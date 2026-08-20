# 常见问题

先根据症状检查安装路径、插件注册、全局样式和 easycom。CMS 问题再检查数据与业务服务。

## 组件未解析

**现象：** 控制台提示无法解析 `snake-*`，页面显示为空。

1. 确认 `pages.json` 已开启 `easycom.autoscan`。
2. npm 安装使用 `snake-ui/components/...`，本地安装使用 `@/uni_modules/snake-ui/components/...`。
3. 确认组件目录和文件名均为 `snake-组件名`。
4. 修改 `pages.json` 后重启开发服务。

## 组件有结构但没有样式

确认 `App.vue` 全局样式已导入正确入口：

```scss
// npm
@import 'snake-ui/index.scss';

// 或 uni_modules
@import './uni_modules/snake-ui/index.scss';
```

两种路径只保留与安装方式对应的一种。

## `uni.$snake` 不存在

确认在 `createApp()` 中执行了 `app.use(SnakeUI)`，并且页面使用的 app 实例就是该函数返回的实例。仅配置 easycom 不会安装全局工具。

模块代码也可以绕过全局属性，直接按需导入：

```ts
import { navTo, toast } from 'snake-ui/libs';
```

## 主题切换没有覆盖页面

- 确认已安装 Snake UI 插件并注册主题。
- 页面根节点需要获得主题 CSS 变量；全局主题场景推荐使用 `snake-config-provider` 包裹页面根部。
- 检查业务样式是否写死十六进制颜色，改用 `var(--snake-color-*)`。
- 检查主题 `name` 是否存在，`setSnakeTheme(name)` 返回 `false` 表示没有找到该主题。

详见[多主题与暗黑模式](/guide/multi-theme)。

## CMS 页面为空

依次检查：

1. `pageComponents` 是否为数组。
2. 每项是否包含字符串 `component`。
3. 是否设置了 `visible: false` 或 `setStyle.showComponent: false`。
4. `component` 是否属于内置标识或已配置别名。
5. 是否监听 `diagnostic` 与 `error` 获取具体原因。

未知组件可以通过 `extension` 插槽承接，不会自动变成内置组件。

## 商品、优惠券或外链操作失败

这些属于业务能力，不会由基础安装自动提供。优先通过 `cms.services.commerce`、`cms.services.coupon` 和 `cms.services.link` 注入；旧项目的 `request/cache/config` 只用于 legacy 兼容路径。

若错误名为 `SnakeUIRuntimeError`，错误消息会指出缺少的适配器及触发组件。

## 小程序外链打不开

小程序不能像 H5 一样直接打开任意外链。宿主通常需要提供 web-view 页面，并在 `cms.services.link.open()` 中完成平台适配。小程序跳转还需确认目标平台支持 `uni.navigateToMiniProgram` 及相应权限。

## 仍然无法定位

提交问题时请同时提供：Snake UI 版本、uni-app 编译器版本、目标平台、安装方式、最小复现页面、控制台错误，以及 `diagnostic` / `error` 事件内容。
