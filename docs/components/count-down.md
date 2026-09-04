---
preview: /pages/componentsA/countDown/index
---

# CountDown 倒计时

用于活动截止等场景的倒计时，通过数字变化给用户明确的时间感受，提示用户进行某行为操作。支持时分秒显示开关、冒号与中文单位分隔符、数字块样式定制。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

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
  height="56" />
```

- `separator="colon"` 用英文冒号连接，`separator="zh"` 在每个数字后追加中文单位（天/时/分/秒，英文环境下为 d/h/m/s）。
- `show-days="false"` 时天数折算进小时；`hide-zero-day` 在天数为 0 时隐藏天部分。
- `height` 同时设置数字块的宽高；`show-border` 打开数字边框。
- `autoplay="false"` 时不自动开始，通过 ref 调用 `start()`；`end()` 可提前结束。

## API

| 参数                                                    | 说明                         | 类型               | 默认值                                        |
| ------------------------------------------------------- | ---------------------------- | ------------------ | --------------------------------------------- |
| `timestamp`                                             | 倒计时剩余秒数               | `number \| string` | `0`                                           |
| `autoplay`                                              | 挂载后自动开始               | `boolean`          | `true`                                        |
| `separator`                                             | 分隔符形态                   | `string`           | `colon`                                       |
| `separatorSize` / `separatorColor`                      | 分隔符大小与颜色             | `number \| string / string` | `30` / 主题文字色                    |
| `color` / `fontSize`                                    | 数字颜色与大小（rpx）        | `string / number \| string` | 主题文字色 / `30`                        |
| `bgColor` / `height`                                    | 数字背景与数字块宽高（rpx）  | `string / number \| string` | 主题表面色 / `auto`                        |
| `showBorder` / `borderColor`                            | 数字边框开关与颜色           | `boolean / string` | `false` / 主题文字色                          |
| `showDays` / `showHours` / `showMinutes` / `showSeconds` | 各部分显示开关               | `boolean`          | `true`                                        |
| `hideZeroDay`                                           | 天数为 0 时隐藏天部分        | `boolean`          | `false`                                       |
| `customClass` / `customStyle`                           | 自定义类名与样式             | `string / style`   | `''`                                          |

## Events 与 Slots

| 事件     | 说明                             |
| -------- | -------------------------------- |
| `change` | 每秒触发，参数为剩余秒数         |
| `end`    | 倒计时结束时触发                 |

无插槽；通过 ref 可调用 `start()` / `end()`。

## 类型定义

```ts
import type { SnakeCountDownProps, SnakeCountDownEmits, SnakeCountDownExpose } from 'snake-ui';
```

## 主题与无障碍

颜色默认走 `--snake-color-text` / `--snake-color-surface` token；数字变化不依赖视觉之外的提示。

源码：`src/uni_modules/snake-ui/components/snake-count-down/snake-count-down.vue`
