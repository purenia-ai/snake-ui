---
preview: /pages/componentsA/lazy-image
---

# Lazy Image 懒加载图片

基于 `snake-image` 的简化懒加载组件，适合商品列表、瀑布流和长页面图片。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<view style="width: 100%; height: 300rpx">
  <snake-lazy-image src="/static/logo.png" mode="aspectFill" />
</view>
```

## 事件与错误状态

```vue
<snake-lazy-image :src="item.image" :index="index" error-img="图片加载失败" @load="loaded" @error="failed" />
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `src` | 图片地址 | `string` | `''` | - |
| `loadingImg` | 加载占位图，当前为兼容预留 | `string` | `''` | - |
| `errorImg` | 传给 Image 的失败提示文字 | `string` | `''` | - |
| `threshold` | 触发距离，当前为兼容预留 | `number` | `100` | - |
| `index` | 业务索引，当前为兼容预留 | `number \| string` | `0` | - |
| `mode` | 图片裁剪模式 | `string` | `widthFix` | uni-app image mode |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `click` | 点击图片 | 原始点击事件 |
| `load` | 图片加载成功 | 原始 load 事件 |
| `error` | 图片加载失败 | 原始 error 事件 |

## 注意事项

- 组件自身宽高为 `100%`，父容器必须提供明确高度。
- 当前依赖 uni-app 原生 `lazy-load`，没有 IntersectionObserver 或自定义占位切换逻辑。

源码：`src/uni_modules/snake-ui/components/snake-lazy-image/snake-lazy-image.vue`
