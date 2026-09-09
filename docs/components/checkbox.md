---
preview: /pages/componentsA/checkbox/index
---

# Checkbox 复选框

`Checkbox` 支持独立 `v-model` 布尔绑定，也可放入 `CheckboxGroup` 通过 `name` 管理数组值；`CheckboxGroup` 提供最大选择数与布局控制。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

独立模式直接绑定布尔值；组模式通过 `CheckboxGroup` 的 `v-model` 管理选中数组：

```vue
<snake-checkbox v-model="accepted">同意用户协议</snake-checkbox>

<snake-checkbox-group v-model="fruits" :max="2" wrap>
  <snake-checkbox name="apple">苹果</snake-checkbox>
  <snake-checkbox name="pear">雪梨</snake-checkbox>
</snake-checkbox-group>
```

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 checkbox 的占宽（需带单位，如 `width="240rpx"`），`wrap` 让每个 checkbox 单独占一行。

## API

### CheckboxGroup

#### Props

| 参数                          | 说明                         | 类型                   | 默认值     |
| ----------------------------- | ---------------------------- | ---------------------- | ---------- |
| `modelValue`                  | 选中的 name 数组             | `(string \| number)[]` | -          |
| `max`                         | 最多能选中多少个             | `number`               | `999`      |
| `disabled`                    | 全组禁用                     | `boolean`              | `false`    |
| `name`                        | 表单内提交时的标识符         | `boolean \| string`    | `''`       |
| `labelDisabled`               | 是否禁止点击标签选中         | `boolean`              | `false`    |
| `shape`                       | square/circle 形状           | `string`               | `'square'` |
| `activeColor`                 | 选中状态下的颜色             | `string`               | 主题色     |
| `size`                        | 整体尺寸 small/default/large | `string`               | `''`       |
| `width`                       | 每个 checkbox 占组宽度       | `string`               | `'auto'`   |
| `wrap`                        | 是否每个 checkbox 都换行     | `boolean`              | `false`    |
| `iconSize`                    | 勾号大小，单位 rpx           | `UnitValue`            | `''`       |
| `customClass` / `customStyle` | 自定义类名和样式             | `string \| style`      | `''`       |

#### Events

`update:modelValue` 和 `change` 均返回最新选中数组。

#### Slots

默认插槽放置 Checkbox。

### Checkbox

#### Props

| 参数                          | 说明                                             | 类型               | 默认值       |
| ----------------------------- | ------------------------------------------------ | ------------------ | ------------ |
| `modelValue`                  | 是否选中，支持 v-model                           | `boolean`          | `false`      |
| `value` / `name`              | 兼容旧 API 的值 / 数据项标识，`value` 非空时优先 | `string \| number` | `''`         |
| `label`                       | 展示标签文本                                     | `string`           | `''`         |
| `shape`                       | square/circle 形状                               | `string`           | 继承 Group   |
| `disabled` / `labelDisabled`  | 禁用 / 禁止点击标签选中                          | `boolean`          | `false`      |
| `activeColor`                 | 选中颜色，设置后覆盖父级 activeColor             | `string`           | 主题色       |
| `iconSize` / `labelSize`      | 勾号与标签字号，单位 rpx                         | `UnitValue`        | 按 size 预设 |
| `size`                        | 整体尺寸 small/default/large                     | `string`           | 继承 Group   |
| `customClass` / `customStyle` | 自定义类名和样式                                 | `string \| style`  | `''`         |

#### Events

| 事件名              | 说明         | 参数      |
| ------------------- | ------------ | --------- |
| `update:modelValue` | 选中状态更新 | `checked` |
| `change`            | 选中状态变化 | `checked` |

#### Slots

默认插槽用于标签内容。

## 主题变量

| 变量                        | 用途                   |
| --------------------------- | ---------------------- |
| `--snake-color-primary`     | 默认选中颜色           |
| `--snake-color-border`      | 未选中和禁用边框       |
| `--snake-color-disabled-bg` | 禁用状态背景与图标颜色 |
| `--snake-color-text`        | 标签文字颜色           |

`activeColor` 会覆盖当前实例或分组的默认主题色。

## 类型定义

从包根导入 `SnakeCheckboxGroupProps`、`SnakeCheckboxProps` 与 `SnakeCheckboxEmits`。

源码：`src/uni_modules/snake-ui/components/snake-checkbox-group/snake-checkbox-group.vue`、`src/uni_modules/snake-ui/components/snake-checkbox/snake-checkbox.vue`
