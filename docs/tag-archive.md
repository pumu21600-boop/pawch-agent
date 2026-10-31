# Tag 说明归档（精简前的原始说明）

> 2026-10-31 按用户要求把每条 tag 说明精简为一句话；这里保存原始全文以便追溯。

## v0.9.5-p8.5（2026-09-03）

```
P8.5: 严格默认档位中立性与极简形态上线
```

## v0.9.6-p8.5（2026-09-04）

```
P8.5 收尾（施工单 012）：思考形态 UI 覆盖恢复、能力标记所有权、tools 闭环、角色语义区分+fallbacks UI、.attachments git 排除、B1-B4 语义固化；覆盖 tag 外的思考档位系列（023f7da..bb2f863）与多模态转接（f65e08d）
```

## v0.9.7-p9（2026-09-04）

```
P9 施工单 013 完成：审批规则引擎 v1 转正（判定补齐/单点化/会话内同类允许/依据可见）+ Plan 模式（Plan 档只读拦截/plan 计划卡/批准转 Act）。88 测试基线（干净终端应全绿；沙箱内 3 个环境假阴性：LSBOX_*×2、PortableGit×1）。真实冒烟：Plan 档拦截链路已真机验证；计划卡真实模型链路待渠道恢复复核（见 ROADMAP P9 行）
```

## v0.9.8-p10（2026-09-04）

```
P10 完成（施工单 014+015）：trace 时间线视图（/api/trace + 前端面板）+ 工作区切换盘点关项 + eval 评测体系（HTTP 黑盒驱动 CLI，首批 3 任务真机 ALL PASS 9/9，主服务零改动）。测试基线主 bin 90 + eval 3 + sandbox_hog 3（干净终端全绿，沙箱内 3 个环境假阴性）
```

## v0.9.9-p10.5（2026-09-04）

```
P10.5 计划外前端改版完成：全站深/浅主题（121 色变量化）、设置面板经典左导航 6 分区、记忆分区（/api/memory + 双层 AGENTS.md 编辑器，保存闭环真机验证）。基线主 bin 90 不变
```

## v0.10.0-mcp（2026-09-04）

```
P11 MCP client stdio 最小闭环完成（施工单 016）：JSON-RPC over stdio、工具桥接 mcp__<server>__<tool>、审批集成（未确认=Dangerous 防投毒）、设置插件分区、崩溃自愈与崩不连坐真机验证、真实模型调用全链路回喂冒烟通过
```

## v0.11.0-p11（2026-09-04）

```
P11 完成（施工单 016+017）：MCP client stdio 最小闭环 + WASM 插件宿主（wasmtime，纯计算沙箱）+ 工具总线统一（内置/mcp__/wasm__ 三源）。组件总线 UI 插槽留 018
```

## v0.13.0-p12（2026-09-04）

```
P12 完成（施工单 018+019）：并行工具调用（Safe 只读组并行+写冲突检测）+ AppContainer 沙箱模式（LowBox+能力 SID 默认断网+ACE 自动授权）。三条 AppContainer 真机坑修复。组件总线 UI 插槽留 018 设计
```

## v0.14.0-p14（2026-09-14）

```
P14 记忆库星云 + Skills + 服务自管理 + 设置-记忆补丁（含 2026-09-14 实时回读补丁）
```

## v0.16.0-p16（2026-09-18）

```
P16 完成（含 024 A2 修正）：同会话运行中追加消息（steering）+ edit_file 体积上限 + 021–023 三批整改入库
```

## v0.17.0-p17（2026-09-18）

```
P17：web_search 联网搜索 + MCP resources/prompts + 组件总线 v1（施工单 026）
```

## v0.22.0-p20.4（2026-09-23）

```
P20.4 内置浏览器搬进桌面壳：child webview 宿主 + 控制通道/CDP 驱动 + 用户反馈补丁二~六（菜单浮层不遮网页/不预建空白 agent 页/拖动 16ms 节流/跨站点导航开新页/开浏览器不闪）；eval 真模型 12 任务 53/53（StepFun step-5-preview）
```

## v0.32.1（2026-10-02）

```
快照基线：v0.32.0 之后 35 个提交（11 条 UI 工单开工前）。

本区间改动（按主题）：
- 生态轮：插件可自带技能（manifest skills 字段）+ 内置六大官方插件 GitHub/Word/表格/PDF/演示文稿/浏览器（全 Node 无 Python，共享依赖 ~/.agent/skill-modules）
- 无边框窗口：撤原生标题栏，─/▢/✕ 自绘进内容行、头部拖拽移动、八边热区拉伸、最大化按钮随窗口态切换图标
- 右侧边栏统一标签页：产物/网页/插件面板/文件预览全进标签，×只关激活标签、+号加面板、关光出选择页；窗口按钮归位右栏右缘（三修特异性）
- 项目文件面板：真树按需展开、双击才预览、预览可编辑保存、图片预览、面包屑段段可点、路径跟随选中
- 时间线：修三个实锤 bug + 只展示当前工作区（task.start.session / session.saved 归属）
- 聊天区 ZCode 化：思考块固定高度+自动跟随+滚轮打断、思考按阶段跨度计时、工作用时落盘、去气泡（用户消息保持靠右）
- 上下文占用口径三轮修复：工具定义计入、渠道 completion 计入、渠道实报锚点（输入+输出=上下文）、占比 0.0% 修、口径对齐 DSH token-meter；移除交接文档功能
- 用量/价格面板：会话口径只算对话、加「当前上下文」行、重启丢圆环修复、价格页按渠道带出模型列表、浅色适配补全、面板精简
- 杂项：顶栏/设置图标统一 SVG、SSE 断线取消做成开关、工作区互串修复（ExecConfig 钉工作区）、档位拦截不再发 [通知] 行、插件页/技能页收敛（SVG 图标、去技能 chip）、文档技能对症重写、demo 感排查 8 项
```

## v0.32.2（2026-10-03）

```
快照基线：v0.32.1 之后 13 个提交。

本区间改动（按主题）：
- 插件三关收官：权限全放开 + 6 项内置能力搬进插件壳（功能桥接/Git 运行时/沙箱/css-ui注入/星云/断线取消）；准入审核关（静态审查+指纹绑定，有阻断项拒装）；审查报告可视化弹窗 + 拉清单自动预审 + 「/」菜单点插件必插输入框
- 文档类预览只读化：docx/pptx/xlsx/pdf 去编辑去工具条，纯内容直出（docx 连缩放/打印条也清掉，docx-save 路由整体拆除）
- 右侧边栏标签定稿（用户逐轮拍板）：等宽→改固定宽 120px（不随标签个数/字数变）、文字前加对应 SVG 图标、× 顶到标签最右；标签挤出时在分隔线上自绘 2px 细滑杆（可拖可点，不占布局不顶标签）
- 修复 @上下文「选对话」列表乱码（flex 列 + overflow:hidden 子项被压成横切片）
```

## v0.32.3（2026-10-03）

```
快照基线：v0.32.2 之后 1 个提交。

本区间改动（按主题）：
- 侧栏插件面板收敛成六个（用户拍板）：「打开标签页」选择页与 + 菜单只出 产物/审查/网页 + 宿主三面板插件 时间线/项目文件/用量，其余插件（Git/沙箱/星云/css-ui注入/断线取消/功能桥接）不再进侧栏，老存档里开着的也一并清掉
```

## v0.32.4（2026-10-03）

```
快照基线：v0.32.3 之后 1 个提交。

本区间改动（按主题）：
- 插件页撤面板插件界面入口（用户拍板）：九个 dock 插件去掉「打开」、用量撤「设置」（从侧栏面板进）、沙箱行换单个「检测」按钮（真自检+行内结果 chip）
```

## v0.32.5（2026-10-04）

```
快照基线：v0.32.4 之后 16 个提交。（2026-10-03~04 自改机制重构轮：阶段0 审批并三档+红线收缩、阶段1 前端 UI_OPS 注册表、阶段2 后端读界面自报清单、阶段3 设置 schema 元数据表、阶段4 插件桥并入同表；测试 319→325；真机验收全过，附 shell 复合命令绕过高危名单的存量弱点记录）
```

## v0.32.6（2026-10-04）

```
快照基线：v0.32.5 之后 1 个提交。（2026-10-04 审计修复轮：shell 判级三洞收口 + xlsx 预览 XSS（库升 0.20.3）+ 壁纸通道补齐 + settings schema 判级；测试 327）
```

## v0.32.7（2026-10-04）

```
快照基线：v0.32.6 之后 1 个提交。（2026-10-04 放开权限轮：除审批档位/API key 全部可改——渠道四件套降 normal、set_config 保注释改 config.toml 带类型对齐、mcp_servers 入表、plugin 工具先审后装 force 必问；测试 329）
```

## v0.32.8（2026-10-04）

```
快照基线：v0.32.7 之后 1 个提交。（MCP 去每服务审批档，统一跟随全局档位）
```

## v0.32.9（2026-10-04）

```
快照基线：v0.32.8 之后 1 个提交。（MCP 去首装确认，装了就能用）
```

## v0.32.10（2026-10-04）

```
快照基线：v0.32.9 之后 1 个提交。（MCP 菜单收一行+启动预连+settings 落盘加固）
```

## v0.32.11（2026-10-04）

```
快照基线：v0.32.10 之后 1 个提交。（聊天区整理：markdown 渲染+工具/思考默认收起）
```

## v0.32.12（2026-10-05）

```
快照基线：v0.32.11 之后 1 个提交。（定时任务高级选项加上下文上限）
```

## v0.32.13（2026-10-05）

```
快照基线：v0.32.12 之后 1 个提交。（定时任务执行模型选择+档位四档残留修复）
```

## v0.32.14（2026-10-05）

```
快照基线：v0.32.13 之后 1 个提交。（定时表单：供应商显示名修正+文案/字体对齐）
```

## v0.32.15（2026-10-05）

```
快照基线：v0.32.14 之后 1 个提交。（供应商下拉只显示供应商名）
```

## v0.32.16（2026-10-05）

```
快照基线：v0.32.15 之后 1 个提交。（模型下拉跟随供应商+删小字）
```

## v0.32.17（2026-10-05）

```
v0.32.17 文档处理全链路轮（2026-10-05）

用户随手发 Office 文档 → 无论什么要求流畅办完：
- 收件：附件按类型分流，Office/PDF 落盘 .attachments/ + 消息注入文档清单（技能路由+副本策略+预览链接格式）
- 保真内核：xlsx patch（ExcelJS）/ pptx replace（run级替换+删移复制页）/ docx patch（微创+红修订）/ pdf edit（页面编排+中文盖章）
- 验收：check.js 结构+文本回抽+条件渲染冒烟，FAIL 不许报完成
- 闭环：回复里 /api/workspace/ 链接可点开预览；默认 _updated 副本保原件
```

## v0.32.18（2026-10-05）

```
工作区别名能改且即时生效：action=alias 具名通道 + alias/workspace 端点补 settings_changed（修改名后界面不刷新、重启才生效）
```

## v0.32.19（2026-10-05）

```
直接改 settings.json 也即时生效：settings_from_text 同尺迁移 + 500ms 外部改动监听（改配置不等重启）
```

## v0.32.20（2026-10-05）

```
改名入口写进系统提示 + SSE 连上即重拉；补上「改完必须重建 release 并重启」的部署动作
```

## v0.32.21（2026-10-06）

```
v0.32.20 → v0.32.21 全量改动（2026-10-05 ~ 10-06，用户实锤驱动）

一、老格式文档桥接（277f1a1）
- .doc/.xls/.ppt/od* 收件转 OOXML：soffice 装了才用（独立 profile + 临时目录改名），没装给三档实话（.xls/.ods 能读不能改）。
- 修「文档通知从未进模型上下文」断链：附件落盘后通知要真进本轮上下文。

二、文档能力实测轮（3110096）
- 修 xlsx 技能「公式被写成文本」、read 显示无缓存公式两处，Word/表格/演示/PDF 多步任务全过。

三、审查面板对齐 ZCode（985994a）
- 后端 recovery 长出 RepoOrigin（shadow/workspace）：workspace 档不传 baseline 即相对 HEAD（「未提交改动」），非 git 工作区明确报「不在 git 仓库中」，不拿影子仓库冒充。
- 前端审查面板重做：来源选择器 + 撤销 + 刷新；点行就地展开 diff（左右行号列 + 增删着色），不再另开 diff 标签。
- 修改动条清单行的横向滑杆：审查行漏了 box-sizing（content-box 下 width:100% 又叠 12px 内边距，整行宽出一截），已补 border-box，浏览器实测溢出归零。

四、会话历史事实源修复（d918569）
- 本轮上下文改为取会话文件历史 + 只接本条新用户消息。原来照单全收前端请求的 messages（只有 role+content），每起一轮就把上一轮的工具卡/思考/用时从会话文件抹掉，重启后只剩最后一条能展开。

五、系统提示与工程卫生（b7e9651）
- prompts/system.md 重写两段：「说已做之前」（没真调工具就说完成＝撒谎；界面动作一律走 ui 工具）与「文档任务」（按消息指明的技能走、保真微创、默认交付副本、必跑 check.js、给 markdown 链接）。
- .gitignore 忽略 /.probe-browser/ /.zcode/ /probe*.xlsx /settings.json.bak。
- docs/ 补《自改方案-免逐项硬编码（op注册表+设置schema）.md》。

验证：cargo check 干净（仅存量告警），353 项测试全过，前端 npm run build 通过。
```

## v0.32.22（2026-10-06）

```
v0.32.21 → v0.32.22 全量改动（2026-10-06 单点修复轮）

修「关掉星云插件，左下角记忆库按钮还在」（9ec344b，用户实锤）

- 根因不在联动而在通知：manifest 声明 feature:"galaxy"，toggle_plugin 一直都同步写 settings.features（落盘为证 features.galaxy=false / disabled_plugins=["nebula"]），但 toggle_plugin 是唯一改了 settings 却不推 settings_changed 的写入面。前端 toggleExt 只更新 extList，settings 派生的界面状态停在旧值，侧栏「记忆库」入口（看 features.galaxy）就一直在，直到重启才对上。
- 修法：toggle_plugin 落定后补推 settings_changed（keys 带 disabled_plugins，联动命中再加功能键）；前端 settings_changed 的 run 本就是 loadExt + loadSettings，事件一到 features 重拉，入口该收就收。另加一道兜底——入口被关时已打开的星云弹层跟着收，不留空壳。
- 新增测试 plugin_toggle_pushes_settings_changed_with_feature_key（钉事件 kind 与 keys 形状，总线按完整形状匹配防并行测试串扰）；ui_events 开测试专用订阅口。
- 真机验收：页面不刷新直接关星云 → 按钮即时消失；开启 → 即时回来；反复两次稳定。已还原成用户原本状态（星云停用）。

验证：354 项测试全过，clippy 仅存量告警，前端 npm run build 通过。
```

## v0.32.23（2026-10-06）

```
v0.32.22 → v0.32.23 全量改动（2026-10-06 单点：浏览器能力总闸）

浏览器插件做成真正的能力总闸（c1d3f4a，用户拍板）

用户原话：「我就是要把这个当成浏览器能力，关掉了 agent 就不能调用内置浏览器，侧边栏的网页入口也没了，就这么简单」。

- 病因：停用插件此前只收回 browser-use 技能（agent 少了说明书），但 browser 工具与 /api/browser/* 面板接口毫无阻拦——shell curl 照样能驱动浏览器。开关拨了，能力还在。
- 修法（三道闸，共用同一份停用名单 plugin::ui::disabled）：
  ① browser::command()（agent 工具唯一入口）开头即拒，回人话指路；
  ② src/server/mod.rs 加 guard_browser_plugin 中间件，/api/browser/* 一律 403（走中间件不逐 handler：19 个端点漏一个就是假闸，新端点自动收编）；
  ③ 前端侧栏「网页」标签改走 browserOn，停用即隐藏、启用即回，页面不刷新同步；+ 号菜单过滤；open_tab 的 ui 工具对 web 收口；每 2s 的 browser/state 轮询随开关起停。
- 新测试 capability_follows_disabled_list。

真机验收：停用 → state/screenshot 均 403、browser-use 技能 7→6、网页标签消失；启用 → 全恢复；双向均不刷新同步。353 项测试全过，clippy 干净。
```

## v0.32.24（2026-10-06）

```
v0.32.23 → v0.32.24 全量改动（2026-10-06 单点：时间线修复）

修「时间线刷不出来」（8faea9c，用户实锤「又发现了」）

两个缺陷叠加把时间线打成空白：

① 根因——gateway.request 把完整请求体写进 JSONL：长任务 messages 历史越滚越大，
单条 2.4MB、每步一条，20MB 轮转上限几次撞穿；keep_archives=3 把更早归档删掉，
task.start 落在已删归档里而后续 tool_call 还在仅存的几份中，任务边界丢失。
实测三份归档中 gateway.request 占 99.6% 体积。改为 JSONL 只记摘要
（model/条数/正文字符数/每条角色+字符数/工具数），完整体仍走 debug 控制台。
主渠道与 aux 渠道同改；embedding 那条本就只记 inputs 计数。

② 假兜底——文档称「无 task.start 时按 tool_call 且 step==0 近似切分」，但 step 是
进程级累加计数器（实测 7768/7769…），永不为 0，该兜底是死代码。

③ 解析器兜底（真被轮转吃掉也不该空白）：孤儿活动事件开降级任务并标 lost_start，
start_ts 照实说明是近似值；收尾用 session.saved（loop.finish 实测 0 条），
判据为「本任务已有 tool_result 之后来的那条」，不误闭合正常任务。

④ 时间线面板：起点缺失的任务显示「起点缺失」小标 + hover 说明。

验证：新增 4 个测试。真机用已被轮转吃掉的旧日志验收——API 从 0 个任务变为按轮切分的
多个任务，与测试期反复执行的 del 动作一一对应，工具调用/结果配对正确。
357 项测试全过，clippy 干净。
```

## v0.32.25（2026-10-06）

```
插件重整：16→9（2026-10-06 用户七项全部拍板，上次推送=v0.32.24 8faea9c 至今全部改动）

① 5 个纯技能插件降级为全局技能：GitHub/Word/PDF/演示/表格——skills/ 整体搬进应用
   技能根，撤插件位，管理面归技能页；系统提示由「可用技能」索引列出。
   git-panel、sandbox-panel 移出插件位（本就只提供面板且不进侧栏），能力全留宿主：
   git.exe 发现链六步、输入框上方分支/脏文件数/提交、审查 diff、src/sandbox 探测执行。

② 三个点名改名：自改→中枢、星云→记忆库（网页→浏览器上轮已改）。manifest title、
   dock ui 标题、面板页 <title>、selfmod_gate 指路话术、settings/session/ui/plugin
   工具描述、系统提示「自我管理与探索纪律」全部同步；「中枢」补 SVG 图标。

③ 沙箱 CPU 撤滑块（用户：「设一个合适的数值然后不留」）：sandbox_cpu_percent 设置键、
   settings_schema 条目与校验、settings 工具 patch/快照、PUT /api/settings、features
   桥、前端 sandboxCpu 全清；SANDBOX_CPU_PERCENT=80 固定生效。顺手删 2026-10-04 去
   首装确认后的死代码 same_config 与过期注释（clippy 存量告警净 -2；HEAD 起 CI
   clippy 尚有 10 条存量红未混修）。

④ 插件删除三件套（补「新建只建不删」缺口）：POST /api/plugins/remove（内核
   plugin::ui::remove，端点与 agent 工具共用一份；只删 user 来源，built_in 拒删说
   人话，草稿指路「丢弃」；删目录+清停用名单/信任表残留+重扫注册表+settings_changed）；
   设置页第三方行「删除」按钮走 ConfirmModal；plugin 工具 action=remove 过 selfmod
   闸、判级 Dangerous 必问。

⑤ git 打包分两档：package_release.ps1 -Slim 出不带内置 MinGit 的精简版
   （agent-<版本>-win64-slim）；README 对照表说清代价=没装 git 的机器上检查点/撤销/
   改动/审查不可用，界面照实说不静默。

⑥ 缺 git 不许静默：GitStatus 增 git_missing 区分「没装 git」与「不是仓库」；改动条
   缺 git 时明说+安装方法（以前整条静默消失）；Git 运行时卡片从插件分区搬进
   设置→插件「宿主能力」区（来源/版本/路径/重新检测），与沙箱行并列（沙箱行显示生效档位）。

真机验证（5173）：插件清单恰 9 个全 ok；技能列表含 5 个新全局技能；git 区分字段正确；
插件建→删→删内置→删不存在 = 200/200/403/404 且磁盘无残留；git info、sandbox info 与
selftest 全通；cargo test 358 过 0 挂；cargo check 零告警；前端 vite 构建过。
```

## v0.32.26（2026-10-07）

```
插件对齐改名落定：css-ui注入→css-ui工具、用量→用量价格（2026-10-07 用户给的名字）

用户纠偏 v0.32.25 交付说明里我自起的「界面微调/辅助渠道」——对齐名要用用户当初给的
名字。从原始会话核对出的最终名单：css-ui工具、用量价格；其余保留插件（时间线、项目
文件、功能桥接、断线取消）现名不动（与用户给的名字一致）。

改动：两个 manifest 的 title + dock ui 标题（侧栏页签跟随）；css-ui 插件页标题与
页内标题；settings_schema 功能键标签；ui 工具 open_panel 参数说明与前端 ops args；
README/plugin-contract-v1/jsonl-schema/settings/usage 注释文档同步。tools/settings.rs
两处「用量」为当年事故记录（历史）、ROADMAP/workorders 为历史档案，均不动。

真机核对：清单 9 个，css-ui工具/用量价格在列且 dock 标题同步；cargo test 358 过；
前端构建过。上次推送 = v0.32.25（5979342）。
```

## v0.32.27（2026-10-07）

```
设置四处空态句去掉 + 技能页行标题去 $（2026-10-07 用户截图点菜）

用户截图 MCP 页签空态「还没有 MCP server。」：没有技能/MCP/插件/定时任务时的
空态句全删。清点共六句——设置页三句（MCP/定时/插件；技能页本就没有空态句）+
「/」能力菜单同性质三句（暂无技能/暂无可用工具/暂无可用插件）。空着只留分区
标题和操作按钮。

另：技能页行标题去掉 $ 前缀（引用前缀 2026-10-02 已统一为 /，$ 是死记忆，
页面上还显示着 $docx）。

真机核对：服务吐出 bundle 与新构建逐字节一致、六句全无；vite 构建过。
纯前端改动。上次推送 = v0.32.26（a772918）。
```

## v0.32.28（2026-10-08）

```
持续 bug 探查修复轮（2026-10-08，自 04d6ac5 起 14 个提交，测试 363→396 全绿，真机冒烟+浏览器验证通过）

P0 安全/崩溃：
- search 工具 query 裸传 ripgrep：--pre= 可借搜索通道对每个命中文件 spawn 任意程序（-e 显式声明模式收口）
- 两处 Unicode panic：normalize_model_id 非 ASCII 模型名字节切片越界；html_to_text 的 to_lowercase 改变字节长度导致偏移错位（改 ASCII 等长小写副本）
- doctext：zip 中央目录 nlen 未校验直接切片 panic；inflate 无输出上限（50MB 恶意条目解出数十 GB 撑爆进程，32MB 上限按炸弹拒）；CDATA/注释里的 > 被当标签结束错切
- DNS rebinding 防护被 127. 前缀匹配击穿（127.0.0.1.evil.com 穿过），收窄为四段 0-255
- /api/workspace/raw 的 SVG 直出无 CSP，点开 raw 链接即同源执行脚本（禁脚本 CSP + nosniff）
- browser 工具 navigate 放行 file://：read-only 档零审批读任意本地文件（工具侧收紧 http(s)，面板地址栏保留）
- 审批自授权三洞：settings 工具 mcp_servers 整表替换零校验（借 MCP 通道任意命令执行）；定时任务经 settings 工具改 approve/full-access 造持久无人值守全批；子代理 on_approval 模型自选=自己批准自己（一律 deny + 档位不得高于父会话）
- shell 判级两处实测残余：^ 转义（d^el 执行即 del）、cmd /V:ON 延迟展开（静态文本无高危 token 却真实执行）

数据丢失/逻辑错误：
- settings.json 7 处读-改-写无锁，并发写互相整份覆盖（AppState.settings_write 串行化 + 外部监听防过期快照）
- set_config 浮点写整数键原样落盘，下次启动解析失败服务起不来（无小数收整数、带小数拒、数组元素类型校验）
- recovery restore 不解析 rename 状态行（半途回滚）+ CJK 路径 quotepath 转义；diff_text 512KB 字节切片 panic
- context「最近 N 个工具结果永不裁」不变量反转（checked_sub 下溢成 None），最新工具结果被静默折叠
- headless 续跑超 3 轮把已 drain 的排队消息直接丢弃；时间线跨会话误闭合；cancel 丢唤醒竞态
- skills save 把项目级旧副本连 references/scripts 一把删（改整体迁移）；schedule 运行守卫 panic 后永久泄漏
- 多模态附件被投影块整体覆盖（截图+文档同发时图片 parts 静默丢失）；thinking+temperature 同发 400 被误归因为「端点拒收思考」并永久降级
- Anthropic usage 口径：input_tokens 不含 cache 字段导致锚点系统性低估；环回渠道（本地模型）走系统代理 502
- max_steps 出口漏拍结束快照/改动条；tool_call 越界 index 撑爆 Vec；SSE 坏 JSON 静默吞成空回答
- 日志/台账写盘错误被吞；会话文件并发写互吃；workspace 列目录跟符号链接；沙箱探测跨链同名标记互删（周期性假红）

浏览器层：事件任务关页后永久泄漏、陈旧 waiter 吞事件（navigate 超时重试必再超时）、ref 跨页别名、max_elements 无上限、shell label 复用
前端：Select 监听器泄漏、设置同步冲编辑中表单、管理条计数冻结、定时器/监听器不清理、价格页丢未 blur 输入、CSS 注入两处语法盲区
插件/脚本：四个插件 req() 无超时（面板永久假死）；check.js 清理代码污染验收结论；pdf 断言被 50 页截断误报；fetch 体检白名单正则过宽
性能：mammoth/SheetJS 动态导入 + manualChunks，首包 JS 1.53MB→546KB（真机浏览器验证）
```

## v0.32.29（2026-10-08）

```
v0.32.29 — 持续 bug 修复轮（第二轮，2026-10-08）

自 v0.32.28（4f06e8b）以来的全部改动，五路并行普查 → 逐项读码复核（实证拦下
subagent 两条误报：context skip(2) 分组折叠其实原子不会破配对、workspace.rs
junction 早在批次七修复）→ 小批次修复 + 回归 + 真机冒烟。测试 396→408
（主 bin 400 + eval 8），clippy 与改动前同基线，前端构建 + fetch 体检过，
release 二进制已热替换用户服务（PID 7424），全端点探活无异常事件。

P0 判级/安全：
- rules.rs git 全局选项的值带引号+空格时 split_whitespace 把真子命令吞掉，
  push/clean/rebase 降级 Normal，auto 档静默放行（实测真实执行）。改引号感知
  分词，引号不配对按高危拒判。
- contract.rs origin_of 让 manifest 自声明 source 压过位置默认，工作区
  plugins 里写一行 model_generated 就跳过 pin 验签。改声明只能降级不能升级。

P1 数据丢失：
- session 落盘把「文件读不出」当新会话，覆写抹掉置顶/归档/标题/用量快照。
- memory sync 无串行化 + 固定 tmp 名，并发写交叉出坏 JSON 后全库静默重置。
- settings 写互斥漏挂 7 个 handler（manage_configs/toggle/promote/trust/
  save_schedule/delete_schedule/skills toggle），并发互覆盖。
- skills delete 兜底按文件夹名误删项目级同名技能。
- plugin remove 对裸文件旧形态照 plugins/ 根删，连坐删掉九个内置插件。
- McpTab 四参调用致 UI 添加 MCP 100% 不可用。
- ScheduleTab「读取失败」提示被同一函数当场擦掉（死代码）。
- eval 切换工作区不验 HTTP 状态码——会把 agent 驱动到用户真实项目建文件。
- eval SSE 断流不验 done——断流前已落地的文件让任务假绿。
- 判级用全局 workspace_root 而非任务钉住值（后台任务切工作区即错）。

P2 收尾（21 项）：best_window Unicode panic、sandbox_selftest 空结果假绿、
session_approval/approval_meta 只增不减、storage 读错误吞、wasm read_cstr
超大分配、recovery rename 键不匹配、ui.css 深色缺 4 组 tint、escalateCss
注释盲区、MemoryTab 回读静默、ScheduleTab 下拉不建依赖、SkillsTab 改名留
旧副本、eval 会话泄漏/setup 路径未消毒/字段不校验/AGENTS.md 豁免假绿/
walk 无深度上限、mcp-http-server port 与 body 校验、沙箱文案不谎称断网、
service.rs usage 四档残留、README/契约/ROADMAP/schema/自改方案文档漂移。
```

## v0.32.30（2026-10-08）

```
v0.32.30 — 插件制作器 + 审核/pin 移除（2026-10-08）

自 v0.32.29（2c46202）以来的全部改动：

1. 插件制作器上线（plugins/plugin-maker/，用户拍板方案）：表单即窗口——需求输入
   + 工作区下拉，确定后宿主切工作区→建对话→输入框预填「用户需求 + 契约规范 +
   最小可用示例 + 安装验证引导」，不代发（用户自己审自己回车）。新桥
   session.create + 新权限；提示词模板内联在插件页，改模板不用重编译宿主。
   入口：设置→插件页「打开」（用户拍板不加侧栏标签）。
2. 审核与 pin 验签移除（用户拍板：提示词保证规范性 + 沙箱隔离保证崩了不连坐，
   两道门在生态没起来时只是安装摩擦；git 删除提交可捞回）：删 review.rs/
   trust.rs、/api/plugins/review 与 /trust 端点、plugin 工具的 review/unpin
   action 与 force 参数、ReviewModal 与全部审核/信任 UI、settings 的
   trusted_plugins 字段、四道验签门、plugin.trust_* 审计 kind。保留 draft
   隔离区、停用语义、manifest 契约校验、source 三值语义。
3. 顺手修一个既有启动 bug（真机对照实验实锤）：App 的 async onMount 续体里调
   onDestroy 每次开页面都抛「Function called outside component initialization」
   并打断后续启动续体——监听与清理移进同步 onMount 返回值，修复后零报错。
4. 前两轮本地提交一并并入：文档收口轮（README 精简 426→203 行/清 P 级编号/
   去模仿表述）、浏览器错误页判定修正（HTTP 4xx/5xx 不再误报「站点连不上」）。

测试 387 过，clippy 无新增告警，前端构建过；隔离实例真机全流程（表单→确定→
新对话预填、切工作区分支、浅色主题契约、免激活加载）全过；验证残留已清
（冒烟实例/临时目录/headless-shell 全删，用户常驻服务未动）。
```

## v0.32.31（2026-10-09）

```
记忆检索接进 agent（v0.32.30 之后）

自 v0.32.30 起的全部改动：新增 memory 工具，把语义记忆检索接给 agent。

- 用户实锤「让他检索记忆，他折腾半天」：模型为找记忆翻应用源码、手解
  3MB library.json，52 秒 18 步还没搜到。根因是 /api/memory/search 只有
  星云面板在调，agent 侧没有工具；ui open_memory 单向开面板，模型无回包。
- memory 工具四动作：search（语义+关键词）/ recent / similar / read（读原文），
  全部只读；受「记忆库」插件总闸（关插件则界面入口和 agent 通道一起没）。
- 检索结果补身份字段（标题/工作区/时间/消息数），agent 能说清「哪条、何时」。
- 检索前有界增量同步：索引原先只在开面板/定时时同步，中途会话搜不到。
- 转写逻辑提成 session::transcript()，面板与工具同一条路；顺带修 omitted
  假提示（没丢内容也报「只保留最近部分」，前端 @引用 同样中招）。
- 系统提示加「以前的记忆」段，写明别翻 logs/、别解析 library.json、别考古。

验证：393 单测全过；隔离实例 + 假渠道 + 232 条真实会话真跑一轮通过。
```

## v0.32.32（2026-10-10）

```
记忆系统完善收尾 + 上下文瘦身（2026-10-11）

自 v0.32.31（d598657）以来的全部改动：

一、记忆系统完善整条线（第 0–8 步全完工，经用户验收反馈后收尾）
- 第 0 步：回滚全局约定路径——修「正在跑的服务读 app_root 那份、用户改
  ~/.agent/AGENTS.md 不生效」的活 bug（拆 global_dir 成两个根）。
- profile.md 自动记忆读写层：行级增删改 + 元数据 + 原子写 + 字符上限计数
  + 观察中过期清理；memory.write 工具（add/replace/remove/merge，match
  一字不差，常规写定级：只读档下每次先问用户）。
- 注入：系统提示在 AGENTS.md 后拼 profile.md，空分区不注入；system.md 加
  「边聊边记」纪律（一次就够、≤40 字、临时性要求不记、冲突听用户的）。
- 上限预警（80% 提醒 + 硬顶拒绝 + 压缩/归档/提上限三选一由用户定）；
  隐私闸：含敏感信息的候选直接丢弃不记。
- 记忆面板第四签「自动记忆」（可编辑 + hits 降序）；全局根从 ~/.agent 搬到
  应用目录（一份安装一份记忆，自动迁移不覆盖）。
- 方案文档定稿（docs/记忆系统方案-2026-10-09.md，四轮外部评审）；§9 开工
  交接；§6.1 记用户两次裁决（契约段删、卡片拆）。
- 用户验收反馈两条：右侧边栏默认零标签页；自动记忆签拆掉条目卡片。
- 顺带修复：模型下拉全选/全不选失效；gateway 请求体不再写全量进日志。

二、上下文瘦身（本轮，用户实锤「新会话发一句你好一万 token」）
- 拆解渠道实报 9726 = 工具定义约 7.9k（四分之三）+ 系统提示约 2.8k。
- 工具定义去重压措辞：与系统提示重复的段（「自改纪律/中枢闸」在 6 个工具
  描述里各一份）改成一句指向；fire_event 白名单枚举整删（白名单 kind 全有
  具名方法）；browser 35 个参数描述压到必备；参数 schema 已写明的配套关系
  不从描述复述；board=项目文件/tab 页签含义等模型猜不出的映射保留。
- 7900→6607，新会话基线降到约 8.8k；prompts/system.md 一字未动（用户要求
  不丢提示词）。
- 右侧边栏改默认关：rpOpen 从 localStorage 改存 sessionStorage，重开软件/
  新标签页从关着开始，旧键启动时清除（反转 10-01「默认开防找不到浏览器」）。
- MCP 实测（App 内 agent 操作）：添加 test-fs（server-filesystem，14 工具，
  约 2800 token——比瘦身省得还多）验证通路后已删除；期间确认工具清单按任务
  快照，中途连的 MCP 下一条消息才生效。
- 防回涨预算测试（6800）加了即被用户否决，已删除，本地提交重排不留痕。

验证：409 单测全过；release 重建 + 服务重启（PID 18772，HTTP 200，二进制
文案核对）；web 前端 npm run build 后真机验证（新资产哈希已被运行中的服务
提供，用户刷新页面即生效）。
```

## v0.32.33（2026-10-20）

```
v0.32.33 — 免打扰自治轮：缓存命中率修复 + 子代理 UI + 抓取回退 + 操作电脑

自 v0.32.32（上次推送至今 2026-10-20）的全部改动：

【缓存命中率】4 个真问题修复，e2e 第 2 轮命中 21%→98%
- 「项目现状」brief 移出系统提示、并进首条 user 消息（原来第 2 轮 system
  变短使 system+tools 稳定区缓存全失效）；/api/chat 与无头会话同路径
- 插件工具顺序 bug：load_inline 后按 stem 重排 + 下发前排序（draft 装载
  不再打翻 Anthropic 前缀）
- 断点反向扫描兜底（末块是未来新块型时退到前一个可缓存块）
- 空串末条 user 也打缓存断点

【子代理 UI】（不落侧边栏）
- 主区实时条：排队中/执行中徽章 + 标签 + 单发取消；跑完留 chip
- 居中小弹窗回看面板：状态/模型/token/时长/子会话 id + 打开子会话 + 取消
- 后端：dispatch id 全生命周期、排队即上屏、200 条历史环形缓冲、
  GET /api/subagents + POST /api/subagents/cancel

【抓取网页增强】
- web_fetch 加 render 档（auto/always/never）：JS 渲染骨架页自动回落浏览器
- 浏览器新方法 page_text（整页 innerText，上限走 max_chars）

【操作电脑】（新模块 src/computer/，零新增依赖）
- computer 工具：screenshot/cursor/screen_size/windows/focus/click/move/
  scroll/drag/type/key
- 截图多模态回传：<<COMPUTER_IMG:base64>> 标记 → tool 消息升级 text+image
  （Anthropic tool_result 图片块；OpenAI 兼容层压平成人话），图片只进请求
  上下文不落盘
- 手写 PNG 编码（flate2 zlib + CRC32）、GDI 截虚拟屏、SendInput 键鼠
- UI：主区实时动作条 + 居中小弹窗面板（左截图右动作流水）
- 真机 opt-in 测试（AGENT_COMPUTER_E2E=1）验 unicode 输入/鼠标定位/组合键

【测试与工具】
- 全量 453 项通过（新增约 40 项）；真机键鼠 e2e 通过；clippy 零新增告警
- scripts/run-tests.bat、run-clippy.bat、build-smoke.bat（Git Bash 的
  link.exe 抢占问题；bat 内禁中文）
- mock_provider 升级：Anthropic 最长前缀缓存拟真、SPA 页、子代理剧本、
  抓取剧本、brief 剥离

【观察（未修，留给用户拍板）】另一会话全量测试发现：渠道静默时「停止」
最长干等 120s、无响应渠道干等 600s 且停不下来（gateway 两处 select! 缺失）。
```

## v0.32.34（2026-10-23）

```
v0.32.33 至今全部改动（10-21 修复轮 9 提交 + 2026-10-22 当前批次 8 项）：

10-21 修复轮：
- 修 5 个待办 bug + 停止按钮的两条失效链路（全量测试发现）
- 修 wasm 并发测试的全量并行竞态
- 修 CI 测试环境差异：3 个在本机过、CI runner 挂的测试
- skill_roots 测试比 canonicalize 后的路径，不再猜前缀形态
- 清 clippy 告警 20 条，CI Rust job 恢复可过
- 修子代理 chip 死结：刷新后历史永远看不到
- 远端仓库改名 pumu21600-boop/pawch-agent；项目定名 Pawch Agent（只改显示名）

2026-10-22 当前批次（用户拍板整批开工，8 项全终局）：
1. 旧设置迁移垫片：47 提交逐代考古定案 + v0 顶层 key 直挂挽救配置（修预设 id 收敛场景 key 静默丢失）+ 两个回归测试
2. browser 工具真模型全流程验证：10 方法全覆盖（点击/填表/下拉/滚动/evaluate 等），本地静态页覆盖，全程 auto 档免审
3. 引导中断真机验：流式输出中途发引导，第一答完整落地未打断、模型同轮续跑、无空轮，坑 29 ② 修复语义全过
4. 工具级取消 + 立即发送/引导分家（用户当日拍板）：立即发送=打断（三等待点让位、本轮继续带新指令跑）；引导=不打断且静默（已引导 chip + 历史轻量行）；steered/interrupted 标记四路径落盘；实测停止到 cancelled 143ms
5. WASM 宿主函数：manifest 权限闸 + 四宿主函数（storage/fs_read/http，SSRF 与工作区判界复用既有防线）+ 三个随包示例插件 + run 纯文本透传；真模型冒烟三项全过
6. P2 二轮拆分：App.svelte 留根的 ext/模型/外观/角色页签拆成 lib/ 下四组件，markup 逐字平移 + Svelte 绑定时序实证 + 隔离实例真机冒烟
7. 三条轻微现象排查：壳启动自 resize 未复现（双构建实测零 Resized 事件）；面板 webview 30ms 闪现定性为固有代价；无头菜单只有一项定性为正常设计并清掉一段死代码
8. 改名迁移轮：crate/二进制 agent → pawch-agent；~/.agent → ~/.pawch-agent；应用目录 .agent → .pawch-agent；AGENT_* → PAWCH_AGENT_*；插件桥协议 agent:* → pawch:*；tauri identifier/壳日志/自启注册表值/LocalAppData 缓存路径/start-stop.bat/打包脚本/README/契约文档/技能安装命令全换；一次性数据迁移（只搬新根没有的、不覆盖、旧根不删）+ 旧路径兼容读一个版本；478 测试 0 挂 + clippy 零 + 三端构建过 + 隔离实例真机六项验证全过
```

## v0.32.35（2026-10-26）

```
改名扫尾+仓库搬家修复+内置浏览器盲区封堵+子代理派发模型三档+身份问答自认知（v0.32.34 起 12 提交）：

- 改名扫尾：desktop crate 正名 pawch-agent-desktop、用户可见文案三处旧环境变量名换正名、.gitignore 补 /.pawch-agent/
- 仓库文件夹改名后服务全灭修复：壳 service_exe 与服务 app_root 的编译期烙路径改 current_exe 推导，壳拉服务补 --minimized（双击语义曾弹系统浏览器）
- E2E 补测 12 项全过零新缺陷（报告 docs/e2e-2026-10-24/03）
- 内置浏览器 P0 排查+盲区封堵：壳装 SlogLogger 接住 tauri CreateWebview 吞错（HRESULT 有尸检材料），child webview 建页/导航/回收全链路真机验证，零外部浏览器进程
- 网页帧流 native 参数 400 修复（0/1/true/false 都认，壳外客户端面板图恢复）
- shell 高危判级收口复合命令绕过（COMPOUND_WRAPPERS 载体表：if/for/cmd/powershell/wsl 等内嵌危险动词即拦）；删插件同步回收面板标签双面；插件制作器「打开」修复（面板被设置弹窗盖住）
- 子代理默认派发模型三档 roles.subagent_mode（跟随父对话/自己设置/派发前询问）：派发器带父轮三元组、ask 档排队前拦截引导重派、schema 注册 agent 可改、功能桥接页两个新下拉，真模型三档实测
- 身份问答：system.md「你是谁」+【模型路由】事实节配对，问身份一句话自我认知零工具调用
- 全程 471 测试+clippy 零
```

## v0.32.36（2026-10-26）

```
v0.32.36 消息操作全套+回滚带文件恢复+身份自省收敛+SSE错误可见+归档/插件面板跟随工作区（v0.32.35 起 12 提交）：

- 消息操作：用户消息悬浮回滚/编辑/删除/多选，服务端 POST /api/sessions/truncate 按第 N 条 user 定位（rollback/delete_turn/delete_user 三种模式，在跑会话先停再操作 409）；编辑=停流→回滚→新文本重发
- 回滚=文件+对话一起：任务起点检查点 id 随快照记进触发的 user 消息 cp 字段（适配器白名单剥掉不进模型），truncate 带 restore_checkpoint 先 recovery::restore 恢复工作区文件再截对话，文件恢复失败整单不做半回滚；无基线旧消息确认框如实说只回滚对话
- 删除类一律确认弹窗（confirmAsk，写明不可恢复）；多选删除改精确删除：按 (role,content) 按序匹配+原子，仅被删 assistant 的 tool 结果结构性跟随，句首孤儿由适配器剥除
- AI 回复信息卡 (i)：首 token 延迟/输出耗时/速度/来源配置/模型/供应商/输入输出与缓存 tokens/命中率，核心 TurnStats 随消息落盘，降级链不冒充；每条消息边缘 HH:MM 时间，ts/steered 等内部字段适配器白名单清洗永不进模型请求
- 身份问答收敛：system.md 改为按自己训练认知答模型名和厂商、不冒充其他产品；渠道/模型常驻注入系统提示，答身份直给不去读设置不调工具不主动展开；工具描述去 SKILL.md/references 字面消产品指纹；新增干净上下文探测快路（同渠道、无工具、无系统、温度 0、缓存 1h）拦短句纯身份问题，答案来自模型自述；回滚成功后清空身份探测缓存，下次身份问题重新探测
- SSE 错误可见：上游 200 流里夹带 finish_reason:error+顶层 error 不再被当普通分片吞掉，网关识别后上抛，server 落 [错误] 气泡
- 回滚无文件改动也放行：recovery::restore 的 touched==0 从报错改为成功的空操作
- 归档当前会话不再跨工作区：只切同 workspace 未归档会话，没有就在当前工作区新开，顺带修掉「删掉的工作区又回来」
- 插件面板跟随工作区切换：宿主比较前后工作区，变化时向启用插件广播 workspace 事件（双前缀），插件制作器下拉与项目文件树即时重拉、当前标记跟随
- 重启丢轨迹=启动竞态：桌面壳等 5173 可连再开窗，前端 waitForService(30s)+逐项退避重试+可见错误/重试按钮，autoPick 优先最近一条非空会话
- 顺手修：brief 只进请求不进落盘（save 边界剥离，会话标题一起治）；模型弹窗勾选保存改串行队列（连点并发不再丢清单）；报错卡片紧凑化；多选点消息整行即勾选；删除详情挪到回答下方右下；用户消息四功能从文字+侧边改 SVG 图标+消息下一行；复制为上下文按钮改名
- 全程 486 测试通过（3 ignored），前端+desktop 构建过，真机 DOM 断言与 mock 渠道隔离验证通过
```

## v0.32.37（2026-10-31）

```
pawch-agent v0.32.37

网关
- DeepSeek 思考档位按官方文档折算成规范档 none/low/high/max（medium/xhigh/minimal 本地折算，max 不再错发 xhigh）

浏览器
- 新增 preview_file 方法：工作区文件直接渲染成 file:// 页面，不起本地服务、不走代理；只放行工作区内路径
- 本地地址导航失败不再跑代理诊断（端口没服务在听≠代理问题）；代理诊断文案明确注册表残留地址无流量在走
- 工具描述与系统提示词新增网页验证纪律：优先内置浏览器、本地 HTML 直开、禁擅自起外部浏览器、看不到截图用客观测量验收

引导（steer）展示
- 引导消息不再把同一轮的折叠过程拆成两半：完成态随过程合成一行，流式与展开态在真实位置显示
- 重启 rebuild 合并对 steered 消息透明

思考框
- 上滑立即停止自动跟随（滚轮/触摸同步判定），滚回底部恢复
- 「回到底部」按钮让出滚动条宽度不再重叠

侧栏
- 归档机制移除，会话只有删除（行菜单删除带确认弹窗，管理模式批量删除）
- 管理会话与切换视图合并为一个下拉菜单（两个视图 + 会话管理）
- 完成态「已工作」时长统一样式，纯问答轮不再丢失
- 工具条按钮尺寸/图标统一

系统提示词
- 新增「编码任务」节：动手前先读、长任务拆小步步步验、说做完带证据、根因修复、前端验收清单（console/资源/溢出/元素/交互）、从零建站审美定调、git 纪律、注释纪律、收尾对账、量完就收工

性能
- system 提示段序改为稳定在前易变垫尾，自动记忆/身份事实不再打断缓存前缀（暖机命中率）
```

## v0.32.38（2026-10-31）

```
Svelte 5 迁移轮(034):编译器 4.2.20→5.57.3、vite-plugin-svelte 4.0.4,组件全部保持 legacy 语法零改写,入口改 mount();manualChunks 改函数式恢复四块分包;npm test 23 过+四闸全绿+真机隔离实例全验;Svelte 5 组件生态自此解锁
```

## v0.32.39（2026-10-31）

```
UI 生态嫁接轮(035):Shiki 代码高亮双主题/Inter+JetBrains Mono 本地字体/图标线宽归一/OverlayScrollbars 悬浮滚动条/Open Props 令牌打底/第三方声明;四闸全绿+真机隔离实例全验;Tabbit 护眼改色坑实锤入档
```

## v0.32.40（2026-10-31）

```
回滚 OverlayScrollbars(035 补丁):OS 重构滚动容器与宿主 scrollTop 管线冲突致滚轮失灵,降级纯 CSS 滚动条;高亮/字体/图标保留;真人滚轮重验全过
```

## v0.32.41（2026-10-31）

```
UI 嫁接轮整轮回退(用户拍板):web/ 字节级还原至 v0.32.38,高亮/字体/图标/滚动条全部退场,Svelte 5 迁移保留;四闸全绿
```

## v0.32.42（2026-10-31）

```
产物鬼影与基线过期修复(036):tracked_files 存在性过滤根因修复(删除如实入影子基线)+POST /api/checkpoints 手动重拍+面板过期态(隐藏清单+重拍按钮);514 测试全绿+真机闭环全验
```

## v0.32.43（2026-10-31）

```
036 补丁:服务重启后重拍按钮生效+失败就地可见;过期提示改一句话可关闭气泡;悬浮输入框右侧让位 14px 修滑条重叠
```
