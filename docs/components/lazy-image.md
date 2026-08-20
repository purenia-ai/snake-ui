---
preview: /pages/componentsA/lazy-image
---

# LazyImage 懒加载图片

图片进入视口阈值后才设置真实地址，适合商品长列表。组件优先使用 `uni.createIntersectionObserver`，不支持时安全降级为立即加载。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-lazy-image :src="item.image" :index="index" :threshold="160" mode="aspectFill" height="300rpx" @load="loaded" />
```

## API

### Props

| 参数                           | 说明               | 类型                        | 默认值                   |
| ------------------------------ | ------------------ | --------------------------- | ------------------------ |
| `src`                          | 真实图片地址       | `string`                    | `''`                     |
| `loadingImg` / `errorImg`      | 加载和失败占位资源 | `string`                    | `''`                     |
| `threshold`                    | 视口预加载距离     | `number`                    | `100`                    |
| `index`                        | 事件携带的列表索引 | `string \| number`          | `0`                      |
| `mode` / `width` / `height`    | 图片模式与尺寸     | 多类型                      | `widthFix / 100% / auto` |
| `radius` / `fade` / `duration` | 圆角与淡入参数     | 多类型                      | `0 / true / 300`         |
| `customStyle`                  | 自定义样式         | `string \| object \| array` | `''`                     |

`src`、`mode`、`width`、`height`、`radius`、`fade`、`duration` 与 Image 含义一致；`loadingImg` 和 `errorImg` 设置占位资源，`threshold`（默认 `100`）控制视口预加载距离，`index` 用于区分列表项，`customStyle` 自定义容器样式。

`click`、`load`、`error` 均返回 `(event, index)`，保留原始事件作为第一个参数。支持 `loading`、`error` 插槽。

源码：`src/uni_modules/snake-ui/components/snake-lazy-image/snake-lazy-image.vue`
