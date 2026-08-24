---
preview: /pages/componentsA/slider/index
---

# Slider 滑动选择器

通过轨道点击或触摸拖动选择数值，支持步长、数值气泡、边界值与自定义滑块。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-slider v-model="value" :min="0" :max="100" :step="5" show-value show-edge-value />
```

```vue
<snake-slider v-model="value" use-slot>
  <template #default="{ value }"><view class="custom-block">{{ value }}</view></template>
</snake-slider>
```

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

`update()` 在容器尺寸变化后重新测量轨道。

源码：`src/uni_modules/snake-ui/components/snake-slider/snake-slider.vue`
