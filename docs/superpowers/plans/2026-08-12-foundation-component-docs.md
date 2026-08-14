# Snake UI 基础组件文档与实时预览实施计划

## 目标

将 12 个已公开导出的基础组件加入 VitePress 导航、独立文档和右侧 uni-app H5 实时预览，使组件文档、示例路由与预览渲染一一对应。

## 实施原则

- 不修改基础组件公共 API 和 npm 导出。
- 不新增依赖，不引入远程接口或远程图片。
- 沿用现有 `preview` frontmatter、hash 路由和 `DemoRenderer` 预览链路。
- 弹层和吸顶组件按完整手机视口预览，避免包装层影响 fixed/sticky 定位。

## 任务 1：扩展预览结构回归检查

涉及文件：

- 修改 `scripts/preview-structure.test.mjs`

步骤：

1. 将组件文档和示例路由数量断言由 20 更新为 32。
2. 保留 frontmatter 路径与 `pages.json` 示例路由集合完全相等的断言。
3. 增加 12 个基础组件文档、路由和 `DemoRenderer kind` 均存在的断言。
4. 运行测试，确认当前结构因缺少基础组件预览而失败。

## 任务 2：新增基础组件演示状态

涉及文件：

- 修改 `src/demo/DemoRenderer.vue`
- 按需修改 `src/demo/fixtures.ts`

步骤：

1. 增加 Tabs 当前索引、Popup 和 Overlay 可见状态。
2. 为 Swiper、Notice Bar、Image 等组件补充本地 fixture。
3. 新增 12 个 `kind` 渲染分支。
4. Button 展示主要、朴素、禁用和加载状态。
5. Image 与 Lazy Image 展示正常及错误反馈；Empty、Loadmore、Notice Bar 展示常见状态。
6. Overlay 和 Popup 提供打开按钮并允许关闭；Tabs 可点击切换。
7. Sticky 使用足够长的页面内容验证滚动吸顶；Swiper 使用本地图片。
8. 将 `overlay`、`popup`、`sticky` 纳入视口型预览，避免安全内边距改变定位语义。
9. 运行 `pnpm run type-check`。

## 任务 3：注册 12 个 uni-app 示例页面

涉及文件：

- 新增 `src/pages/examples/button.vue`
- 新增 `src/pages/examples/empty.vue`
- 新增 `src/pages/examples/icon.vue`
- 新增 `src/pages/examples/image.vue`
- 新增 `src/pages/examples/lazy-image.vue`
- 新增 `src/pages/examples/loadmore.vue`
- 新增 `src/pages/examples/notice-bar.vue`
- 新增 `src/pages/examples/overlay.vue`
- 新增 `src/pages/examples/popup.vue`
- 新增 `src/pages/examples/sticky.vue`
- 新增 `src/pages/examples/swiper.vue`
- 新增 `src/pages/examples/tabs.vue`
- 修改 `src/pages.json`

步骤：

1. 每个页面只负责传入对应 `kind` 和标题，保持与现有示例一致。
2. 在 `pages.json` 注册全部路由及中文导航栏标题。
3. 运行预览结构测试，确认路由侧已经齐全但文档侧仍失败。

## 任务 4：编写基础组件文档并加入导航

涉及文件：

- 新增 `docs/components/button.md`
- 新增 `docs/components/empty.md`
- 新增 `docs/components/icon.md`
- 新增 `docs/components/image.md`
- 新增 `docs/components/lazy-image.md`
- 新增 `docs/components/loadmore.md`
- 新增 `docs/components/notice-bar.md`
- 新增 `docs/components/overlay.md`
- 新增 `docs/components/popup.md`
- 新增 `docs/components/sticky.md`
- 新增 `docs/components/swiper.md`
- 新增 `docs/components/tabs.md`
- 修改 `docs/.vitepress/config.mts`

步骤：

1. 每篇文档增加与示例路由一致的 `preview` frontmatter。
2. 根据当前组件源码记录基础用法、Props、事件、插槽和平台注意事项。
3. 在组件侧边栏最前面新增“基础组件”分组并收录 12 篇文档。
4. 不复制旧 uView API；只描述 Snake UI 当前真实接口。
5. 运行 `pnpm run test:preview-structure` 与 `pnpm run docs:build`。

## 任务 5：完整自动验证

按顺序运行：

1. `pnpm run test:preview-structure`
2. `pnpm run test:uview-dependency`
3. `pnpm run type-check`
4. `pnpm run build:h5`
5. `pnpm run build:mp-weixin`
6. `pnpm run build:app`
7. `pnpm run docs:build:preview`
8. 确认文档、示例路由及 frontmatter 均为 32 个且路径集合一致。

## 任务 6：浏览器验收

1. 启动 H5 `5173` 与文档 `5174` 服务。
2. 检查“基础组件”分组及 12 个导航链接。
3. 逐页确认 iframe 跳转到对应示例，控制台无运行错误。
4. 检查 Popup 和 Overlay 打开、遮罩覆盖及关闭交互。
5. 检查 Tabs 切换、Swiper 轮播、Notice Bar 自动切换。
6. 检查 Sticky 在 iframe 内滚动时吸顶，页面内容不被手机框错误裁切。
7. 检查窄屏下独立打开预览入口仍然可用。

## 完成标准

- 12 个公开基础组件均能从侧边栏进入独立文档。
- 每篇基础组件文档都有对应的可交互手机预览。
- 文档、路由、预览映射总数均为 32 且一一对应。
- H5、微信小程序、App 与 VitePress 构建通过。
- 未新增 uView Pro 依赖或改变现有组件公开 API。
