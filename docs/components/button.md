---
preview: /pages/componentsA/button/index
---

# Button 按钮

基于 uni-app 原生 `button` 封装，覆盖常用属性、状态与交互。

## 平台兼容性

支持 H5、App 以及 uni-app 支持的各家小程序；开放能力属性仅在对应平台生效。

## 基础用法

```vue
<snake-button>默认按钮</snake-button>
<snake-button type="primary">主要按钮</snake-button>
<snake-button type="success" plain>镂空按钮</snake-button>
<snake-button size="small" shape="circle">小型胶囊按钮</snake-button>
<snake-button loading>加载中</snake-button>
<snake-button disabled>不可操作</snake-button>
```

## 主题、尺寸和形状

`type` 支持 `default`、`primary`、`success`、`info`、`warning`、`error`。

`size` 支持 `large`、`default`、`medium`、`small`、`mini`；`shape` 支持 `square` 和 `circle`。

```vue
<snake-button type="primary">主要按钮</snake-button>
<snake-button type="warning" plain>警告按钮</snake-button>
<snake-button size="medium">中号按钮</snake-button>
<snake-button shape="circle">胶囊按钮</snake-button>
```

## 水波纹与节流

```vue
<snake-button ripple>水波纹按钮</snake-button>
<snake-button ripple ripple-bg-color="rgba(255, 255, 255, .42)">自定义水波纹</snake-button>
<snake-button :throttle-time="500" @click="submit">提交订单</snake-button>
```

开启 `ripple` 后不再叠加原生 `hover-class`。`disabled` 或 `loading` 时不会触发业务点击。

## 原生开放能力

```vue
<snake-button open-type="getPhoneNumber" @getphonenumber="receivePhone">获取手机号</snake-button>
<snake-button form-type="submit">提交表单</snake-button>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `text` | 无默认插槽时显示的文本 | `string` | `''` |
| `type` | 主题类型 | `string` | `default` |
| `size` | 按钮尺寸 | `string` | `default` |
| `shape` | 按钮形状 | `square \| circle` | `square` |
| `plain` | 是否镂空 | `boolean` | `false` |
| `hairLine` | 是否使用细边框 | `boolean` | `true` |
| `disabled` | 是否禁用 | `boolean` | `false` |
| `loading` | 是否显示原生加载状态 | `boolean` | `false` |
| `ripple` | 是否开启水波纹 | `boolean` | `false` |
| `rippleBgColor` | 水波纹颜色 | `string` | `''` |
| `hoverClass` | 自定义按下类名 | `string` | `''` |
| `throttleTime` | 点击节流时间，单位 ms | `number \| string` | `0` |
| `customClass` | 根节点自定义类名 | `string` | `''` |
| `customStyle` | 根节点自定义样式 | `string \| object` | `{}` |

其余原生能力参数包括 `scope`、`openType`、`formType`、`appParameter`、`hoverStopPropagation`、`lang`、`sessionFrom`、`sendMessageTitle`、`sendMessagePath`、`sendMessageImg`、`showMessageCard`、`dataName`、`hoverStartTime` 和 `hoverStayTime`。

## Events

支持 `click`、`getuserinfo`、`contact`、`getphonenumber`、`error`、`launchapp`、`opensetting`、`chooseavatar` 和 `agreeprivacyauthorization`。

源码：`src/uni_modules/snake-ui/components/snake-button/snake-button.vue`
