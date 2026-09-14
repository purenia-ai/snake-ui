---
preview: /pages/componentsA/input/index
---

# Input 输入框

基于 uni-app input，支持清空、密码显示、格式化、前后插槽和 Form 校验联动。

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

## API

### Props

| 参数                                                    | 说明                                                  | 类型                            | 默认值            |
| ------------------------------------------------------- | ----------------------------------------------------- | ------------------------------- | ----------------- |
| `modelValue`                                            | v-model 值                                            | `string \| number`              | `''`              |
| `type` / `password`                                     | text/number/idcard/digit/password/nickname 与密码模式 | `string \| boolean`             | `text`            |
| `placeholder` / `placeholderStyle` / `placeholderColor` | 占位内容和样式                                        | `string`                        | 主题默认值        |
| `maxlength` / `clearable` / `showPassword`              | 最大长度、清空和密码切换                              | `number \| boolean`             | `140` / `false`   |
| `prefixIcon` / `suffixIcon`                             | 前后图标                                              | `string`                        | `''`              |
| `border` / `shape` / `size`                             | none/surround/bottom、square/circle、尺寸             | `string`                        | `none` / `square` |
| `disabled` / `readonly`                                 | 禁用和只读                                            | `boolean`                       | `false`           |
| `formatter` / `formatTrigger` / `trim`                  | 格式化函数、input/blur 时机、失焦去空格               | `function \| string \| boolean` | -                 |
| `focus` / `cursor` / `selectionStart` / `selectionEnd`  | 焦点与光标选择                                        | `boolean \| number`             | 原生默认值        |
| `confirmType` / `confirmHold` / `holdKeyboard`          | 键盘确认配置                                          | `string \| boolean`             | `done` / `false`  |
| `adjustPosition` / `cursorSpacing`                      | 键盘避让                                              | `boolean \| number`             | `true` / `0`      |
| `customClass` / `customStyle`                           | 自定义类名和样式                                      | `string \| style`               | `''`              |

### Events

| 事件名                                   | 说明                   | 参数             |
| ---------------------------------------- | ---------------------- | ---------------- |
| `update:modelValue` / `input` / `change` | 值更新、输入和失焦确认 | `value`          |
| `focus` / `blur`                         | 获取或失去焦点         | 原生事件         |
| `confirm`                                | 点击键盘确认           | `(value, event)` |
| `clear` / `click`                        | 清空、点击组件         | - / event        |
| `keyboardheightchange`                   | 键盘高度变化           | 原生事件         |

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

从包根导入 `InputProps` 与 `InputEmits`。`formatter` 应保持同步且无副作用，异步校验交给 Form 规则处理。
