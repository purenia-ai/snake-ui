---
preview: /pages/componentsA/checkbox
---

# Checkbox 复选框

可独立绑定 boolean，也可放入 CheckboxGroup，通过 `name` 管理数组值。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-checkbox v-model="accepted">同意用户协议</snake-checkbox>
<snake-checkbox-group v-model="fruits"><snake-checkbox name="apple">苹果</snake-checkbox></snake-checkbox-group>
```

## API

### Props

| 参数                                          | 说明                     | 类型                | 默认值      |
| --------------------------------------------- | ------------------------ | ------------------- | ----------- |
| `modelValue`                                  | 独立使用时的选中值       | `boolean`           | `false`     |
| `name` / `label`                              | Group 值和标签           | `unknown \| string` | -           |
| `disabled` / `labelDisabled`                  | 禁用全部或仅禁用标签点击 | `boolean`           | `false`     |
| `shape` / `size`                              | square/circle 与组件尺寸 | `string`            | 继承 Group  |
| `activeColor` / `inactiveColor` / `iconColor` | 选中、未选中和勾选颜色   | `string`            | 主题默认值  |
| `iconSize` / `labelSize`                      | 图标和文字大小           | `UnitValue`         | `34` / `28` |
| `customClass` / `customStyle`                 | 自定义类名和样式         | `string \| style`   | `''`        |

### Events

| 事件名              | 说明         | 参数              |
| ------------------- | ------------ | ----------------- |
| `update:modelValue` | 独立状态更新 | `checked`         |
| `change`            | 独立状态变化 | `(checked, name)` |
| `click`             | 点击组件     | event             |

### Slots

默认插槽用于标签内容。

源码：`src/uni_modules/snake-ui/components/snake-checkbox/snake-checkbox.vue`
