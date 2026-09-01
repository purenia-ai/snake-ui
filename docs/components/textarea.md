---
preview: /pages/componentsA/textarea/index
---

# Textarea 文本域

用于多行文本输入，支持固定或自适应高度、字数统计和 Form 校验联动。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-textarea v-model="intro" :maxlength="200" count :height="180" />
```

中文、日文等输入法处于候选组合阶段时，组件只更新内部显示；组合结束后才同步 `v-model` 并触发表单 `change` 校验，避免半成品拼音造成误校验。

## API

### Props

| 参数                                                   | 说明                   | 类型                   | 默认值                      |
| ------------------------------------------------------ | ---------------------- | ---------------------- | --------------------------- |
| `modelValue` / `placeholder` / `maxlength`             | 值、占位和最大长度     | `string \| number`     | `''` / `请输入内容` / `140` |
| `height` / `autoHeight` / `fixed`                      | 高度、自适应和固定区域 | `UnitValue \| boolean` | `120` / `false`             |
| `count`                                                | 显示字数统计           | `boolean`              | `false`                     |
| `disabled` / `readonly`                                | 禁用和只读             | `boolean`              | `false`                     |
| `border` / `size` / `fontSize`                         | 边框、尺寸和字号       | `string \| UnitValue`  | `surround`                  |
| `focus` / `cursor` / `selectionStart` / `selectionEnd` | 焦点和光标             | `boolean \| number`    | 原生默认值                  |
| `confirmType` / `confirmHold` / `showConfirmBar`       | 键盘确认栏             | `string \| boolean`    | `return` / `false` / `true` |
| `adjustPosition` / `holdKeyboard` / `cursorSpacing`    | 键盘行为               | `boolean \| number`    | 原生默认值                  |
| `customClass` / `customStyle`                          | 自定义类名和样式       | `string \| style`      | `''`                        |

### Events

| 事件名                                   | 说明                   | 参数             |
| ---------------------------------------- | ---------------------- | ---------------- |
| `update:modelValue` / `input` / `change` | 值更新、输入和失焦确认 | `value`          |
| `focus` / `blur` / `linechange`          | 焦点和行数变化         | 原生事件         |
| `confirm`                                | 键盘确认               | `(value, event)` |
| `keyboardheightchange`                   | 键盘高度变化           | 原生事件         |

源码：`src/uni_modules/snake-ui/components/snake-textarea/snake-textarea.vue`
