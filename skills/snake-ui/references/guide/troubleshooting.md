---
name: 'troubleshooting'
description: 'Snake UI 常见问题参考。处理 troubleshooting、guide 或相关 uni-app 使用问题时按需读取。'
triggers: ['troubleshooting', '常见问题']
---

# 常见问题

先根据症状检查安装路径、插件注册、全局样式和 easycom。CMS 问题再检查数据与业务服务。

## 先定位问题类型

| 现象                 | 优先检查                                 | 相关文档                                   |
| -------------------- | ---------------------------------------- | ------------------------------------------ |
| 组件未解析或没有样式 | 安装方式、easycom、SCSS 入口             | [快速开始](/components/quickstart)         |
| 主题颜色没有生效     | `theme.scss`、ConfigProvider、主题变量名 | [多主题与暗黑模式](/guide/multi-theme)     |
| CMS 页面为空         | 配置信封、组件标识、`diagnostic` 事件    | [CMS 总览](/cms/overview)                  |
| 商品/优惠券操作失败  | `cms.services` 注入和返回契约            | [业务服务接入](/cms/services)              |
| 仅某个平台异常       | 条件编译、平台 API、真机基础库版本       | [运行环境与能力边界](/guide/compatibility) |

下面按常见症状展开排查。

## 1. 组件未解析

**现象：** 控制台提示无法解析 `snake-*`，页面显示为空。

1. 确认 `pages.json` 已开启 `easycom.autoscan`。
2. npm 安装使用 `@puresnake/snake-ui/components/...`，本地安装使用 `@/uni_modules/snake-ui/components/...`。
3. 确认组件目录和文件名均为 `snake-组件名`。
4. 修改 `pages.json` 后重启开发服务。

## 2. 组件有结构但没有样式

确认 `App.vue` 全局样式已导入正确入口：

```scss
// npm
@import '@puresnake/snake-ui/index.scss';

// 或 uni_modules
@import './uni_modules/snake-ui/index.scss';
```

两种路径只保留与安装方式对应的一种。HBuilderX 项目还需确认已安装「sass/scss 编译」插件。

## 3. npm 与 uni_modules 安装混用

**现象：** 依赖重复、版本不一致、打包异常或样式冲突。

- 二选一：npm 安装（CLI 项目）或 uni_modules 安装（HBuilderX 项目），不要同时存在两份。
- 清理 `node_modules` 与 `uni_modules` 中的重复依赖，保持版本唯一。
- 升级到最新版本，避免历史缺陷。

## 4. 类型提示缺失

**现象：** 组件标签、属性或 `import` 无补全、无校验。

1. 确认安装方式与导入路径一致（npm 用 `@puresnake/snake-ui`，uni_modules 用本地路径）。
2. VSCode 仅启用 Volar，禁用 Vetur。
3. 组件目录名必须为 `snake-组件名`，easycom 才能解析到组件类型。
4. 修改配置或升级依赖后重启 TS 服务或编辑器。

详见[代码提示](/guide/code-hint)。

## 5. `uni.$snake` 不存在

确认在 `createApp()` 中执行了 `app.use(SnakeUI)`，并且页面使用的 app 实例就是该函数返回的实例。仅配置 easycom 不会安装全局工具。

模块代码也可以绕过全局属性，直接按需导入：

```ts
import { navTo, toast } from '@puresnake/snake-ui/libs';
```

## 6. 主题切换没有覆盖页面

- 确认已安装 Snake UI 插件并注册主题。
- 页面根节点需要获得主题 CSS 变量；全局主题场景推荐使用 `snake-config-provider` 包裹页面根部，或启用[虚拟根组件](/guide/root)。
- 检查业务样式是否写死十六进制颜色，改用 `var(--snake-color-*)`。
- 检查主题 `name` 是否存在，`setTheme(name)` 返回 `false` 表示没有找到该主题。

详见[多主题与暗黑模式](/guide/multi-theme)。

## 7. 与其他组件库共存

Snake UI 使用 `snake-` 组件前缀与 `--snake-*` 变量命名空间，与其他库混用时注意：

- easycom 规则不要互相覆盖 `snake-*` 前缀。
- 全局样式冲突时缩小引入范围，避免两套 reset/基础样式同时生效。
- 工具函数按需导入，避免挂载到同一个全局对象。

## 8. HBuilderX 编译或提示异常

- 线上项目使用 HBuilderX 稳定版，内测版仅用于尝鲜。
- 确认已安装「sass/scss 编译」插件。
- HBuilderX 的 TS 提示弱于 Volar；需要完整类型体验时建议 CLI 项目 + VSCode，见[代码提示](/guide/code-hint)。
- 修改 `pages.json` 或 easycom 配置后重新编译项目。

## 9. CMS 页面为空

依次检查：

1. `pageComponents` 是否为数组。
2. 每项是否包含字符串 `component`。
3. 是否设置了 `active: false`。
4. `component` 是否属于内置标识。
5. 是否监听 `diagnostic` 与 `error` 获取具体原因。

未知组件可以通过 `extension` 插槽承接，不会自动变成内置组件。

## 10. 商品、优惠券或外链操作失败

这些属于业务能力，不会由基础安装自动提供。请通过 `cms.services.commerce`、`cms.services.coupon` 和 `cms.services.link` 注入。

若错误名为 `UIRuntimeError`，错误消息会指出缺少的适配器及触发组件。

## 11. 小程序外链打不开

小程序不能像 H5 一样直接打开任意外链。宿主通常需要提供 web-view 页面，并在 `cms.services.link.open()` 中完成平台适配。小程序跳转还需确认目标平台支持 `uni.navigateToMiniProgram` 及相应权限。

## 仍然无法定位

提交问题时请同时提供：Snake UI 版本、uni-app 编译器版本、目标平台、安装方式、最小复现页面、控制台错误，以及 `diagnostic` / `error` 事件内容。
