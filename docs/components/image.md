---
preview: /pages/componentsA/image/index
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
    height="160px"
    mode="aspectFill"
    :radius="16"
    preview
/>
<snake-image src="/static/avatar.png" alt="用户头像" width="60px" height="60px" shape="circle" />
```

## 加载状态

### 加载中

默认显示加载图标。简单的品牌占位图可使用 `loading-img`；需要组合动画、文字或骨架屏时使用 `loading` 插槽。

```vue
<snake-image src="/static/product.png" width="100%" height="110px" loading-img="/static/image-loading.png" />

<snake-image src="/static/product.png" width="100%" height="110px">
  <template #loading>
    <snake-loading size="24" />
  </template>
</snake-image>
```

传入 `show-loading="false"` 可隐藏加载反馈。

### 加载失败

默认显示错误图标与提示。简单错误图使用 `error-img`；需要自定义内容时使用 `error` 插槽。

```vue
<snake-image src="/static/not-found.png" width="100%" height="110px" error-img="/static/image-error.png" />

<snake-image src="/static/not-found.png" width="100%" height="110px">
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
<snake-image src="/static/product.png" width="100px" height="100px" mode="aspectFill" />
<snake-image src="/static/product.png" width="100px" height="100px" mode="aspectFit" />
```

### 圆形与圆角

```vue
<snake-image src="/static/avatar.png" width="60px" height="60px" shape="circle" />
<snake-image src="/static/product.png" width="120px" height="90px" :radius="16" />
```

## 图片预览

传入 `preview` 后，点击图片会调用 `uni.previewImage`。使用 `preview-urls` 可提供预览图集合；集合应包含当前 `src`。

```vue
<snake-image
    src="/static/product-1.png"
    width="120px"
    height="120px"
    preview
    :preview-urls="['/static/product-1.png', '/static/product-2.png']"
/>
```

## API

### Props

| 参数                  | 说明                                                        | 类型                  | 默认值        |
| --------------------- | ----------------------------------------------------------- | --------------------- | ------------- |
| `src`                 | 图片资源地址                                                | `string`              | `''`          |
| `alt`                 | 图片替代文本                                                | `string`              | `''`          |
| `mode`                | 裁剪缩放模式，如 `scaleToFill` / `aspectFit` / `aspectFill` | `ImageMode`           | `scaleToFill` |
| `width`               | 组件宽度                                                    | `UnitValue`           | `100%`        |
| `height`              | 组件高度，传 `auto` 表示自适应                              | `UnitValue \| 'auto'` | `auto`        |
| `shape`               | 形状，可选值 `square`（方形）/ `circle`（圆形）             | `string`              | `square`      |
| `radius`              | 圆角尺寸，数值按 px（375 稿）处理                           | `UnitValue`           | `0`           |
| `lazyLoad`            | 是否开启视口懒加载，进入预加载范围后才请求真实图片          | `boolean`             | `false`       |
| `lazyThreshold`       | 视口懒加载的预加载距离                                      | `number`              | `100`         |
| `showMenuByLongpress` | 是否开启长按识别菜单                                        | `boolean`             | `false`       |
| `webp`                | 是否默认使用 WebP                                           | `boolean`             | `false`       |
| `fade`                | 是否开启淡入动画                                            | `boolean`             | `true`        |
| `duration`            | 淡入动画持续时间，单位 ms                                   | `number`              | `300`         |
| `bgColor`             | 背景颜色，未设置时使用 `--snake-color-surface-muted`        | `string`              | -             |
| `showLoading`         | 是否显示加载反馈                                            | `boolean`             | `true`        |
| `loadingIcon`         | 加载状态图标名称，为空时使用默认图标                        | `string`              | `''`          |
| `loadingImg`          | 加载中显示的占位图片地址                                    | `string`              | `''`          |
| `showError`           | 是否显示加载失败反馈                                        | `boolean`             | `true`        |
| `errorIcon`           | 加载失败图标名称                                            | `string`              | `image`       |
| `errorImg`            | 加载失败显示的回退图片地址                                  | `string`              | `''`          |
| `preview`             | 点击图片时是否调用 `uni.previewImage` 预览                  | `boolean`             | `false`       |
| `previewUrls`         | 预览图集合，应包含当前 `src`                                | `string[]`            | -             |
| `customClass`         | 根节点自定义类名                                            | `string`              | `''`          |
| `customStyle`         | 根节点自定义样式                                            | `StyleValue`          | `''`          |

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
