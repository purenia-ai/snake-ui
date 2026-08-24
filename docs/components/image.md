---
preview: /pages/componentsA/image/index
---

# Image 图片

封装 uni-app `image`，提供加载、失败、淡入、圆角、圆形、WebP、长按菜单和图片预览能力。`src` 变化时会自动重置状态。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-image src="/static/logo.png" width="100%" height="320rpx" mode="aspectFill" :radius="16" preview />
<snake-image src="/static/avatar.png" width="120rpx" height="120rpx" shape="circle" />
```

`loading` 与 `error` 插槽可替换默认反馈。

## API

### Props

| 参数                                      | 说明               | 类型                              | 默认值             |
| ----------------------------------------- | ------------------ | --------------------------------- | ------------------ |
| `src` / `mode`                            | 图片地址和裁剪方式 | `string`                          | `'' / scaleToFill` |
| `width` / `height`                        | 容器尺寸           | `string \| number`                | `100% / auto`      |
| `shape` / `radius`                        | 形状和圆角         | `square\|circle / string\|number` | `square / 0`       |
| `lazyLoad` / `webp`                       | 原生懒加载与 WebP  | `boolean`                         | `false`            |
| `showMenuByLongpress`                     | 长按显示识别菜单   | `boolean`                         | `false`            |
| `fade` / `duration`                       | 淡入及其时长       | `boolean / number`                | `true / 300`       |
| `showLoading` / `loadingIcon`             | 加载反馈           | `boolean / string`                | `true / ''`        |
| `showError` / `errorIcon`                 | 失败反馈           | `boolean / string`                | `true / image`     |
| `preview` / `previewUrls`                 | 点击预览及图片集合 | `boolean / string[]`              | `false`            |
| `bgColor` / `customClass` / `customStyle` | 背景和自定义样式   | 多类型                            | 主题默认值         |

事件包括 `load(event)`、`error(event)` 和 `click(event)`。

源码：`src/uni_modules/snake-ui/components/snake-image/snake-image.vue`
