---
preview: /pages/componentsB/floatingBubble/index
cms: true
---

# 悬浮气泡 <span class="cms-badge">CMS</span>

在页面右侧显示可关闭的悬浮图片；页面滚动时暂时向屏幕外收起，停止后恢复。也可通过默认插槽承载自定义内容（如分享、回到顶部按钮）。

## 运行前提

依赖 Vue `getCurrentInstance`、Snake Icon、uni-app 动画与存储 API，以及 `uni.$snake.getRect`、`sys`、`navTo`。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

图片入口模式，点击跳转、可关闭：

```vue
<snake-floating-bubble
    :datas="{
        uid: 'customer-service',
        src: 'https://example.com/service.png',
        url: '/pages/service/index',
        width: 96,
        height: 96,
        right: 0,
        bottom: 20
    }"
    :scroll-top="scrollTop"
/>
```

插槽模式，承载自定义内容：

```vue
<snake-floating-bubble :scroll-top="scrollTop" bottom="280rpx" background="transparent">
  <image src="/static/share.png" @click="share" />
  <image src="/static/totop.png" @click="toTop" />
</snake-floating-bubble>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数         | 说明                             | 类型               | 默认值        | 可选值 |
| ------------ | -------------------------------- | ------------------ | ------------- | ------ |
| `datas`      | 图片入口配置；传入即启用图片模式 | `Object`           | `{}`          | -      |
| `scrollTop`  | 页面滚动位置；变化时触发收起动画 | `Number`           | `0`           | -      |
| `bottom`     | 插槽模式下底部定位偏移           | `String`           | `80rpx`       | -      |
| `background` | 插槽模式下容器背景               | `String`           | `transparent` | -      |
| `zIndex`     | 层级                             | `Number \| String` | `6`           | -      |

### Slots

| 名称      | 说明                                             |
| --------- | ------------------------------------------------ |
| `default` | 自定义内容；提供后覆盖图片模式，关闭按钮不再显示 |

### `datas` 字段

| 字段              | 说明                     |
| ----------------- | ------------------------ |
| `uid`             | 持久化关闭状态的标识     |
| `src`、`url`      | 图片和点击跳转地址       |
| `width`、`height` | 图片区域尺寸，单位 `rpx` |
| `right`、`bottom` | 固定定位百分比           |

组件未向父级发送事件。

## 注意事项

- 关闭状态保存在 `suspensionList` 本地存储中，同一 `uid` 后续不再显示。
- 每次 `scrollTop` 变化都会尝试触发动画，内部用 2 秒定时器恢复。
- 组件卸载时会清理定时器。

## 主题变量

组件未直接使用 CSS 主题变量。图片模式由 `datas` 配置，插槽模式可通过 `background` 和插槽内容控制外观。

源码：`src/uni_modules/snake-ui/components/snake-floating-bubble/snake-floating-bubble.vue`
