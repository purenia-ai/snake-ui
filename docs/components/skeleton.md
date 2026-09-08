---
preview: /pages/componentsA/skeleton/index
---

# Skeleton 骨架屏

在首次请求尚未完成时预显示页面结构，支持快速段落模式和自定义骨架模板。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-skeleton :loading="loading" avatar :rows="3">
  <view>真实内容</view>
</snake-skeleton>

<snake-skeleton :loading="loading">
  <template #template>
    <snake-skeleton-item variant="image" height="300rpx" />
    <snake-skeleton-item width="60%" custom-style="margin-top: 20rpx" />
  </template>
  <view>真实内容</view>
</snake-skeleton>
```

## API

### Props

| 参数          | 说明                         | 类型                               | 默认值 |
| ------------- | ---------------------------- | ---------------------------------- | ------ |
| `loading`     | 是否显示骨架                 | `boolean`                          | `true` |
| `animated`    | 是否启用流光动画             | `boolean`                          | `true` |
| `title`       | 是否显示默认标题占位         | `boolean`                          | `true` |
| `titleWidth`  | 默认标题宽度                 | `string \| number`                | `40%`  |
| `titleHeight` | 默认标题高度                 | `string \| number`                | `18`   |
| `rows`        | 默认段落行数                 | `number`                           | `3`    |
| `rowsWidth`   | 默认段落宽度，可逐行配置     | `string \| number \| Array`       | `100%` |
| `rowsHeight`  | 默认段落高度，可逐行配置     | `string \| number \| Array`       | `16`   |
| `avatar`      | 是否显示默认头像占位         | `boolean`                          | `false`|
| `avatarSize`  | 默认头像尺寸                 | `string \| number`                | `32`   |
| `avatarShape` | 默认头像形状                 | `circle \| square`                | `circle` |
| `customStyle` | 根节点样式                   | `string \| object \| array`       | `''`   |

### Slots

| 名称       | 说明                 |
| ---------- | -------------------- |
| `default`  | 加载完成后的真实内容 |
| `template` | 自定义骨架模板       |

源码：`src/uni_modules/snake-ui/components/snake-skeleton/snake-skeleton.vue`
