---
preview: /pages/componentsA/index-anchor
---

# IndexAnchor 索引锚点

定义 `IndexList` 中的分组位置，`index` 必须与父级 `indexList` 顺序一致。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-index-list :index-list="['A']">
  <snake-index-anchor :index="0" text="A" custom-style="height: 64rpx" />
</snake-index-list>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `index` | 在父级索引中的位置 | `number` | 必填 | `0` 及以上 |
| `text` | 锚点文字 | `string` | `''` | - |
| `customStyle` | 锚点行内样式 | `string \| object` | `''` | - |

源码：`src/uni_modules/snake-ui/components/snake-index-anchor/snake-index-anchor.vue`
