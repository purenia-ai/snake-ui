# snake-parse 完整富文本解析器设计

## 目标

新增独立的 `snake-parse`，在组件库内实现完整、跨端的 HTML 富文本解析与渲染能力。实现范围以 uView `u-parse` 的功能集为基线；现有 `snake-rich-text` 与 CMS 映射保持不变。

## 对外接口

新增标准 Props：`content`、`containerStyle`、`domain`、`tagStyle`、`lazyLoad`、`loadingImg`、`errorImg`、`previewImg`、`showImgMenu`、`copyLink`、`pauseVideo`、`scrollTable`、`selectable`、`setTitle`、`useAnchor`。

新增事件：`load`、`ready`、`imgtap`、`linktap`、`play`、`error`。向组件 ref 暴露 `setContent`、`getText`、`getRect`、`navigateTo`、`pauseMedia` 和 `setPlaybackRate`。

## 架构

组件拆分为三个职责明确的内部模块：

1. HTML 解析器：词法扫描 HTML，解码实体，维护标签栈，并产出 `{ name, attrs, children }` / `{ type: 'text', text }` 节点树。
2. 节点渲染器：递归处理节点。普通节点使用原生 `rich-text`，图片、链接、音视频、表格和深层结构由对应 uni-app 原生组件渲染。
3. 根组件：协调 Props、兼容内容来源、解析时机、图片加载状态、事件与公共方法。

解析器使用标签白名单，忽略脚本、表单、嵌入式危险内容及事件属性；对相对 URL、HTML 实体、`rpx`、图片尺寸、列表、表格、SVG 和内嵌样式作跨端归一化。样式解析器支持标签、class、id、后代/子选择器及 `::before` / `::after` 的有限集合。

## 交互与跨端行为

图片默认限宽、支持加载/错误占位、懒加载、点击预览、长按菜单及 `imgtap`；链接会先发出 `linktap`，再按锚点、外链、站内页分别处理；表格可选择用横向滚动容器包裹；媒体支持多源回退与自动暂停。

使用 uni-app 条件编译隔离 H5、App、Harmony 和小程序的节点渲染差异，避免将 Web API 引入小程序构建产物。

## 验证

补充针对解析器的测试样例，覆盖：嵌套标签与容错闭合、实体/URL 解码、危险标签和事件属性移除、图片/链接/表格/媒体节点，以及 `datas.myValue` 与 `content` 的优先级。运行相关测试、类型检查与格式检查。

## 非目标

不新增富文本编辑能力；不保留对第三方富文本组件名称或安装方式的运行时依赖。`snake-rich-text` 保持既有 CMS 对外接口，并委托 `snake-parse` 完成渲染。
