# Snake UI 直接 H5 预览设计

## 背景

Snake UI 的 VitePress 文档已经能通过组件页 frontmatter 生成 iframe 地址，并使用 uni-app H5 的 hash 路由打开对应示例页。但当前示例统一经过 `DemoShell` 包装，大标题、负边距卡片、固定间距与 `overflow: hidden` 占用或裁切了手机预览中的有效内容，导致部分组件展示不全。

对 `D:\development\Projects\UniApp\uView-Pro` 的检查表明，其文档与演示工程之间没有使用 `postMessage` 或 `contentWindow` 通信。文档仅把 Markdown 中声明的页面路径拼接到 H5 地址，uni-app 通过 hash 路由直接打开真实演示页。

## 目标

- 20 个组件示例页在 iframe 中直接、完整地展示真实组件。
- 长内容使用 iframe 内部页面的自然纵向滚动，不被外层容器裁切。
- 弹窗、悬浮、吸顶和筛选面板能够相对 H5 视口正确定位。
- 开发与生产继续使用相同的 `/preview/` 地址结构。
- 不引入跨窗口通信或新的运行时依赖。

## 非目标

- 本次不调整 `snake-drop-menu` 和 `snake-drop-menu-item`。
- 本次不替换 VitePress 右侧手机外壳视觉。
- 本次不修改公开组件 API、业务适配器或 npm 包名。
- 本次不增加实时编辑、props 控制面板或父子窗口状态同步。

## 已确认方案

采用“真实演示页直接进入 iframe”方案。

数据流保持为：

1. 组件 Markdown 通过 `preview` frontmatter 声明 uni-app 页面路径。
2. VitePress `PreviewFrame` 将路径拼为开发或生产环境的 `/preview/#/pages/examples/...`。
3. iframe 加载同一个 uni-app H5 应用。
4. uni-app hash 路由直接渲染目标示例页。

父页面不向 iframe 发送消息，iframe 也不需要向父页面报告高度或组件状态。路由变化继续通过更新 iframe 的 `src` 完成。

## 示例页面结构

### DemoRenderer

`DemoRenderer.vue` 继续集中管理组件选择、fixture 数据和示例交互状态，但不再使用 `DemoShell`。

它只提供一个轻量根容器：

- 宽度为 `100%`。
- 最小高度为 `100vh`。
- 默认背景与组件演示所需的少量安全内边距。
- 不使用负边距、阴影卡片、固定高度或 `overflow: hidden`。

### 布局类别

示例按定位需求分为两类：

- 普通流组件：公告、图片、导航、商品列表等可以使用统一的小尺寸水平或垂直内边距。
- 视口组件：弹窗、悬浮、CMS、筛选等直接占用根视口，不添加可能改变 fixed、sticky 或遮罩定位参照的装饰容器。

分类只影响示例页布局，不进入 Snake UI 公共组件 API。

### DemoShell

`DemoShell.vue` 不再参与任何预览路由。确认没有其他引用后删除该文件，避免保留失效的演示结构。

## iframe 与滚动

- `PreviewFrame.vue` 继续使用固定手机视口尺寸。
- iframe 自身保持 `height: 100%`，内部 H5 页面负责滚动。
- 不根据内容动态调整 iframe 高度，否则长列表、弹窗和 fixed 元素会失去手机视口语义。
- VitePress 页面滚动与 iframe 内部滚动相互独立。
- 加载中、超时提示和“新窗口打开”功能保持现状。

## 样式约束

- H5 根页面不得横向溢出。
- 示例根节点使用 `box-sizing: border-box`。
- 普通示例的内边距保持克制，不遮盖组件自身的边距配置。
- 不为真实组件增加缩放；预览按 uni-app 的正常 H5 viewport 计算 `rpx`。
- 不使用外层 `overflow: hidden` 解决视觉圆角，手机外壳的裁切仍由 iframe/手机框负责。

## 错误处理

- iframe 服务未启动时继续显示当前超时提示。
- 示例 fixture 缺字段导致组件异常时，应修正 fixture，而不是用外层容器隐藏异常区域。
- 组件内容超出一屏属于正常情况，应允许内部滚动。

## 验证标准

### 自动验证

- `pnpm run type-check`
- `pnpm run test:runtime`
- `pnpm run build:h5`
- `pnpm run docs:build:preview`
- 确认 20 个组件文档均有对应 preview 路由。

### 浏览器验证

- 检查 20 个组件路由均成功加载且没有项目控制台错误。
- 普通组件页面顶部不再出现 Snake UI 装饰性大标题。
- 商品列表能够在 iframe 内滚动到最后一项。
- 筛选面板展开后不被示例根容器裁切。
- 页面弹窗遮罩覆盖完整 H5 视口。
- 悬浮组件相对 H5 视口定位。
- 在文档组件间切换时，iframe 路由与内容同步更新。
- 窄屏下“在新窗口打开实时预览”仍指向正确页面。

## 兼容性

该调整只修改 demo 应用，不改变 `snake-ui` npm 包的公开导出、组件目录或安装方式。现有 frontmatter、生产产物 `/preview/` 目录和开发端口保持兼容。
