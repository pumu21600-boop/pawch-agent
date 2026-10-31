# THIRD-PARTY NOTICES / 第三方组件声明

本仓库自身以 MIT 许可发布（见 LICENSE）。以下第三方组件随前端构建打包或被部分复制，按其许可要求在此集中声明。
（npm 依赖的完整许可文本随包分发于 `web/node_modules/<pkg>/LICENSE*`；构建产物由本应用本地托管，不对外再分发源码。）

| 组件 | 版本 | 许可 | 用法 | 来源 |
|---|---|---|---|---|
| shiki / @shikijs/* | 4.5.0 | MIT | 代码高亮引擎（npm 依赖，懒加载） | https://github.com/shikijs/shiki |
| overlayscrollbars | 2.17.0 | MIT | 悬浮滚动条（npm 依赖） | https://github.com/KingSora/OverlayScrollbars |
| @fontsource-variable/inter | 5.3.0 | 字体 SIL OFL 1.1（打包层 MIT） | 正文字体，woff2 本地打包 | https://github.com/fontsource/font-files |
| @fontsource-variable/jetbrains-mono | 5.3.0 | 字体 SIL OFL 1.1（打包层 MIT） | 代码字体，woff2 本地打包 | https://github.com/fontsource/font-files |
| lucide-static | 1.66.0 | ISC | 图标字典与线宽基准（仅参考与抄写个别 SVG，未打包进构建） | https://github.com/lucide-icons/lucide |
| open-props | （变量抄写） | MIT | `web/src/lib/ui.css` 中 `--ease-*` / `--shadow-*` 设计令牌按其值抄写 | https://github.com/argyleink/open-props |

说明：
- SIL OFL 1.1 允许随软件自由嵌入与分发字体，不要求应用级署名；保留各字体包内的 OFL 许可文本即满足条件。
- MIT / ISC 许可要求在副本中保留版权与许可声明——npm 依赖由包内 LICENSE 文件满足；手工抄写的部分（上表「变量抄写/图标抄写」）以本文件集中登记。
- 抄写部分若有更新需求，以上游仓库为准重新核对。
