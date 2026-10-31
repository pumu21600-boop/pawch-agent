import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  appendThinking,
  settleThinking,
  appendContent,
  addToolPart,
  settleToolPart,
  trimParts,
  partsFromStoredMessage,
  mergeAssistantRun,
  buildBlocks,
  buildCompletedView,
  buildMessageBlocks,
  completedHasProcess,
  isNoiseThinking,
  processSummary,
  processIsLive,
  toolMeta,
  prettyArgs,
  fmtDurCn,
} from '../src/lib/chat.js';

test('正文分片紧挨着才续写，遇到工具就开新段（保证时间线顺序）', () => {
  let p = [];
  p = appendContent(p, '先看一下');
  p = appendContent(p, '目录。');
  p = addToolPart(p, { name: 'list_dir', args: '{"path":"."}', toolIndex: 0 });
  p = appendContent(p, '目录里有三个文件。');
  assert.deepEqual(
    p.map((x) => x.type),
    ['content', 'tool', 'content']
  );
  assert.equal(p[0].text, '先看一下目录。');
  assert.equal(p[2].text, '目录里有三个文件。');
});

test('思考分片只和未结束的同一段合并；结算后新分片开新段', () => {
  let p = [];
  p = appendThinking(p, '先想');
  p = appendThinking(p, '一下。');
  assert.equal(p.length, 1);
  assert.equal(p[0].text, '先想一下。');
  p = settleThinking(p, 3200);
  assert.equal(p[0].done, true);
  assert.equal(p[0].ms, 3200);
  p = appendThinking(p, '再想');
  p = settleThinking(p, 800);
  assert.equal(p.length, 2);
  assert.equal(p[1].ms, 800);
  // 已结算的思考不会被二次结算
  p = settleThinking(p, 9999);
  assert.equal(p[1].ms, 800);
});

test('孤立标点思考（. / 。 / …）不生成新的空思考段；已有段内标点照常拼', () => {
  assert.equal(isNoiseThinking('.'), true);
  assert.equal(isNoiseThinking('。'), true);
  assert.equal(isNoiseThinking('…'), true);
  assert.equal(isNoiseThinking('  '), true);
  assert.equal(isNoiseThinking('嗯'), false);
  let p = [];
  p = appendThinking(p, '.');
  assert.equal(p.length, 0, '孤立点号不应开新段');
  p = appendThinking(p, '先想');
  p = appendThinking(p, '.');
  assert.equal(p.length, 1);
  assert.equal(p[0].text, '先想.', '已有思考段内的标点要保留');
  // 历史里存下的纯标点 reasoning 也不显示
  const stored = partsFromStoredMessage({ reasoning_content: '.', content: '答案' });
  assert.deepEqual(
    stored.map((x) => x.type),
    ['content']
  );
});

test('工具结果只结算最后一个同名 running，失败的留 fail + 预览', () => {
  let p = [];
  p = addToolPart(p, { name: 'shell', args: '{"command":"npm test"}', toolIndex: 0 });
  p = addToolPart(p, { name: 'shell', args: '{"command":"npm run build"}', toolIndex: 1 });
  p = settleToolPart(p, 'shell', false, 'exit 1');
  assert.equal(p[0].status, 'running');
  assert.equal(p[1].status, 'fail');
  assert.equal(p[1].preview, 'exit 1');
});

test('降级重试按字符数从尾部裁掉对应类型的文本', () => {
  let p = [];
  p = appendThinking(p, 'abcdef');
  p = appendContent(p, '1234567890');
  p = trimParts(p, 'content', 4);
  assert.equal(p[1].text, '123456');
  p = trimParts(p, 'thinking', 6);
  assert.equal(p.length, 1);
  assert.equal(p[0].type, 'content');
});

test('buildBlocks：连续过程合成块，正文隔断，按真实顺序排列', () => {
  const parts = [
    { type: 'thinking', text: '想', ms: 1000 },
    { type: 'tool', name: 'read_file' },
    { type: 'content', text: '第一步说明' },
    { type: 'thinking', text: '再想', ms: 2000 },
    { type: 'tool', name: 'edit_file' },
    { type: 'content', text: '最终回答' },
  ];
  const blocks = buildBlocks(parts);
  assert.deepEqual(
    blocks.map((b) => b.kind),
    ['process', 'content', 'process', 'content']
  );
  assert.equal(blocks[0].items.length, 2);
  assert.equal(blocks[1].text, '第一步说明');
});

test('buildCompletedView：完成后只留最后一段结语，执行过程全部折进一个过程块', () => {
  const parts = [
    { type: 'thinking', text: '想A', ms: 61000, done: true },
    { type: 'tool', name: 'shell' },
    { type: 'content', text: '我来。' },
    { type: 'thinking', text: '想B', ms: 4000, done: true },
    { type: 'tool', name: 'write_file' },
    { type: 'content', text: '做好了：文件已生成。' },
  ];
  const blocks = buildCompletedView(parts);
  assert.deepEqual(
    blocks.map((b) => b.kind),
    ['process', 'content']
  );
  assert.equal(blocks[0].items.length, 5, '思考/工具/中途说明都在过程块里');
  assert.equal(blocks[0].items[2].text, '我来。');
  assert.equal(blocks[1].text, '做好了：文件已生成。');
  // 简单问答没有过程，不凭空造过程块
  assert.deepEqual(buildCompletedView([{ type: 'content', text: '答案' }]), [{ kind: 'content', text: '答案' }]);
  // 纯标点思考不能撑出空过程块
  assert.deepEqual(buildCompletedView([{ type: 'thinking', text: '.' }, { type: 'content', text: '答案' }]), [
    { kind: 'content', text: '答案' },
  ]);
  // 流式入口仍按真实顺序展开
  assert.equal(buildMessageBlocks(parts, true).filter((b) => b.kind === 'process').length, 2);
});

test('completedHasProcess：有无过程块决定「已工作」显示位置（纯问答轮不丢时长）', () => {
  // 纯问答：无过程块 → 「已工作」单独显示在顶部条
  assert.equal(completedHasProcess([{ type: 'content', text: '答案' }]), false);
  // 纯标点思考撑不出过程块 → 仍是顶部条
  assert.equal(
    completedHasProcess([{ type: 'thinking', text: '.' }, { type: 'content', text: '答案' }]),
    false
  );
  // 有思考/工具 → 时长并进过程行，顶部不再单独显示
  assert.equal(
    completedHasProcess([
      { type: 'thinking', text: '想', ms: 61000, done: true },
      { type: 'content', text: '答案' },
    ]),
    true
  );
});

test('processSummary：已工作/思考时长 + 工具数；没有过程时给兜底文案', () => {
  assert.equal(
    processSummary([
      { type: 'thinking', ms: 65000 },
      { type: 'tool' },
      { type: 'tool' },
    ]),
    '思考 1 分 5 秒 · 2 个工具'
  );
  assert.equal(processSummary([{ type: 'tool' }]), '1 个工具');
  assert.equal(
    processSummary([{ type: 'thinking', ms: 65000 }, { type: 'tool' }], 822000),
    '已工作 13 分 42 秒 · 思考 1 分 5 秒 · 1 个工具'
  );
  assert.equal(processSummary([{ type: 'content', text: '中途说明' }]), '执行过程');
});

test('processIsLive：只有执行中的工具/未结算的思考才算活', () => {
  assert.equal(processIsLive([{ type: 'tool', status: 'ok' }]), false);
  assert.equal(processIsLive([{ type: 'tool', status: 'running' }]), true);
  assert.equal(processIsLive([{ type: 'thinking', done: true }]), false);
  assert.equal(processIsLive([{ type: 'thinking', done: false }]), true);
});

test('mergeAssistantRun：多步合并成一条，parts 顺序保留、toolIndex 重排', () => {
  const step1 = {
    id: 'm1',
    role: 'assistant',
    ts: 111,
    content: '先读文件。',
    thinking: '想A',
    thinkMs: 1000,
    tools: [{ name: 'read_file', args: '{"path":"a.txt"}' }],
    parts: [
      { type: 'thinking', text: '想A', ms: 1000, done: true },
      { type: 'content', text: '先读文件。' },
      { type: 'tool', toolIndex: 0, name: 'read_file', args: '{"path":"a.txt"}', status: 'ok' },
    ],
    stats: null,
    workMs: 0,
  };
  const step2 = {
    id: 'm2',
    role: 'assistant',
    ts: 222,
    content: '改完了。',
    thinking: '想B',
    thinkMs: 2000,
    tools: [{ name: 'edit_file', args: '{"path":"a.txt"}' }],
    parts: [
      { type: 'thinking', text: '想B', ms: 2000, done: true },
      { type: 'tool', toolIndex: 0, name: 'edit_file', args: '{"path":"a.txt"}', status: 'ok' },
      { type: 'content', text: '改完了。' },
    ],
    stats: { total_tokens: 10 },
    workMs: 5000,
  };
  const [m] = mergeAssistantRun([step1, step2]);
  assert.equal(m.id, 'm1');
  assert.equal(m.ts, 111);
  assert.equal(m.workMs, 5000);
  assert.deepEqual(m.stats, { total_tokens: 10 });
  assert.equal(m.content, '先读文件。改完了。');
  assert.equal(m.thinking, '想A想B');
  assert.deepEqual(
    m.parts.map((p) => p.type),
    ['thinking', 'content', 'tool', 'thinking', 'tool', 'content']
  );
  assert.equal(m.parts[4].toolIndex, 1);
  // 中间有 user 隔断则不能合并
  const list = mergeAssistantRun([step1, { role: 'user', content: '再说一句' }, step2]);
  assert.equal(list.length, 3);
});

test('mergeAssistantRun：引导(steered)对合并透明，标记插在发生位置；打断照旧拆分', () => {
  const mk = (id, ts, text, toolIndex = 0) => ({
    id,
    role: 'assistant',
    ts,
    content: text,
    tools: [{ name: 'shell', args: '{}' }],
    parts: [{ type: 'tool', toolIndex, name: 'shell', args: '{}', status: 'ok' }, { type: 'content', text }],
    workMs: 0,
  });
  const steer = { id: 's1', role: 'user', content: '为什么不用内置浏览器', steered: true, ts: 150 };
  // 引导夹在两条 assistant 中间：不拆，标记插在两段 parts 的边界
  const [m] = mergeAssistantRun([mk('a1', 100, '前半。'), steer, mk('a2', 200, '后半。', 1)]);
  assert.equal(m.id, 'a1');
  assert.deepEqual(
    m.parts.map((p) => p.type),
    ['tool', 'content', 'steer', 'tool', 'content'],
    '同一轮不再被引导拆成两半，标记在发生位置'
  );
  assert.equal(m.parts[2].text, '为什么不用内置浏览器');
  // 多条引导按序都收进来
  const [m2] = mergeAssistantRun([
    mk('b1', 100, '一。'),
    steer,
    { id: 's2', role: 'user', content: '顺便截个图', steered: true, ts: 160 },
    mk('b2', 200, '二。', 1),
  ]);
  assert.equal(m2.parts.filter((p) => p.type === 'steer').length, 2);
  // 引导后没有 assistant（轮被取消）：原样保留，不丢
  const tail = mergeAssistantRun([mk('c1', 100, '完。'), steer]);
  assert.equal(tail.length, 2);
  assert.equal(tail[1].steered, true);
  assert.equal(tail[1].content, '为什么不用内置浏览器');
  // 引导后跟的是新 user 消息：原样保留在原位
  const mid = mergeAssistantRun([steer, { role: 'user', content: '正式提问' }, mk('d1', 100, '答。')]);
  assert.equal(mid.length, 3);
  assert.equal(mid[0].steered, true);
  // 打断(interrupted)是真用户气泡：照旧拆分
  const intr = { id: 'i1', role: 'user', content: '立刻停', interrupted: true, ts: 150 };
  const split = mergeAssistantRun([mk('e1', 100, '前。'), intr, mk('e2', 200, '后。', 1)]);
  assert.equal(split.length, 3, 'interrupted 不合并');
  assert.equal(split[1].interrupted, true);
});

test('steer 分块：完成态按引导位置分段，流式同样隔断', () => {
  const parts = [
    { type: 'tool', toolIndex: 0, name: 'write_file' },
    { type: 'content', text: '改好了第一版。' },
    { type: 'steer', text: '顺便把标题改成 X' },
    { type: 'tool', toolIndex: 1, name: 'edit_file' },
    { type: 'content', text: '标题已改，全部完成。' },
  ];
  const done = buildCompletedView(parts);
  assert.deepEqual(
    done.map((b) => b.kind),
    ['process', 'steer', 'process', 'content'],
    '引导前后的过程各自成块（中途说明折进过程），结语是最后一段正文'
  );
  assert.equal(done[1].text, '顺便把标题改成 X');
  assert.equal(done[2].items.map((p) => p.type).join(','), 'tool', '引导后的过程块只有引导后的内容');
  assert.equal(done[3].text, '标题已改，全部完成。');
  const live = buildBlocks(parts);
  assert.deepEqual(
    live.map((b) => b.kind),
    ['process', 'content', 'steer', 'process', 'content']
  );
  // 开头就是引导 / 只有引导没正文：照样渲染，不丢
  assert.deepEqual(buildCompletedView([{ type: 'steer', text: '先想好' }]), [{ kind: 'steer', text: '先想好' }]);
  // completedHasProcess：只有引导没有过程块 → 「已工作」走顶部独立行
  assert.equal(completedHasProcess([{ type: 'steer', text: '先想好' }, { type: 'content', text: '答' }]), false);
});

test('partsFromStoredMessage：思考 → 正文 → 工具，工具 index 从 0 起', () => {
  const parts = partsFromStoredMessage({
    reasoning_content: '想了想',
    reasoning_ms: 1200,
    content: '执行。',
    tool_calls: [
      { id: 't1', function: { name: 'shell', arguments: '{"command":"dir"}' } },
      { id: 't2', function: { name: 'read_file', arguments: '{"path":"a"}' } },
    ],
  });
  assert.deepEqual(
    parts.map((p) => p.type),
    ['thinking', 'content', 'tool', 'tool']
  );
  assert.equal(parts[0].ms, 1200);
  assert.equal(parts[3].toolIndex, 1);
  assert.equal(parts[2].id, 't1');
});

test('toolMeta：不把原始 JSON 糊到脸上，路径/命令进 subject', () => {
  const w = toolMeta('write_file', '{"path":"src/main.js","content":"<!DOCTYPE html>"}');
  assert.equal(w.label, '写入文件');
  assert.equal(w.subject, 'src/main.js');
  const s = toolMeta('shell', '{"command":"node --version\\n&& echo hi"}');
  assert.equal(s.label, '执行命令');
  assert.equal(s.subject, 'node --version && echo hi');
  const b = toolMeta('browser_navigate', '{"url":"https://example.com"}');
  assert.equal(b.label, '浏览器');
  assert.equal(b.subject, 'https://example.com');
  const unknown = toolMeta('custom_tool', '{"q":"x"}');
  assert.equal(unknown.label, 'custom_tool');
  assert.equal(unknown.subject, 'x');
  // 参数不是 JSON 时原样缩略，不崩
  const raw = toolMeta('shell', 'npm run build -- --watch');
  assert.equal(raw.label, '执行命令');
  assert.equal(raw.subject, 'npm run build -- --watch');
});

test('prettyArgs：合法 JSON 展开，非法原样，超长截断', () => {
  assert.equal(prettyArgs('{"a":1}'), '{\n  "a": 1\n}');
  assert.equal(prettyArgs('{oops'), '{oops');
  assert.equal(prettyArgs(''), '');
  const long = prettyArgs(JSON.stringify({ content: 'x'.repeat(9000) }), 100);
  assert.ok(long.length < 200, String(long.length));
  assert.ok(long.includes('已截断'), long);
});

test('fmtDurCn：秒/分/分秒', () => {
  assert.equal(fmtDurCn(0), '1 秒');
  assert.equal(fmtDurCn(27000), '27 秒');
  assert.equal(fmtDurCn(65000), '1 分 5 秒');
  assert.equal(fmtDurCn(120000), '2 分');
});
