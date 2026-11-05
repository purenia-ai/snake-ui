---
preview: /pages/componentsA/radio/index
---

# Radio 单选框

`RadioGroup` 与 `Radio` 成对使用：容器管理一组互斥的单选值、禁用状态、颜色与布局，`Radio` 通过 `name` 参与互斥选择。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-radio-group v-model="flavor">
  <snake-radio name="sweet">鲜甜</snake-radio>
  <snake-radio name="spicy">香辣</snake-radio>
  <snake-radio name="mild">清淡</snake-radio>
</snake-radio-group>
```

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 radio 的占宽（如 `width="120px"`），`wrap` 让每个 radio 单独占一行。

## 初始值与禁用项

将组的 `v-model` 初始化为某个 `name` 即可预选。禁用单项不会影响其他选项；点击已选中的项不会清空选择，也不会再次触发 `change`。

```vue
<snake-radio-group v-model="delivery">
  <snake-radio name="express">快递配送</snake-radio>
  <snake-radio name="pickup" disabled>到店自提</snake-radio>
</snake-radio-group>
```

## API

### RadioGroup

#### Props

| 参数            | 说明                                                             | 类型               | 默认值     |
| --------------- | ---------------------------------------------------------------- | ------------------ | ---------- |
| `customStyle`   | 根节点自定义样式                                                 | `StyleValue`       | `{}`       |
| `customClass`   | 根节点自定义类名                                                 | `string`           | `''`       |
| `disabled`      | 是否禁用所有 radio                                               | `boolean`          | `false`    |
| `modelValue`    | 当前选中的 name（v-model），等于某个 radio 的 `name` 时该项选中  | `string \| number` | `''`       |
| `activeColor`   | 选中状态下的颜色，应用到所有子 radio                             | `string`           | 主题色     |
| `size`          | 整体尺寸，可选值 `small` / `default` / `large`，也可传自定义数值 | `string \| number` | `''`       |
| `labelDisabled` | 是否禁止点击标签选中                                             | `boolean`          | `false`    |
| `shape`         | 形状，可选值 `square`（方形）/ `circle`（圆形）                  | `string`           | `'circle'` |
| `iconSize`      | 勾选图标的大小，单位 px（375 稿）                                | `UnitValue`        | `''`       |
| `width`         | 每个 radio 占 snake-radio-group 的宽度，需带单位                 | `UnitValue`        | `'auto'`   |
| `wrap`          | 是否每个 radio 都换行                                            | `boolean`          | `false`    |

#### Events

| 事件名              | 说明                  | 参数      |
| ------------------- | --------------------- | --------- |
| `update:modelValue` | 选中值更新（v-model） | 最新 name |
| `change`            | 任一个 radio 状态变化 | 最新 name |

#### Slots

默认插槽放置 Radio。

### Radio

#### Props

| 参数            | 说明                                                             | 类型                | 默认值       |
| --------------- | ---------------------------------------------------------------- | ------------------- | ------------ |
| `customStyle`   | 根节点自定义样式                                                 | `StyleValue`        | `{}`         |
| `customClass`   | 根节点自定义类名                                                 | `string`            | `''`         |
| `label`         | 展示标签文本，插槽有内容时被覆盖                                 | `string`            | `''`         |
| `name`          | 数据项标识符，等于 Group 的 `v-model` 时选中                     | `string \| number`  | `''`         |
| `shape`         | 形状，可选值 `square`（方形）/ `circle`（圆形）                  | `string`            | 继承 Group   |
| `disabled`      | 是否禁用，未设置时继承 Group                                     | `string \| boolean` | `false`      |
| `labelDisabled` | 是否禁止点击标签选中，未设置时继承 Group                         | `string \| boolean` | `false`      |
| `activeColor`   | 选中颜色，设置后覆盖父级 activeColor                             | `string`            | 主题色       |
| `iconSize`      | 勾选图标的大小，单位 px（375 稿）                                | `UnitValue`         | 按 size 预设 |
| `labelSize`     | 标签文字的大小，单位 px（375 稿）                                | `UnitValue`         | 按 size 预设 |
| `size`          | 整体尺寸，可选值 `small` / `default` / `large`，也可传自定义数值 | `string \| number`  | 继承 Group   |

#### Events

`change(name)` — radio 从未选中变为选中时触发，携带当前 radio 的 name。点击已选中项不触发。

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

```ts
import type { RadioGroupProps, RadioProps, RadioEmits } from '@puresnake/snake-ui';
```
