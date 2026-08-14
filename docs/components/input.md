---
preview: /pages/componentsA/input
---

# Input 输入框

基于 uni-app input，支持清空、密码显示、格式化、前后插槽和 Form 校验联动。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-input v-model="value" border="surround" clearable prefix-icon="search" placeholder="请输入内容" />
<snake-input v-model="password" type="password" show-password border="surround" />
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

`prefix`、`suffix` 分别替换前后图标区域。

源码：`src/uni_modules/snake-ui/components/snake-input/snake-input.vue`
