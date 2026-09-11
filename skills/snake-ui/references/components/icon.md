---
name: 'icon'
description: 'Snake UI Icon 图标参考。处理 icon、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['icon', 'snake-icon', 'Icon', '图标']
---

# Icon 图标

`snake-icon` 支持内置字体图标、图片图标、标签和百分比裁切效果。内置字体的类名前缀为 `sicon`，图标名称与下方图标集中的名称一一对应。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-icon name="photo" />
<snake-icon name="search" color="#2979ff" size="28" />
<snake-icon name="checkmark-circle" label="完成" label-pos="bottom" />
<snake-icon name="https://example.com/icon.png" width="40" height="40" />
```

`name` 中包含 `/` 时按图片图标渲染。字体图标会生成 `sicon-${name}` 类名，例如 `name="search"` 对应 `sicon-search`。自定义字体图标可通过 `custom-prefix` 指定字体类前缀。

## 图标集

<IconGallery />

## API

### Props

| 参数                                                        | 说明                                    | 类型               | 默认值                   |
| ----------------------------------------------------------- | --------------------------------------- | ------------------ | ------------------------ |
| `name`                                                      | 图标名称或图片地址                      | `string`           | `''`                     |
| `color`                                                     | 图标颜色，可使用主题色名称              | `string`           | `''`                     |
| `size`                                                      | 图标尺寸，数值单位为 rpx                | `string \| number` | `inherit`                |
| `bold`                                                      | 是否加粗                                | `boolean`          | `false`                  |
| `index`                                                     | 点击和触摸事件返回的标识                | `string \| number` | `''`                     |
| `hoverClass`                                                | 按下时的样式类                          | `string`           | `''`                     |
| `customPrefix`                                              | 自定义字体类前缀                        | `string`           | `sicon`                  |
| `label` / `labelPos`                                        | 标签及其位置                            | 多类型             | `''` / `right`           |
| `labelSize` / `labelColor`                                  | 标签字号及颜色                          | 多类型             | `28` / 主题文本色        |
| `space`                                                     | 标签和图标的统一间距，优先于四向 margin | `string \| number` | `''`                     |
| `marginLeft` / `marginTop` / `marginRight` / `marginBottom` | 各标签方向的默认间距                    | `string \| number` | `6`                      |
| `imgMode` / `width` / `height`                              | 图片图标参数                            | 多类型             | `widthFix` / `''` / `''` |
| `top`                                                       | 垂直位置微调                            | `string \| number` | `0`                      |
| `showDecimalIcon`                                           | 是否显示部分填充图标                    | `boolean`          | `false`                  |
| `inactiveColor` / `percent`                                 | 裁切图标的底色及填充百分比              | 多类型             | 分割线色 / `50`          |
| `customClass` / `customStyle`                               | 自定义类名和根节点样式                  | 多类型             | 空值                     |

### Events

| 事件名       | 触发时机 | 参数                        |
| ------------ | -------- | --------------------------- |
| `click`      | 点击图标 | `index`，未设置时为原始事件 |
| `touchstart` | 触摸开始 | `index`，未设置时为原始事件 |

## 主题变量

| 变量名                         | 说明                   |
| ------------------------------ | ---------------------- |
| `--snake-color-text-secondary` | 标签文字默认色         |
| `--snake-color-divider`        | DecimalIcon 未激活颜色 |
| `--snake-color-primary`        | primary 主题色         |
| `--snake-color-success`        | success 主题色         |
| `--snake-color-warning`        | warning 主题色         |
| `--snake-color-error`          | error 主题色           |
| `--snake-color-info`           | info 主题色            |
