---
preview: /pages/componentsA/textarea/index
---

# Textarea 文本域

用于多行文本输入，支持固定或自适应高度、字数统计和 Form 校验联动。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-textarea v-model="intro" :maxlength="200" count :height="90" />
```

中文、日文等输入法处于候选组合阶段时，组件只更新内部显示；组合结束后才同步 `v-model` 并触发表单 `change` 校验，避免半成品拼音造成误校验。

## API

### Props

| 参数               | 说明                                                                                | 类型                               | 默认值       |
| ------------------ | ----------------------------------------------------------------------------------- | ---------------------------------- | ------------ |
| `modelValue`       | 双向绑定的当前值（v-model）                                                         | `string \| number`                 | `''`         |
| `placeholder`      | 输入为空时的占位文本                                                                | `string`                           | `请输入内容` |
| `placeholderStyle` | 占位文本样式                                                                        | `string`                           | `''`         |
| `maxlength`        | 允许输入的最大字符数                                                                | `number`                           | `140`        |
| `height`           | 组件高度                                                                            | `UnitValue`                        | `60`         |
| `autoHeight`       | 是否随内容自适应高度                                                                | `boolean`                          | `false`      |
| `fixed`            | 是否使用固定定位，textarea 位于 `position: fixed` 区域内时使用                      | `boolean`                          | `false`      |
| `count`            | 是否显示字数统计                                                                    | `boolean`                          | `false`      |
| `disabled`         | 是否禁用交互                                                                        | `boolean`                          | `false`      |
| `readonly`         | 是否只读                                                                            | `boolean`                          | `false`      |
| `size`             | 尺寸，可选值 `small` / `default` / `large`；未设置时跟随 FormItem，兜底为 `default` | `FormSize`                         | -            |
| `border`           | 边框模式，可选值 `none`（无边框）/ `surround`（全边框）/ `bottom`（底部线）         | `'none' \| 'surround' \| 'bottom'` | `surround`   |
| `color`            | 输入文字颜色                                                                        | `string`                           | 主题文字色   |
| `placeholderColor` | 占位文本颜色                                                                        | `string`                           | 主题占位色   |
| `fontSize`         | 文字尺寸，数值按 px（375 稿）处理                                                   | `UnitValue`                        | `14`         |
| `focus`            | 是否自动获取焦点                                                                    | `boolean`                          | `false`      |
| `cursor`           | 输入框光标位置                                                                      | `number`                           | `-1`         |
| `selectionStart`   | 文本选择区域的起始位置，需与 `selectionEnd` 搭配使用                                | `number`                           | `-1`         |
| `selectionEnd`     | 文本选择区域的结束位置，需与 `selectionStart` 搭配使用                              | `number`                           | `-1`         |
| `confirmType`      | 键盘右下角确认按钮类型                                                              | `string`                           | `return`     |
| `confirmHold`      | 确认输入后是否保持键盘弹出                                                          | `boolean`                          | `false`      |
| `adjustPosition`   | 键盘弹起时是否自动调整页面位置                                                      | `boolean`                          | `true`       |
| `holdKeyboard`     | 点击页面时是否保持键盘弹出                                                          | `boolean`                          | `false`      |
| `cursorSpacing`    | 光标与键盘的距离，单位 px                                                           | `number`                           | `0`          |
| `showConfirmBar`   | 是否显示键盘上方带"完成"按钮的栏（iOS）                                             | `boolean`                          | `true`       |
| `customClass`      | 根节点自定义类名                                                                    | `string`                           | `''`         |
| `customStyle`      | 根节点自定义样式                                                                    | `StyleValue`                       | `''`         |

### Events

| 事件名                 | 说明               | 参数             |
| ---------------------- | ------------------ | ---------------- |
| `update:modelValue`    | 值更新（v-model）  | `value: string`  |
| `input`                | 输入时触发         | `value: string`  |
| `change`               | 失焦且值变化后触发 | `value: string`  |
| `focus`                | 获得焦点           | 原生事件         |
| `blur`                 | 失去焦点           | 原生事件         |
| `confirm`              | 点击键盘确认键     | `(value, event)` |
| `linechange`           | 行数变化           | 原生事件         |
| `keyboardheightchange` | 键盘高度变化       | 原生事件         |

## 主题变量

| 变量名                      | 说明             |
| --------------------------- | ---------------- |
| `--snake-color-text`        | 输入文字颜色     |
| `--snake-color-text-light`  | 占位文字颜色     |
| `--snake-color-text-muted`  | 字数统计颜色     |
| `--snake-color-divider`     | 默认边框颜色     |
| `--snake-color-primary`     | 聚焦边框颜色     |
| `--snake-color-error`       | 校验失败边框颜色 |
| `--snake-color-disabled-bg` | 禁用状态背景色   |
| `--snake-radius-md`         | 容器圆角         |
