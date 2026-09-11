---
preview: /pages/componentsA/skeleton/index
---

# Skeleton 骨架屏

`Skeleton` 在首次请求尚未完成时预显示页面结构，支持快速段落模式和自定义骨架模板；`SkeletonItem` 是可组合的基础占位块，用于自由搭建骨架结构。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

快速模式通过 `avatar`、`title` 和 `rows` 等属性直接生成默认骨架：

```vue
<snake-skeleton :loading="loading" avatar :rows="3">
  <view>真实内容</view>
</snake-skeleton>
```

## 自定义模板

在 `template` 插槽中用 `SkeletonItem` 自由组合业务骨架：

```vue
<snake-skeleton :loading="loading">
  <template #template>
    <snake-skeleton-item variant="image" height="300rpx" />
    <snake-skeleton-item width="60%" custom-style="margin-top: 20rpx" />
  </template>
  <view>真实内容</view>
</snake-skeleton>
```

`SkeletonItem` 支持 `text`、`rect`、`circle`、`image` 四种占位形态，也可以脱离 `Skeleton` 独立使用。

## API

### Skeleton

#### Props

| 参数          | 说明                     | 类型                        | 默认值   |
| ------------- | ------------------------ | --------------------------- | -------- |
| `loading`     | 是否显示骨架             | `boolean`                   | `true`   |
| `animated`    | 是否启用流光动画         | `boolean`                   | `true`   |
| `title`       | 是否显示默认标题占位     | `boolean`                   | `true`   |
| `titleWidth`  | 默认标题宽度             | `string \| number`          | `40%`    |
| `titleHeight` | 默认标题高度             | `string \| number`          | `18`     |
| `rows`        | 默认段落行数             | `number`                    | `3`      |
| `rowsWidth`   | 默认段落宽度，可逐行配置 | `string \| number \| Array` | `100%`   |
| `rowsHeight`  | 默认段落高度，可逐行配置 | `string \| number \| Array` | `16`     |
| `avatar`      | 是否显示默认头像占位     | `boolean`                   | `false`  |
| `avatarSize`  | 默认头像尺寸             | `string \| number`          | `32`     |
| `avatarShape` | 默认头像形状             | `circle \| square`          | `circle` |
| `customStyle` | 根节点样式               | `string \| object \| array` | `''`     |

#### Slots

| 名称       | 说明                 |
| ---------- | -------------------- |
| `default`  | 加载完成后的真实内容 |
| `template` | 自定义骨架模板       |

### SkeletonItem

#### Props

| 参数          | 说明                       | 类型                              | 默认值 |
| ------------- | -------------------------- | --------------------------------- | ------ |
| `variant`     | 占位形态                   | `text \| rect \| circle \| image` | `text` |
| `width`       | 宽度，数字按 px            | `string \| number`                | 按形态 |
| `height`      | 高度，数字按 px            | `string \| number`                | 按形态 |
| `radius`      | 圆角，数字按 px            | `string \| number`                | 按形态 |
| `animated`    | 动画开关，默认继承骨架容器 | `boolean`                         | `true` |
| `customStyle` | 根节点样式                 | `string \| object \| array`       | `''`   |

## 主题变量

| 变量                         | 用途           |
| ---------------------------- | -------------- |
| `--snake-skeleton-color`     | 骨架基础背景色 |
| `--snake-skeleton-highlight` | 流光高亮颜色   |
