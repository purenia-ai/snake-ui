---
name: 'radio'
description: 'Snake UI Radio 单选框参考。处理 radio、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['radio', 'snake-radio', 'Radio', '单选框']
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

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 radio 的占宽（数值按 375 稿 px 处理，也可写 `"120px"`、`"50%"`），`wrap` 让每个 radio 单独占一行。

## 初始值与禁用项

将组的 `v-model` 初始化为某个 `name` 即可预选。禁用单项不会影响其他选项；点击已选中的项不会清空选择，也不会再次触发 `change`。

```vue
<snake-radio-group v-model="delivery">
  <snake-radio name="express">快递配送</snake-radio>
  <snake-radio name="pickup" disabled>到店自提</snake-radio>
</snake-radio-group>
```

## 列表形态

设置 `placement="right"` 把指示器移到文字右侧，配合 `wrap` 与 `border` 得到设置列表式的逐行样式；`inactiveColor`、`labelColor`、`labelSize` 可在组上统一设置，也可在单项上覆盖：

```vue
<snake-radio-group v-model="layout" wrap border placement="right" inactive-color="#c0c4cc">
  <snake-radio name="list" border>列表视图</snake-radio>
  <snake-radio name="grid" border>网格视图</snake-radio>
  <snake-radio name="compact" border>紧凑视图</snake-radio>
</snake-radio-group>
```

`border` 只绘制相邻行之间的分隔线：组内最后一项不绘制，单项显式设置 `border` 时按设置绘制。

## 尺寸与颜色

`size` 接受 `small` / `default` / `large`，也可直接给数值：盒子取该数值，勾号与字号按默认档比例等比推导（勾号约为盒子的 0.59，字号约为 0.82）。

```vue
<snake-radio-group v-model="size" :active-color="'#2563eb'">
  <snake-radio name="small" size="small">small</snake-radio>
  <snake-radio name="custom" :size="22">自定义 22</snake-radio>
  <snake-radio name="large" size="large">large</snake-radio>
</snake-radio-group>
```

## API

### RadioGroup

#### Props

| 参数            | 说明                                                                                   | 类型               | 默认值     |
| --------------- | -------------------------------------------------------------------------------------- | ------------------ | ---------- |
| `customStyle`   | 根节点自定义样式                                                                       | `StyleValue`       | `''`       |
| `customClass`   | 根节点自定义类名                                                                       | `string`           | `''`       |
| `disabled`      | 是否禁用所有 radio                                                                     | `boolean`          | `false`    |
| `modelValue`    | 当前选中的 name（v-model），等于某个 radio 的 `name` 时该项选中                        | `string \| number` | `''`       |
| `activeColor`   | 选中状态下的颜色，应用到所有子 radio                                                   | `string`           | 主题色     |
| `inactiveColor` | 未选中状态的边框颜色，应用到所有子 radio                                               | `string`           | `''`       |
| `size`          | 整体尺寸，可选值 `small` / `default` / `large`，也可传自定义数值                       | `string \| number` | `''`       |
| `labelDisabled` | 是否禁止点击标签选中                                                                   | `boolean`          | `false`    |
| `shape`         | 形状，可选值 `square`（方形）/ `circle`（圆形）                                        | `string`           | `'circle'` |
| `placement`     | 指示器位置，可选值 `left` / `right`                                                    | `string`           | `'left'`   |
| `iconSize`      | 勾选图标的大小，单位 px（375 稿）                                                      | `UnitValue`        | `''`       |
| `width`         | 每个 radio 占 snake-radio-group 的宽度，数值按 375 稿 px 处理，`'auto'` 表示不设置宽度 | `UnitValue`        | `'auto'`   |
| `wrap`          | 是否每个 radio 都换行                                                                  | `boolean`          | `false`    |
| `labelSize`     | 标签文字大小，单位 px（375 稿）                                                        | `UnitValue`        | `''`       |
| `labelColor`    | 标签文字颜色，应用到所有子 radio                                                       | `string`           | `''`       |
| `border`        | 是否为每个 radio 绘制行分隔线（组内最后一项不绘制）                                    | `boolean`          | `false`    |

#### Events

| 事件名              | 说明                  | 参数      |
| ------------------- | --------------------- | --------- |
| `update:modelValue` | 选中值更新（v-model） | 最新 name |
| `change`            | 任一个 radio 状态变化 | 最新 name |

#### Slots

默认插槽放置 Radio。

#### Expose

| 属性/方法       | 说明                                         | 类型     |
| --------------- | -------------------------------------------- | -------- |
| `getData()`     | 取子项读取的级联配置快照                     | `object` |
| `setValue(val)` | 设置选中值，会派发 `change` 并触发表单项校验 | `void`   |

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
| `activeColor`   | 选中颜色，设置后覆盖父级 `activeColor`                           | `string`            | 主题色       |
| `inactiveColor` | 未选中边框颜色，设置后覆盖父级 `inactiveColor`                   | `string`            | `''`         |
| `iconSize`      | 勾选图标的大小，单位 px（375 稿），未设置时按 `size` 预设        | `UnitValue`         | 按 size 预设 |
| `labelSize`     | 标签文字的大小，单位 px（375 稿），未设置时按 `size` 预设        | `UnitValue`         | 按 size 预设 |
| `labelColor`    | 标签文字颜色，设置后覆盖父级 `labelColor`                        | `string`            | `''`         |
| `size`          | 整体尺寸，可选值 `small` / `default` / `large`，也可传自定义数值 | `string \| number`  | 继承 Group   |
| `placement`     | 指示器位置，可选值 `left` / `right`，未设置时继承 Group          | `string`            | `left`       |
| `border`        | 是否显示行分隔线，未设置时继承 Group（组内最后一项不绘制）       | `string \| boolean` | `''`         |

#### Events

| 事件名   | 说明                                                                     | 参数      |
| -------- | ------------------------------------------------------------------------ | --------- |
| `change` | radio 从未选中变为选中时触发，携带当前 radio 的 name；点击已选中项不触发 | 最新 name |

#### Slots

| 名称      | 说明                         |
| --------- | ---------------------------- |
| `default` | 标签内容，不传时显示 `label` |

#### Expose

| 属性         | 说明         | 类型               |
| ------------ | ------------ | ------------------ |
| `isChecked`  | 当前是否选中 | `boolean`          |
| `isDisabled` | 是否禁用     | `boolean`          |
| `value`      | 数据项标识符 | `string \| number` |

## 无障碍

- 组根节点渲染 `role="radiogroup"`，子项渲染 `role="radio"` 与 `aria-checked`，`disabled` 时同步 `aria-disabled` 并从 Tab 序列移除。
- 焦点态下 `Enter` / `Space` 与点击等价；`disabled` 的单项不会获得焦点。
- 单选没有「取消选中」语义：再次点击已选项不派发 `change`，也不会把组值清空。

## 主题变量

| 变量                        | 用途                   |
| --------------------------- | ---------------------- |
| `--snake-color-primary`     | 默认选中颜色           |
| `--snake-color-border`      | 未选中和禁用边框       |
| `--snake-color-divider`     | 行分隔线颜色           |
| `--snake-color-disabled-bg` | 禁用状态背景与图标颜色 |
| `--snake-color-text`        | 标签文字颜色           |
| `--snake-color-text-muted`  | 禁用态标签颜色         |

`activeColor`、`inactiveColor`、`labelColor` 会覆盖当前实例或分组的默认主题色。

## 类型定义

```ts
import type {
    RadioGroupProps,
    RadioGroupExpose,
    RadioProps,
    RadioEmits,
    RadioExpose,
    RadioPlacement
} from '@puresnake/snake-ui';
```
