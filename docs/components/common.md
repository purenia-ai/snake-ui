# 内置样式

Snake UI 的 `index.scss` 内置了一组常用布局工具类，适合页面中的少量、重复性布局。组件功能本身不依赖你主动使用这些类。

::: tip
使用 npm 时引入 `snake-ui/index.scss`；使用 `uni_modules` 时引入项目内对应的 `index.scss`。具体配置见[配置](/components/setting)。
:::

## 定位

```html
<view class=snake-relative>
    <view class=snake-absolute>绝对定位内容</view>
</view>
```

| 类名 | 样式 |
| --- | --- |
| `snake-relative`、`snake-rela` | `position: relative` |
| `snake-absolute`、`snake-abso` | `position: absolute` |

## 字号

语义字号包含 `snake-font-xs`、`snake-font-sm`、`snake-font-md`、`snake-font-lg` 和 `snake-font-xl`，对应 `22rpx`、`26rpx`、`28rpx`、`30rpx` 和 `34rpx`。

还可以使用数值形式：

- `snake-font-9` 至 `snake-font-19` 使用 `px`。
- `snake-font-20` 至 `snake-font-40` 使用 `rpx`。

```html
<text class=snake-font-sm>辅助文字</text>
<text class=snake-font-32>标题文字</text>

## Flex 布局

常用类包括：

- `snake-flex`：横向 Flex 并垂直居中。
- `snake-flex-center`：水平垂直居中。
- `snake-flex-col`：纵向 Flex。
- `snake-flex-wrap`、`snake-flex-nowrap`：换行或不换行。
- `snake-col-top`、`snake-col-center`、`snake-col-bottom`：垂直对齐。
- `snake-row-left`、`snake-row-center`、`snake-row-right`：水平对齐。
- `snake-row-between`、`snake-row-around`：分布方式。

子元素可以使用 `snake-flex-0` 至 `snake-flex-12` 设置 `flex` 值。

## 文字对齐与显隐

- `snake-text-left`、`snake-text-center`、`snake-text-right` 控制文字对齐。
- `snake-hidden` 同时设置 `opacity: 0` 和 `visibility: hidden`，仍会保留元素布局空间。

## 内外边距

间距数值范围为 `0` 至 `80rpx`，其中偶数和 5 的倍数可用。

- 四周外边距：`snake-margin-20`、`snake-m-20`。
- 四周内边距：`snake-padding-20`、`snake-p-20`。
- 指定方向外边距：`snake-margin-left-20`、`snake-m-l-20`。
- 指定方向内边距：`snake-padding-top-20`、`snake-p-t-20`。

方向缩写为 `l`、`t`、`r`、`b`。大面积视觉定制应使用主题变量或业务类名，参见[自定义样式](/guide/custom-style)。
```
