# Snake UI 骨架屏与 Joker 首页接入设计

## 背景与目标

Joker 首页当前通过 `snake-page` 的全屏白底三点动画等待 CMS 页面接口，加载期间用户无法感知页面结构。新增一套可复用的 Snake UI 骨架基础组件，并先在 Joker 的 `pages/tabbar/main.vue` 中落地，使首次加载呈现接近真实商城首页的结构；下拉刷新和登录态刷新继续保留已有内容。

## 方案

采用“通用容器 + 基础占位单元 + 业务模板”三层结构：

- `snake-skeleton` 负责依据 `loading` 在骨架模板与真实内容之间切换，并提供默认的标题、头像和文本行快速模式。
- `snake-skeleton-item` 提供 `text`、`rect`、`circle`、`image` 四种占位形态，支持宽、高、圆角、动画和自定义样式。
- Joker 的 `snake-main-skeleton` 仅组合首页横幅、五宫格导航、区块标题和两列四个商品卡片，不把业务布局固化进 Snake UI。

动画使用 CSS 渐变 shimmer。Snake UI 当前不支持 nvue，因此不移植 uView Pro 的 nvue DOM 测宽和原生动画逻辑。第一版不增加延迟显示、最短展示时间或切换过渡。

## 公共接口

`snake-skeleton` 提供：

- `loading?: boolean`，默认 `true`
- `animated?: boolean`，默认 `true`
- `title?: boolean`，默认 `true`
- `titleWidth?: number | string`
- `titleHeight?: number | string`
- `rows?: number`
- `rowsWidth?: number | string | Array<number | string>`
- `rowsHeight?: number | string | Array<number | string>`
- `avatar?: boolean`
- `avatarSize?: number | string`
- `avatarShape?: 'circle' | 'square'`
- `customStyle?: SnakeStyleValue`
- `template` 插槽用于自定义骨架，默认插槽用于真实内容

`snake-skeleton-item` 提供：

- `variant?: 'text' | 'rect' | 'circle' | 'image'`
- `width?: number | string`
- `height?: number | string`
- `radius?: number | string`
- `animated?: boolean`，未传时继承最近的 `snake-skeleton`，独立使用时默认 `true`
- `customStyle?: SnakeStyleValue`

数字尺寸按 Snake UI 现有 `addUnit` 规则转为 `px`，显式传入的 `rpx`、百分比等单位保持不变。自定义模板中的占位单元继承容器的动画开关，单元自身的显式配置优先。

## Joker 首页行为

首页保留真实 navbar 和 tabbar，只将 CMS 正文放入骨架容器。移除 `snake-page` 的 `isLoading` 绑定，`pageLoading` 仅表示首次 CMS 页面请求是否完成。请求成功、业务失败或异常都会在 `finally` 中退出骨架；错误提示维持现状，不新增错误页或重试入口。

下拉刷新和登录态刷新不重新开启骨架，以避免已有内容闪烁。骨架期间 `snake-cms` 尚未挂载，因此分享参数读取和触底加载必须对 `cmsRef` 使用可选调用，避免首次加载期间发生空引用错误。

## 发布与同步

Snake UI 增加组件实现、类型导出、演示页、文档入口和契约测试。完成验证后，将两个基础组件及必要的公共导出同步到 Joker 内置的 `src/uni_modules/snake-ui` 副本，再增加 Joker 首页业务骨架和接入代码。两个仓库分别提交，不推送远端。

## 验证

- Snake UI：验证默认属性、行宽数组、最后一行缩短、插槽切换、动画关闭、类型导出、文档和演示入口；执行相关测试、完整测试、ESLint、类型检查、文档构建和微信小程序构建。
- Joker：增加 smoke test，验证首页使用骨架、取消全屏 loading、保留 navbar/tabbar，以及 `cmsRef` 的加载期防护；执行完整 smoke test 和微信小程序生产构建。
- Joker 类型检查如仍命中仓库既有错误，只记录结果，不扩大本次修改范围。
