import { test } from 'node:test';
import assert from 'node:assert/strict';
import { md } from '../src/lib/md.js';

test('HTML 一律转义，模型输出里的 script 不会被执行', () => {
  const html = md('<script>alert(1)</script>');
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('&lt;script&gt;'));
});

test('代码块带语言与复制按钮，内容保持转义、不被包进段落', () => {
  const html = md('```js\nconst a = "<x>";\n```');
  assert.ok(html.includes('class="md-codeblock"'), html);
  assert.ok(html.includes('class="md-codelang">js<'), html);
  assert.ok(html.includes('class="md-copy"'), html);
  assert.ok(html.includes('&lt;x&gt;'), html);
  assert.ok(!html.includes('<p class="md-p"><div'), '代码块不能被包进 <p>');
});

test('代码块里的 markdown 符号不被二次解析', () => {
  const html = md('```\n**not bold** `not code`\n```');
  assert.ok(html.includes('**not bold**'), html);
  assert.ok(!html.includes('<strong>'), html);
});

test('链接只放行 http/https 与站内预览，javascript: 剥成纯文本', () => {
  assert.ok(md('[a](https://example.com)').includes('href="https://example.com"'));
  assert.ok(md('[a](/api/workspace/file?path=x)').includes('doc-cite'));
  const bad = md('[a](javascript:alert(1))');
  assert.ok(!bad.includes('href='), bad);
  assert.ok(bad.includes('a'), bad);
});

test('表格与列表结构正常', () => {
  const table = md('| A | B |\n| --- | --- |\n| 1 | 2 |');
  assert.ok(table.includes('<table class="md-table">'), table);
  assert.ok(table.includes('<td>1</td>'), table);
  const ul = md('- 一\n- 二');
  assert.ok(ul.includes('<ul class="md-ul"><li>一</li><li>二</li></ul>'), ul);
});
