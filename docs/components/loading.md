---
preview: /pages/componentsA/loading/index
---

# Loading 加载

用于按钮、图片和页面中的加载反馈，支持圆环、旋转条、跳动点和波浪四种形态。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-loading />
<snake-loading type="spinner" direction="horizontal" color="#06D290" :size="28" text="加载中" />
<snake-loading type="dots">正在提交</snake-loading>
```

## API

### Props

| 参数           | 说明                                                                                       | 类型               | 默认值     |
| -------------- | ------------------------------------------------------------------------------------------ | ------------------ | ---------- |
| `show`         | 是否显示                                                                                   | `boolean`          | `true`     |
| `type`         | 加载形态，可选值 `circular`（圆环）/ `spinner`（旋转条）/ `dots`（跳动点）/ `wave`（波浪） | `LoadingType`      | `circular` |
| `color`        | 图标颜色                                                                                   | `string`           | 主题色     |
| `size`         | 图标尺寸，数值按 px（375 稿）处理                                                          | `number \| string` | `17`       |
| `text`         | 默认文字                                                                                   | `string`           | `''`       |
| `textColor`    | 文字颜色                                                                                   | `string`           | 次要文字色 |
| `textSize`     | 文字大小，数值按 px（375 稿）处理                                                          | `number \| string` | `12`       |
| `direction`    | 图标与文字排列方向，可选值 `horizontal`（水平）/ `vertical`（垂直）                        | `LoadingDirection` | `vertical` |
| `inheritColor` | 是否继承父级颜色                                                                           | `boolean`          | `false`    |
| `duration`     | 动画周期，单位 ms                                                                          | `number`           | `800`      |
| `customClass`  | 根节点自定义类名                                                                           | `string`           | `''`       |
| `customStyle`  | 根节点自定义样式                                                                           | `StyleValue`       | `''`       |

### Slots

| 名称      | 说明                            |
| --------- | ------------------------------- |
| `default` | 自定义加载文字，优先于 `text`。 |

## 主题变量

| 变量                       | 用途         |
| -------------------------- | ------------ |
| `--snake-color-primary`    | 默认图标颜色 |
| `--snake-color-text-muted` | 默认文字颜色 |
