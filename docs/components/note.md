# 组件使用注意事项

这些约定适用于 Snake UI 的基础、表单和 CMS 组件。遵循它们可以减少组件无法解析、样式缺失和跨端表现不一致的问题。

## 安装与编译

- npm 和 `uni_modules` 选择一种安装方式，不要同时维护两份组件库。
- 插件、样式和 easycom 路径必须来自同一种安装方式。
- `pages.json` 只能有一个 `easycom` 字段；新增规则时合并到已有的 `custom`。
- 修改 easycom、入口样式或插件注册后，重新编译项目。
- Snake UI 面向 uni-app Vue 3，不保证在普通 Vue Web 工程中直接运行。

## 样式

- 在 `App.vue` 的非 scoped 样式中引入 `index.scss`。
- 页面需要使用 SCSS 语法时，为对应 `<style>` 添加 `lang=scss`。
- 自定义外观优先使用主题变量、`custom-style` 或 `custom-class`。
- 不要依赖组件内部 DOM 和私有类名；内部结构不是稳定的公共 API。
- 小程序样式隔离、H5 DOM 和 App 渲染结构可能不同，需要在目标端验证。

完整定制方式见[自定义样式](/guide/custom-style)，主题作用域见 [ConfigProvider](/components/config-provider)。

## 组件 API

- 以对应组件文档列出的 Props、Events、Slots 和公开方法为准。
- easycom 只负责发现组件，不会安装 `uni.$snake`；全局工具仍依赖 `app.use(SnakeUI)`。
- 节点查询、吸顶、滚动和弹层组件依赖运行上下文，跨平台表现需实际测试。

## CMS 组件

纯展示 CMS 组件可以直接接收数据。商品、优惠券、外链和小程序跳转等业务动作可能需要宿主应用注入 `cms.services`。

这些服务不会由基础安装自动提供。接入方式见[CMS 快速接入](/cms/getting-started)和[装修编辑器数据对接](/cms/sanke-editor)。

## 遇到问题

先按[常见问题](/guide/troubleshooting)检查安装路径、样式入口、插件注册和业务服务。提交问题时请提供 Snake UI 版本、uni-app 编译器版本、目标平台、安装方式、最小复现和控制台错误。
