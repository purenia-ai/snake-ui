# 最右侧固定手机预览设计

## 背景

当前手机预览虽然位于 VitePress 右栏，但仍参与 `aside` 内容流，只会在右栏内部居中，无法像 uView2 文档一样贴近整个页面的最右侧。

uView2 的 `demoModel.vue` 使用 `position: fixed`，并按视口宽度设置 `right`：常规桌面贴浏览器右边缘，大屏幕则贴合居中页面容器的右边缘。

## 结构

桌面预览从 VitePress `aside` 插槽移出，改挂到布局的 `layout-bottom` 插槽。组件仍由当前页面 frontmatter 决定是否渲染，不改变预览路由。

VitePress 原生 `aside` 恢复默认职责，仅显示“本页内容”页面导航。移动端继续通过 `doc-before` 显示新窗口预览链接。

## 固定定位

桌面 `.preview-panel` 使用 `position: fixed`，顶部根据可用视口高度计算，使手机模型在导航栏下方垂直居中。宽度继续保持紧凑分档和真机比例：

- 1280–1499px：250px
- 1500–1919px：280px
- 1920px 以上：320px

右侧定位参考 uView2：

- 1280–1449px：`right: 20px`
- 1450–1679px：`right: 30px`
- 1680px 以上：`right: max(0px, calc((100vw - 1680px) / 2))`

手机预览使用较高层级，但低于 VitePress 导航和弹层。iframe 保持 `scrolling="auto"`。

## 内容避让

组件文档页面在桌面断点下给正文容器预留固定预览所需的右侧空间，防止手机覆盖正文。左侧栏维持 232px，正文维持紧凑宽度。

原先为容纳手机而覆盖的 `.aside`、`.aside-container`、`.aside-curtain` 宽度全部移除，避免页面导航被无意义地拉宽或偏移。

## 验证

- 结构测试断言桌面预览挂载于 `layout-bottom`，不再挂在任何 aside 插槽。
- 结构测试断言 `.preview-panel` 使用 fixed 定位，并包含 uView2 风格的 20px、30px 和居中容器右侧规则。
- 结构测试断言不存在手机驱动 aside 宽度的样式。
- 运行预览结构测试、类型检查和 VitePress 构建。
- 浏览器工具可用时检查 1366、1500、1920 三种宽度；若本机浏览器内核仍故障，明确标注未完成自动截图验收。
