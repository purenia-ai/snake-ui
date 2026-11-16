---
name: 'checkbox'
description: 'Snake UI Checkbox 复选框参考。处理 checkbox、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['checkbox', 'snake-checkbox', 'Checkbox', '复选框']
---

# Checkbox 复选框

`Checkbox` 支持独立 `v-model` 布尔绑定，也可放入 `CheckboxGroup` 通过 `name` 管理数组值；`CheckboxGroup` 负责选择数量上下限、批量操作与列表布局。

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
  <snake-checkbox name="lemon">柠檬</snake-checkbox>
</snake-checkbox-group>
```

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 checkbox 的占宽（数值按 375 稿 px 处理，也可写 `"120px"`、`"50%"`），`wrap` 让每个 checkbox 单独占一行。

## 数量上下限

`max` 限制最多可选数量，`min` 限制最少保留数量。达到上限后，未选项进入锁定态（置灰）并在点击时给出轻提示；达到下限后，已选项同样锁定，无法取消。

```vue
<snake-checkbox-group v-model="permissions" :min="1" :max="2">
  <snake-checkbox name="read">读取</snake-checkbox>
  <snake-checkbox name="write">编辑</snake-checkbox>
  <snake-checkbox name="manage">管理</snake-checkbox>
</snake-checkbox-group>
```

提示文案取语言包（`checkbox.maxText` / `checkbox.minText`），可用同名属性覆盖，`{n}` 会被替换成对应的数量。

## 批量操作与半选

通过 `ref` 调用 `toggleAll()` 一次切换全部可操作项，配套 `indeterminate` 表示「部分选中」，常用于全选行：

```vue
<snake-checkbox :model-value="allChecked" :indeterminate="partlyChecked" @change="toggleAll">
  全选
</snake-checkbox>

<snake-checkbox-group ref="group" v-model="fruits" @change="syncAllState">
  <snake-checkbox name="apple">苹果</snake-checkbox>
  <snake-checkbox name="pear">雪梨</snake-checkbox>
</snake-checkbox-group>
```

`toggleAll()` 支持 `toggleAll({ checked: true, skipDisabled: true })` 指定目标状态并跳过禁用项；结果始终受 `min` / `max` 约束。

## 列表形态

设置 `placement="right"` 把指示器移到文字右侧，配合 `wrap` 与 `border` 得到设置列表式的逐行样式；`inactiveColor`、`labelColor`、`labelSize` 可在组上统一设置，也可在单项上覆盖：

```vue
<snake-checkbox-group v-model="channels" wrap border placement="right" inactive-color="#c0c4cc" label-color="#303133">
  <snake-checkbox name="sms" border>短信通知</snake-checkbox>
  <snake-checkbox name="email" border>邮件通知</snake-checkbox>
  <snake-checkbox name="push" border>应用内推送</snake-checkbox>
</snake-checkbox-group>
```

`border` 只绘制相邻行之间的分隔线：组内最后一项不绘制，单项显式设置 `border` 时按设置绘制。

## API

### CheckboxGroup

#### Props

| 参数            | 说明                                                                                  | 类型                   | 默认值     |
| --------------- | ------------------------------------------------------------------------------------- | ---------------------- | ---------- |
| `customStyle`   | 根节点自定义样式                                                                      | `StyleValue`           | `''`       |
| `customClass`   | 根节点自定义类名                                                                      | `string`               | `''`       |
| `modelValue`    | 绑定值，选中的 checkbox name 组成的数组（v-model）                                    | `(string \| number)[]` | -          |
| `max`           | 最多能选中多少个 checkbox，`0` 表示不限制                                             | `number`               | `999`      |
| `min`           | 最少需要选中多少个 checkbox，`0` 表示不限制                                           | `number`               | `0`        |
| `disabled`      | 是否禁用所有 checkbox                                                                 | `boolean`              | `false`    |
| `labelDisabled` | 是否禁止点击标签选中                                                                  | `boolean`              | `false`    |
| `shape`         | 形状，可选值 `square`（方形）/ `circle`（圆形）                                       | `string`               | `'square'` |
| `placement`     | 指示器位置，可选值 `left` / `right`                                                   | `string`               | `'left'`   |
| `activeColor`   | 选中状态下的颜色，应用到所有子 checkbox                                               | `string`               | 主题色     |
| `inactiveColor` | 未选中状态的边框颜色，应用到所有子 checkbox                                           | `string`               | `''`       |
| `size`          | 整体尺寸，可选值 `small` / `default` / `large` 或自定义数值                           | `string \| number`     | `''`       |
| `width`         | 每个 checkbox 占 CheckboxGroup 的宽度，数值按 375 稿 px 处理，`'auto'` 表示不设置宽度 | `UnitValue`            | `'auto'`   |
| `wrap`          | 是否每个 checkbox 都换行                                                              | `boolean`              | `false`    |
| `iconSize`      | 勾选图标的大小，单位 px（375 稿）                                                     | `UnitValue`            | `''`       |
| `labelSize`     | 标签文字大小，单位 px（375 稿）                                                       | `UnitValue`            | `''`       |
| `labelColor`    | 标签文字颜色，应用到所有子 checkbox                                                   | `string`               | `''`       |
| `border`        | 是否为每个 checkbox 绘制行分隔线（组内最后一项不绘制）                                | `boolean`              | `false`    |
| `maxText`       | 超过 `max` 时的提示文案，支持 `{n}` 占位符                                            | `string`               | 语言包     |
| `minText`       | 少于 `min` 时的提示文案，支持 `{n}` 占位符                                            | `string`               | 语言包     |

#### Events

| 事件名              | 说明                         | 参数                          |
| ------------------- | ---------------------------- | ----------------------------- |
| `update:modelValue` | 选中值数组更新（v-model）    | `value: (string \| number)[]` |
| `change`            | 任一 checkbox 状态变化时触发 | `value: (string \| number)[]` |

#### Slots

| 名称      | 说明          |
| --------- | ------------- |
| `default` | 放置 Checkbox |

#### Methods

| 方法                     | 说明                                                         | 返回值                 |
| ------------------------ | ------------------------------------------------------------ | ---------------------- |
| `toggleAll(options?)`    | 批量切换，`options` 可为布尔值或 `{ checked, skipDisabled }` | 提交后的数组           |
| `setAllChecked(checked)` | 全选 / 全不选，等价于 `toggleAll(checked)`                   | 提交后的数组           |
| `getSelectedValues()`    | 取当前选中值副本                                             | `(string \| number)[]` |
| `validateSelection()`    | 当前是否还能继续选择（未禁用且未达 `max`）                   | `boolean`              |
| `getChildrenCount()`     | 已注册的子项数量                                             | `number`               |

#### Expose

| 属性/方法       | 说明                                 | 类型      |
| --------------- | ------------------------------------ | --------- |
| `selectedCount` | 当前选中数量                         | `number`  |
| `isFull`        | 是否已达 `max`                       | `boolean` |
| `isEmpty`       | 是否一个都没选                       | `boolean` |
| `isMinReached`  | 是否已达 `min`（此时已选项不可取消） | `boolean` |

### Checkbox

#### Props

| 参数            | 说明                                                            | 类型                | 默认值       |
| --------------- | --------------------------------------------------------------- | ------------------- | ------------ |
| `customStyle`   | 根节点自定义样式                                                | `StyleValue`        | `{}`         |
| `customClass`   | 根节点自定义类名                                                | `string`            | `''`         |
| `label`         | 展示标签文本                                                    | `string`            | `''`         |
| `name`          | 数据项名称或唯一标识                                            | `string \| number`  | `''`         |
| `shape`         | 形状，可选值 `square`（方形）/ `circle`（圆形），未设置时继承组 | `string`            | `square`     |
| `modelValue`    | 是否选中，支持 v-model（独立模式）                              | `boolean`           | `false`      |
| `disabled`      | 是否禁用，未设置时继承组                                        | `string \| boolean` | `''`         |
| `labelDisabled` | 是否禁止点击标签选中，未设置时继承组                            | `string \| boolean` | `''`         |
| `activeColor`   | 选中颜色，设置后覆盖父级 `activeColor`                          | `string`            | 主题色       |
| `inactiveColor` | 未选中边框颜色，设置后覆盖父级 `inactiveColor`                  | `string`            | `''`         |
| `iconSize`      | 勾选图标的大小，单位 px（375 稿），未设置时按 `size` 预设       | `UnitValue`         | 按 size 预设 |
| `labelSize`     | 标签文字大小，单位 px（375 稿），未设置时按 `size` 预设         | `UnitValue`         | 按 size 预设 |
| `labelColor`    | 标签文字颜色，设置后覆盖父级 `labelColor`                       | `string`            | `''`         |
| `size`          | 整体尺寸，可选值 `small` / `default` / `large` 或自定义数值     | `string \| number`  | 继承组与表单 |
| `placement`     | 指示器位置，可选值 `left` / `right`，未设置时继承组             | `string`            | `left`       |
| `border`        | 是否显示行分隔线，未设置时继承组（组内最后一项不绘制）          | `string \| boolean` | `''`         |
| `indeterminate` | 半选状态，仅影响展示，优先级高于选中态                          | `boolean`           | `false`      |

#### Events

| 事件名              | 说明         | 参数      |
| ------------------- | ------------ | --------- |
| `update:modelValue` | 选中状态更新 | `checked` |
| `change`            | 选中状态变化 | `checked` |

#### Slots

| 名称      | 说明                         |
| --------- | ---------------------------- |
| `default` | 标签内容，不传时显示 `label` |

#### Expose

| 属性         | 说明                              | 类型               |
| ------------ | --------------------------------- | ------------------ |
| `isChecked`  | 当前是否选中                      | `boolean`          |
| `isDisabled` | 是否禁用（不含数量上下限锁定）    | `boolean`          |
| `isLocked`   | 是否因 `min` / `max` 暂时不可操作 | `boolean`          |
| `value`      | 数据项标识符                      | `string \| number` |

## 无障碍

- 根节点渲染 `role="checkbox"` 与 `aria-checked`（半选时为 `mixed`），`disabled` 时同步 `aria-disabled` 并从 Tab 序列移除。
- 焦点态下 `Enter` / `Space` 与点击等价；焦点环由组件库主题的 `focus-visible` 样式统一提供。
- 达到 `min` / `max` 的锁定项仍可聚焦，触发时会以提示文案说明原因，而不是静默失败。

## 主题变量

| 变量                        | 用途                   |
| --------------------------- | ---------------------- |
| `--snake-color-primary`     | 默认选中颜色           |
| `--snake-color-border`      | 未选中和禁用边框       |
| `--snake-color-divider`     | 行分隔线颜色           |
| `--snake-color-disabled-bg` | 禁用状态背景与图标颜色 |
| `--snake-color-text`        | 标签文字颜色           |
| `--snake-color-text-muted`  | 禁用与锁定态的标签颜色 |

`activeColor`、`inactiveColor`、`labelColor` 会覆盖当前实例或分组的默认主题色。

## 类型定义

```ts
import type {
    CheckboxGroupProps,
    CheckboxGroupExpose,
    CheckboxToggleAllOptions,
    CheckboxProps,
    CheckboxEmits,
    CheckboxExpose,
    CheckboxPlacement
} from '@puresnake/snake-ui';
```
