---
preview: /pages/componentsA/index-anchor
---

# IndexAnchor 索引锚点

定义 `IndexList` 中的分组位置，并根据父组件配置提供吸顶效果。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-index-list :index-list="['A']">
  <snake-index-anchor index="A" text="A 类商品" />
  <view>Apple</view>
</snake-index-list>
```

## 自定义内容

```vue
<snake-index-anchor index="HOT" use-slot>
  <view class="custom-anchor">热门城市</view>
</snake-index-anchor>
```

## API

### Props

| 参数          | 说明                       | 类型                        | 默认值  |
| ------------- | -------------------------- | --------------------------- | ------- |
| `index`       | 对应父级 indexList 的值    | `string \| number`          | 必填    |
| `text`        | 展示文字；为空时显示 index | `string`                    | `''`    |
| `useSlot`     | 是否优先使用默认插槽       | `boolean`                   | `false` |
| `customClass` | 自定义类名                 | `string`                    | `''`    |
| `customStyle` | 锚点自定义样式             | `string \| object \| array` | `''`    |

### Slots

| 插槽名    | 说明                       |
| --------- | -------------------------- |
| `default` | useSlot 为 true 时替换文字 |

源码：`src/uni_modules/snake-ui/components/snake-index-anchor/snake-index-anchor.vue`
