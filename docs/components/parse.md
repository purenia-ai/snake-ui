---
preview: /pages/componentsB/parse/index
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

| 参数                         | 说明                             | 类型                                      | 默认值           |
| ---------------------------- | -------------------------------- | ----------------------------------------- | ---------------- |
| `content`                    | HTML 字符串                      | `string`                                  | `''`             |
| `domain`                     | 相对链接主域名                   | `string`                                  | —                |
| `containerStyle`             | 根容器样式                       | `string`                                  | `''`             |
| `tagStyle`                   | 标签默认样式                     | `Record<string, string>`                  | —                |
| `previewImg` / `lazyLoad`    | 图片预览、懒加载                 | `boolean \| string`                       | `true` / `false` |
| `loadingImg` / `errorImg`    | 图片占位图                       | `string`                                  | `''`             |
| `showImgMenu` / `copyLink`   | 图片菜单、外链处理               | `boolean \| string`                       | `true`           |
| `pauseVideo` / `scrollTable` | 媒体自动暂停、表格横滑           | `boolean \| string`                       | `true` / —       |
| `selectable` / `useAnchor`   | 文本选择、页内锚点               | `boolean \| string` / `boolean \| number` | —                |
| `setTitle`                   | 是否将 HTML `title` 设为页面标题 | `boolean \| string`                       | `true`           |

### Events

| 事件                 | 触发时机与参数                                   |
| -------------------- | ------------------------------------------------ |
| `load`               | 内容解析并加载后触发                             |
| `ready`              | 图片等内容就绪后触发，参数为节点布局信息或空对象 |
| `imgtap` / `linktap` | 点击图片或链接时触发，传入相应属性               |
| `play` / `error`     | 媒体播放或出错时触发                             |

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
