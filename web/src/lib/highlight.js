// Shiki 代码高亮（施工单 035 件 1）：懒加载——首块代码出现才拉引擎；JS 正则引擎（不用 WASM）。
// md.js 的 escape-first 管线不动：这里读 DOM 里 code 的 textContent（天然已反转义），
// 高亮产物由 Shiki 生成（内容已转义，安全），只回填到我们自己的 <code> 内。
// 双主题走 CSS 变量（defaultColor:false → 每个 token 带 --shiki-light/--shiki-dark），
// 配合 ui.css 里 [data-theme] 两条规则，切主题即时变色、不重新高亮。
//
// 调用点：App.svelte 的 afterUpdate 渲染后处理（与 data-mt 补盖同处）。
// 去重：.md-codeblock[data-hl] 标记；流式重渲染会重建节点（标记消失）→ 自动重排入队。
// 防抖：150ms 合并同一批，避免流式期间每片都打一次。

const LANGS = [
  'typescript', 'javascript', 'json', 'rust', 'python', 'bash',
  'css', 'html', 'sql', 'yaml', 'markdown', 'diff',
];

// 显式导入表：不能用 `@shikijs/langs/${id}` 模板串——Vite 会把可匹配的全部语言
// 预编译成 chunk（等于把整张语言表搬进 dist），显式写死才真正做到按需打包。
const LANG_IMPORTS = {
  typescript: () => import('@shikijs/langs/typescript'),
  javascript: () => import('@shikijs/langs/javascript'),
  json: () => import('@shikijs/langs/json'),
  rust: () => import('@shikijs/langs/rust'),
  python: () => import('@shikijs/langs/python'),
  bash: () => import('@shikijs/langs/bash'),
  css: () => import('@shikijs/langs/css'),
  html: () => import('@shikijs/langs/html'),
  sql: () => import('@shikijs/langs/sql'),
  yaml: () => import('@shikijs/langs/yaml'),
  markdown: () => import('@shikijs/langs/markdown'),
  diff: () => import('@shikijs/langs/diff'),
};

// md-codehead 的语言标签 → Shiki 语言 id；'' = 不高亮（保持原样）
const ALIAS = {
  js: 'javascript', ts: 'typescript', jsx: 'javascript', tsx: 'typescript',
  sh: 'bash', shell: 'bash', zsh: 'bash', console: 'bash',
  yml: 'yaml', py: 'python', htm: 'html', xml: 'html', md: 'markdown',
  golang: 'go', rb: 'ruby',
  '': '', text: '', txt: '', plaintext: '', plain: '',
};

// 依赖入口用 @shikijs/langs|themes 的细粒度导出——shiki 主包的 shiki/langs 是
// 346 语言整张表，静态引用会全量变成懒加载 chunk（真机踩过：dist 膨到 328 文件 12MB）。
let hlPromise = null;
function ensureHighlighter() {
  if (!hlPromise) {
    hlPromise = import('shiki/core').then(async ({ createHighlighterCore }) => {
      const [{ createJavaScriptRegexEngine }] = await Promise.all([
        import('@shikijs/engine-javascript'),
      ]);
      const themes = await Promise.all([
        import('@shikijs/themes/github-dark'),
        import('@shikijs/themes/github-light'),
      ]);
      const langs = await Promise.all(LANGS.map((id) => LANG_IMPORTS[id]()));
      return createHighlighterCore({
        themes,
        langs,
        engine: createJavaScriptRegexEngine(),
      });
    });
    hlPromise.catch(() => { hlPromise = null; }); // 失败允许下次重试，不永久卡死
  }
  return hlPromise;
}

let queue = [];
let queueTimer = null;

export function enhanceCodeBlocks(root) {
  if (!root || !root.querySelectorAll) return;
  const found = root.querySelectorAll('.md-codeblock:not([data-hl]) code');
  if (!found.length) return;
  for (const el of found) {
    const box = el.closest('.md-codeblock');
    if (!box) continue;
    box.dataset.hl = 'queued';
    queue.push({ code: el, box });
  }
  if (queueTimer) return;
  queueTimer = setTimeout(run, 150);
}

async function run() {
  queueTimer = null;
  const jobs = queue.splice(0);
  if (!jobs.length) return;
  let hl = null;
  for (const { code, box } of jobs) {
    if (!code.isConnected || !box.isConnected) continue; // 节点已被流式重渲染换掉，新节点会重新入队
    box.dataset.hl = 'done';
    const raw = code.textContent;
    if (!raw.trim()) continue;
    const label = ((box.querySelector('.md-codelang') || {}).textContent || '').trim().toLowerCase();
    const lang = label in ALIAS ? ALIAS[label] : (LANGS.includes(label) ? label : '');
    if (!lang) continue; // 未知语言/纯文本：保持无高亮
    try {
      hl = hl || (await ensureHighlighter());
      const html = hl.codeToHtml(raw.replace(/\n$/, ''), {
        lang,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: false,
      });
      const s = html.indexOf('<code>');
      const e = html.lastIndexOf('</code>');
      if (s >= 0 && e > s) {
        code.innerHTML = html.slice(s + 6, e);
        code.classList.add('shiki-code');
      }
    } catch {
      // 单块失败不拖垮整轮，保持无高亮原样
    }
  }
}
