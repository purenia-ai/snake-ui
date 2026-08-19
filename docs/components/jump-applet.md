---
preview: /pages/componentsB/jump-applet
cms: true
---

# 小程序跳转 <span class="cms-badge">CMS</span>
通过按钮或图片触发小程序、H5 URL Scheme 或企业微信承接页跳转。

## 运行前提

依赖安装 Snake UI 时提供的 `config`、`request` 适配器，`uni.navigateToMiniProgram`、`uni.request` 和 `uni.$snake`；H5 企业微信分支还会访问 `window.location.href`。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-jump-applet
  :datas="{
    isButton: true,
    title: '打开小程序',
    textColor: '#ffffff',
    btnColor: '#06D290',
    appId: 'wx0000000000000000',
    path: 'pages/home/index',
    query: '?source=cms',
    isAuto: false,
    isWeCom: false,
  }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">需在目标平台验证跳转</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | 展示和跳转配置 | `Object` | 未声明 | - |

### `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `isButton` | 使用按钮或图片作为入口 |
| `title`、`textColor`、`btnColor` | 按钮文案与颜色 |
| `imageUrl` | 图片入口地址 |
| `isAuto` | 挂载后是否立即跳转 |
| `isWeCom` | 是否走企业微信 H5 上报与承接页逻辑 |
| `appId`、`path`、`query` | 目标小程序和页面参数 |

组件未向父级发送事件。

## 注意事项

- 自动跳转会在组件挂载时产生外部副作用，使用前应获得用户预期与平台允许。
- H5 URL Scheme 依赖后端 `/user/weixin/generateUrlScheme`。
- 企业微信分支会向 `${config.baseUrl}/juliang` 上报并跳转业务 WebView。
- 源码在 `uni.request` 成功回调中不判断响应内容，只要请求完成就继续导航。

源码：`src/uni_modules/snake-ui/components/snake-jump-applet/snake-jump-applet.vue`
