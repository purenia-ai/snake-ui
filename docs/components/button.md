---
preview: /pages/componentsA/button
---

# Button 按钮

正式操作按钮，支持多主题、尺寸、胶囊形态、加载、图标、水波纹、点击节流、表单行为和小程序开放能力。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-button type="primary">主要按钮</snake-button>
<snake-button type="success" plain>朴素按钮</snake-button>
<snake-button size="small" shape="circle" icon="checkmark">完成</snake-button>
<snake-button loading loading-text="提交中" loading-mode="spinner" />
<snake-button disabled>不可操作</snake-button>
```

`type` 支持 `default`、`primary`、`success`、`info`、`warning`、`error`；`size` 支持 `large`、`default`、`medium`、`small`、`mini`。

## 小程序开放能力

```vue
<snake-button open-type="getPhoneNumber" @getphonenumber="receivePhone">获取手机号</snake-button>
<snake-button form-type="submit">提交表单</snake-button>
```

开放能力仅在对应平台生效。禁用或加载时会移除 `open-type`，避免重复授权。

## API

### Props

| 参数                                              | 说明                   | 类型                               | 默认值              |
| ------------------------------------------------- | ---------------------- | ---------------------------------- | ------------------- |
| `text`                                            | 无默认插槽时显示的文字 | `string`                           | `''`                |
| `type`                                            | 主题类型               | `string`                           | `default`           |
| `size`                                            | 按钮尺寸               | `string`                           | `default`           |
| `shape`                                           | `square` 或 `circle`   | `string`                           | `square`            |
| `plain` / `hairLine`                              | 朴素样式 / 细边框      | `boolean`                          | `false` / `true`    |
| `disabled` / `loading`                            | 禁用 / 加载状态        | `boolean`                          | `false`             |
| `loadingText` / `loadingMode` / `loadingSize`     | 加载文字、形态和尺寸   | `string / string / number\|string` | `'' / circle / 18`  |
| `icon` / `iconColor`                              | 前置图标与颜色         | `string`                           | `''`                |
| `color`                                           | 自定义主题色           | `string`                           | `''`                |
| `ripple` / `rippleBgColor`                        | 水波纹开关与颜色       | `boolean / string`                 | `false`             |
| `throttleTime`                                    | 点击节流时间，单位 ms  | `number \| string`                 | `0`                 |
| `formType` / `openType`                           | uni-app 原生按钮能力   | `string`                           | `''`                |
| `hoverClass` / `hoverStartTime` / `hoverStayTime` | 原生按压反馈参数       | `string / number / number`         | 自动 / `20` / `150` |
| `customClass` / `customStyle`                     | 自定义类名与样式       | `string / style`                   | `''`                |

其余开放能力参数包括 `scope`、`appParameter`、`hoverStopPropagation`、`lang`、`sessionFrom`、`sendMessageTitle`、`sendMessagePath`、`sendMessageImg`、`showMessageCard` 和 `dataName`。

## Events 与 Slots

普通点击触发 `click(event)`。平台开放能力可触发 `getuserinfo`、`contact`、`getphonenumber`、`error`、`launchapp`、`opensetting`、`chooseavatar`、`agreeprivacyauthorization`。默认插槽用于按钮内容。

源码：`src/uni_modules/snake-ui/components/snake-button/snake-button.vue`
