---
name: 'tooltip'
description: 'Snake UI Tooltip 文字提示参考。处理 tooltip、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['tooltip', 'snake-tooltip', 'Tooltip', '文字提示']
---

# Tooltip 文字提示

Tooltip 用于展示与触发元素相关的简短说明或非操作性内容。它以默认插槽作为触发元素，内容可通过 `content` 属性或 `content` 插槽传入。

浮层用 CSS 附着在触发元素上，方向与箭头按布局对齐；点击外部关闭由内置透明遮罩完成，不需要页面额外维护队列或测量位置。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-tooltip content="这是一段说明文字">
    <snake-icon name="info-circle" size="14px" />
</snake-tooltip>
```

## 富内容与受控显示

`content` 插槽可承载 `snake-parse` 等内容组件；使用 `v-model` 可由页面主动控制显隐。

```vue
<snake-tooltip v-model="showDetail" placement="bottom-start" :offset="10">
    <snake-icon name="info-circle" size="14px" />
    <template #content>
        <snake-parse :content="description" />
    </template>
</snake-tooltip>
```

## 方向

支持 `top`、`bottom`、`left`、`right` 及各自的 `-start`、`-end` 变体，共 12 种，默认是 `bottom`。箭头会按触发元素与浮层的实际尺寸对齐。打开一个 Tooltip 时，其余已打开的 Tooltip 会自动关闭；点击透明区域默认关闭当前 Tooltip。

内容应保持简短且不可承载关键操作；复杂交互请使用 Popup。受控模式下由 `v-model` 统一维护显隐，避免同时调用实例方法和修改绑定值。

浮层不会自动翻转方向，也不能越过父级的 `overflow: hidden` 裁剪。靠近屏幕边缘或位于裁剪容器内时，应选择合适的 `placement`，或将触发元素放在不裁剪浮层的容器中。

## 动态内容与位置刷新

内容插槽会随 Vue 状态重新渲染，浮层的 CSS 位置会跟随内容尺寸变化。若插槽的宽高在打开后发生变化，可在 DOM 更新后调用 `updatePosition()`，重新测量箭头位置。

```vue
<script setup lang="ts">
import { nextTick, ref } from 'vue';
import type { TooltipExpose } from '@puresnake/snake-ui';

const tooltip = ref<TooltipExpose | null>(null);
const detail = ref('简短说明');

async function expandDetail() {
    detail.value = '更新后的多行说明内容';
    await nextTick();
    await tooltip.value?.updatePosition();
}
</script>

<template>
    <snake-tooltip ref="tooltip" placement="bottom-start" @open="expandDetail">
        <text>查看说明</text>
        <template #content>
            <text>{{ detail }}</text>
        </template>
    </snake-tooltip>
</template>
```

## 兼容写法与行为说明

| 功能         | 说明                                                        |
| ------------ | ----------------------------------------------------------- |
| 关闭按钮     | 用 `closeable` 控制                                         |
| 内容插槽     | 使用 `#content` 插槽；`use-content-slot` 这类属性写法不支持 |
| 点击外部关闭 | 内置透明遮罩，默认关闭，可用 `closeOnClickOverlay` 控制     |
| `offset`     | 浮层与触发元素的间距；数字按 px（375 稿）处理               |
| 内容尺寸变化 | 浮层由 CSS 重新布局，`updatePosition()` 刷新箭头对齐        |
| 显隐动画     | 立即显示和关闭，没有过渡动画                                |

`customArrow` 和 `customPop` 分别用于箭头与浮层面板的类名；`contentClass`、`contentStyle` 只作用于内容容器。

## API

### Props

| 参数                  | 说明                                    | 类型               | 默认值     |
| --------------------- | --------------------------------------- | ------------------ | ---------- |
| `v-model`             | 是否显示                                | `boolean`          | `false`    |
| `content`             | 纯文本内容；有 `content` 插槽时不使用   | `string`           | `''`       |
| `placement`           | 展示方向                                | `TooltipPlacement` | `'bottom'` |
| `offset`              | 与触发元素间距，数值按 px（375 稿）处理 | `number \| string` | `4`        |
| `visibleArrow`        | 是否显示箭头                            | `boolean`          | `true`     |
| `disabled`            | 是否禁用触发                            | `boolean`          | `false`    |
| `closeable`           | 是否显示关闭按钮                        | `boolean`          | `false`    |
| `closeOnClickOverlay` | 点击透明区域是否关闭                    | `boolean`          | `true`     |
| `zIndex`              | 透明遮罩层级                            | `number`           | `10070`    |
| `customClass`         | 根节点自定义类名                        | `string`           | `''`       |
| `customStyle`         | 根节点自定义样式                        | `StyleValue`       | `''`       |
| `customArrow`         | 箭头自定义类名                          | `string`           | `''`       |
| `customPop`           | 浮层面板自定义类名                      | `string`           | `''`       |
| `contentClass`        | 内容容器自定义类名                      | `string`           | `''`       |
| `contentStyle`        | 内容容器自定义样式                      | `StyleValue`       | `''`       |

### Events

| 事件名          | 说明               | 回调参数            |
| --------------- | ------------------ | ------------------- |
| `change`        | 显隐状态变化       | `{ show: boolean }` |
| `open`          | 打开后触发         | -                   |
| `close`         | 关闭后触发         | -                   |
| `click-overlay` | 点击透明区域时触发 | `event`             |

### Methods

通过组件 ref 可调用以下方法：

| 方法名             | 说明               |
| ------------------ | ------------------ |
| `open()`           | 打开 Tooltip       |
| `close()`          | 关闭 Tooltip       |
| `toggle()`         | 切换显示状态       |
| `updatePosition()` | 重新测量并对齐箭头 |

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
