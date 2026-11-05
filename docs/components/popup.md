---
preview: /pages/componentsA/popup/index
description: 使用 Snake UI Popup 构建居中弹窗、底部面板和侧边抽屉，处理遮罩、滚动与安全区。
---

# Popup 弹出层

基于 Overlay 与 Transition 的正式弹层，支持中心和四边弹出、圆角、关闭图标、安全区以及完整生命周期。

## 使用建议

Popup 适合承载需要暂时打断页面的补充内容。简单反馈优先使用 Toast 或 Modal；复杂长流程应进入独立页面，避免在多层弹窗中继续嵌套弹窗。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-popup v-model="visible" mode="bottom" round closeable safe-area-inset-bottom>
  <view class="panel">弹层内容</view>
</snake-popup>
```

关闭按钮、遮罩和业务操作都可关闭弹层。H5 中打开复杂表单弹层后，业务页面应将焦点移入弹层；关闭后恢复到触发按钮。不可只依赖滑动手势关闭。

默认通过遮罩阻止背景区域触摸滚动。嵌套滚动容器等特殊场景可设置 `:lock-scroll="false"`，并由业务自行处理背景滚动。

## 无障碍

- 打开后将焦点移入弹层，关闭后恢复到触发按钮；H5 业务层还应为弹层提供明确标题。
- 保留关闭按钮、遮罩或业务操作中的至少一种可见关闭方式，不要只依赖滑动手势。
- 弹层打开时阻止背景滚动和误触；关闭动画结束后再恢复背景交互。

## API

### Props

| 参数                  | 说明                                                                                                        | 类型                          | 默认值         |
| --------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------- | -------------- |
| `modelValue`          | 显示状态（v-model）                                                                                         | `boolean`                     | `false`        |
| `show`                | 显示状态的兼容别名，绑定后优先于 `v-model`                                                                  | `boolean`                     | `false`        |
| `mode`                | 弹出方向，可选值 `center`（居中）/ `top`（顶部）/ `right`（右侧）/ `bottom`（底部）/ `left`（左侧）         | `PopupMode`                   | `center`       |
| `bgColor`             | 面板背景颜色                                                                                                | `string`                      | 主题表面色     |
| `zIndex`              | 弹层层级                                                                                                    | `number`                      | `10075`        |
| `duration`            | 动画持续时间，单位 ms                                                                                       | `number`                      | `300`          |
| `round`               | 圆角值，`true` 使用主题大圆角，数字或字符串按 px（375 稿）处理                                              | `number \| string \| boolean` | `false`        |
| `zoom`                | `center` 模式是否使用缩放动画，关闭时退回淡入淡出                                                           | `boolean`                     | `true`         |
| `closeable`           | 是否显示关闭按钮                                                                                            | `boolean`                     | `false`        |
| `closeIcon`           | 关闭按钮图标名称                                                                                            | `string`                      | `close`        |
| `closeIconColor`      | 关闭按钮图标颜色                                                                                            | `string`                      | 主题次要文字色 |
| `closeIconSize`       | 关闭按钮图标大小，数值按 px（375 稿）处理                                                                   | `number \| string`            | `10`           |
| `closeIconPos`        | 关闭按钮位置，可选值 `top-left`（左上）/ `top-right`（右上）/ `bottom-left`（左下）/ `bottom-right`（右下） | `PopupCloseIconPosition`      | `top-right`    |
| `closeOnClickOverlay` | 点击遮罩时是否关闭                                                                                          | `boolean`                     | `true`         |
| `overlay`             | 是否显示遮罩层                                                                                              | `boolean`                     | `true`         |
| `embedded`            | 嵌入页面模式，根与面板回到文档流随内容撑高，不固定、不裁剪                                                  | `boolean`                     | `false`        |
| `rootPortal`          | 传送到页面根节点渲染，避免被祖先 transform/overflow 裁剪                                                    | `boolean`                     | `false`        |
| `overlayOpacity`      | 遮罩层透明度                                                                                                | `number`                      | `0.5`          |
| `lockScroll`          | 是否阻止遮罩区域的触摸滚动                                                                                  | `boolean`                     | `true`         |
| `overlayStyle`        | 遮罩层自定义样式                                                                                            | `StyleValue`                  | `''`           |
| `safeAreaInsetBottom` | 是否适配底部安全区                                                                                          | `boolean`                     | `false`        |
| `safeAreaInsetTop`    | 是否适配顶部安全区                                                                                          | `boolean`                     | `false`        |
| `customClass`         | 根节点自定义类名                                                                                            | `string`                      | `''`           |
| `customStyle`         | 根节点自定义样式                                                                                            | `StyleValue`                  | `''`           |

`round` 为数字或字符串时按 px（375 稿）处理，`true` 使用主题大圆角令牌。center 模式四角全圆；四边模式只圆远离屏幕边缘的一侧。四边弹层进出场为整块滑入或滑出。

### Events

| 事件名              | 说明                    | 参数       |
| ------------------- | ----------------------- | ---------- |
| `update:modelValue` | 显示状态更新（v-model） | `boolean`  |
| `update:show`       | 更新兼容状态 `show`     | `boolean`  |
| `open`              | 弹层开始打开            | -          |
| `opened`            | 进入动画完成            | -          |
| `close`             | 弹层开始关闭            | -          |
| `closed`            | 离开动画完成            | -          |
| `before-enter`      | 进入动画开始前          | -          |
| `enter`             | 进入动画开始            | -          |
| `before-leave`      | 离场动画开始前          | -          |
| `leave`             | 离场动画开始            | -          |
| `change`            | 显示状态改变            | `{ show }` |
| `click-overlay`     | 点击遮罩                | 原生事件   |

### Slots

| 名称      | 说明     |
| --------- | -------- |
| `default` | 弹层内容 |

### Expose

| 方法      | 说明     |
| --------- | -------- |
| `open()`  | 打开弹层 |
| `close()` | 关闭弹层 |

## 主题变量

| 变量                       | 用途                  |
| -------------------------- | --------------------- |
| `--snake-color-surface`    | 默认面板背景          |
| `--snake-color-text-muted` | 默认关闭图标颜色      |
| `--snake-radius-large`     | `round="true"` 的圆角 |
| `--snake-z-index-popup`    | 样式层的默认弹层层级  |
