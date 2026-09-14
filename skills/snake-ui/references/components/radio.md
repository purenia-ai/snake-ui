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

布局通过 `width` 与 `wrap` 控制：`width` 指定每个 radio 的占宽（如 `width="240rpx"`），`wrap` 让每个 radio 单独占一行。

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

| 参数                          | 说明                         | 类型               | 默认值     |
| ----------------------------- | ---------------------------- | ------------------ | ---------- |
| `modelValue`                  | 当前选中的 name              | `string \| number` | `''`       |
| `disabled`                    | 全组禁用                     | `boolean`          | `false`    |
| `activeColor`                 | 选中状态下的颜色             | `string`           | 主题色     |
| `size`                        | 整体尺寸 small/default/large | `string`           | `''`       |
| `labelDisabled`               | 是否禁止点击标签选中         | `boolean`          | `false`    |
| `shape`                       | circle/square 形状           | `string`           | `'circle'` |
| `iconSize`                    | 勾号大小，单位 rpx           | `UnitValue`        | `''`       |
| `width`                       | 每个 radio 占组宽度          | `UnitValue`        | `'auto'`   |
| `wrap`                        | 是否每个 radio 都换行        | `boolean`          | `false`    |
| `customClass` / `customStyle` | 自定义类名和样式             | `string \| style`  | `''`       |

#### Events

`update:modelValue` 和 `change` 均返回最新 name。

#### Slots

默认插槽放置 Radio。

### Radio

#### Props

| 参数                          | 说明                                             | 类型               | 默认值       |
| ----------------------------- | ------------------------------------------------ | ------------------ | ------------ |
| `label`                       | 展示标签文本                                     | `string`           | `''`         |
| `value` / `name`              | 兼容旧 API 的值 / 数据项标识，`value` 非空时优先 | `string \| number` | `''`         |
| `shape`                       | circle/square 形状                               | `string`           | 继承 Group   |
| `disabled` / `labelDisabled`  | 禁用 / 禁止点击标签选中                          | `boolean`          | `false`      |
| `activeColor`                 | 选中颜色，设置后覆盖父级 activeColor             | `string`           | 主题色       |
| `iconSize` / `labelSize`      | 勾号与标签字号，单位 rpx                         | `UnitValue`        | 按 size 预设 |
| `size`                        | 整体尺寸 small/default/large                     | `string`           | 继承 Group   |
| `customClass` / `customStyle` | 自定义类名和样式                                 | `string \| style`  | `''`         |

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

从包根导入 `RadioGroupProps`、`RadioProps` 与 `RadioEmits`。
