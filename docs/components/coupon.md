---
preview: /pages/componentsB/coupon
cms: true
---

# 优惠券 <span class="cms-badge">CMS</span>
检查领取资格，以页面图片或弹窗形式展示优惠券，并在领取后执行内部或外部跳转。

## 运行前提

依赖安装 Snake UI 时提供的 `request`、`config` 适配器，Snake Popup、Snake Icon、TabBar API 和 `uni.$snake` 运行时工具。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-coupon
  :datas="{
    modeType: 'page',
    couponId: 'activity-001',
    beforeImage: 'https://example.com/coupon-ready.png',
    afterImage: 'https://example.com/coupon-used.png',
    type: '10',
    afterUrl: '/pages/coupon/list',
  }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">依赖真实优惠券接口</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | 优惠券展示、接口和跳转配置 | `Object` | 未声明 | - |

### `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `modeType` | `page` 或 `popup` |
| `popupMode` | 弹窗位置，使用 `bottom` 或 `center` |
| `couponId` | 传给资格检查和领取接口的活动 ID |
| `beforeImage`、`afterImage` | 可领取和领取后图片 |
| `type` | 字符串 `'10'` 表示内部跳转，其他值走外部承接流程 |
| `afterUrl` | 领取后的内部地址或 WebView 地址 |

组件未向父级发送事件。

## 注意事项

- 挂载时立即请求 `/v3/app/user/coupon/check`，点击领取请求 `/v3/app/user/coupon/add`。
- 底部弹窗会隐藏 TabBar，关闭后延迟恢复。
- 外部承接逻辑会读取 H5 URL 的 `clickid` 并向 `${config.baseUrl}/juliang` 上报。
- 资格检查失败时组件将 `isCouponCheck` 设为 `false`，表现会与“已领取”相同。

源码：`src/uni_modules/snake-ui/components/snake-coupon/snake-coupon.vue`
