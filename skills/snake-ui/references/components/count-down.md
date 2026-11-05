---
name: 'count-down'
description: 'Snake UI CountDown 倒计时参考。处理 count-down、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['count-down', 'snake-count-down', 'CountDown', '倒计时']
---

# CountDown 倒计时

用于活动截止等场景的倒计时，通过数字变化给用户明确的时间感受，提示用户进行某行为操作。支持时分秒显示开关、冒号与中文单位分隔符、数字块样式定制。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-count-down :timestamp="86400" />
```

`timestamp` 单位为秒；组件挂载后自动开始，每秒触发一次 `change`（参数为剩余秒数），归零时触发 `end`。

## 显示控制与样式

```vue
<snake-count-down
    :timestamp="86400"
    separator="zh"
    :show-days="false"
    :show-border="true"
    border-color="#06D290"
    color="#06D290"
    bg-color="rgba(6, 210, 144, 0.08)"
    height="28"
/>
```

- `separator="colon"` 用英文冒号连接，`separator="zh"` 在每个数字后追加中文单位（天/时/分/秒，英文环境下为 d/h/m/s）。
- `show-days="false"` 时天数折算进小时；`hide-zero-day` 在天数为 0 时隐藏天部分。
- `height` 同时设置数字块的宽高；`show-border` 打开数字边框。
- `autoplay="false"` 时不自动开始，通过 ref 调用 `start()`；`end()` 可提前结束。

## 服务端截止时间

业务通常拿到的是截止时间戳，应先在页面计算剩余秒数再传入，避免将毫秒直接传给 `timestamp`。页面重新进入时重新计算，可避免后台停留造成显示不准。

```ts
const remaining = Math.max(0, Math.floor((endAt - Date.now()) / 1000));
```

## API

### Props

| 参数             | 说明                                                     | 类型               | 默认值     |
| ---------------- | -------------------------------------------------------- | ------------------ | ---------- |
| `customClass`    | 根节点自定义类名                                         | `string`           | `''`       |
| `customStyle`    | 根节点自定义样式                                         | `StyleValue`       | `''`       |
| `timestamp`      | 倒计时剩余秒数                                           | `number \| string` | `0`        |
| `autoplay`       | 是否挂载后自动开始倒计时                                 | `boolean`          | `true`     |
| `separator`      | 分隔符形态，可选值 `colon`（英文冒号）/ `zh`（中文单位） | `string`           | `colon`    |
| `separatorSize`  | 分隔符大小，单位 px（375 稿）                            | `number \| string` | `15`       |
| `separatorColor` | 分隔符颜色                                               | `string`           | 主题文字色 |
| `color`          | 倒计时数字颜色                                           | `string`           | 主题文字色 |
| `fontSize`       | 倒计时数字大小，单位 px（375 稿）                        | `number \| string` | `15`       |
| `bgColor`        | 倒计时数字背景颜色                                       | `string`           | 主题表面色 |
| `height`         | 数字块高度（宽度同值），单位 px（375 稿）                | `number \| string` | `auto`     |
| `showBorder`     | 是否显示数字边框                                         | `boolean`          | `false`    |
| `borderColor`    | 数字边框颜色                                             | `string`           | 主题文字色 |
| `showSeconds`    | 是否显示秒                                               | `boolean`          | `true`     |
| `showMinutes`    | 是否显示分钟                                             | `boolean`          | `true`     |
| `showHours`      | 是否显示小时                                             | `boolean`          | `true`     |
| `showDays`       | 是否显示天                                               | `boolean`          | `true`     |
| `hideZeroDay`    | 天数为 0 时是否隐藏天部分                                | `boolean`          | `false`    |

### Events

| 事件名   | 触发时机         | 参数     |
| -------- | ---------------- | -------- |
| `change` | 每秒更新剩余时间 | 剩余秒数 |
| `end`    | 倒计时归零或结束 | -        |

### Expose

| 方法        | 说明                              |
| ----------- | --------------------------------- |
| `start()`   | 开始或继续倒计时                  |
| `end()`     | 提前结束当前倒计时                |
| `destroy()` | 主动停止倒计时，不触发 `end` 事件 |

## 类型定义

```ts
import type { CountDownProps, CountDownEmits, CountDownExpose } from '@puresnake/snake-ui';
```

## 主题变量

| 变量名                  | 说明                   |
| ----------------------- | ---------------------- |
| `--snake-color-text`    | 数字、分隔符和边框颜色 |
| `--snake-color-surface` | 数字块背景色           |
