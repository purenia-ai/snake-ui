---
preview: /pages/componentsA/checkbox/index
---

# Checkbox 复选框

复选框支持独立 `v-model` 布尔绑定，也可放入 CheckboxGroup，通过 `name` 管理数组值。

## 何时使用

用于零个、一个或多个可同时成立的选项。只能选择一项时使用 Radio；代表立即生效的开关状态时使用 Switch。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-checkbox v-model="accepted">同意用户协议</snake-checkbox>
<snake-checkbox-group v-model="fruits">
  <snake-checkbox name="apple">苹果</snake-checkbox>
  <snake-checkbox name="pear">雪梨</snake-checkbox>
</snake-checkbox-group>
```

## API

### Props

| 参数                    | 说明                               | 类型               | 默认值      |
| ----------------------- | ---------------------------------- | ------------------ | ----------- |
| `modelValue`            | 是否选中，支持 v-model             | `boolean`          | `false`     |
| `value` / `name`        | 兼容旧 API 的值 / 数据项标识，`value` 非空时优先 | `string \| number` | `''` |
| `label`                 | 展示标签文本                       | `string`           | `''`        |
| `shape`                 | square/circle 形状                 | `string`           | 继承 Group  |
| `disabled` / `labelDisabled` | 禁用 / 禁止点击标签选中         | `boolean`          | `false`     |
| `activeColor`           | 选中颜色，设置后覆盖父级 activeColor | `string`         | 主题色      |
| `iconSize` / `labelSize` | 勾号与标签字号，单位 rpx           | `UnitValue`        | 按 size 预设 |
| `size`                  | 整体尺寸 small/default/large       | `string`           | 继承 Group  |
| `customClass` / `customStyle` | 自定义类名和样式             | `string \| style`  | `''`        |

### Events

| 事件名              | 说明             | 参数      |
| ------------------- | ---------------- | --------- |
| `update:modelValue` | 选中状态更新     | `checked` |
| `change`            | 选中状态变化     | `checked` |

### Slots

默认插槽用于标签内容。

## 类型定义

从包根导入 `SnakeCheckboxProps` 与 `SnakeCheckboxEmits`；组合使用时可配合 `SnakeCheckboxGroupProps`。

源码：`src/uni_modules/snake-ui/components/snake-checkbox/snake-checkbox.vue`
