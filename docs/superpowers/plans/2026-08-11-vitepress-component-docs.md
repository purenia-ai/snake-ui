# Snake UI VitePress 组件文档实施计划

## 目标

在不修改现有 `snake-cms.vue` 和 `components/` 源码的前提下，建立独立的 `docs/` VitePress 子项目，覆盖 20 个公开组件页面，并通过静态构建验证。

## 实施原则

- 组件契约以当前源码为唯一事实来源。
- uni-app/uView 示例只进入 Markdown 代码块，不在 VitePress 中执行。
- 不猜测缺失的 Props 类型、默认值或事件载荷。
- 不添加与文档站无关的依赖和配置。
- 现有 `docs/superpowers/` 规格与计划文件不参与站点导航。

## 任务 1：建立独立 VitePress 工程

新增文件：

- `docs/package.json`
- `docs/.gitignore`
- `docs/.vitepress/config.mts`
- `docs/.vitepress/theme/index.ts`
- `docs/.vitepress/theme/custom.css`

步骤：

1. 在 `docs/package.json` 中声明私有包、ESM 模式、VitePress 开发/构建/预览脚本，以及兼容的 `vitepress`、`vue` 开发依赖。
2. 配置中文站点标题、描述、导航、分组侧边栏、本地搜索和页脚。
3. 扩展默认主题，仅引入自定义 CSS，不注册或执行现有 uni-app 组件。
4. 设置品牌色、首页样式、API 表格窄屏滚动和统一效果图占位样式。
5. 忽略 `.vitepress/cache`、`.vitepress/dist` 和 `node_modules`。

初步验证：

```powershell
Set-Location docs
npm install
npm run docs:build
```

预期结果：生成 `docs/package-lock.json`，最小站点成功构建。

## 任务 2：编写首页与使用指南

新增文件：

- `docs/index.md`
- `docs/guide/getting-started.md`
- `docs/guide/compatibility.md`
- `docs/guide/component-data.md`

步骤：

1. 首页说明 Snake UI 的商城/CMS 定位、静态文档性质和主要能力入口。
2. 快速开始说明如何复制组件、准备 uni-app/uView、配置 `@/` 别名依赖，并给出最小引入示例。
3. 兼容性页集中说明 `uni`、`uni.$u`、`rpx`、小程序 API、H5 API、全局组件和业务模块约束。
4. 数据约定页解释 `datas`、`pageInfo`、`pageComponents` 等对象由业务侧提供，示例字段应与源码读取保持一致。

验证：

- 所有指南页面均能从导航到达。
- Markdown 中的 Vue/uni-app 示例不会作为可执行代码参与 SSR。

## 任务 3：提取简单展示组件契约并编写页面

读取源码：

- `components/auxiliarysegmentation/index.vue`
- `components/custommodule/index.vue`
- `components/follow/index.vue`
- `components/images/index.vue`
- `components/notice/notice.vue`
- `components/richtext/richtext.vue`
- `components/videos/index.vue`

新增对应页面：

- `docs/components/auxiliary-segmentation.md`
- `docs/components/custom-module.md`
- `docs/components/follow.md`
- `docs/components/images.md`
- `docs/components/notice.md`
- `docs/components/rich-text.md`
- `docs/components/videos.md`

每页逐项核对模板读取字段、Props 声明、事件、插槽、uni/uView 依赖和样式约束。`follow` 当前没有公开逻辑时如实标注其占位状态。

## 任务 4：提取导航与互动组件契约并编写页面

读取源码：

- `components/commoditysearch/index.vue`
- `components/graphicnavigation/index.vue`
- `components/jumpApplet/index.vue`
- `components/page-popup/index.vue`
- `components/pictureads/index.vue`
- `components/suspension/index.vue`

新增对应页面：

- `docs/components/commodity-search.md`
- `docs/components/graphic-navigation.md`
- `docs/components/jump-applet.md`
- `docs/components/page-popup.md`
- `docs/components/picture-ads.md`
- `docs/components/suspension.md`

重点记录导航副作用、平台 API、远程资源、H5/小程序差异和 uView 组件依赖。

## 任务 5：提取复杂内容与商品组件契约并编写页面

读取源码：

- `components/activity-list/index.vue`
- `components/coupon/index.vue`
- `components/filter-sorts/index.vue`
- `components/filter-sorts/filter-page.vue`
- `components/goodsList/index.vue`
- `components/listswitching/index.vue`
- `components/listswitching/components/tree-select/index.vue`
- `components/magiccube/index.vue`

新增对应页面：

- `docs/components/activity-list.md`
- `docs/components/coupon.md`
- `docs/components/filter-sorts.md`
- `docs/components/goods-list.md`
- `docs/components/list-switching.md`
- `docs/components/magic-cube.md`

重点记录：

- 商品列表的展示模式、输入数据和 `item-click`、`handlerOffer` 事件。
- 筛选排序与内部 `filter-page` 的输入、确认事件和滚动行为。
- 列表切换与内部 `tree-select` 的关系。
- 优惠券和跳转组件所需的业务请求、配置模块。
- 魔方布局使用的配置字段和嵌套图片数据。

## 任务 6：编写 Snake CMS 总览与组件映射

读取源码：

- `snake-cms.vue`

新增文件：

- `docs/components/snake-cms.md`

步骤：

1. 记录 `pageInfo`、`pageComponents`、`scrollTop`、`stickyOffsetTop` Props。
2. 整理 `pageComponents[].component` 到实际组件的映射。
3. 说明商品、活动、筛选、分页、滚动和回到顶部之间的数据流。
4. 列出 `@/utils/request`、缓存管理器、uView 和全局 `snake-*` 组件等依赖。
5. 给出静态配置示例，但不调用业务接口。

## 任务 7：统一效果图状态与内容质量

新增目录：

- `docs/public/component-previews/`

步骤：

1. 不存在真实截图的组件统一使用 CSS 效果图占位块，文本明确为“效果图待补充”。
2. 检查所有页面均包含用途、前提、示例、API、注意事项、源码路径。
3. 检查中英文组件名称、文件名、导航链接和标题一致。
4. 搜索并消除未说明的空表格、空链接和临时占位内容。

检查命令：

```powershell
rg -n "TODO|TBD|FIXME|href=\"\"|\]\(\)" docs -g "*.md" -g "*.ts" -g "*.css"
```

“效果图待补充”是设计确定的 UI 状态，不计为未完成内容。

## 任务 8：安装、构建与站点核验

步骤：

1. 在 `docs/` 使用 npm 安装声明依赖并保留 `package-lock.json`。
2. 运行 VitePress 生产构建。
3. 检查构建输出中首页、3 篇指南和 20 个组件页面均存在。
4. 启动本地预览并检查关键页面、窄屏布局和深色模式。
5. 若无法进行浏览器视觉检查，明确记录未验证项，不以构建成功代替视觉验收。

验证命令：

```powershell
Set-Location docs
npm run docs:build
Get-ChildItem .vitepress/dist/components -Filter *.html
Get-ChildItem .vitepress/dist/guide -Filter *.html
```

完成条件：

- 构建命令退出码为 0。
- 20 个组件 HTML 页面和 3 个指南 HTML 页面均生成。
- 未修改现有组件源码。
- 最终交付说明实际完成的验证以及仍缺少的真实效果图。
