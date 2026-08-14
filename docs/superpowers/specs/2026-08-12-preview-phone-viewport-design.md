# 手机预览完整显示修复设计

## 背景

当前组件预览挂载在 VitePress 默认 `aside` 插槽中。外层 `.aside` 虽扩展到 `360px`，但 VitePress 内部 `.aside-container` 与 `.aside-curtain` 仍固定为 `224px`，且 `.aside-container` 使用 `overflow-x: hidden`，导致宽 `326px` 的手机框被横向裁切。固定 `650px` 高度和 `top: 88px` 也会让手机框在较矮桌面视口中超出可视区域。

参考 uView2 文档的 `demoModel.vue`，手机预览应按桌面宽度响应式缩放、保持真机纵横比，并让 iframe 自己滚动。

## 设计

继续使用 `Layout.vue` 的 `aside-top` 插槽，不重构预览路由和通信方式。

在桌面预览断点下同步设置以下三层宽度：

- `.VPDoc.has-aside .aside`
- `.VPDoc.has-aside .aside-container`
- `.VPDoc.has-aside .aside-curtain`

手机框使用约 `70.9:143.6` 的真机比例，并参考 uView2 分档：

- `1280–1365px`：宽 `270px`
- `1366–1499px`：宽 `270px`
- `1500–1919px`：宽 `310px`
- `1920px` 及以上：宽 `360px`

预览面板高度同时受 `100vh` 限制，确保导航栏下方的手机框完整落在可视区内。iframe 设置 `scrolling="auto"`、`display: block`、宽高 `100%`，长内容由 iframe 内部滚动，不扩大外层手机框。

小于 `1280px` 时维持现有行为：隐藏右侧手机框，在正文顶部提供新窗口预览链接。

## 边界

- 不修改组件示例内容、H5 路由或 mock 数据。
- 不引入 `postMessage`。
- 不改变移动端文档布局。
- 不修改 uView Pro 或 VitePress 依赖源码。

## 验证

- 增加结构测试，断言三层 aside 宽度均被覆盖，iframe 开启自动滚动，手机框不再使用无视视口的固定高度。
- 运行预览结构测试、类型检查、H5 构建和文档预览构建。
- 浏览器工具可用时，在 `1366×768` 和 `1920×1080` 下测量手机框边界；若工具仍受本机临时目录故障阻塞，明确记录该环境限制，不虚报视觉验收。
