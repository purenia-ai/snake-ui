---
name: 'input'
description: 'Snake UI Input 输入框参考。处理 input、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['input', 'snake-input', 'Input', '输入框']
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

## 尺寸与主题

`size` 同时决定容器高度、字号与清除/密码图标大小（此前只改高度、字号固定 14px）：

| `size`    | 高度 | 字号 | 图标 |
| --------- | ---- | ---- | ---- |
| `small`   | 32px | 13px | 14px |
| `default` | 40px | 14px | 16px |
| `large`   | 48px | 16px | 18px |

优先级从低到高：`size` 档位 → CSS 变量 → `height` / `fontSize` 属性。放在 FormItem 内且未显式传 `size` 时跟随 Form 的尺寸。

```vue
<snake-input v-model="value" size="large" border="surround" />
<snake-input v-model="value" :height="56" border="surround" />
<snake-input v-model="value" border="surround" custom-class="my-input" />
<!-- .my-input { --snake-input-height: 56px; --snake-input-font-size: 16px; --snake-input-radius: 14px } -->
```

## 清除与字数

清除按钮默认**有内容就显示**，失焦后也能一键清空；需要「仅聚焦时显示」时设置 `clear-trigger="focus"`。`show-word-limit` 配合 `maxlength` 在输入框右侧显示 `已输入/上限`，字数按字符计数，emoji 与生僻字只算一个。

```vue
<snake-input v-model="keyword" clearable placeholder="失焦后仍可清空" />
<snake-input v-model="keyword" clearable clear-trigger="focus" placeholder="仅聚焦时显示清除按钮" />
<snake-input v-model="code" show-word-limit :maxlength="6" placeholder="最多 6 位" />
```

点击清除会派发 `update:modelValue` / `input` / `change` / `clear`，点击图标不会冒泡成根节点的 `click`。

## 只读与点击

`readonly` 时原生输入框不可编辑，点击会**整块转发**成 `click`（原生控件被 `disabled` 后会吞掉点击，小程序端尤其明显，因此用透明遮罩承接）。常见用法是「点输入框打开选择器」。

```vue
<snake-input v-model="address" readonly placeholder="点击选择收货地址" @click="openAddressPicker" />
```

`disabled` 是彻底禁用：不再派发 `click`，清除与字数统计也会隐藏。需要外部强制错误态（不走 Form 校验）时传 `error`。

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

| 参数               | 说明                                                                                          | 类型                | 默认值       |
| ------------------ | --------------------------------------------------------------------------------------------- | ------------------- | ------------ |
| `modelValue`       | 输入框的值（v-model）                                                                         | `string \| number`  | `''`         |
| `type`             | 输入类型，可选值 `text` / `number` / `idcard` / `digit` / `password`（密码遮罩）/ `nickname`  | `InputType`         | `text`       |
| `placeholder`      | 占位文本                                                                                      | `string`            | `请输入内容` |
| `placeholderStyle` | 占位文本样式，仅支持 color、font-size、font-weight                                            | `string`            | `''`         |
| `placeholderClass` | 占位文本样式类名，需要在页面或全局样式中定义                                                  | `string`            | `''`         |
| `customInputClass` | 输入框本体的附加类名                                                                          | `string`            | `''`         |
| `placeholderColor` | 占位文本颜色                                                                                  | `string`            | 主题占位色   |
| `maxlength`        | 最大输入长度                                                                                  | `number`            | `140`        |
| `clearable`        | 是否显示清空按钮                                                                              | `boolean`           | `false`      |
| `clearTrigger`     | 清空按钮显示时机，可选值 `always`（有内容即显示）/ `focus`（仅聚焦时）                        | `InputClearTrigger` | `always`     |
| `showWordLimit`    | 是否在右侧显示字数统计，需同时设置 `maxlength`                                                | `boolean`           | `false`      |
| `error`            | 是否强制显示错误态边框                                                                        | `boolean`           | `false`      |
| `showPassword`     | 是否显示密码可见切换图标                                                                      | `boolean`           | `false`      |
| `prefixIcon`       | 前置图标名称                                                                                  | `string`            | `''`         |
| `suffixIcon`       | 后置图标名称                                                                                  | `string`            | `''`         |
| `border`           | 边框模式，可选值 `none`（无边框）/ `surround`（全边框）/ `bottom`（底部线）                   | `string`            | `none`       |
| `shape`            | 形状，可选值 `square`（小圆角）/ `circle`（胶囊）                                             | `string`            | `square`     |
| `size`             | 尺寸档位，可选值 `small` / `default` / `large`，同时决定高度、字号与图标大小；不传时跟随 Form | `string`            | `default`    |
| `height`           | 容器高度，数值按 px（375 稿）处理；覆盖 `size` 档位高度                                       | `UnitValue`         | -            |
| `color`            | 文字颜色                                                                                      | `string`            | 主题文字色   |
| `fontSize`         | 文字大小，数值按 px（375 稿）处理；不传时跟随 `size` 档位（13 / 14 / 16）                     | `UnitValue`         | -            |
| `inputAlign`       | 内容对齐方式，可选值 `left` / `center` / `right`                                              | `string`            | `left`       |
| `disabled`         | 是否禁用（禁用后不再派发 `click`）                                                            | `boolean`           | `false`      |
| `readonly`         | 是否只读（不可编辑，点击整块派发 `click`，适合打开选择器）                                    | `boolean`           | `false`      |
| `disabledColor`    | 禁用状态的背景色                                                                              | `string`            | 主题禁用底色 |
| `formatter`        | 输入格式化函数，应为同步且无副作用                                                            | `Function`          | -            |
| `formatTrigger`    | 格式化时机，可选值 `input` / `blur`                                                           | `string`            | `input`      |
| `trim`             | 失焦时是否去除首尾空格                                                                        | `boolean`           | `false`      |
| `focus`            | 是否自动获取焦点                                                                              | `boolean`           | `false`      |
| `cursor`           | 聚焦时的光标位置                                                                              | `number`            | `-1`         |
| `selectionStart`   | 光标起始位置，需与 `selectionEnd` 搭配使用                                                    | `number`            | `-1`         |
| `selectionEnd`     | 光标结束位置，需与 `selectionStart` 搭配使用                                                  | `number`            | `-1`         |
| `confirmType`      | 键盘右下角按钮文字，可选值 `done` / `go` / `next` / `search` / `send`                         | `string`            | `done`       |
| `confirmHold`      | 点击确认键后是否保持键盘不收起                                                                | `boolean`           | `false`      |
| `adjustPosition`   | 键盘弹起时是否自动上推页面                                                                    | `boolean`           | `true`       |
| `holdKeyboard`     | 聚焦时点击页面是否保持键盘不收起                                                              | `boolean`           | `false`      |
| `cursorSpacing`    | 光标与键盘的距离，单位 px                                                                     | `number`            | `0`          |
| `customClass`      | 根节点自定义类名                                                                              | `string`            | `''`         |
| `customStyle`      | 根节点自定义样式                                                                              | `StyleValue`        | `''`         |

### Events

| 事件名                 | 说明                                                   | 参数             |
| ---------------------- | ------------------------------------------------------ | ---------------- |
| `update:modelValue`    | 值更新（v-model）                                      | `value: string`  |
| `input`                | 输入时触发                                             | `value: string`  |
| `change`               | 失焦且值变化后触发                                     | `value: string`  |
| `focus`                | 获得焦点                                               | 原生事件         |
| `blur`                 | 失去焦点                                               | 原生事件         |
| `confirm`              | 点击键盘确认键                                         | `(value, event)` |
| `clear`                | 点击清空按钮                                           | -                |
| `click`                | 点击组件（`readonly` 时由遮罩转发，`disabled` 不派发） | 原生事件         |
| `keyboardheightchange` | 键盘高度变化                                           | 原生事件         |

### Slots

| 名称     | 说明               |
| -------- | ------------------ |
| `prefix` | 替换输入框前置图标 |
| `suffix` | 替换输入框后置图标 |

### Expose

| 方法    | 说明                                                                  |
| ------- | --------------------------------------------------------------------- |
| `focus` | 聚焦输入框，`disabled` / `readonly` 时不生效                          |
| `blur`  | 让输入框失焦并收起键盘                                                |
| `clear` | 清空输入内容，有值时同步派发 `update:modelValue` / `input` / `change` |

```vue
<snake-input ref="inputRef" v-model="code" :maxlength="6" />

<script setup lang="ts">
import { ref } from 'vue';
import type { InputExpose } from '@puresnake/snake-ui';

const inputRef = ref<InputExpose>();
inputRef.value?.focus();
inputRef.value?.clear();
</script>
```

## 主题变量

### 尺寸变量

`size` 档位与 `height` / `fontSize` 之外，还可以直接用变量改尺寸（变量优先级低于 `height` / `fontSize` 属性）：

| 变量名                          | 用途                         | 默认值         |
| ------------------------------- | ---------------------------- | -------------- |
| `--snake-input-height`          | 默认高度                     | `40px`         |
| `--snake-input-height-small`    | `size="small"` 高度          | `32px`         |
| `--snake-input-height-large`    | `size="large"` 高度          | `48px`         |
| `--snake-input-font-size`       | 默认字号                     | `14px`         |
| `--snake-input-font-size-small` | `size="small"` 字号          | `13px`         |
| `--snake-input-font-size-large` | `size="large"` 字号          | `16px`         |
| `--snake-input-radius`          | 圆角（`circle` 除外）        | 主题圆角       |
| `--snake-input-border-color`    | `surround` / `bottom` 边框色 | 主题分割线     |
| `--snake-input-bg`              | 容器底色                     | `transparent`  |
| `--snake-input-icon-color`      | 前后图标与操作图标颜色       | 主题次要文字色 |
| `--snake-input-count-color`     | 字数统计颜色                 | 主题次要文字色 |

### 颜色变量

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
import type { InputProps, InputEmits, InputExpose, InputClearTrigger } from '@puresnake/snake-ui';
```
