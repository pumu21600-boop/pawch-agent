// 聊天展示层的纯逻辑：流式分段、历史合并、工具人话化。
//
// 为什么要单独成模块（2026-10-30 UI 轮）：
// - 一轮回复在事实源里是「一步一条 assistant」，前端展示是一条气泡；合并/分段规则
//   一错就会出现「重启后工具调用被拆成 N 个气泡」这类回归（10-30 已踩过一次）。
// - 本模块不碰 DOM，可直接用 Node 内置 test runner 单测（web/test/chat.test.mjs），
//   前端此前没有单测框架，这一层是最值得先钉死的纯逻辑。
//
// 数据形状（parts，按**真实发生顺序**）：
//   { type: 'thinking', text, ms, done }
//   { type: 'content', text }
//   { type: 'tool', toolIndex, id, name, args, status: 'running'|'ok'|'fail', preview }
// 旧消息没有 parts 时由 messageParts() 用 thinking/content/tools 兜底。

/// 「3 分 47 秒」/「27 秒」；不到 1 秒显示 1 秒（别给 0 秒这种怪数字）
export function fmtDurCn(ms) {
  const s = Math.max(1, Math.round((ms || 0) / 1000));
  if (s < 60) return `${s} 秒`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return r ? `${m} 分 ${r} 秒` : `${m} 分`;
}

/// 思考分片：紧挨着同一段思考就续写，遇到正文/工具就开新段
export function appendThinking(parts, text) {
  if (!text) return parts || [];
  const arr = (parts || []).slice();
  const last = arr[arr.length - 1];
  if (last && last.type === 'thinking' && !last.done) {
    arr[arr.length - 1] = { ...last, text: last.text + text };
  } else {
    arr.push({ type: 'thinking', text, ms: 0, done: false });
  }
  return arr;
}

/// 本段思考结束（正文到达 / 工具调用 / 轮收尾）：把阶段跨度记到这一段上
export function settleThinking(parts, ms) {
  if (!parts || !parts.length) return parts || [];
  let idx = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].type === 'thinking' && !parts[i].done) {
      idx = i;
      break;
    }
  }
  if (idx < 0) return parts;
  const arr = parts.slice();
  arr[idx] = { ...arr[idx], ms: (arr[idx].ms || 0) + Math.max(0, ms || 0), done: true };
  return arr;
}

/// 正文分片：紧挨着同一段正文就续写（工具/思考之后是新的一段）
export function appendContent(parts, text) {
  if (!text) return parts || [];
  const arr = (parts || []).slice();
  const last = arr[arr.length - 1];
  if (last && last.type === 'content') {
    arr[arr.length - 1] = { ...last, text: last.text + text };
  } else {
    arr.push({ type: 'content', text });
  }
  return arr;
}

/// 新增一个工具段。toolIndex 与消息的 tools 数组下标一致（折叠状态沿用旧键）
export function addToolPart(parts, tool) {
  const arr = (parts || []).slice();
  arr.push({
    type: 'tool',
    toolIndex: tool.toolIndex ?? 0,
    id: tool.id || '',
    name: tool.name || '?',
    args: tool.args || '',
    status: tool.status || 'running',
    preview: tool.preview || '',
  });
  return arr;
}

/// 工具结果到达：只结算最后一个同名、仍在执行的工具段
export function settleToolPart(parts, name, ok, preview) {
  if (!parts || !parts.length) return parts || [];
  const arr = parts.slice();
  for (let i = arr.length - 1; i >= 0; i--) {
    const p = arr[i];
    if (p.type === 'tool' && p.name === name && p.status === 'running') {
      arr[i] = { ...p, status: ok ? 'ok' : 'fail', preview: preview || '' };
      break;
    }
  }
  return arr;
}

/// 降级链换渠道重试：按服务端给的字符数，从尾部裁掉 content/thinking
export function trimParts(parts, kind, n) {
  if (!parts || !n) return parts || [];
  let remain = n;
  const arr = parts.slice();
  for (let i = arr.length - 1; i >= 0 && remain > 0; i--) {
    if (arr[i].type !== kind) continue;
    const text = arr[i].text || '';
    const cut = Math.min(remain, text.length);
    remain -= cut;
    const left = text.slice(0, text.length - cut);
    if (left) arr[i] = { ...arr[i], text: left };
    else arr.splice(i, 1);
  }
  return arr;
}

/// 从落盘的一条 assistant 消息生成 parts。
/// 一步内的顺序按「思考 → 正文 → 工具调用」——正文通常是调工具前的说明。
export function partsFromStoredMessage(m) {
  const parts = [];
  if (m.reasoning_content) {
    parts.push({ type: 'thinking', text: m.reasoning_content, ms: m.reasoning_ms || 0, done: true });
  }
  if (m.content) parts.push({ type: 'content', text: m.content });
  (m.tool_calls || []).forEach((tc, i) => {
    parts.push({
      type: 'tool',
      toolIndex: i,
      id: tc.id || '',
      name: tc.function?.name || '?',
      args: tc.function?.arguments || '',
      status: 'ok',
      preview: '',
    });
  });
  return parts;
}

/// 旧形状（没有 parts）兜底：思考 → 工具 → 正文（与旧版展示一致）
export function legacyParts(m) {
  const parts = [];
  if (m.thinking) parts.push({ type: 'thinking', text: m.thinking, ms: m.thinkMs || 0, done: true });
  (m.tools || []).forEach((t, i) => {
    parts.push({
      type: 'tool',
      toolIndex: i,
      id: t.id || '',
      name: t.name || '?',
      args: t.args || '',
      status: t.status || 'ok',
      preview: t.preview || '',
    });
  });
  if (m.content) parts.push({ type: 'content', text: m.content });
  return parts;
}

/// 取消息的 parts（模板/合并统一入口）
export function messageParts(m) {
  return m.parts && m.parts.length ? m.parts : legacyParts(m);
}

/// 同一轮连续 assistant 并成一个气泡。落盘一步一条是事实源，展示层合并。
/// 合并规则：content/thinking 拼接、tools 依序合并、parts 依序拼接并重排 toolIndex、
/// thinkMs 累加；workMs/stats 取收尾那条；ts/id 留第一条。
export function mergeAssistantRun(list) {
  const out = [];
  for (const m of list) {
    const prev = out[out.length - 1];
    if (m.role === 'assistant' && prev && prev.role === 'assistant') {
      const prevTools = prev.tools || [];
      const mergedParts = (prev.parts && prev.parts.length ? prev.parts : legacyParts(prev)).map((p) => ({ ...p }));
      for (const p of m.parts && m.parts.length ? m.parts : legacyParts(m)) {
        mergedParts.push(
          p.type === 'tool' ? { ...p, toolIndex: prevTools.length + (p.toolIndex || 0) } : { ...p }
        );
      }
      out[out.length - 1] = {
        ...prev,
        content: (prev.content || '') + (m.content || ''),
        thinking: (prev.thinking || '') + (m.thinking || ''),
        tools: [...prevTools, ...(m.tools || [])],
        parts: mergedParts,
        thinkMs: (prev.thinkMs || 0) + (m.thinkMs || 0),
        workMs: m.workMs || prev.workMs,
        stats: m.stats || prev.stats,
      };
    } else {
      out.push(m);
    }
  }
  return out;
}

/// 工具结果回填到历史 parts（按 tool_call_id 精确匹配）
export function attachToolPreview(parts, toolCallId, preview) {
  if (!parts || !toolCallId) return parts || [];
  const idx = parts.findIndex((p) => p.type === 'tool' && p.id === toolCallId);
  if (idx < 0) return parts;
  const arr = parts.slice();
  arr[idx] = { ...arr[idx], preview: preview || '' };
  return arr;
}

/// 渲染分块：连续的非正文（思考/工具）合成一个「过程」块，正文独立成块。
/// 这样多步任务按真实顺序呈现：过程 → 说明文字 → 过程 → 最终回答。
export function buildBlocks(parts) {
  const blocks = [];
  let proc = null;
  for (const p of parts || []) {
    if (p.type === 'content') {
      if (p.text) blocks.push({ kind: 'content', text: p.text });
      proc = null;
    } else {
      if (!proc) {
        proc = { kind: 'process', items: [] };
        blocks.push(proc);
      }
      proc.items.push(p);
    }
  }
  return blocks;
}

/// 过程块是否还在跑：有执行中的工具，或还有没结算的思考段。
/// 只给「当前这一块」打活点——同一轮里已完成的旧过程块不该继续闪。
export function processIsLive(items) {
  return (items || []).some(
    (i) => (i.type === 'tool' && i.status === 'running') || (i.type === 'thinking' && !i.done)
  );
}

/// 过程块的摘要：「思考 6 分 29 秒 · 7 个工具」
export function processSummary(items) {
  const list = items || [];
  const thinkMs = list.filter((i) => i.type === 'thinking').reduce((s, i) => s + (i.ms || 0), 0);
  const tools = list.filter((i) => i.type === 'tool').length;
  const bits = [];
  if (thinkMs > 0) bits.push(`思考 ${fmtDurCn(thinkMs)}`);
  else if (list.some((i) => i.type === 'thinking')) bits.push('思考');
  if (tools) bits.push(`${tools} 个工具`);
  return bits.join(' · ');
}

// —— 工具人话化 ——
// 目标：不把 {"content": "<!DOCTYPE html>..." 这种东西糊到用户脸上。
// label 是动作（写入文件/执行命令），subject 是对象（路径/命令/URL）。
const TOOL_RULES = [
  [/^(write_file|write)$/i, '写入文件', 'write'],
  [/^(edit_file|edit)$/i, '修改文件', 'write'],
  [/^(read_file|read)$/i, '读取文件', 'read'],
  [/^(list_dir|list_files|glob|search_files)$/i, '浏览文件', 'folder'],
  [/^(shell|bash|run_command|exec)$/i, '执行命令', 'terminal'],
  [/^web_search$/i, '搜索网页', 'globe'],
  [/^web_fetch$/i, '抓取网页', 'globe'],
  [/^browser/i, '浏览器', 'browser'],
  [/^memory/i, '记忆', 'brain'],
  [/^schedule/i, '定时任务', 'calendar'],
  [/^spawn_subagent|^subagent/i, '子代理', 'bot'],
  [/^computer/i, '操作电脑', 'screen'],
  [/^xlsx/i, 'Excel', 'sheet'],
  [/^pptx/i, '演示文稿', 'slides'],
  [/^docx/i, 'Word 文档', 'doc'],
  [/^pdf/i, 'PDF', 'doc'],
  [/^git/i, 'Git', 'git'],
  [/^mcp__/i, 'MCP 工具', 'plug'],
  [/^wasm__/i, '插件', 'plug'],
];

const SUBJECT_KEYS = [
  'path',
  'file_path',
  'file',
  'filename',
  'target',
  'command',
  'cmd',
  'query',
  'url',
  'pattern',
  'action',
  'title',
  'task',
  'prompt',
  'name',
];

function parseArgs(args) {
  if (args && typeof args === 'object') return args;
  if (typeof args !== 'string' || !args.trim()) return null;
  try {
    const v = JSON.parse(args);
    return v && typeof v === 'object' ? v : null;
  } catch {
    return null;
  }
}

function cleanSubject(v) {
  return String(v).replace(/\s+/g, ' ').trim();
}

function subjectOf(args) {
  const o = parseArgs(args);
  if (!o) {
    const raw = typeof args === 'string' ? cleanSubject(args) : '';
    return raw.length > 110 ? raw.slice(0, 110) + '…' : raw;
  }
  for (const k of SUBJECT_KEYS) {
    const v = o[k];
    if (typeof v === 'string' && v.trim()) {
      const s = cleanSubject(v);
      return s.length > 110 ? s.slice(0, 110) + '…' : s;
    }
  }
  for (const v of Object.values(o)) {
    if (typeof v === 'string' && v.trim() && v.length <= 120 && !v.includes('\n')) {
      return cleanSubject(v);
    }
  }
  return '';
}

export function toolMeta(name, args) {
  const n = String(name || '');
  let label = n || '工具';
  let icon = 'tool';
  for (const [re, lb, ic] of TOOL_RULES) {
    if (re.test(n)) {
      label = lb;
      icon = ic;
      break;
    }
  }
  let subject = subjectOf(args);
  // shell 的多行命令：压成一行，保留可读的第一段
  if (/^(shell|bash|run_command|exec)$/i.test(n) && subject) {
    subject = subject.replace(/\s+/g, ' ').trim();
    if (subject.length > 90) subject = subject.slice(0, 90) + '…';
  }
  return { label, subject, icon, iconSvg: toolIcon(icon) };
}

/// 参数按 JSON 展开（失败就原样）；超长只截预览，避免 50KB 的 write_file 参数
/// 把展开面板撑爆（完整内容本来也不适合在气泡里读）。
export function prettyArgs(args, limit = 6000) {
  if (args == null || args === '') return '';
  let out;
  if (typeof args === 'object') {
    try {
      out = JSON.stringify(args, null, 2);
    } catch {
      out = String(args);
    }
  } else {
    try {
      out = JSON.stringify(JSON.parse(args), null, 2);
    } catch {
      out = String(args);
    }
  }
  if (out.length > limit) {
    return out.slice(0, limit) + `\n…（已截断，共 ${out.length} 字符）`;
  }
  return out;
}

/// 静态 SVG（只来自本模块的固定字符串，不含任何用户输入）
export function toolIcon(kind) {
  const wrap = (body) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  switch (kind) {
    case 'write':
      return wrap('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>');
    case 'read':
      return wrap('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/>');
    case 'folder':
      return wrap('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>');
    case 'terminal':
      return wrap('<path d="m5 7 5 5-5 5"/><path d="M13 17h6"/>');
    case 'globe':
      return wrap('<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.6 2.3 3.9 5.1 3.9 8.5s-1.3 6.2-3.9 8.5c-2.6-2.3-3.9-5.1-3.9-8.5s1.3-6.2 3.9-8.5Z"/>');
    case 'browser':
      return wrap('<rect x="3" y="4.5" width="18" height="15" rx="2"/><path d="M3 9h18"/><path d="M7 6.7h.01M10 6.7h.01"/>');
    case 'brain':
      return wrap('<path d="M12 5.5a3 3 0 0 0-3 3c0 .7.2 1.3.6 1.8a2.7 2.7 0 0 0 1 4.9h2.8a2.7 2.7 0 0 0 1-4.9c.4-.5.6-1.1.6-1.8a3 3 0 0 0-3-3Z"/><path d="M9.5 18.5h5"/>');
    case 'calendar':
      return wrap('<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M8 3v4M16 3v4M3.5 10h17"/>');
    case 'bot':
      return wrap('<rect x="4" y="8" width="16" height="11" rx="2.5"/><path d="M12 5v3M8.5 12.5h.01M15.5 12.5h.01"/>');
    case 'screen':
      return wrap('<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M9 20h6M12 16.5V20"/>');
    case 'sheet':
      return wrap('<rect x="3.5" y="4" width="17" height="16" rx="2"/><path d="M3.5 9h17M9 9v11M15 9v11"/>');
    case 'slides':
      return wrap('<rect x="3.5" y="4" width="17" height="12" rx="2"/><path d="M12 16v4M8.5 20h7"/>');
    case 'doc':
      return wrap('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 16.5h4"/>');
    case 'git':
      return wrap('<circle cx="6.5" cy="6" r="2.2"/><circle cx="6.5" cy="18" r="2.2"/><circle cx="17.5" cy="12" r="2.2"/><path d="M6.5 8.2v7.6M8.7 6h4.1a2.5 2.5 0 0 1 2.5 2.5v1.3"/>');
    case 'plug':
      return wrap('<path d="M12 3v4M8 3v4M16 3v4"/><path d="M6 7h12v4a6 6 0 0 1-6 6 6 6 0 0 1-6-6Z"/><path d="M12 17v4"/>');
    default:
      return wrap('<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.4 2.4-2.4-2.4Z"/>');
  }
}
