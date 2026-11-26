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

## 尺寸与高度

`size` 同时决定容器高度与字号：

| `size`    | 高度  | 字号 |
| --------- | ----- | ---- |
| `small`   | 64px  | 13px |
| `default` | 80px  | 14px |
| `large`   | 112px | 16px |

`height` 覆盖 `size` 高度，也可以比档位高度更小；`auto-height` 时高度由内容撑开，`height` 退化为最小高度。

```vue
<snake-textarea v-model="remark" size="large" />
<snake-textarea v-model="remark" :height="120" />
<snake-textarea v-model="remark" auto-height :height="60" placeholder="从 60px 起随内容长高" />
```

## 字数与格式化

`count` 配合 `maxlength` 显示 `已输入/上限`，**按字符计数**：emoji 与生僻字只算一个，不会被算成两个。

`formatter` 为同步无副作用的格式化函数，默认每次输入都会执行；格式化砍掉的字符会同步从输入框里清掉（不只是在 `v-model` 里消失）。只在失焦时整理内容用 `format-trigger="blur"`，去掉首尾空格用 `trim`。

```vue
<snake-textarea v-model="remark" count :maxlength="80" placeholder="最多 80 字" />
<snake-textarea v-model="code" :formatter="value => value.replace(/[^0-9a-z]/gi, '').toUpperCase()" />
<snake-textarea v-model="note" format-trigger="blur" trim placeholder="失焦时去空格" />
```

## 只读与点击

`readonly` 时文本域不可编辑，点击会整块转发成 `click`（原生控件被 `disabled` 后会吞掉点击，因此用透明遮罩承接），适合「点文本域打开编辑页」；`disabled` 是彻底禁用，不再派发 `click`。

```vue
<snake-textarea v-model="detail" readonly auto-height placeholder="点击编辑详情" @click="openEditor" />
```

## API

### Props

| 参数                    | 说明                                                                                  | 类型                               | 默认值       |
| ----------------------- | ------------------------------------------------------------------------------------- | ---------------------------------- | ------------ |
| `modelValue`            | 双向绑定的当前值（v-model）                                                           | `string \| number`                 | `''`         |
| `placeholder`           | 输入为空时的占位文本                                                                  | `string`                           | `请输入内容` |
| `placeholderStyle`      | 占位文本样式                                                                          | `string`                           | `''`         |
| `placeholderClass`      | 占位文本样式类名，需要在页面或全局样式中定义                                          | `string`                           | `''`         |
| `maxlength`             | 允许输入的最大字符数                                                                  | `number`                           | `140`        |
| `height`                | 组件高度，数值按 px（375 稿）处理；不传时跟随 size 档位（64 / 80 / 112）              | `UnitValue`                        | -            |
| `autoHeight`            | 是否随内容自适应高度                                                                  | `boolean`                          | `false`      |
| `fixed`                 | 是否使用固定定位，textarea 位于 `position: fixed` 区域内时使用                        | `boolean`                          | `false`      |
| `count`                 | 是否显示字数统计（按字符计数，emoji 与生僻字只算一个）                                | `boolean`                          | `false`      |
| `error`                 | 是否强制显示错误态边框                                                                | `boolean`                          | `false`      |
| `disabled`              | 是否禁用交互（禁用后不再派发 `click`）                                                | `boolean`                          | `false`      |
| `readonly`              | 是否只读（不可编辑，点击整块派发 `click`，适合打开编辑页）                            | `boolean`                          | `false`      |
| `size`                  | 尺寸档位，可选值 `small` / `default` / `large`，决定高度与字号；未设置时跟随 FormItem | `FormSize`                         | -            |
| `border`                | 边框模式，可选值 `none`（无边框）/ `surround`（全边框）/ `bottom`（底部线）           | `'none' \| 'surround' \| 'bottom'` | `surround`   |
| `color`                 | 输入文字颜色                                                                          | `string`                           | 主题文字色   |
| `placeholderColor`      | 占位文本颜色                                                                          | `string`                           | 主题占位色   |
| `fontSize`              | 文字尺寸，数值按 px（375 稿）处理；不传时跟随 `size` 档位（13 / 14 / 16）             | `UnitValue`                        | -            |
| `focus`                 | 是否自动获取焦点                                                                      | `boolean`                          | `false`      |
| `cursor`                | 输入框光标位置                                                                        | `number`                           | `-1`         |
| `selectionStart`        | 文本选择区域的起始位置，需与 `selectionEnd` 搭配使用                                  | `number`                           | `-1`         |
| `selectionEnd`          | 文本选择区域的结束位置，需与 `selectionStart` 搭配使用                                | `number`                           | `-1`         |
| `confirmType`           | 键盘右下角确认按钮类型                                                                | `string`                           | `return`     |
| `confirmHold`           | 确认输入后是否保持键盘弹出                                                            | `boolean`                          | `false`      |
| `adjustPosition`        | 键盘弹起时是否自动调整页面位置                                                        | `boolean`                          | `true`       |
| `holdKeyboard`          | 点击页面时是否保持键盘弹出                                                            | `boolean`                          | `false`      |
| `cursorSpacing`         | 光标与键盘的距离，单位 px                                                             | `number`                           | `0`          |
| `showConfirmBar`        | 是否显示键盘上方带"完成"按钮的栏（iOS）                                               | `boolean`                          | `true`       |
| `disableDefaultPadding` | 是否去掉 iOS 下 textarea 的默认内边距（仅微信小程序生效）                             | `boolean`                          | `false`      |
| `formatter`             | 内容格式化函数，应为同步且无副作用                                                    | `(value: string) => string`        | -            |
| `formatTrigger`         | 格式化时机，可选值 `input` / `blur`                                                   | `'input' \| 'blur'`                | `input`      |
| `trim`                  | 失焦时是否去除首尾空格                                                                | `boolean`                          | `false`      |
| `customClass`           | 根节点自定义类名                                                                      | `string`                           | `''`         |
| `customStyle`           | 根节点自定义样式                                                                      | `StyleValue`                       | `''`         |

### Events

| 事件名                 | 说明                                                   | 参数             |
| ---------------------- | ------------------------------------------------------ | ---------------- |
| `update:modelValue`    | 值更新（v-model）                                      | `value: string`  |
| `input`                | 输入时触发                                             | `value: string`  |
| `change`               | 失焦且值变化后触发                                     | `value: string`  |
| `focus`                | 获得焦点                                               | 原生事件         |
| `blur`                 | 失去焦点                                               | 原生事件         |
| `confirm`              | 点击键盘确认键                                         | `(value, event)` |
| `linechange`           | 行数变化                                               | 原生事件         |
| `keyboardheightchange` | 键盘高度变化                                           | 原生事件         |
| `clear`                | 调用 `clear()` 清空                                    | -                |
| `click`                | 点击组件（`readonly` 时由遮罩转发，`disabled` 不派发） | 原生事件         |

### Expose

| 方法    | 说明                                                              |
| ------- | ----------------------------------------------------------------- |
| `focus` | 聚焦文本域，`disabled` / `readonly` 时不生效                      |
| `blur`  | 让文本域失焦并收起键盘                                            |
| `clear` | 清空内容，有值时同步派发 `update:modelValue` / `input` / `change` |

```vue
<snake-textarea ref="textareaRef" v-model="remark" count :maxlength="80" />

<script setup lang="ts">
import { ref } from 'vue';
import type { TextareaExpose } from '@puresnake/snake-ui';

const textareaRef = ref<TextareaExpose>();
textareaRef.value?.focus();
textareaRef.value?.clear();
</script>
```

## 主题变量

### 尺寸变量

| 变量名                                 | 用途                                  | 默认值           |
| -------------------------------------- | ------------------------------------- | ---------------- |
| `--snake-textarea-height`              | 默认高度                              | `80px`           |
| `--snake-textarea-height-small`        | `size="small"` 高度                   | `64px`           |
| `--snake-textarea-height-large`        | `size="large"` 高度                   | `112px`          |
| `--snake-textarea-native-height`       | `auto-height` 时默认档位原生控件下限  | `47px`           |
| `--snake-textarea-native-height-small` | `auto-height` 时 `small` 原生控件下限 | `31px`           |
| `--snake-textarea-native-height-large` | `auto-height` 时 `large` 原生控件下限 | `79px`           |
| `--snake-textarea-font-size`           | 默认字号                              | `14px`           |
| `--snake-textarea-font-size-small`     | `small` 字号                          | `13px`           |
| `--snake-textarea-font-size-large`     | `large` 字号                          | `16px`           |
| `--snake-textarea-padding`             | 容器内边距                            | `10px 11px 21px` |
| `--snake-textarea-radius`              | 圆角                                  | 主题圆角         |
| `--snake-textarea-border-color`        | 边框颜色                              | 主题分割线       |
| `--snake-textarea-bg`                  | 容器底色                              | `transparent`    |
| `--snake-textarea-count-color`         | 字数统计颜色                          | 主题次要文字色   |

### 颜色变量

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
