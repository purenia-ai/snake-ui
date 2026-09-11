---
preview: /pages/componentsA/line/index
---

# Line 分隔线

用于分隔内容块的线条，支持横向与竖向两种方向、半像素细线以及实线/虚线/圆点样式。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-line />
<snake-line color="#06D290" margin="20rpx 0" />
```

## 方向与线型

```vue
<!-- 竖向线条，length 表现为高度 -->
<snake-line direction="col" length="80" />
<!-- 虚线 / 圆点 -->
<snake-line border-style="dashed" />
<snake-line border-style="dotted" />
```

`hairLine` 默认开启，通过 `transform: scaleY/scaleX(0.5)` 实现跨端一致的半像素细线。

## API

### Props

| 参数                          | 说明                                   | 类型                        | 默认值                 |
| ----------------------------- | -------------------------------------- | --------------------------- | ---------------------- |
| `color`                       | 线条颜色                               | `string`                    | `--snake-color-border` |
| `length`                      | 长度，竖向表现为高度，可为百分比或 rpx | `string`                    | `100%`                 |
| `direction`                   | 线条方向                               | `row \| col`                | `row`                  |
| `hairLine`                    | 是否显示半像素细线条                   | `boolean`                   | `true`                 |
| `margin`                      | 与上下左右元素的间距                   | `string`                    | `0`                    |
| `borderStyle`                 | 线条类型                               | `solid \| dashed \| dotted` | `solid`                |
| `customClass` / `customStyle` | 自定义类名和样式                       | `string \| object \| array` | `''`                   |

## 主题变量

| 变量名                 | 说明         |
| ---------------------- | ------------ |
| `--snake-color-border` | 分隔线默认色 |
