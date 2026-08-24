---
preview: /pages/componentsB/pagePopup/index
cms: true
---

# 页面弹窗 <span class="cms-badge">CMS</span>
页面进入后立即展示居中或底部图片弹窗，并支持图片跳转。

## 运行前提

依赖 Snake Popup、Snake Icon、`uni.$snake.navTo`、`uni.$snake.sleep` 和 TabBar 显隐 API。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-page-popup
  :datas="{
    popupMode: 'center',
    image: 'https://example.com/campaign.png',
    url: '/pages/activity/index',
  }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | 弹窗配置 | `Object` | 未声明 | - |

### `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `popupMode` | `center` 或 `bottom`，决定位置、背景和关闭按钮 |
| `image` | 弹窗图片地址 |
| `url` | 点击图片后的跳转地址 |

组件未向父级发送事件。

## 注意事项

组件的 `show` 初始值固定为 `true`。底部弹窗挂载时隐藏 TabBar，关闭 300ms 后重新显示；若组件异常卸载或页面切换，应额外确认 TabBar 状态能够恢复。

源码：`src/uni_modules/snake-ui/components/snake-page-popup/snake-page-popup.vue`
