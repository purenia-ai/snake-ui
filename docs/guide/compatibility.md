# 运行环境

## uni-app 基础能力

组件模板广泛使用 `<view>`、`<image>`、`<scroll-view>`、`<swiper>` 等 uni-app 内置组件，并通过 `uni` 访问导航、存储、动画、加载提示、节点查询和小程序跳转能力。

普通 Vue Web 工程即使能够编译 `.vue` 文件，也不等同于完整的 uni-app 运行环境。

## Snake UI 基础能力

组件库已经内置 `snake-image`、`snake-icon`、`snake-popup`、`snake-notice-bar`、`snake-sticky`、`snake-tabs`、`snake-loadmore`、`snake-empty`、`snake-button` 和 `snake-overlay` 等基础组件，不依赖 uView Pro。

插件安装后会注册 Snake UI 自有的 `uni.$snake` 和模板 `$snake`，其中包括：

- `navTo`
- `toast`
- `sleep`
- `guid`
- `getRect`
- `sys`
- `pxToRpx`
- `getQueryParams`

组件库内部和宿主工程均不应继续访问 `uni.$u`。模块化代码也可以从 `snake-ui` 或 `snake-ui/libs` 按需导入这些工具。

## 业务工程依赖

业务能力通过安装选项注入，不再直接引入宿主工程的 `@/utils` 或 `@/config`：

| 适配器             | 用途           | 使用位置                      |
| ------------------ | -------------- | ----------------------------- |
| `request` / `http` | 业务 HTTP 请求 | Snake CMS、优惠券、小程序跳转 |
| `cache`            | 缓存读写       | Snake CMS、筛选面板           |
| `config`           | 服务和业务配置 | 优惠券、小程序跳转            |

基础组件不要求这些适配器；使用相应业务组件时，应通过 `app.use(SnakeUI, options)` 配置。缺少必要能力时会抛出带组件名的 `SnakeUIRuntimeError`。

## 全局组件和样式

源码还会使用 `snake-suspension`、`snake-drop-menu-item` 等全局组件，以及大量工具类。若页面结构正常但样式缺失，应检查宿主项目的全局组件注册、公共样式和原子类配置。

## 平台差异

- `uni.navigateToMiniProgram` 只在支持该 API 的目标平台有效。
- 某些逻辑直接访问 `window.location.href`，只适用于 H5 分支。
- `styleIsolation`、`virtualHost` 等选项主要与小程序组件样式和节点结构相关。
- 使用页面滚动与节点查询的组件必须在正确的页面/组件上下文中运行。
