---
preview: /pages/componentsA/indexAnchor/index
---

# IndexAnchor 索引锚点

定义索引列表中的分组位置，可在页面型 `IndexList` 或容器型 `IndexListPanel` 中使用。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-index-list-panel :index-list="['A']">
  <snake-index-anchor index="A" text="A 类商品" />
  <view>Apple</view>
</snake-index-list-panel>
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

## 主题变量

| 变量名                     | 说明         |
| -------------------------- | ------------ |
| `--snake-color-text`       | 锚点文字颜色 |
| `--snake-color-background` | 锚点背景颜色 |

源码：`src/uni_modules/snake-ui/components/snake-index-anchor/snake-index-anchor.vue`
