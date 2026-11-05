---
preview: /pages/componentsA/input/index
description: 使用 Snake UI Input 采集文本、数字和密码，支持格式化、清空、插槽与 Form 校验联动。
---

# Input 输入框

基于 uni-app input，支持清空、密码显示、格式化、前后插槽和 Form 校验联动。

## 使用建议

Input 适合单行内容。多行输入使用 [Textarea](/components/textarea)，结构化选择优先使用 Select、Calendar 等选择组件，避免让用户手工输入可枚举值。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-input v-model="value" border="surround" clearable prefix-icon="search" placeholder="请输入内容" />
<snake-input v-model="password" type="password" show-password border="surround" />
```

中文、日文等输入法处于候选组合阶段时不会提前同步半成品内容；组合结束后再更新 `v-model` 并触发表单校验。

## 格式化与确认键

`formatter` 应为同步且无副作用的函数；需要在每次输入时格式化使用 `format-trigger="input"`，仅在失焦时整理内容使用 `blur`。异步校验交给 Form 规则处理。

```vue
<snake-input
    v-model="phone"
    type="number"
    confirm-type="done"
    :formatter="value => value.replace(/\D/g, '').slice(0, 11)"
    format-trigger="input"
    @confirm="submit"
/>
```

## 无障碍

- 在 `FormItem` 中提供明确的 `label`，不要只依赖 placeholder 表达字段含义。
- 根据内容设置 `type`、`confirm-type` 和长度限制，让软键盘与输入预期一致。
- 校验失败时保留具体错误信息，并让用户能够回到对应字段修正。

## API

### Props

| 参数               | 说明                                                                                         | 类型               | 默认值       |
| ------------------ | -------------------------------------------------------------------------------------------- | ------------------ | ------------ |
| `modelValue`       | 输入框的值（v-model）                                                                        | `string \| number` | `''`         |
| `type`             | 输入类型，可选值 `text` / `number` / `idcard` / `digit` / `password`（密码遮罩）/ `nickname` | `InputType`        | `text`       |
| `placeholder`      | 占位文本                                                                                     | `string`           | `请输入内容` |
| `placeholderStyle` | 占位文本样式，仅支持 color、font-size、font-weight                                           | `string`           | `''`         |
| `placeholderColor` | 占位文本颜色                                                                                 | `string`           | 主题占位色   |
| `maxlength`        | 最大输入长度                                                                                 | `number`           | `140`        |
| `clearable`        | 是否显示清空按钮（聚焦且有内容时）                                                           | `boolean`          | `false`      |
| `showPassword`     | 是否显示密码可见切换图标                                                                     | `boolean`          | `false`      |
| `prefixIcon`       | 前置图标名称                                                                                 | `string`           | `''`         |
| `suffixIcon`       | 后置图标名称                                                                                 | `string`           | `''`         |
| `border`           | 边框模式，可选值 `none`（无边框）/ `surround`（全边框）/ `bottom`（底部线）                  | `string`           | `none`       |
| `shape`            | 形状，可选值 `square`（小圆角）/ `circle`（胶囊）                                            | `string`           | `square`     |
| `size`             | 尺寸，可选值 `small` / `default` / `large`；在 Form 内未设置时跟随 Form                      | `string`           | `default`    |
| `color`            | 文字颜色                                                                                     | `string`           | 主题文字色   |
| `fontSize`         | 文字大小，数值按 px（375 稿）处理                                                            | `UnitValue`        | `14`         |
| `inputAlign`       | 内容对齐方式，可选值 `left` / `center` / `right`                                             | `string`           | `left`       |
| `disabled`         | 是否禁用                                                                                     | `boolean`          | `false`      |
| `readonly`         | 是否只读                                                                                     | `boolean`          | `false`      |
| `disabledColor`    | 禁用状态的背景色                                                                             | `string`           | 主题禁用底色 |
| `formatter`        | 输入格式化函数，应为同步且无副作用                                                           | `Function`         | -            |
| `formatTrigger`    | 格式化时机，可选值 `input` / `blur`                                                          | `string`           | `input`      |
| `trim`             | 失焦时是否去除首尾空格                                                                       | `boolean`          | `false`      |
| `focus`            | 是否自动获取焦点                                                                             | `boolean`          | `false`      |
| `cursor`           | 聚焦时的光标位置                                                                             | `number`           | `-1`         |
| `selectionStart`   | 光标起始位置，需与 `selectionEnd` 搭配使用                                                   | `number`           | `-1`         |
| `selectionEnd`     | 光标结束位置，需与 `selectionStart` 搭配使用                                                 | `number`           | `-1`         |
| `confirmType`      | 键盘右下角按钮文字，可选值 `done` / `go` / `next` / `search` / `send`                        | `string`           | `done`       |
| `confirmHold`      | 点击确认键后是否保持键盘不收起                                                               | `boolean`          | `false`      |
| `adjustPosition`   | 键盘弹起时是否自动上推页面                                                                   | `boolean`          | `true`       |
| `holdKeyboard`     | 聚焦时点击页面是否保持键盘不收起                                                             | `boolean`          | `false`      |
| `cursorSpacing`    | 光标与键盘的距离，单位 px                                                                    | `number`           | `0`          |
| `customClass`      | 根节点自定义类名                                                                             | `string`           | `''`         |
| `customStyle`      | 根节点自定义样式                                                                             | `StyleValue`       | `''`         |

### Events

| 事件名                 | 说明               | 参数             |
| ---------------------- | ------------------ | ---------------- |
| `update:modelValue`    | 值更新（v-model）  | `value: string`  |
| `input`                | 输入时触发         | `value: string`  |
| `change`               | 失焦且值变化后触发 | `value: string`  |
| `focus`                | 获得焦点           | 原生事件         |
| `blur`                 | 失去焦点           | 原生事件         |
| `confirm`              | 点击键盘确认键     | `(value, event)` |
| `clear`                | 点击清空按钮       | -                |
| `click`                | 点击组件           | 原生事件         |
| `keyboardheightchange` | 键盘高度变化       | 原生事件         |

### Slots

| 名称     | 说明               |
| -------- | ------------------ |
| `prefix` | 替换输入框前置图标 |
| `suffix` | 替换输入框后置图标 |

## 主题变量

Input 复用全局主题令牌：

| 变量                        | 用途                      |
| --------------------------- | ------------------------- |
| `--snake-color-text`        | 输入文字颜色              |
| `--snake-color-text-light`  | 占位文字颜色              |
| `--snake-color-text-muted`  | 操作图标颜色              |
| `--snake-color-disabled-bg` | 禁用背景色                |
| `--snake-color-divider`     | 默认边框颜色              |
| `--snake-color-primary`     | 聚焦边框颜色              |
| `--snake-color-error`       | 校验失败边框颜色          |
| `--snake-radius-md`         | `surround` 模式的圆角大小 |

## 类型定义

```ts
import type { InputProps, InputEmits } from '@puresnake/snake-ui';
```
