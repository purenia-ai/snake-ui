---
name: 'rich-text'
description: 'Snake UI RichText 富文本参考。处理 rich-text、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['rich-text', 'snake-rich-text', 'RichText', '富文本']
---

# RichText 富文本

`snake-rich-text` 用于渲染文章、商品详情等 HTML 内容。内置 HTML 解析、图片预览、链接处理、表格横向滚动、音视频与 App-NVue 支持，可独立使用。

## 与原生 rich-text 的区别

uni-app 自带的 `<rich-text>` 只接受节点树，样式和交互都要自己维护；`snake-rich-text` 直接接收 HTML 字符串，并补齐图片预览、链接复制、表格横向滚动、音视频与锚点定位。

| 场景                                 | 建议                               |
| ------------------------------------ | ---------------------------------- |
| 一段图文、公告正文、几行后台富文本   | 直接用原生 `<rich-text>`，无需引入 |
| 商品详情、长文章、带表格与音视频内容 | 用 `snake-rich-text`               |

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

App-NVue 通过内置 WebView 渲染复杂内容；`iframe`、`embed` 等嵌入标签仅在 H5 与 App 上渲染。平台差异见下方“安全与兼容”。

## 基础用法

```vue
<snake-rich-text :content="article" preview-img scroll-table @linktap="onLinkTap" />
```

`content` 接收 HTML 字符串；图片预览由 `preview-img` 控制，表格内容较宽时可启用 `scroll-table`。

组件根节点只透传 `containerStyle`：除链接色与图片圆角外不带排版样式，留白、最大宽度都交给外层容器，因此嵌进别的容器时不会多出一层缩进。

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

`tagStyle`、`scrollTable`、`useAnchor`、`domain`、`previewImg` 只在解析阶段生效；运行期修改这些参数时组件会重新解析当前内容，并重新触发 `load` 与 `ready`。

### Events

| 事件名             | 说明                     | 参数                            |
| ------------------ | ------------------------ | ------------------------------- |
| `load`             | 内容解析并加载后触发     | -                               |
| `ready`            | 内容布局完成后触发       | `rect`                          |
| `imgtap`           | 点击图片时触发           | `attrs`                         |
| `linktap`          | 点击链接时触发           | `attrs`，含 `href` 与链接文本   |
| `play`             | 媒体开始播放时触发       | `{ source, attrs }`             |
| `pause`            | 媒体暂停时触发           | `{ source, attrs }`             |
| `fullscreenchange` | 视频全屏状态变化时触发   | `{ source, attrs, fullScreen }` |
| `error`            | 富文本资源加载失败时触发 | `{ source, attrs }`             |

`source` 为媒体标签名（`video` / `audio`），`attrs` 是内容里的原始属性，`src` 为当前实际使用的地址。

### Methods

组件 ref 提供 `setContent(content, append)`、`getText()`、`getRect()`、`navigateTo(id, offset)`、`pauseMedia()` 和 `setPlaybackRate(rate)`。

### Slots

| 名称      | 说明                                     |
| --------- | ---------------------------------------- |
| `default` | `content` 尚未解析出节点时显示的占位内容 |

## 与其他组件库的对照

| 其他库                        | 本组件            | 迁移说明                                                                                                             |
| ----------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| uview-plus `up-parse`         | `snake-rich-text` | 底座同为 mp-html，15 个道具逐个同名（`content`、`tagStyle`、`lazyLoad`、`selectable`、`scrollTable` 等），直接换标签 |
| uView-Pro `u-parse`（已废弃） | `snake-rich-text` | 旧组件用 `:html`，迁移时改为 `:content`；uView-Pro 已删除该组件，无同名替代                                          |
| wot-ui `wd-rich-text`         | `snake-rich-text` | `image-click` → `imgtap`，`link-click` → `linktap`，`enable-anchor` → `useAnchor`，`loading-image` → `loadingImg`    |

与 wot-ui 的差别在于交互归属：`snake-rich-text` 保持 mp-html / uView 血统的行为，外链按 `copyLink` 复制或打开、站内路径自动 `navigateTo`、锚点自动滚动；wot-ui 只抛事件、跳转全部交给业务。需要在跳转前做埋点或改写链接时，先监听 `linktap`，再在回调里自行导航。

## 安全与兼容

解析器按标签白名单渲染，移除脚本、表单和事件属性。H5 与 App 端可渲染 `iframe`、`embed`，因此不可信 HTML 仍应在服务端完成清洗，并限制可访问的嵌入地址；小程序端会忽略这些嵌入标签。H5、App、小程序使用原生节点；App-NVue 使用内置 WebView 处理复杂内容。

内容自带的 `<style>` 标签只支持标签、`class`、`id` 和后代选择器，不支持 `*`、属性选择器和媒体查询；需要稳定的排版时用 `tagStyle`。

## 常见问题

### H5 部署在子路径时图片 404

内容里的 `/static/…` 是运行时字符串，不会经过构建期的路径转换。应用部署在 `/h5/`、`/snake-ui/h5/` 这类子路径时，这类地址会请求站点根目录并 404；改用完整地址，或用 `domain` 指定主域名（如 `domain="/snake-ui/h5"`）。

### 表格没有横向滚动

`scrollTable` 只作用于有明确宽度的表格：给表格写 `style="width:640px"` 这类固定宽度才会超出容器，`width:100%` 会跟随容器收缩。

### 内容里的样式没生效

组件不注入全局样式，只渲染内容自身的样式与 `tagStyle`；`tagStyle` 的优先级低于内容内联样式。后台已经把颜色写进内联样式时，需要从内容侧修正，或在服务端清洗阶段去掉这些样式。

## 主题变量

组件不写死正文颜色与图片样式，都可以用 CSS 变量控制；不设置时保持组件内置的默认表现（链接默认跟随主色）。

| 变量                             | 说明                                                             |
| -------------------------------- | ---------------------------------------------------------------- |
| `--snake-rich-text-color`        | 正文颜色，默认继承父级                                           |
| `--snake-rich-text-font-size`    | 正文字号，默认继承父级                                           |
| `--snake-rich-text-line-height`  | 正文行高，默认继承父级                                           |
| `--snake-rich-text-link-color`   | 链接颜色，默认跟随 `--snake-color-primary`，与 `snake-link` 一致 |
| `--snake-rich-text-image-radius` | 内容图片圆角，默认 `0`                                           |

变量声明在任意祖先节点即可，组件根节点会继承；`containerStyle`、`tagStyle` 与内容内联样式仍然优先于这些变量。需要跟随全局主题时，使用[色彩令牌](/components/color)。

```vue
<view style="--snake-rich-text-link-color: var(--snake-color-primary-deep);">
  <snake-rich-text :content="article" />
</view>
```
