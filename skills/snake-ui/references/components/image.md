---
name: 'image'
description: 'Snake UI Image 图片参考。处理 image、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['image', 'snake-image', 'Image', '图片']
---

# Image 图片

封装 uni-app `image`，提供加载、失败、淡入、圆角、圆形、WebP、长按菜单和图片预览能力。`src` 变化时会自动重置状态。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-image
    src="/static/logo.png"
    alt="Snake UI 标志"
    width="100%"
    height="320rpx"
    mode="aspectFill"
    :radius="16"
    preview
/>
<snake-image src="/static/avatar.png" alt="用户头像" width="120rpx" height="120rpx" shape="circle" />
```

## 加载状态

### 加载中

默认显示加载图标。简单的品牌占位图可使用 `loading-img`；需要组合动画、文字或骨架屏时使用 `loading` 插槽。

```vue
<snake-image src="/static/product.png" width="100%" height="220rpx" loading-img="/static/image-loading.png" />

<snake-image src="/static/product.png" width="100%" height="220rpx">
  <template #loading>
    <snake-loading size="24" />
  </template>
</snake-image>
```

传入 `show-loading="false"` 可隐藏加载反馈。

### 加载失败

默认显示错误图标与提示。简单错误图使用 `error-img`；需要自定义内容时使用 `error` 插槽。

```vue
<snake-image src="/static/not-found.png" width="100%" height="220rpx" error-img="/static/image-error.png" />

<snake-image src="/static/not-found.png" width="100%" height="220rpx">
  <template #error>
    <view class="image-error">图片暂时无法显示</view>
  </template>
</snake-image>
```

传入 `show-error="false"` 可隐藏失败反馈。两个状态的渲染优先级均为：同名插槽 > `loading-img` / `error-img` > 默认图标。

## 视口懒加载

`lazy-load` 使用 `uni.createIntersectionObserver`，仅在进入视口预加载距离后创建真实图片请求。组件不会同时启用原生 `image` 的 `lazy-load`，避免两套懒加载调度相互影响。`loadingImg` 与 `errorImg` 在组件内部按状态直接渲染，未配置时才回退为默认图标；需要复杂状态内容时使用同名插槽，插槽优先。

```vue
<snake-image
    src="/static/product.png"
    lazy-load
    :lazy-threshold="160"
    loading-img="/static/image-loading.png"
    error-img="/static/image-error.png"
/>
```

`lazy-threshold` 默认为 `100`；数值越大，图片会在距视口更远的位置开始请求。

## 展示样式

### 填充模式

通过 `mode` 控制图片在容器内的裁剪和对齐方式，常用商品图使用 `aspectFill`，完整展示图片使用 `aspectFit`。

```vue
<snake-image src="/static/product.png" width="200rpx" height="200rpx" mode="aspectFill" />
<snake-image src="/static/product.png" width="200rpx" height="200rpx" mode="aspectFit" />
```

### 圆形与圆角

```vue
<snake-image src="/static/avatar.png" width="120rpx" height="120rpx" shape="circle" />
<snake-image src="/static/product.png" width="240rpx" height="180rpx" :radius="16" />
```

## 图片预览

传入 `preview` 后，点击图片会调用 `uni.previewImage`。使用 `preview-urls` 可提供预览图集合；集合应包含当前 `src`。

```vue
<snake-image
    src="/static/product-1.png"
    width="240rpx"
    height="240rpx"
    preview
    :preview-urls="['/static/product-1.png', '/static/product-2.png']"
/>
```

## API

### Props

| 参数                                         | 说明                   | 类型                              | 默认值              |
| -------------------------------------------- | ---------------------- | --------------------------------- | ------------------- |
| `src` / `mode`                               | 图片地址和裁剪方式     | `string`                          | `'' / scaleToFill`  |
| `alt`                                        | 图片的可访问文本       | `string`                          | `''`                |
| `width` / `height`                           | 容器尺寸               | `string \| number`                | `100% / auto`       |
| `shape` / `radius`                           | 形状和圆角             | `square\|circle / string\|number` | `square / 0`        |
| `lazyLoad` / `lazyThreshold`                 | 视口懒加载及预加载距离 | `boolean / number`                | `false / 100`       |
| `webp`                                       | 使用 WebP              | `boolean`                         | `false`             |
| `showMenuByLongpress`                        | 长按显示识别菜单       | `boolean`                         | `false`             |
| `fade` / `duration`                          | 淡入及其时长           | `boolean / number`                | `true / 300`        |
| `showLoading` / `loadingIcon` / `loadingImg` | 加载反馈与图片占位     | `boolean / string / string`       | `true / '' / ''`    |
| `showError` / `errorIcon` / `errorImg`       | 失败反馈与图片回退     | `boolean / string / string`       | `true / image / ''` |
| `preview` / `previewUrls`                    | 点击预览及图片集合     | `boolean / string[]`              | `false`             |
| `bgColor` / `customClass` / `customStyle`    | 背景和自定义样式       | 多类型                            | 主题默认值          |

### Events

| 事件名  | 触发时机     | 参数    |
| ------- | ------------ | ------- |
| `load`  | 图片加载成功 | `event` |
| `error` | 图片加载失败 | `event` |
| `click` | 点击图片     | `event` |

### Methods

| 方法名   | 说明                                  | 参数 |
| -------- | ------------------------------------- | ---- |
| `reload` | 按当前 `src` 和懒加载策略重新请求图片 | -    |

### Slots

| 插槽名    | 说明               |
| --------- | ------------------ |
| `loading` | 自定义加载状态     |
| `error`   | 自定义加载失败状态 |

## 主题变量

| 变量名                        | 说明                       |
| ----------------------------- | -------------------------- |
| `--snake-color-surface-muted` | 图片容器默认背景色         |
| `--snake-color-text-muted`    | 状态图标默认颜色           |
| `--snake-image-status-color`  | 加载状态文字与图标颜色     |
| `--snake-image-error-color`   | 加载失败状态文字与图标颜色 |
