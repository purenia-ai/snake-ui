---
name: 'tooltip'
description: 'Snake UI Tooltip 文字提示参考。处理 tooltip、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['tooltip', 'snake-tooltip', 'Tooltip', '文字提示']
---

# Tooltip 文字提示

Tooltip 用于展示与触发元素相关的简短说明或非操作性内容。它以默认插槽作为触发元素，内容可通过 `content` 属性或 `content` 插槽传入。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-tooltip content="这是一段说明文字">
    <snake-icon name="info-circle" size="28rpx" />
</snake-tooltip>
```

## 富内容与受控显示

`content` 插槽可承载 `mp-html` 等内容组件；使用 `v-model` 可由页面主动控制显隐。

```vue
<snake-tooltip v-model="showDetail" placement="bottom-start" :offset="10">
    <snake-icon name="info-circle" size="28rpx" />
    <template #content>
        <mp-html :content="description" />
    </template>
</snake-tooltip>
```

## 方向

支持 `top`、`bottom`、`left`、`right` 及各自的 `-start`、`-end` 变体。默认是 `bottom`。打开一个 Tooltip 时，同页其余已打开的 Tooltip 会自动关闭；点击透明区域默认关闭当前 Tooltip。

内容应保持简短且不可承载关键操作；复杂交互请使用 Popup。受控模式下由 `v-model` 统一维护显隐，避免同时调用实例方法和修改绑定值。

## API

### Props

| 参数                  | 说明                                  | 类型               | 默认值     |
| --------------------- | ------------------------------------- | ------------------ | ---------- |
| `v-model`             | 是否显示                              | `boolean`          | `false`    |
| `content`             | 纯文本内容；有 `content` 插槽时不使用 | `string`           | `''`       |
| `placement`           | 展示方向                              | `TooltipPlacement` | `'bottom'` |
| `offset`              | 与触发元素间距，数值按 `rpx` 处理     | `number \| string` | `8`        |
| `visibleArrow`        | 是否显示箭头                          | `boolean`          | `true`     |
| `disabled`            | 是否禁用触发                          | `boolean`          | `false`    |
| `closeable`           | 是否显示关闭按钮                      | `boolean`          | `false`    |
| `closeOnClickOverlay` | 点击透明区域是否关闭                  | `boolean`          | `true`     |
| `zIndex`              | 透明遮罩层级                          | `number`           | `10070`    |
| `customClass`         | 根节点自定义类名                      | `string`           | `''`       |
| `customStyle`         | 根节点自定义样式                      | `StyleValue`       | `''`       |
| `contentClass`        | 内容容器自定义类名                    | `string`           | `''`       |
| `contentStyle`        | 内容容器自定义样式                    | `StyleValue`       | `''`       |

### Events

| 事件名          | 说明               | 回调参数            |
| --------------- | ------------------ | ------------------- |
| `change`        | 显隐状态变化       | `{ show: boolean }` |
| `open`          | 打开后触发         | -                   |
| `close`         | 关闭后触发         | -                   |
| `click-overlay` | 点击透明区域时触发 | `event`             |

### Methods

通过组件 ref 可调用以下方法：

| 方法名     | 说明         |
| ---------- | ------------ |
| `open()`   | 打开 Tooltip |
| `close()`  | 关闭 Tooltip |
| `toggle()` | 切换显示状态 |

### Slots

| 插槽名    | 说明                                    |
| --------- | --------------------------------------- |
| `default` | 触发 Tooltip 的元素                     |
| `content` | Tooltip 内容；优先级高于 `content` 属性 |

## 主题变量

| 变量名                       | 说明       |
| ---------------------------- | ---------- |
| `--snake-tooltip-color`      | 文字颜色   |
| `--snake-tooltip-background` | 背景色     |
| `--snake-tooltip-radius`     | 圆角       |
| `--snake-tooltip-shadow`     | 阴影       |
| `--snake-tooltip-padding`    | 内容内边距 |
| `--snake-tooltip-font-size`  | 字号       |
