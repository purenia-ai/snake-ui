---
preview: /pages/componentsA/checkboxGroup/index
---

# CheckboxGroup 复选框组

管理一组 Checkbox 的数组值、禁用状态、最大选择数和布局。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-checkbox-group v-model="value" :max="2" placement="column">
  <snake-checkbox name="apple">苹果</snake-checkbox>
  <snake-checkbox name="pear">雪梨</snake-checkbox>
</snake-checkbox-group>
```

## API

### Props

| 参数                            | 说明                            | 类型                | 默认值               |
| ------------------------------- | ------------------------------- | ------------------- | -------------------- |
| `modelValue`                    | 选中的 name 数组                | `unknown[]`         | `[]`                 |
| `disabled` / `max`              | 全组禁用和最大选择数，0 不限制  | `boolean \| number` | `false` / `0`        |
| `direction` / `placement`       | row/column 布局，placement 优先 | `string`            | `row`                |
| `size` / `shape`                | 子项尺寸和 square/circle        | `string`            | `default` / `square` |
| `activeColor` / `inactiveColor` | 选中和未选中颜色                | `string`            | 主题默认值           |
| `iconSize` / `labelSize`        | 子项图标和文字大小              | `UnitValue`         | `34` / `28`          |
| `customClass` / `customStyle`   | 自定义类名和样式                | `string \| style`   | `''`                 |

### Events

`update:modelValue` 和 `change` 均返回最新数组。

### Slots

默认插槽放置 Checkbox。

源码：`src/uni_modules/snake-ui/components/snake-checkbox-group/snake-checkbox-group.vue`
