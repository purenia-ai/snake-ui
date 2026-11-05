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

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 checkbox 的占宽（需带单位，如 `width="120px"`），`wrap` 让每个 checkbox 单独占一行。

## 表单值与数量限制

组模式的 `v-model` 始终是 `name` 数组。达到 `max` 后，其余未选项不可再选；业务应根据数组值提交，而不是读取展示文本。

```vue
<snake-checkbox-group v-model="permissions" :max="2" @change="saveDraft">
  <snake-checkbox name="read">读取</snake-checkbox>
  <snake-checkbox name="write">编辑</snake-checkbox>
  <snake-checkbox name="manage">管理</snake-checkbox>
</snake-checkbox-group>
```

## API

### CheckboxGroup

#### Props

| 参数            | 说明                                                        | 类型                   | 默认值   |
| --------------- | ----------------------------------------------------------- | ---------------------- | -------- |
| `customStyle`   | 根节点自定义样式                                            | `StyleValue`           | `''`     |
| `customClass`   | 根节点自定义类名                                            | `string`               | `''`     |
| `modelValue`    | 绑定值，选中的 checkbox name 组成的数组（v-model）          | `(string \| number)[]` | -        |
| `max`           | 最多能选中多少个 checkbox                                   | `number`               | `999`    |
| `disabled`      | 是否禁用所有 checkbox                                       | `boolean`              | `false`  |
| `name`          | 在表单内提交时的标识符                                      | `boolean \| string`    | `''`     |
| `labelDisabled` | 是否禁止点击标签选中                                        | `boolean`              | `false`  |
| `shape`         | 形状，可选值 `square`（方形）/ `circle`（圆形）             | `string`               | `square` |
| `activeColor`   | 选中状态下的颜色，应用到所有子 checkbox                     | `string`               | 主题色   |
| `size`          | 整体尺寸，可选值 `small` / `default` / `large` 或自定义数值 | `string \| number`     | `''`     |
| `width`         | 每个 checkbox 占 CheckboxGroup 的宽度，需带单位             | `string`               | `auto`   |
| `wrap`          | 是否每个 checkbox 都换行                                    | `boolean`              | `false`  |
| `iconSize`      | 勾选图标的大小，单位 px（375 稿）                           | `UnitValue`            | `''`     |

#### Events

| 事件名              | 说明                         | 参数                          |
| ------------------- | ---------------------------- | ----------------------------- |
| `update:modelValue` | 选中值数组更新（v-model）    | `value: (string \| number)[]` |
| `change`            | 任一 checkbox 状态变化时触发 | `value: (string \| number)[]` |

#### Slots

| 名称      | 说明          |
| --------- | ------------- |
| `default` | 放置 Checkbox |

### Checkbox

#### Props

| 参数            | 说明                                                                                            | 类型                | 默认值                       |
| --------------- | ----------------------------------------------------------------------------------------------- | ------------------- | ---------------------------- |
| `customStyle`   | 根节点自定义样式                                                                                | `StyleValue`        | `{}`                         |
| `customClass`   | 根节点自定义类名                                                                                | `string`            | `''`                         |
| `label`         | 展示标签文本                                                                                    | `string`            | `''`                         |
| `name`          | 数据项名称或唯一标识                                                                            | `string \| number`  | `''`                         |
| `shape`         | 形状，可选值 `square`（方形）/ `circle`（圆形），未设置时继承 CheckboxGroup                     | `string`            | `square`                     |
| `modelValue`    | 是否选中，支持 v-model（独立模式）                                                              | `boolean`           | `false`                      |
| `disabled`      | 是否禁用，未设置时继承 CheckboxGroup                                                            | `string \| boolean` | `''`                         |
| `labelDisabled` | 是否禁止点击标签选中，未设置时继承 CheckboxGroup                                                | `string \| boolean` | `''`                         |
| `activeColor`   | 选中状态下的颜色，设置后覆盖 CheckboxGroup 的 `activeColor`                                     | `string`            | 主题色（继承 CheckboxGroup） |
| `iconSize`      | 勾选图标的大小，单位 px（375 稿），未设置时按 size 预设                                         | `UnitValue`         | 按 size 预设                 |
| `labelSize`     | 标签文字大小，单位 px（375 稿），未设置时按 size 预设                                           | `UnitValue`         | 按 size 预设                 |
| `size`          | 整体尺寸，可选值 `small` / `default` / `large` 或自定义数值，未设置时继承 CheckboxGroup 与 Form | `string \| number`  | `default`                    |

#### Events

| 事件名              | 说明         | 参数      |
| ------------------- | ------------ | --------- |
| `update:modelValue` | 选中状态更新 | `checked` |
| `change`            | 选中状态变化 | `checked` |

#### Slots

| 名称      | 说明                         |
| --------- | ---------------------------- |
| `default` | 标签内容，不传时显示 `label` |

## 主题变量

| 变量                        | 用途                   |
| --------------------------- | ---------------------- |
| `--snake-color-primary`     | 默认选中颜色           |
| `--snake-color-border`      | 未选中和禁用边框       |
| `--snake-color-disabled-bg` | 禁用状态背景与图标颜色 |
| `--snake-color-text`        | 标签文字颜色           |

`activeColor` 会覆盖当前实例或分组的默认主题色。

## 类型定义

```ts
import type { CheckboxGroupProps, CheckboxProps, CheckboxEmits } from '@puresnake/snake-ui';
```
