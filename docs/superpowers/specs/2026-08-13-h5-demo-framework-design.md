# Snake UI H5 Demo 预览框架优化设计

## 背景

当前 H5 预览页（`DemoRenderer.vue`）只提供白底根容器，缺少导航、标题与分区结构，观感接近“裸页面”。对照 `D:\development\Projects\UniApp\uView-Pro\src\pages` 的实际写法，uView-Pro 每个组件 demo 页由 `demo-page` 外壳 + `.u-demo`（演示区）+ `.u-config`（参数配置）组成，整体为白底、主色标题、虚线演示卡片，视觉统一、层级清晰。

本次以 snake-ui 自身的蛇绿品牌色（`#06d290` / `#00a86f`）对齐该页面结构，仅重构预览页外壳，不改动 demo 内容与组件 API。

## 目标

- 对齐 uView-Pro `demo-page` 页面解剖：渐变导航栏（返回 + 标题 + 首页）、白底页面、主色粗标题 + 灰色描述的标题区、虚线边框演示卡片。
- 全部 32 个示例分支内容原样保留，只更换外层容器。
- 用 CSS 变量 + SCSS 变量建立统一设计令牌（品牌色、背景、文字、圆角、阴影、尺寸）。
- 桌面 H5 内容宽度收窄为 `max-width: 760px`，保持长行可读性。
- 视口类组件（弹窗、悬浮、筛选、吸顶等）继续全屏渲染，不被装饰容器裁切。

## 非目标

- 不修改任何公开组件 API、fixture 数据或交互逻辑。
- 不引入新的运行时依赖（沿用原生 `view`/`text` + scoped scss）。
- 不复制 uView-Pro 的“参数配置”交互面板与体验地图等 App 内功能。
- 不改变 VitePress 文档侧的手机外壳与 iframe 通信。
- 不调整组件文档内容，仅同步 `preview` frontmatter 的路径前缀。

## 已确认方案

### 设计令牌 `src/demo/theme.scss`

在 `:root` 定义 CSS 变量，并在同文件映射为 SCSS 变量，供各 demo 组件 scoped 样式引用：

- 品牌色：`--snake-primary: #06d290`、`--snake-primary-deep: #00a86f`、`--snake-primary-dark: #0a8a5e`、`--snake-primary-light: #3fe0ab`、`--snake-primary-soft: #e7f9f1`。
- 背景：页面 `#ffffff`（对齐 uView-Pro 白底）、卡片 `#ffffff`、柔和底 `#eef6f1`。
- 文字：主 `#14251c`、次 `#5d7168`、提示 `#8ba096`。
- 边框、圆角（20/14/10px）、阴影、导航高度（44px）。

`App.vue` 全局 `@import "./demo/theme.scss"`，`page` 背景与文字色跟随变量，并开启 `-webkit-font-smoothing: antialiased`。

### 预览外壳 `src/demo/DemoPage.vue`

- 根节点 `.demo-page { box-sizing: border-box; min-height: 100vh; background: var(--snake-bg-page) }`。
- 导航栏对齐 uView-Pro `u-navbar`：`linear-gradient(90deg, dark, primary)` 水平渐变、白字、`‹` 返回、居中标题、`首页` 入口，sticky 吸顶。
- 标题区对齐 uView-Pro `demo-page_header`：可选分类小徽标 + 22px 主色粗体标题 + 13px 灰色描述，不渲染大 Hero 卡片。
- 内容区 `max-width: 760px` 居中，底部留白，无页脚（对齐 uView-Pro 页面收尾方式）。
- `viewport` 属性为 true 时直接透传 slot（视口类组件全屏、白底），避免装饰容器干扰 fixed/sticky/遮罩定位。

### 分区卡片 `src/demo/DemoSection.vue`

对齐 uView-Pro `.u-demo-wrap`：

- 标题行：居中加粗“演示效果”。
- 演示卡片：白底、`1px dashed` 虚线边框、`20px 12px` 内边距，无圆角无阴影。
- `bare` 属性为 true 时直通内容（视口类示例使用）。

### `DemoRenderer.vue` 调整

- 根节点替换为 `<DemoPage>` + `<DemoSection>`，32 个 `kind` 分支原样保留。
- 删除 `.demo-preview`、`.demo-page-header*` 等旧外壳样式；内容样式改用 CSS 变量。
- 滚动演示用 `.demo-hero` 更名为 `.demo-scroll-hero`，避免与 `DemoPage` 标题区样式冲突。

### `pages.json` 调整

- globalStyle 增加 `"navigationStyle": "custom"`，由 `DemoPage` 自绘导航栏，避免与原生导航栏叠加。
- 首页 `pages/index/index` 同样使用 `"navigationStyle": "custom"`，与示例页共用渐变导航栏，保证入口与子页视觉一致。
- 示例页路由由 `pages/examples/*` 迁移到 `pages/componentsA/*`（基础组件 12 个）与 `pages/componentsB/*`（CMS 组件 20 个），对齐 uView-Pro 的 A/B/C 物理目录组织。
- 背景色统一为 `#FFFFFF`。

## 组件总览页（首页）

参考 uView-Pro `pages/example/components.vue`，首页 `src/pages/index/index.vue` 由单一 `DemoRenderer` 重写为组件总览页：

- 复用 `DemoPage` 外壳（`nav-back=false`、`nav-home=false`，隐藏返回与首页按钮），标题区展示“Snake UI”与库简介。
- 分组配置独立维护在 `src/pages/index/components.config.ts`，结构对齐 uView-Pro `components.config.ts`：`groupName` / `groupNameEn` / `list`，每项含 `path` / `title` / `titleEn` / `desc`。
- 语义分组：基础组件（12 个）+ CMS 组件（20 个），组标题为绿色渐变文字 + 白色数量徽标。
- 顶部搜索框按标题、英文名、描述与路径过滤，支持清空与“未找到”空状态。
- 卡片网格 4/2/1 列响应式（`768px` 以下 2 列、`420px` 以下 1 列），`fadeUp` 渐入动画 + 交错延迟，hover 上浮高亮。
- 卡片点击 `uni.navigateTo` 跳转到对应示例页，与 uView-Pro `openPage` 一致。

## 示例页目录组织

对齐 uView-Pro `src/pages/componentsA|B|C` 的物理分区方式：

- `src/pages/componentsA/`：12 个基础组件示例页（button / empty / icon / image / lazy-image / loadmore / notice-bar / overlay / popup / sticky / swiper / tabs）。
- `src/pages/componentsB/`：20 个 CMS 业务组件示例页（snake-cms 及 images、picture-ads、magic-cube 等）。
- 物理分区无语义要求，语义分组统一由 `components.config.ts` 维护；示例页文件内容不变，仅移动目录并同步 `pages.json` 路由与文档 `preview` frontmatter。

## 兼容性

- 只修改 demo 应用外壳，`snake-ui` npm 包导出、组件目录与安装方式不变。
- 示例页路由目录调整（`pages/examples` → `pages/componentsA|B`），fixture 与组件 API 不变。
- 开发与生产 H5 构建路径不变。

## 验证标准

### 自动验证

- `pnpm type-check`
- `pnpm test:preview-structure`
- `pnpm test:component-docs`
- `pnpm build:h5`

### 浏览器验证

- 每个示例页显示白底、渐变导航栏与主色标题，返回/首页可正常跳转。
- 普通示例内容在 760px 内居中呈现，演示卡片为虚线边框、居中分区标题。
- 弹窗、悬浮、筛选、吸顶等视口示例仍全屏定位，不被装饰容器裁切。
- 手机宽度下导航不换行，标题超长时省略号截断。