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

| 参数                                           | 说明                       | 类型                | 默认值                  |
| ---------------------------------------------- | -------------------------- | ------------------- | ----------------------- |
| `modelValue` / `min` / `max` / `step`          | 当前值、范围和步长         | `number \| string`  | `0` / `0` / `100` / `1` |
| `height` / `blockWidth`                        | 轨道高度和滑块尺寸         | `UnitValue`         | `6` / `30`              |
| `activeColor` / `inactiveColor` / `blockColor` | 状态颜色                   | `string`            | 主题默认值              |
| `blockStyle`                                   | 滑块附加样式               | `style`             | `''`                    |
| `disabled` / `useSlot`                         | 禁用和使用自定义滑块       | `boolean`           | `false`                 |
| `showValue` / `valuePosition`                  | 数值气泡和 top/bottom 位置 | `boolean \| string` | `false` / `top`         |
| `showEdgeValue`                                | 显示最小和最大值           | `boolean`           | `false`                 |
| `customClass` / `customStyle`                  | 自定义类名和样式           | `string \| style`   | `''`                    |

### Events

| 事件名                     | 说明                 | 参数  |
| -------------------------- | -------------------- | ----- |
| `update:modelValue`        | 拖动或点击实时更新   | value |
| `start` / `moving` / `end` | 触摸开始、移动、结束 | value |
| `change`                   | 点击或拖动结束       | value |

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

源码：`src/uni_modules/snake-ui/components/snake-slider/snake-slider.vue`
