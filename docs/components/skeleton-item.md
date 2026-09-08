---
preview: /pages/componentsA/skeletonItem/index
---

# SkeletonItem 骨架占位

提供可组合的基础占位块，通常用于 `snake-skeleton` 的 `template` 插槽。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-skeleton-item variant="circle" width="96rpx" height="96rpx" />
<snake-skeleton-item variant="image" height="300rpx" radius="20rpx" />
<snake-skeleton-item width="60%" :animated="false" />
```

## API

### Props

| 参数          | 说明                           | 类型                                  | 默认值 |
| ------------- | ------------------------------ | ------------------------------------- | ------ |
| `variant`     | 占位形态                       | `text \| rect \| circle \| image`    | `text` |
| `width`       | 宽度，数字按 px                | `string \| number`                   | 按形态 |
| `height`      | 高度，数字按 px                | `string \| number`                   | 按形态 |
| `radius`      | 圆角，数字按 px                | `string \| number`                   | 按形态 |
| `animated`    | 动画开关，默认继承骨架容器     | `boolean`                             | `true` |
| `customStyle` | 根节点样式                     | `string \| object \| array`          | `''`   |

源码：`src/uni_modules/snake-ui/components/snake-skeleton-item/snake-skeleton-item.vue`
