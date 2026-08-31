---
preview: /pages/componentsA/radio/index
---

# Radio 单选框

可独立绑定 boolean，也可在 RadioGroup 中通过 `name` 参与互斥选择。

## 何时使用

用于一组选项中必须或最多选择一项的场景。允许多选时使用 Checkbox；选项很多或空间紧张时可考虑下拉选择组件。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-radio v-model="isDefault">默认地址</snake-radio>
<snake-radio-group v-model="flavor"><snake-radio name="sweet">鲜甜</snake-radio></snake-radio-group>
```

## API

### Props

| 参数                                          | 说明                     | 类型                | 默认值      |
| --------------------------------------------- | ------------------------ | ------------------- | ----------- |
| `modelValue`                                  | 独立使用时的选中值       | `boolean`           | `false`     |
| `name` / `label`                              | Group 值和标签           | `unknown \| string` | -           |
| `disabled` / `labelDisabled`                  | 禁用全部或标签点击       | `boolean`           | `false`     |
| `shape` / `size`                              | circle/square 与组件尺寸 | `string`            | 继承 Group  |
| `activeColor` / `inactiveColor` / `iconColor` | 状态颜色                 | `string`            | 主题默认值  |
| `iconSize` / `labelSize`                      | 图标和文字大小           | `UnitValue`         | `34` / `28` |
| `customClass` / `customStyle`                 | 自定义类名和样式         | `string \| style`   | `''`        |

### Events

`update:modelValue`、`change(checked, name)` 和 `click(event)`。

### Slots

默认插槽用于标签内容。

## 无障碍

组件支持焦点、Enter 和 Space 键，并输出 `radio` / `aria-checked` 状态。每一项都应提供清晰且互不歧义的文字标签。

## 类型定义

从包根导入 `SnakeRadioProps` 与 `SnakeRadioEmits`；组合使用时可配合 `SnakeRadioGroupProps`。

源码：`src/uni_modules/snake-ui/components/snake-radio/snake-radio.vue`
