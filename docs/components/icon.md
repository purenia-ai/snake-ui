---
preview: /pages/componentsA/icon/index
---

# Icon 图标

`snake-icon` 使用标准图标组件契约，支持内置字体图标、图片图标、标签及 DecimalIcon。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :--: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-icon name="photo" />
<snake-icon name="search" color="#2979ff" size="28" />
<snake-icon name="checkmark-circle" label="完成" label-pos="bottom" />
<snake-icon name="https://example.com/icon.png" width="40" height="40" />
```

`name` 中包含 `/` 时按图片图标渲染。自定义字体图标可通过 `custom-prefix` 指定字体类前缀。

## 图标集

<IconGallery />

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `name` | 图标名称或图片地址 | `string` | `''` |
| `color` | 图标颜色，可使用主题色名称 | `string` | `''` |
| `size` | 图标尺寸，数值单位为 rpx | `string \| number` | `inherit` |
| `bold` | 是否加粗 | `boolean` | `false` |
| `index` | 点击和触摸事件返回的标识 | `string \| number` | `''` |
| `hoverClass` | 按下时的样式类 | `string` | `''` |
| `customPrefix` | 自定义字体类前缀 | `string` | `sicon` |
| `label` / `labelPos` | 标签及其位置 | 多类型 | `''` / `right` |
| `labelSize` / `labelColor` | 标签字号及颜色 | 多类型 | `28` / 主题文本色 |
| `space` | 标签和图标的统一间距，优先于四向 margin | `string \| number` | `''` |
| `marginLeft` / `marginTop` / `marginRight` / `marginBottom` | 各标签方向的默认间距 | `string \| number` | `6` |
| `imgMode` / `width` / `height` | 图片图标参数 | 多类型 | `widthFix` / `''` / `''` |
| `top` | 垂直位置微调 | `string \| number` | `0` |
| `showDecimalIcon` | 是否显示部分填充图标 | `boolean` | `false` |
| `inactiveColor` / `percent` | DecimalIcon 底色及百分比 | 多类型 | 分割线色 / `50` |
| `customClass` / `customStyle` | 自定义类名和根节点样式 | 多类型 | 空值 |

### Events

`click` 和 `touchstart` 返回 `index`；未设置 `index` 时返回原始事件。

源码：`src/uni_modules/snake-ui/components/snake-icon/snake-icon.vue`
