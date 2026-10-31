import './lib/ui.css';
// 字体本地打包（035 件 2）：Inter 正文 / JetBrains Mono 代码，变量字体离线可用
import '@fontsource-variable/inter';
import '@fontsource-variable/jetbrains-mono';
// 悬浮滚动条（035 件 4）：样式先行，配合 data-overlayscrollbars-initialize 防原生条闪现
import 'overlayscrollbars/overlayscrollbars.css';
import { mount } from 'svelte';
import App from './App.svelte';

// Svelte 5 入口：mount() 取代 Svelte 4 的 new App()（034 迁移轮）。
// 组件仍按 legacy 语法编译（无 runes），行为不变。
const app = mount(App, { target: document.getElementById('app') });

export default app;
