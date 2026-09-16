---
name: 'parse'
description: 'Snake UI Parse 富文本解析参考。处理 parse、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['parse', 'snake-parse', 'Parse', '富文本解析']
---

# Parse 富文本解析

`snake-parse` 用于渲染文章、商品详情等 HTML 内容。内置 HTML 解析、图片预览、链接处理、表格横向滚动、音视频与 App-NVue 支持，可独立使用。

## 基础用法

```vue
<snake-parse :content="article" preview-img scroll-table @linktap="onLinkTap" />
```

## Props

| 参数                         | 说明                             | 类型                                      | 默认值           |
| ---------------------------- | -------------------------------- | ----------------------------------------- | ---------------- |
| `content`                    | HTML 字符串                      | `string`                                  | `''`             |
| `domain`                     | 相对链接主域名                   | `string`                                  | `''`             |
| `containerStyle`             | 根容器样式                       | `string`                                  | `''`             |
| `tagStyle`                   | 标签默认样式                     | `Record<string, string>`                  | `{}`             |
| `previewImg` / `lazyLoad`    | 图片预览、懒加载                 | `boolean \| string`                       | `true` / `false` |
| `loadingImg` / `errorImg`    | 图片占位图                       | `string`                                  | `''`             |
| `showImgMenu` / `copyLink`   | 图片菜单、外链处理               | `boolean \| string`                       | `true`           |
| `pauseVideo` / `scrollTable` | 媒体自动暂停、表格横滑           | `boolean \| string`                       | `true` / `false` |
| `selectable` / `useAnchor`   | 文本选择、页内锚点               | `boolean \| string` / `boolean \| number` | `false`          |
| `setTitle`                   | 是否将 HTML `title` 设为页面标题 | `boolean \| string`                       | `true`           |

## Events 与 Methods

事件：`load`、`ready`、`imgtap`、`linktap`、`play`、`pause`、`fullscreenchange`、`error`。

组件 ref 方法：`setContent(content, append)`、`getText()`、`getRect()`、`navigateTo(id, offset)`、`pauseMedia()`、`setPlaybackRate(rate)`。

## 安全与兼容

解析器按标签白名单渲染，移除脚本、表单和事件属性。H5 与 App 端可渲染 `iframe`、`embed`，因此不可信 HTML 仍应在服务端完成清洗，并限制可访问的嵌入地址；小程序端会忽略这些嵌入标签。H5、App、小程序使用原生节点；App-NVue 使用内置 WebView 处理复杂内容。
