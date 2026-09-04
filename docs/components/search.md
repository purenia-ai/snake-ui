---
preview: /pages/componentsA/search/index
---

# Search 搜索框

搜索组件，集成了常见搜索框所需功能，支持圆形/方形、清除控件、右侧操作按钮与聚焦动画，一键引入开箱即用。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-search v-model="keyword" placeholder="请输入关键字" @search="handleSearch" @clear="handleClear" />
```

## 形状与操作按钮

```vue
<!-- 方形 + 隐藏操作按钮 -->
<snake-search shape="square" :show-action="false" />
<!-- 聚焦时才展开操作按钮 -->
<snake-search animation action-text="搜索" />
```

`disabled` 为 true 时输入框不可编辑，点击组件会触发 `click`，通常用于跳转真正的搜索页。

## API

### Props

| 参数              | 说明                                     | 类型                    | 默认值                   |
| ----------------- | ---------------------------------------- | ----------------------- | ------------------------ |
| `shape`           | 搜索框形状                               | `round \| square`       | `round`                  |
| `bgColor`         | 搜索框背景色                             | `string`                | `--snake-color-surface-muted` |
| `placeholder`     | 占位提示文字                             | `string`                | 语言包默认值             |
| `clearabled`      | 是否启用清除控件                         | `boolean`               | `true`                   |
| `focus`           | 是否自动聚焦                             | `boolean`               | `false`                  |
| `showAction`      | 是否在右侧显示操作按钮                   | `boolean`               | `true`                   |
| `actionStyle`     | 右侧操作按钮样式                         | `object \| array`       | `{}`                     |
| `actionText`      | 右侧操作按钮文字                         | `string`                | 语言包默认值             |
| `inputAlign`      | 输入框内容水平对齐方式                   | `left \| center \| right` | `left`                |
| `disabled`        | 是否禁用输入框                           | `boolean`               | `false`                  |
| `animation`       | showAction 时是否聚焦才展开              | `boolean`               | `false`                  |
| `borderColor`     | 边框颜色，配置后才有边框                 | `string`                | `none`                   |
| `modelValue`      | 双向绑定的输入值                         | `string`                | `''`                     |
| `height`          | 搜索框高度，数值按 rpx 处理              | `number \| string`      | `64`                     |
| `inputStyle`      | 输入框样式，对象形式                     | `object \| array`       | `{}`                     |
| `maxlength`       | 输入框最大长度，-1 不限制                | `number \| string`      | `-1`                     |
| `searchIconColor` | 搜索图标颜色，默认同输入框字体颜色       | `string`                | `''`                     |
| `color`           | 输入框字体颜色                           | `string`                | `--snake-color-text-secondary` |
| `placeholderColor`| placeholder 的颜色                       | `string`                | `--snake-color-text-muted` |
| `margin`          | 与上下左右元素的间距                     | `string`                | `0`                      |
| `searchIcon`      | 左侧图标名称或图片路径                   | `string`                | `search`                 |
| `adjustPosition`  | 弹出键盘时是否自动调节高度               | `boolean`               | `true`                   |
| `customClass` / `customStyle` | 自定义类名和样式               | `string \| object \| array` | `''`               |

### Events

| 事件名            | 触发时机                       | 参数              |
| ----------------- | ------------------------------ | ----------------- |
| `update:modelValue` | 输入值变化                   | `value`           |
| `input` / `change`| 输入/内容变化                  | `value`           |
| `search`          | 用户确定搜索                   | `value`           |
| `custom`          | 点击右侧操作按钮               | `value`           |
| `clear`           | 点击清除按钮                   | -                 |
| `focus` / `blur`  | 输入框聚焦/失焦                | `value`           |
| `click`           | 禁用状态下点击搜索框           | -                 |

源码：`src/uni_modules/snake-ui/components/snake-search/snake-search.vue`
