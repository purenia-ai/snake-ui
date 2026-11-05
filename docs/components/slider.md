---
preview: /pages/componentsA/slider/index
---

# Slider 滑动选择器

通过轨道点击或触摸拖动选择数值，支持步长、数值气泡、边界值与自定义滑块。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-slider v-model="value" :min="0" :max="100" :step="5" show-value show-edge-value />
```

```vue
<snake-slider v-model="value" use-slot>
  <template #default="{ value }"><view class="custom-block">{{ value }}</view></template>
</snake-slider>
```

H5 中轨道可通过 Tab 聚焦，方向键按照 `step` 调整数值；触摸拖动、轨道点击和键盘调整都会遵守 `min`、`max` 与步长归一化规则。

## API

### Props

| 参数            | 说明                                                 | 类型                  | 默认值       |
| --------------- | ---------------------------------------------------- | --------------------- | ------------ |
| `modelValue`    | 双向绑定的当前值（v-model）                          | `number \| string`    | `0`          |
| `min`           | 允许设置的最小值                                     | `number \| string`    | `0`          |
| `max`           | 允许设置的最大值                                     | `number \| string`    | `100`        |
| `step`          | 每次变化的步长                                       | `number \| string`    | `1`          |
| `height`        | 组件高度，数值按 px（375 稿）处理                    | `UnitValue`           | `3`          |
| `blockWidth`    | 滑块宽度，数值按 px（375 稿）处理                    | `UnitValue`           | `15`         |
| `activeColor`   | 激活状态颜色                                         | `string`              | 主题色       |
| `inactiveColor` | 未激活状态颜色                                       | `string`              | 主题分隔线色 |
| `blockColor`    | 滑块颜色                                             | `string`              | `#fff`       |
| `blockStyle`    | 滑块附加样式                                         | `StyleValue`          | `''`         |
| `disabled`      | 是否禁用交互                                         | `boolean`             | `false`      |
| `useSlot`       | 是否使用默认插槽替换默认滑块                         | `boolean`             | `false`      |
| `showValue`     | 是否显示当前数值气泡                                 | `boolean`             | `false`      |
| `valuePosition` | 数值气泡位置，可选值 `top`（上方）/ `bottom`（下方） | `SliderValuePosition` | `top`        |
| `showEdgeValue` | 是否显示最小和最大值                                 | `boolean`             | `false`      |
| `customClass`   | 根节点自定义类名                                     | `string`              | `''`         |
| `customStyle`   | 根节点自定义样式                                     | `StyleValue`          | `''`         |

### Events

| 事件名              | 说明               | 参数    |
| ------------------- | ------------------ | ------- |
| `update:modelValue` | 拖动或点击实时更新 | `value` |
| `change`            | 点击或拖动结束     | `value` |
| `start`             | 触摸开始           | `value` |
| `moving`            | 触摸移动           | `value` |
| `end`               | 触摸结束           | `value` |

### Expose

| 方法       | 说明                           |
| ---------- | ------------------------------ |
| `update()` | 容器尺寸变化后重新测量轨道位置 |

### Slots

| 插槽名    | 说明                         | 参数        |
| --------- | ---------------------------- | ----------- |
| `default` | `useSlot` 开启时替换默认滑块 | `{ value }` |

## 主题变量

| 变量名                     | 说明           |
| -------------------------- | -------------- |
| `--snake-color-primary`    | 激活轨道默认色 |
| `--snake-color-divider`    | 未激活轨道颜色 |
| `--snake-color-text-muted` | 边界值文字颜色 |
