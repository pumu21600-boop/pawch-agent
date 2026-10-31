# 034 · Svelte 5 迁移轮（编译器升 5，代码保持 legacy 语法）

> 排期来源：UI 优化调研（2026-10-31 会话）——2026 年 Svelte 组件生态（shadcn-svelte / Bits UI v1 / TanStack Virtual / motion）全部押 Svelte 5，前端钉在 svelte ^4.2.19 吃不到；用户拍板「现在就开始迁」。
> 路径（官方推荐）：**编译器升 5，组件保持 legacy 语法**——Svelte 5 对不含 runes 的组件自动按 legacy 编译，legacy 与 runes 共存是官方支持；runes 组件可与 legacy 宿主互操作，生态库升级后即可用。
> 纪律：窄而刚——本单只做「编译器换代 + 全绿」，runes 化改写、Vite 升级、生态库引入一律不做。

## 前置盘点（2026-10-31 实测）

17 个 .svelte 共 16141 行（App.svelte 11870 / Galaxy.svelte 1345 / lib 下 15 个）；特性面：
`on:` 407（App 243）、`export let` 102（App 0）、`bind:` 98、`$:` 77、createEventDispatcher 12 组件、
`{@html}` 11、afterUpdate 2、onMount 4、onDestroy 4、`use:` action 1、事件修饰符 `|stopPropagation` 35 / `|preventDefault` 2；
**零 slot、零 store、零 transition、零 svelte:component、零 svelte:key/await**；
入口仅 `web/src/main.js` 一处 `new App({target})`（全仓核实无其他手动实例化）；
17 条 node:test 全是纯 JS（chat.js / md.js），不涉组件编译；
CI frontend job（ci.yml:47-82）= npm ci → npm test → check_fetch → build → check_md_css。

## 一、范围（本单交付）

### 件 1 · 工具链
- `web/package.json`：`svelte` → `^5`（装当时最新 5.x）、`@sveltejs/vite-plugin-svelte` → `^4`（v4 配 vite ^5 + svelte ^5；**Vite 留在 5**，最小改动）；`npm install` 刷新 package-lock。

### 件 2 · 入口
- `web/src/main.js`：`new App({ target })` → `mount(App, { target })`（Svelte 5 官方入口 API；文件共 5 行）。

### 件 3 · 编译清障
- 修升级后的编译报错与硬警告（预期零星：HTML 严格化的自闭合标签、a11y 警告增量）。
- **407 处 `on:`、98 处 `bind:`、77 处 `$:`、12 个 dispatcher、2 处 afterUpdate 全部不动**——legacy 模式合法，只接受弃用警告，不改写。

### 件 4 · 分包对账
- vite `manualChunks` 的 `svelte: ['svelte/internal']`：Svelte 5 的 legacy runtime 仍在 `svelte/internal`，预期照常解析；若 chunk 警告或落空，改函数式按模块 id 分组。产物保持四块（应用 / xlsx / mammoth / svelte 运行时），chunk 数与体积写进验证记录。

### 件 5 · 守卫与真机验收
- 见「三、验证口径」。

## 二、明确不做（禁止事项）

- **不做 runes 化改写**：`$: → $derived/$effect`、`export let → $props`、`on: → onclick`、dispatcher → 回调 props 一律不动。App.svelte 全量 runes 化是重写级工程、零用户可见收益，留给将来与巨石拆分打包的单独立项。
- 不升 Vite 6/7、不引 TypeScript、不新增 svelte.config.js（除非编译必需）。
- 不引任何新生态库（shadcn-svelte / Bits UI / TanStack Virtual 留 UI 优化轮；Shiki / Lucide / Open Props 本不依赖 Svelte 5，也不在本单）。
- 不顺手改任何行为与样式；web/src 里 20 处既有「Svelte 坑」workaround 注释全部保留（legacy 模式下行为原样成立）。

## 三、验证口径

- **本地四闸**：`npm test`（17 条全过）+ `npm run build` + `node ../scripts/check_fetch_json.mjs` + `node ../scripts/check_md_css.mjs` 全绿；chunk 对账记入本单验证记录。
- **真机**（隔离实例 + mock 渠道，照 docs/e2e-2026-10-24 范式）：主聊天一轮 mock 对话（流式 / 思考块 / 工具卡 / 折叠）、设置六分区逐个打开、右侧五页签、深浅主题切换、星云页、定时页签；CDP 断言关键 DOM；收尾进程清点（隔离实例按 PID 杀，不用 agent.exe stop）。
- **壳零改动**：Rust / desktop 不动一byte（前端只换 web/dist，exe 经 ServeDir 托管）；CI 推送后 frontend job 绿为最终门禁。

## 四、风险与对策

- 弃用警告（createEventDispatcher / afterUpdate / on: / export let）：5 中标弃用但 legacy 完全可用——警告照单收，不改代码。
- CSS 未使用选择器裁剪：行为与 4 相同 → `scripts/check_md_css.mjs` 15 类守卫兜底。
- 事件委托机制变化：5 对常见 DOM 事件走委托，`|stopPropagation` 语义由编译器保证；真机 CDP 覆盖点击路径。
- npm 安装走代理（本机外网直连不通，`export HTTPS_PROXY=http://127.0.0.1:7897` 兜底）。

## 五、验证记录（2026-10-31）

### 本地四闸（全绿）
- **件 1 工具链**：svelte **4.2.20 → 5.57.3**、@sveltejs/vite-plugin-svelte 3.1.2 → **4.0.4**、vite 5.4.21（未动）。npm 撞旧 lock 死结（旧伴生包 vite-plugin-svelte-inspector@2.1.0 钉死插件 v3），删 node_modules+lock 全新安装解决。
- **件 2 入口**：main.js `new App({target})` → `mount(App, {target})`。
- **件 3 清障**：**一次编译通过、零报错**。`on:` 407 / `bind:` 98 / `$:` 77 / dispatcher 12 / afterUpdate 2 全部未动。警告面（126 条，全部为警告不拦构建）：a11y 新规 116 条（Svelte 5 新增的静态元素交互/label 关联/键盘事件检查，4 时代不存在）、css_unused_selector 9 条（与 4 同类，check_md_css 兜底）、node_invalid_placement 1 条（App.svelte:7072 `<tr>` 直挂 `<table>`，**既有**写法，浏览器自动补 tbody，仅渲染未改）。
- **件 4 分包**：对象式 manualChunks 落空（Svelte 5 legacy runtime 走 `svelte/internal/client` 子路径，`svelte/internal` 桶口拼出 0 字节空块、运行时混进 index）→ 改**函数式按模块 id 分组**，四块恢复：`svelte 49.98 kB (gzip 18.91)` / `index 358.87 (120.55)` / `mammoth 304.79 (93.29)` / `xlsx 687.75 (336.80)`，CSS 98.50 kB。
- **件 5 四闸**：npm test **23/23 过**、check_fetch 93 调用点全过、check_md_css 15 类全在、build 零报错。

### 真机（隔离实例 + mock 渠道，127.0.0.1:5273）
临时实例 = release exe 复制 + web/dist + config.toml（port 5273 / gateway→mock 9399）+ providers.json + prompts（**缺 providers.json 会启动即退**，报错只有前台可见——后续临时实例照此带全）。Tabbit 浏览器实操，DOM 断言：
- 应用挂载（mount 路径）：composer/chat-body/侧栏/深色主题全在 ✓
- 普通流式轮：mock 流式回复完整落出 ✓；工具轮：思考块 + 工具行（人话化「1 个工具/已读取文件…」）+ 最终回答 ✓
- 错误路径：key 未配时人话错误横幅 ✓
- 设置弹窗：左导航 8 分区（外观/模型配置/功能桥接/记忆/技能/MCP/插件/定时）逐个点开渲染 ✓；自研 Select 下拉开→选→收 ✓
- 右面板：产物页签（会话基线人话文案）✓；「添加标签页」下拉开网页页签+空态 ✓（用量/时间线页签属插件，临时实例未装插件不出现=能力总闸语义，非回归）
- 主题切换 data-theme dark↔light ✓；星云 canvas+WebGL 上下文+Esc 关闭 ✓；刷新后会话/消息/错误横幅完整恢复 ✓
- **未覆盖+原因**：终端面板/预览页签（同容器面板，低风险）；用量/时间线插件页签（临时实例无插件）。

### 收尾
隔离实例与 mock 按 PID 杀净（仅剩用户常驻 5173 服务），临时目录已删。**遗留说明**：调试期两次无参跑临时 exe 走了「兄弟进程存在→直接开浏览器」分支，给默认浏览器开了 2 个指向 5273 的死页签，可手动关掉。
