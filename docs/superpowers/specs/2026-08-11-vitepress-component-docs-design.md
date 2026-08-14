# Snake UI VitePress 组件文档设计

## 背景

当前目录包含 `snake-cms.vue` 和一组基于 uni-app、uView 的 Vue 单文件组件，但不包含 `package.json`、README 或可直接运行的应用工程。组件使用 `<view>`、`<image>`、`uni`、`uni.$u`、`rpx`、`@/utils` 等宿主能力，因此不能在普通 VitePress 浏览器环境中直接挂载。

本次建设一个独立、可静态构建的中文组件文档站点。第一版覆盖当前全部公开组件，以 API 说明、源码示例和静态效果图区域为主，不引入 uni-app Web 运行时，也不修改现有组件实现。

## 目标

- 使用 VitePress 建立可本地开发、可静态构建的组件库文档。
- 为 `snake-cms` 及 `components/` 下全部顶层组件提供独立文档页。
- 每个组件页说明用途、依赖、引入方式、基础用法、Props、事件、插槽和平台注意事项。
- 代码示例保持 uni-app/uView 语义，让使用者能够复制到真实业务工程中调整使用。
- 为静态效果图预留统一位置；没有现成截图时明确显示占位说明，不伪造运行效果。
- 文档工程与组件源码隔离，避免为展示文档而改变组件行为。

## 非目标

- 不把当前目录改造成可发布的 npm 组件包。
- 不迁移 Options API 组件或统一其编码风格。
- 不在 VitePress 内实现可交互的 uni-app 沙箱。
- 不补齐当前缺失的业务请求、缓存、配置或 uView 依赖。
- 不在第一版自动从源码生成 API 文档。
- 不负责部署到具体平台；只保证生成静态站点产物。

## 方案选择

采用独立 `docs/` 子项目：VitePress 的依赖、脚本、配置、主题和内容均放入 `docs/`，不在仓库根目录创建应用级包配置。

没有采用根目录工程方案，因为当前源码可能会在未来并入其他 uni-app 工程，根目录依赖容易产生职责混淆。没有采用自动解析方案，因为组件同时存在 Options API、`setup()` 和 `<script setup>`，部分 Props 缺少完整声明，源码注释也存在编码问题，自动产物的准确性暂时不足。

## 目录结构

```text
docs/
├── package.json
├── package-lock.json
├── .gitignore
├── index.md
├── guide/
│   ├── getting-started.md
│   ├── compatibility.md
│   └── component-data.md
├── components/
│   ├── snake-cms.md
│   ├── activity-list.md
│   ├── auxiliary-segmentation.md
│   ├── commodity-search.md
│   ├── coupon.md
│   ├── custom-module.md
│   ├── filter-sorts.md
│   ├── follow.md
│   ├── goods-list.md
│   ├── graphic-navigation.md
│   ├── images.md
│   ├── jump-applet.md
│   ├── list-switching.md
│   ├── magic-cube.md
│   ├── notice.md
│   ├── page-popup.md
│   ├── picture-ads.md
│   ├── rich-text.md
│   ├── suspension.md
│   └── videos.md
├── public/
│   └── component-previews/
└── .vitepress/
    ├── config.mts
    └── theme/
        ├── index.ts
        └── custom.css
```

`filter-page` 和 `tree-select` 是顶层组件内部使用的子组件，不单独放入主导航；它们的职责和内部事件分别在 `filter-sorts`、`list-switching` 页面中说明。

## 信息架构

顶部导航包含“指南”和“组件”。侧边栏使用以下分组：

- 开始：快速开始、运行环境、组件数据约定。
- 容器：Snake CMS、自定义模块。
- 内容展示：图片、轮播广告、魔方、视频、富文本、公告、辅助分割线。
- 导航与互动：图文导航、商品搜索、悬浮入口、弹窗、小程序跳转、关注。
- 商品：商品列表、活动列表、筛选排序、列表切换、优惠券。

首页说明项目定位、uni-app/uView 依赖和文档的静态示例性质，并提供快速开始与组件总览入口。

## 组件页模板

每个公开组件页使用一致结构：

1. 组件名称和一句话用途。
2. 运行前提，列出 uni-app、uView、全局组件、别名模块或平台 API 等真实依赖。
3. 引入与基础用法，示例只展示使用该组件所需的最小模板和数据。
4. 静态效果图区域：存在真实图片时展示；缺失时显示“效果图待补充”，不使用误导性的模拟截图。
5. API：Props、Events、Slots 表格。源码未声明的类型或默认值记为“未声明”，不进行猜测。
6. 数据结构：对 `datas` 等对象型入参列出源码实际读取的字段。
7. 注意事项：说明平台限制、外部服务、全局注册或副作用。
8. 源码位置：使用相对于当前目录的路径，方便维护者定位。

`snake-cms` 页面额外记录 `pageComponents` 中 `component` 与具体子组件的映射，以及商品列表、筛选和活动相关的数据协作关系。

## 内容来源与维护方式

第一版文档由现有 `.vue` 文件人工整理。Props、事件和数据字段以当前源码为准；当模板和脚本存在不一致时，在注意事项中记录现状，不顺带修改组件。

示例代码不会被 VitePress 当作 Vue 组件执行。Markdown 围栏代码仅用于展示，因此 `uni`、`u-*` 标签、`@/` 别名和业务模块不会影响文档静态构建。

后续新增或修改组件时，维护者同步更新对应 Markdown。自动提取可以作为独立后续项目，在组件契约规范化后再评估。

## 样式设计

沿用 VitePress 默认主题的结构和可访问性，只做轻量品牌化：

- 主色使用接近现有源码中常见的绿色 `#06d290`。
- 首页强调组件用于移动端商城/CMS 场景。
- API 表格保持横向可滚动，适配窄屏。
- 代码块、提示框和效果图占位区域使用统一圆角与边框。
- 遵循系统深浅色模式，不引入额外 UI 框架或字体网络依赖。

## 构建与命令

`docs/package.json` 提供以下脚本：

- `npm run docs:dev`：启动本地文档开发服务器。
- `npm run docs:build`：生成静态站点。
- `npm run docs:preview`：预览构建产物。

VitePress 构建输出保留默认位置 `docs/.vitepress/dist`，并由 `docs/.gitignore` 排除。依赖固定在锁文件中，使用 npm 管理。

## 错误与边界处理

- 组件无法在浏览器直接运行：文档明确标注运行环境，并仅展示代码，不执行示例。
- API 信息不完整：使用“未声明”或“源码未提供默认值”，避免推断。
- 静态截图缺失：展示明确的占位状态，构建不因缺图失败。
- 外部图片链接可能失效：文档本身不依赖远程图片完成布局或构建。
- 源码包含编码异常注释：文档根据可验证的模板和脚本行为重新表述，不复制乱码。
- VitePress SSR 阶段：主题扩展不访问 `window`、`document` 或 `uni`，保证静态生成安全。

## 验证

实现完成后执行以下检查：

1. 安装 `docs/package.json` 声明的依赖并生成锁文件。
2. 运行 `npm run docs:build`，确认所有 Markdown 和主题代码可静态构建。
3. 启动本地预览，检查首页、顶部导航、所有侧边栏链接和 20 个公开组件页面。
4. 搜索空链接、`TODO`、`TBD` 和未替换占位文本；允许统一的“效果图待补充”状态，但不得留下设计或 API 占位项。
5. 抽查 `snake-cms`、`goods-list`、`filter-sorts`、`list-switching` 和一个简单展示组件，核对 Props、事件与源码一致。
6. 在窄屏和深色模式下检查导航、表格、代码块及效果图区域的可读性。

## 完成标准

- `docs/` 可独立安装依赖并成功构建。
- 首页、三篇指南和全部 20 个公开组件页面均可从导航访问。
- 每个组件页都包含用途、运行前提、示例、API、注意事项和源码位置。
- 不修改 `snake-cms.vue` 或 `components/` 下任何现有文件。
- 构建过程不要求真实 uni-app、uView、业务接口或浏览器全局变量。
