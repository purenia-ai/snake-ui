---
preview: /pages/componentsB/videos
cms: true
---

# 视频 <span class="cms-badge">CMS</span>
显示视频首帧封面，点击后在全屏弹层中播放视频。

## 运行前提

依赖 Snake Image、Snake Icon、Snake Popup、uni-app `<video>` 和 `uni.$snake.guid`。封面 URL 使用阿里云 OSS 视频截帧查询参数。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-videos :datas="{ src: 'https://example.com/product.mp4' }" />
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | 视频配置 | `Object` | 未声明 | - |
| `scrollTop` | 页面滚动位置；当前逻辑未使用 | `Number` | `0` | - |

### `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `src` | 视频地址，同时用于拼接 OSS 首帧封面地址 |

组件未声明事件和插槽。

## 注意事项

- 非 OSS 视频地址可能不支持追加的截帧参数，需自行验证封面响应。
- 点击弹层空白区域会关闭播放层，点击视频本身会阻止关闭。
- 内部 `uid`、`isShow` 当前未参与渲染。

源码：`src/uni_modules/snake-ui/components/snake-videos/snake-videos.vue`
