---
preview: /pages/componentsA/tooltip/index
---

# Tooltip 文字提示

Tooltip 用于展示与触发元素相关的简短说明或非操作性内容。它以默认插槽作为触发元素，内容可通过 `content` 属性或 `content` 插槽传入。

Snake Tooltip 与 Wot UI Tooltip 的用途相同，但定位和关闭机制并不相同：Snake 用 CSS 将浮层附着在触发元素上，并用透明遮罩处理点击外部关闭；Wot UI 会测量浮层位置，点击外部关闭通常由页面配合 `useQueue()` 处理。

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

`content` 插槽可承载 `snake-parse` 等内容组件；使用 `v-model` 可由页面主动控制显隐。

```vue
<snake-tooltip v-model="showDetail" placement="bottom-start" :offset="10">
    <snake-icon name="info-circle" size="28rpx" />
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
import type { TooltipExpose } from '@/uni_modules/snake-ui/components/snake-tooltip/types';

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

## 与 Wot UI 的 API 差异

| 功能         | Snake Tooltip                                           | Wot UI Tooltip                                     |
| ------------ | ------------------------------------------------------- | -------------------------------------------------- |
| 关闭按钮     | `closeable`，也接受 `show-close`                        | `show-close`                                       |
| 内容插槽     | 直接使用 `#content`                                     | 当前源码也会自动识别 `#content`                    |
| 点击外部关闭 | 内置透明遮罩，默认关闭，可用 `closeOnClickOverlay` 控制 | 页面使用 `useQueue().closeOutside()`               |
| `offset`     | 浮层与触发元素的间距；数字按 `rpx` 处理                 | 沿坐标轴调整位置，接受数字、数组或对象，按像素处理 |
| 内容尺寸变化 | 浮层由 CSS 重新布局，`updatePosition()` 刷新箭头对齐    | `updatePosition()` 重新测量并定位浮层              |
| 显隐动画     | 立即显示和关闭                                          | 200ms 淡入淡出                                     |

`customArrow` 和 `customPop` 分别用于箭头与浮层面板的类名；`contentClass`、`contentStyle` 只作用于内容容器。Wot UI 文档示例仍写有 `use-content-slot`，但当前 Tooltip 类型与组件实现均没有这个属性。

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
| `showClose`           | 关闭按钮兼容别名                      | `boolean`          | `false`    |
| `closeOnClickOverlay` | 点击透明区域是否关闭                  | `boolean`          | `true`     |
| `zIndex`              | 透明遮罩层级                          | `number`           | `10070`    |
| `customClass`         | 根节点自定义类名                      | `string`           | `''`       |
| `customStyle`         | 根节点自定义样式                      | `StyleValue`       | `''`       |
| `customArrow`         | 箭头自定义类名                        | `string`           | `''`       |
| `customPop`           | 浮层面板自定义类名                    | `string`           | `''`       |
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
