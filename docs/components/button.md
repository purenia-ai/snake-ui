---
preview: /pages/componentsA/button/index
---

# Button 按钮

正式操作按钮，支持多主题、尺寸、胶囊形态、加载、图标、水波纹、点击节流、表单行为和小程序开放能力。

## 何时使用

- 用于提交、保存、确认等明确操作；一个操作区只保留一个主要按钮。
- 异步请求开始后再设置 `loading`，避免用户在请求尚未发起时无法提交。
- 纯导航场景优先使用 `navigator`，不要把按钮当普通链接。

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
<snake-button type="info" :block="false">自适应宽度</snake-button>
```

`type` 支持 `default`、`primary`、`success`、`info`、`warning`、`error`；`size` 支持 `large`、`default`、`medium`、`small`、`mini`。

## 主题与镂空按钮

```vue
<snake-button type="primary">主要按钮</snake-button>
<snake-button type="success">成功按钮</snake-button>
<snake-button type="warning">警告按钮</snake-button>
<snake-button type="error">错误按钮</snake-button>

<snake-button type="primary" plain>主要镂空按钮</snake-button>
<snake-button type="success" plain>成功镂空按钮</snake-button>
```

`plain` 会使用当前主题的文字、边框和浅色背景；自定义 `color` 时使用该颜色 10% 透明度的浅底（非 hex 颜色回退到主题浅色 token），适合次要操作。一个操作区域应只保留一个高强调的实心主按钮。

## 分部件定制

根节点之外，可通过 `contentClass` / `contentStyle` 定制内容区（图标与文字的容器）。小程序端组件内部样式经编译带有属性选择器（特异性 0,2,0），页面工具类（0,1,0）无法覆盖，因此冲突样式请用 `contentStyle` 行内写法（行内样式始终优先），`contentClass` 用于语义类或非冲突样式：

```vue
<snake-button type="primary" content-style="gap: 8rpx; min-width: 120rpx">
  自定义内容区
</snake-button>
```

## 尺寸与形状

```vue
<snake-button size="large">大号按钮</snake-button>
<snake-button size="default">默认按钮</snake-button>
<snake-button size="medium">中号按钮</snake-button>
<snake-button size="small">小号按钮</snake-button>
<snake-button size="mini">迷你按钮</snake-button>
<snake-button shape="circle">胶囊按钮</snake-button>
```

`large` 和 `default` 默认占满父容器宽度；`medium`、`small` 和 `mini` 根据内容收缩，可放在支持换行的横向容器中。

## 图标与自定义颜色

```vue
<snake-button icon="checkmark">确认</snake-button>
<snake-button type="info" icon="search" icon-color="#fff">搜索</snake-button>
<snake-button color="#7c3aed">品牌按钮</snake-button>
<snake-button color="#f97316" plain>品牌镂空按钮</snake-button>
```

`color` 用于临时品牌色或业务色。需要全局统一时，应优先覆盖 `--snake-color-*` 主题变量。

## 水波纹

```vue
<snake-button ripple>点击任意位置</snake-button>
<snake-button ripple ripple-bg-color="rgba(255, 255, 255, .42)">
  自定义水波纹
</snake-button>
```

水波纹从用户实际按下的位置扩散，并自动计算覆盖整个按钮所需的尺寸。开启 `ripple` 后不再叠加原生 `hover-class` 反馈；无法获得触点信息的平台会从按钮中心扩散。

## 受控加载与防重复提交

```vue
<snake-button :loading="submitting" loading-text="提交中" :throttle-time="500" @click="submit">
  提交订单
</snake-button>
```

`disabled` 或 `loading` 时不会触发 `click`，小程序开放能力也会同步禁用。

## 小程序开放能力

```vue
<snake-button open-type="getPhoneNumber" @getphonenumber="receivePhone">获取手机号</snake-button>
<snake-button form-type="submit">提交表单</snake-button>
```

开放能力仅在对应平台生效。禁用或加载时会移除 `open-type`，避免重复授权。

## API

### Props

| 参数                                              | 说明                     | 类型                               | 默认值                               |
| ------------------------------------------------- | ------------------------ | ---------------------------------- | ------------------------------------ |
| `text`                                            | 无默认插槽时显示的文字   | `string`                           | `''`                                 |
| `type`                                            | 主题类型                 | `string`                           | `default`                            |
| `size`                                            | 按钮尺寸                 | `string`                           | `default`                            |
| `shape`                                           | `square` 或 `circle`     | `string`                           | `square`                             |
| `block`                                           | 是否撑满容器宽度（块级） | `boolean`                          | `true`                               |
| `plain` / `hairLine`                              | 朴素样式 / 细边框        | `boolean`                          | `false` / `true`                     |
| `disabled` / `loading`                            | 禁用 / 加载状态          | `boolean`                          | `false`                              |
| `loadingText` / `loadingMode` / `loadingSize`     | 加载文字、形态和尺寸     | `string / string / number\|string` | `'' / circle / 18`                   |
| `icon` / `iconColor`                              | 前置图标与颜色           | `string`                           | `''`                                 |
| `color`                                           | 自定义主题色             | `string`                           | `''`                                 |
| `ripple` / `rippleBgColor`                        | 点击位置水波纹开关与颜色 | `boolean / string`                 | `false` / `rgba(255, 255, 255, .28)` |
| `throttleTime`                                    | 点击节流时间，单位 ms    | `number \| string`                 | `0`                                  |
| `formType` / `openType`                           | uni-app 原生按钮能力     | `string`                           | `''`                                 |
| `hoverClass` / `hoverStartTime` / `hoverStayTime` | 原生按压反馈参数         | `string / number / number`         | 自动 / `20` / `150`                  |
| `customClass` / `customStyle`                     | 自定义类名与样式         | `string / style`                   | `''`                                 |
| `contentClass` / `contentStyle`                  | 内容区自定义类名与样式   | `string / style`                   | `''`                                 |

其余开放能力参数包括 `scope`、`appParameter`、`hoverStopPropagation`、`lang`、`sessionFrom`、`sendMessageTitle`、`sendMessagePath`、`sendMessageImg`、`showMessageCard` 和 `dataName`。

## Events 与 Slots

普通点击触发 `click(event)`。平台开放能力可触发 `getuserinfo`、`contact`、`getphonenumber`、`error`、`launchapp`、`opensetting`、`chooseavatar`、`agreeprivacyauthorization`。默认插槽用于按钮内容。

## 类型定义

```ts
import type { SnakeButtonEmits, SnakeButtonProps, SnakeButtonSize, SnakeButtonType } from '@puresnake/snake-ui';
```

## 主题与无障碍

按钮颜色使用 `--snake-color-*`，圆角与动画使用 `--snake-radius-small`、`--snake-duration-fast`。文字按钮应提供明确操作文案；只有图标时请通过外层语义提供可访问名称。

源码：`src/uni_modules/snake-ui/components/snake-button/snake-button.vue`
