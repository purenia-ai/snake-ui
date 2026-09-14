---
preview: /pages/componentsA/link/index
---

# Link 超链接

超链接组件，不同平台有不同表现形式：App 平台通过内置浏览器打开，小程序把链接复制到粘贴板并提示，H5 中通过 `window.open` 打开链接。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-link href="https://example.com">打开链接</snake-link>
```

`defaultClick` 为 false 时点击只触发 `click` 事件并携带链接地址，由业务自行处理跳转。

小程序不会直接打开外部网页，而是复制链接并提示用户；需要站内跳转时关闭 `default-click`，在 `click` 中使用项目路由。

## API

### Props

| 参数           | 说明                         | 类型               | 默认值                  |
| -------------- | ---------------------------- | ------------------ | ----------------------- |
| `text`         | 超链接文字                   | `string \| number` | `''`                    |
| `color`        | 文字颜色                     | `string`           | `--snake-color-primary` |
| `fontSize`     | 字体大小，数值按 rpx 处理    | `string \| number` | `28`                    |
| `underLine`    | 是否显示下划线               | `boolean`          | `false`                 |
| `href`         | 要跳转的链接                 | `string`           | `''`                    |
| `mpTips`       | 小程序复制到粘贴板后的提示语 | `string`           | 语言包默认值            |
| `lineColor`    | 下划线颜色，默认同文字颜色   | `string`           | `''`                    |
| `defaultClick` | 是否默认点击跳转             | `boolean`          | `true`                  |

### Events

| 事件名  | 触发时机                     | 参数   |
| ------- | ---------------------------- | ------ |
| `click` | defaultClick 为 false 时点击 | `href` |

### Slots

| 名称    | 说明       |
| ------- | ---------- |
| default | 超链接内容 |

## 主题变量

| 变量名                  | 说明           |
| ----------------------- | -------------- |
| `--snake-color-primary` | 超链接默认颜色 |
