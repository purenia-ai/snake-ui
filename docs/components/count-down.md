---
preview: /pages/componentsA/countDown/index
---

# CountDown 倒计时

用于活动截止等场景的倒计时，通过数字变化给用户明确的时间感受，提示用户进行某行为操作。支持天/时/分/秒显示开关、冒号与中文单位分隔符、数字块样式定制，以及暂停、继续与重设。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-count-down :timestamp="86400" />
```

`timestamp` 单位为秒；组件挂载后自动开始，开始与每秒更新时触发 `change`（参数为剩余秒数），归零时触发一次 `end`。

## 显示单位与折算

```vue
<snake-count-down :timestamp="93784" separator="zh" />
<snake-count-down :timestamp="93784" :show-days="false" />
<snake-count-down :timestamp="93784" :show-days="false" :show-hours="false" />
```

- `separator="colon"` 用英文冒号连接，`separator="zh"` 在每个数字后追加中文单位（天/时/分/秒，英文环境下为 d/h/m/s）。
- 关掉某一级后，它的数值会折算给下一级，不会丢时间：关掉天后天数累加到小时（`26:03:04`），再关掉小时后小时数继续累加到分钟（`1563:04`）。
- `hide-zero-day` 只在天数为 0 时隐藏天部分，不影响其它单位。
- 隐藏中间某一级（如保留天和秒、只关掉小时）属于非常规组合，折算后该级的数值会出现在下一级字段里。

## 计时精度

组件内部记录的是**结束时刻**，每秒用当前时间反推剩余时间，而不是「每次减一」。页面切到后台、小程序定时器被节流或 H5 标签页休眠后，下一轮的差值会自动追平，长时间运行也不会累积误差。

业务侧要保证传入的 `timestamp` 本身准确。拿到的是服务端截止时间戳时，先算剩余秒数再传入，并在页面重新进入时重算：

```ts
const remaining = Math.max(0, Math.floor((endAt - Date.now()) / 1000));
```

## 运行控制

`autoplay="false"` 时组件不会自己开始，`timestamp` 变化也只更新展示；如需按新时长重来，调用 `reset()`。

```vue
<snake-count-down ref="countdownRef" :timestamp="3600" :autoplay="false" />
<snake-button @click="countdownRef?.start()">开始</snake-button>
<snake-button @click="countdownRef?.pause()">暂停</snake-button>
<snake-button @click="countdownRef?.reset()">重设</snake-button>
```

暂停会保留剩余时间，再次 `start()` 从这里续上；`end()` 会归零并触发 `end`，`destroy()` 只停表不动显示。完整方法列表见 [Expose](#expose)。

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
| `height`         | 数字块高度（宽度不小于该值），单位 px（375 稿）          | `number \| string` | `auto`     |
| `showBorder`     | 是否显示数字边框                                         | `boolean`          | `false`    |
| `borderColor`    | 数字边框颜色                                             | `string`           | 主题文字色 |
| `showSeconds`    | 是否显示秒                                               | `boolean`          | `true`     |
| `showMinutes`    | 是否显示分钟；关闭后分钟数折算到秒                       | `boolean`          | `true`     |
| `showHours`      | 是否显示小时；关闭后小时数折算到分钟                     | `boolean`          | `true`     |
| `showDays`       | 是否显示天；关闭后天数折算到小时                         | `boolean`          | `true`     |
| `hideZeroDay`    | 天数为 0 时是否隐藏天部分                                | `boolean`          | `false`    |

### Events

| 事件名   | 触发时机                    | 参数     |
| -------- | --------------------------- | -------- |
| `change` | 开始计时及每秒更新剩余时间  | 剩余秒数 |
| `end`    | 倒计时归零或调用 `end()` 时 | -        |

### Expose

| 方法        | 说明                                   |
| ----------- | -------------------------------------- |
| `start()`   | 开始倒计时；暂停后从剩余时间继续       |
| `pause()`   | 暂停倒计时，保留剩余时间               |
| `reset()`   | 重设到 `timestamp`，按 `autoplay` 起表 |
| `end()`     | 提前结束并触发 `end` 事件              |
| `destroy()` | 主动停止倒计时，不触发 `end` 事件      |

## 类型定义

```ts
import type { CountDownProps, CountDownEmits, CountDownExpose } from '@puresnake/snake-ui';
```

## 主题变量

| 变量名                  | 说明                   |
| ----------------------- | ---------------------- |
| `--snake-color-text`    | 数字、分隔符和边框颜色 |
| `--snake-color-surface` | 数字块背景色           |
