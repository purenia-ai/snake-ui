---
preview: /pages/componentsA/image
---

# Image 图片

封装 uni-app `image`，统一处理尺寸、圆角、懒加载、加载事件和失败占位。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-image src="/static/logo.png" width="100%" height="320rpx" :radius="12" mode="aspectFit" />
```

## 加载失败

```vue
<snake-image src="/static/not-found.png" height="180rpx" error-icon="图片暂不可用" @error="onError" />
```

失败后组件显示文字占位；设置 `show-error="false"` 可隐藏占位内容。

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `src` | 图片地址 | `string` | `''` | 本地或网络地址 |
| `mode` | 图片裁剪模式 | `string` | `scaleToFill` | uni-app image mode |
| `width` | 容器宽度 | `string \| number` | `100%` | - |
| `height` | 容器高度 | `string \| number` | `auto` | - |
| `radius` | 圆角 | `string \| number` | `0` | - |
| `lazyLoad` | 是否启用原生懒加载 | `boolean` | `false` | `true` / `false` |
| `showError` | 加载失败后是否显示占位 | `boolean` | `true` | `true` / `false` |
| `errorIcon` | 失败占位文字 | `string` | `图片加载失败` | - |
| `customStyle` | 容器自定义样式 | `string \| object \| array` | `''` | - |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `load` | 图片加载成功 | 原始 load 事件 |
| `error` | 图片加载失败 | 原始 error 事件 |
| `click` | 点击图片容器 | 原始点击事件 |

## 注意事项

- `height="auto"` 时容器没有固定高度，实际显示受图片 mode 和父布局影响。
- `src` 变化后当前实现不会自动重置失败状态，需通过重新创建组件实例刷新。

源码：`src/uni_modules/snake-ui/components/snake-image/snake-image.vue`
