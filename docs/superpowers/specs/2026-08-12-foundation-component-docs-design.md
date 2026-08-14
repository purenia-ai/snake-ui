# Snake UI 基础组件文档与实时预览设计

## 目标

让已经公开导出的 12 个基础组件出现在 VitePress 组件导航中，并像现有业务组件一样在右侧手机框内提供可交互的 uni-app H5 实时预览。

组件范围：`snake-button`、`snake-empty`、`snake-icon`、`snake-image`、`snake-lazy-image`、`snake-loadmore`、`snake-notice-bar`、`snake-overlay`、`snake-popup`、`snake-sticky`、`snake-swiper`、`snake-tabs`。

## 文档结构

在组件侧边栏最前面新增“基础组件”分组，每个公开组件对应一篇独立文档。文档包含基础用法、主要 Props、事件、插槽及注意事项，并通过 `preview` frontmatter 指向同名示例页。

## 预览结构

为 12 个组件分别新增 `src/pages/examples/<name>.vue` 页面，并注册到 `src/pages.json`。页面继续使用现有 `DemoRenderer`，由 `kind` 选择实际组件，保持 VitePress frontmatter → iframe → uni-app hash 路由的数据流不变。

预览交互约定：

- Button 展示主要、朴素、禁用和加载状态。
- Icon 展示当前内置图标字形。
- Image 与 Lazy Image 展示成功和错误状态。
- Empty、Loadmore、Notice Bar 展示常用状态。
- Overlay 与 Popup 提供按钮打开，并允许点击遮罩关闭。
- Sticky 放入可滚动示例中验证吸顶。
- Swiper 使用本地图片展示轮播与指示器。
- Tabs 保存当前索引并响应切换。

## 变更边界

不修改 12 个基础组件的公开 API、npm 导出和现有 20 个业务组件页面；不新增依赖；预览数据全部本地化，避免依赖业务接口。

## 验证

- 32 篇组件文档的 `preview` 路径与 32 个示例路由一一对应。
- `pnpm run type-check` 通过。
- `pnpm run test:preview-structure` 通过并更新数量断言。
- `pnpm run build:h5` 与 `pnpm run docs:build` 通过。
- 抽查基础组件页面的 iframe 路由切换、弹层关闭、Tabs 切换和内部滚动。
