---
name: 'lazy-image'
description: 'Snake UI LazyImage 懒加载图片参考。处理 lazy-image、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['lazy-image', 'snake-lazy-image', 'LazyImage', '懒加载图片']
---

# LazyImage 懒加载图片

图片进入视口阈值后才设置真实地址，适合商品长列表。组件优先使用 `uni.createIntersectionObserver`，不支持时安全降级为立即加载。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-lazy-image :src="item.image" :index="index" :threshold="160" mode="aspectFill" height="300rpx" @load="loaded" />
```

## 占位与失败回退

```vue
<snake-lazy-image :src="item.image" loading-img="/static/image-loading.png" error-img="/static/image-error.png" />
```

`loadingImg` 只作为进入视口前的占位资源，不会提前触发真实图片的 `load` 或 `error` 事件；`errorImg` 是图片地址。需要自定义复杂状态时可使用同名插槽。

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

### Events

| 事件名  | 触发时机         | 参数             |
| ------- | ---------------- | ---------------- |
| `click` | 点击图片         | `(event, index)` |
| `load`  | 真实图片加载成功 | `(event, index)` |
| `error` | 真实图片加载失败 | `(event, index)` |

### Slots

| 插槽名    | 说明               |
| --------- | ------------------ |
| `loading` | 自定义加载占位内容 |
| `error`   | 自定义失败回退内容 |

## 主题变量

组件未直接使用 CSS 主题变量，加载结果由内部 Image 组件渲染并继承其主题样式。
