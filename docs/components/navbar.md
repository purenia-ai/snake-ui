---
preview: /pages/componentsA/navbar/index
---

# Navbar 导航栏

用于页面顶部导航，支持状态栏安全区、返回操作、固定定位、标题及左右插槽。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-navbar title="订单详情" />
```

自定义右侧操作：

```vue
<snake-navbar title="消息" :custom-back="handleBack">
    <template #right><text>更多</text></template>
</snake-navbar>
```

## 固定导航栏的内容偏移

`fixed` 默认开启，页面正文需为导航栏预留顶部空间；`immersive` 仅适用于内容可延伸到状态栏背景的页面。需要拦截返回时使用 `custom-back`，否则组件调用默认返回逻辑。

## 小程序胶囊

微信小程序的右上角胶囊浮在导航栏上。组件按 `uni.getMenuButtonBoundingClientRect()` 让出胶囊宽度：`#right` 插槽的内容整体左移，标题的最大宽度也扣掉这段，长标题与右侧操作都不会被胶囊压住。H5 与 App 没有胶囊，这段宽度为 0。

## 底色与前景色

默认取主题表面色做底、主题文字色做前景。需要整条品牌色时传 `background`，并同时传 `title-color` 与 `back-icon-color`（示例应用取 `--snake-color-primary-ink`，默认白字，与按钮、标签的实心主色一致；主色偏亮又需要更高对比的主题把它覆写成墨绿即可）。底部分隔线是半像素（`::after` + `scaleY(0.5)`），与小程序原生导航栏同样粗细。

## API

### Props

| 参数               | 说明                                         | 类型         | 默认值       |
| ------------------ | -------------------------------------------- | ------------ | ------------ |
| `title`            | 中间标题                                     | `string`     | `''`         |
| `height`           | 导航内容高度，数值按 px（375 稿）处理        | `UnitValue`  | `44`         |
| `backIconColor`    | 返回图标颜色                                 | `string`     | 主题文字色   |
| `backIconName`     | 返回图标名称                                 | `string`     | `arrow-left` |
| `backIconSize`     | 返回图标尺寸，数值按 px（375 稿）处理        | `UnitValue`  | `20`         |
| `backText`         | 返回区域辅助文字（默认跟随 `backIconColor`） | `string`     | `''`         |
| `backTextStyle`    | 返回区域辅助文字样式                         | `StyleValue` | `''`         |
| `titleWidth`       | 标题区域宽度，数值按 px（375 稿）处理        | `UnitValue`  | `180`        |
| `titleColor`       | 标题颜色                                     | `string`     | 主题文字色   |
| `titleSize`        | 标题字号，数值按 px（375 稿）处理            | `UnitValue`  | `16`         |
| `titleBold`        | 标题是否加粗                                 | `boolean`    | `false`      |
| `isBack`           | 是否显示返回按钮                             | `boolean`    | `true`       |
| `background`       | 导航栏背景样式或颜色                         | `StyleValue` | 主题表面色   |
| `fixed`            | 是否固定在顶部                               | `boolean`    | `true`       |
| `immersive`        | 是否允许内容沉浸到状态栏区域                 | `boolean`    | `false`      |
| `safeAreaInsetTop` | 是否包含状态栏安全区                         | `boolean`    | `true`       |
| `borderBottom`     | 是否显示底部分隔线（半像素）                 | `boolean`    | `true`       |
| `zIndex`           | 固定定位层级                                 | `UnitValue`  | `980`        |
| `customBack`       | 自定义返回处理，传入时拦截默认返回逻辑       | `Function`   | `null`       |
| `customClass`      | 根节点自定义类名                             | `string`     | `''`         |
| `customStyle`      | 根节点自定义样式                             | `StyleValue` | `''`         |

### Slots

| 插槽      | 说明                   |
| --------- | ---------------------- |
| `left`    | 返回区域后的左侧内容   |
| `default` | 未设置标题时的中间内容 |
| `right`   | 右侧操作内容           |

### Events

| 事件名 | 触发时机       | 参数    |
| ------ | -------------- | ------- |
| `back` | 点击返回区域时 | `event` |

## 主题变量

| 变量名                  | 说明                 |
| ----------------------- | -------------------- |
| `--snake-color-text`    | 返回图标与标题默认色 |
| `--snake-color-surface` | 导航栏默认背景色     |
| `--snake-color-divider` | 底部分隔线颜色       |
