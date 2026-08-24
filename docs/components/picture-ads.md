---
preview: /pages/componentsB/pictureAds/index
cms: true
---

# 轮播广告 <span class="cms-badge">CMS</span>
以纵向图片列表或 Snake UI Swiper 展示广告，支持列表、轮播和指示器配置。

## 运行前提

依赖 Snake Swiper、`uni.$snake.navTo`、`toast`、`sleep` 和 Snake UI `addUnit` 单位工具。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

> 表格表示组件可通过当前工程编译。涉及跳转、开放能力、原生媒体或业务接口的功能，仍需按下文条件在目标平台验证。

## 基础用法

```vue
<snake-picture-ads
  :datas="{
    swiperType: 1,
    imageList: [
      { src: 'https://example.com/hero-1.png', url: '/pages/activity/one' },
      { src: 'https://example.com/hero-2.png', url: '/pages/activity/two' },
    ],
    height: 180,
    pageMargin: 24,
    imageMargin: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    interval: 3000,
    pagingType: 'bullets',
    indicatorColor: '#06D290',
  }"
/>
```

## 效果图

<div class="component-preview"><span class="component-preview__label">请在右侧实时预览中操作组件</span></div>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `datas` | `Object \| null` | `{}` | 广告列表和轮播配置 |

### 主要 `datas` 字段

| 字段 | 说明 |
| --- | --- |
| `imageList` | 广告数组，每项读取 `src`、`url`、`text`，并可能读取活动时间 |
| `swiperType` | `0` 为单列图片；`1` 为普通轮播；`2` 为带前后边距轮播 |
| `height` | 展示高度，源码按两倍数值传入 rpx/轮播高度 |
| `pageMargin`、`imageMargin`、`borderRadius` | 页面间距、图片间距和圆角 |
| `backgroundColor` | 外层背景色 |
| `interval` | 自动轮播间隔，缺省使用 `3000` |
| `pagingType` | `bullets`、`fraction` 或 `progressbar` |
| `indicatorColor` | 当前指示器颜色 |

组件未向父级发送事件；轮播变化只更新内部索引，点击直接导航。

## 注意事项

- 模板最前面的空状态直接读取 `datas.imageList.length`，必须提供数组。
- 支付宝小程序审核隐藏状态会过滤包含特定 `pageId` 的链接。
- 当广告同时含 `startTime`、`endTime` 且没有 URL 时，点击只显示“活动未开始”提示；组件本身不比较当前时间。

源码：`src/uni_modules/snake-ui/components/snake-picture-ads/snake-picture-ads.vue`
