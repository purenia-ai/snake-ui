---
name: 'parse'
description: 'Snake UI Parse 富文本解析参考。处理 parse、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['parse', 'snake-parse', 'Parse', '富文本解析']
---

# Parse 富文本解析

`snake-parse` 用于渲染文章、商品详情等 HTML 内容。内置 HTML 解析、图片预览、链接处理、表格横向滚动、音视频与 App-NVue 支持，可独立使用。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

App-NVue 通过内置 WebView 渲染复杂内容；`iframe`、`embed` 等嵌入标签仅在 H5 与 App 上渲染。平台差异见下方“安全与兼容”。

## 基础用法

```vue
<snake-parse :content="article" preview-img scroll-table @linktap="onLinkTap" />
```

`content` 接收 HTML 字符串；图片预览由 `preview-img` 控制，表格内容较宽时可启用 `scroll-table`。

## API

### Props

| 参数             | 说明                                 | 类型                     | 默认值  |
| ---------------- | ------------------------------------ | ------------------------ | ------- |
| `content`        | 要渲染的 HTML 内容                   | `string`                 | `''`    |
| `containerStyle` | 根容器样式                           | `string`                 | `''`    |
| `domain`         | 相对资源地址使用的主域名             | `string`                 | -       |
| `tagStyle`       | 标签默认样式映射                     | `Record<string, string>` | -       |
| `lazyLoad`       | 是否延迟加载图片                     | `boolean`                | `false` |
| `loadingImg`     | 图片加载中的占位图地址               | `string`                 | `''`    |
| `errorImg`       | 图片加载失败的占位图地址             | `string`                 | `''`    |
| `previewImg`     | 点击图片时是否打开预览               | `boolean`                | `true`  |
| `showImgMenu`    | 是否显示图片长按菜单                 | `boolean`                | `true`  |
| `copyLink`       | 点击外部链接时是否复制地址           | `boolean`                | `true`  |
| `pauseVideo`     | 播放新视频时是否暂停其他视频         | `boolean`                | `true`  |
| `scrollTable`    | 是否让表格独立横向滚动               | `boolean`                | -       |
| `selectable`     | 文本是否可长按选择                   | `boolean`                | -       |
| `setTitle`       | 是否使用 HTML `title` 更新页面标题   | `boolean`                | `true`  |
| `useAnchor`      | 是否启用锚点定位，传数字可指定偏移量 | `boolean \| number`      | -       |

### Events

| 事件名    | 说明                     | 参数                |
| --------- | ------------------------ | ------------------- |
| `load`    | 内容解析并加载后触发     | -                   |
| `ready`   | 内容布局完成后触发       | `rect`              |
| `imgtap`  | 点击图片时触发           | `attrs`             |
| `linktap` | 点击链接时触发           | `attrs`             |
| `play`    | 媒体开始播放时触发       | `{ source, attrs }` |
| `error`   | 富文本资源加载失败时触发 | `{ source, attrs }` |

### Methods

组件 ref 提供 `setContent(content, append)`、`getText()`、`getRect()`、`navigateTo(id, offset)`、`pauseMedia()` 和 `setPlaybackRate(rate)`。

### Slots

| 名称      | 说明                                     |
| --------- | ---------------------------------------- |
| `default` | `content` 尚未解析出节点时显示的占位内容 |

## 安全与兼容

解析器按标签白名单渲染，移除脚本、表单和事件属性。H5 与 App 端可渲染 `iframe`、`embed`，因此不可信 HTML 仍应在服务端完成清洗，并限制可访问的嵌入地址；小程序端会忽略这些嵌入标签。H5、App、小程序使用原生节点；App-NVue 使用内置 WebView 处理复杂内容。

## 主题变量

Parse 没有专用的 `--snake-parse-*` 变量。可通过 `containerStyle` 设置容器样式、通过 `tagStyle` 设置标签默认样式；需要跟随全局主题时，使用[色彩令牌](/components/color)。
