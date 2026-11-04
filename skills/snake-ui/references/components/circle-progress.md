---
name: 'circle-progress'
description: 'Snake UI CircleProgress 环形进度条参考。处理 circle-progress、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['circle-progress', 'snake-circle-progress', 'CircleProgress', '环形进度条']
---

# CircleProgress 环形进度条

canvas 绘制的环形进度条：中心天然透明、弧端默认圆头，可放置在任意背景（含渐变与图片）上。微信小程序端使用 canvas 2d 并按像素比缩放保证清晰，其余端使用旧版 canvas 接口。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-circle-progress :percent="68">
    <text class="score">68%</text>
</snake-circle-progress>
```

中心内容通过默认插槽自定义，可以是文字、图标或任意组合。

## 方向与端点

```vue
<!-- 逆时针（仍从 12 点方向起笔） -->
<snake-circle-progress :percent="40" :clockwise="false" />
<!-- 平头端点 -->
<snake-circle-progress :percent="80" line-cap="butt" />
```

`percent` 会被钳制在 0–100；进度、颜色、线宽变化会立即重画。颜色经 canvas 绘制，不支持 CSS 变量：传入 `var()` 表达式时取其中的回退色值，需要跟随主题时请直接传具体色值。

## API

### Props

| 参数            | 说明                              | 类型                            | 默认值                  |
| --------------- | --------------------------------- | ------------------------------- | ----------------------- |
| `percent`       | 进度百分比，数值 0-100            | `number \| string`              | `0`                     |
| `width`         | 圆环直径，数值按 px（375 稿）处理 | `number \| string`              | `100`                   |
| `borderWidth`   | 线条宽度，数值按 px（375 稿）处理 | `number \| string`              | `8`                     |
| `activeColor`   | 激活弧颜色                        | `string`                        | `--snake-color-primary` |
| `inactiveColor` | 底环颜色                          | `string`                        | `--snake-color-divider` |
| `lineCap`       | 弧端形状                          | `'round' \| 'butt' \| 'square'` | `'round'`               |
| `clockwise`     | 是否顺时针                        | `boolean`                       | `true`                  |

### Slots

| 名称    | 说明           |
| ------- | -------------- |
| default | 中心自定义内容 |

## 主题变量

| 变量名                  | 说明           |
| ----------------------- | -------------- |
| `--snake-color-primary` | 激活弧默认颜色 |
| `--snake-color-divider` | 底环默认颜色   |
