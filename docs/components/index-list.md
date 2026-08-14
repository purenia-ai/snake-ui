---
preview: /pages/componentsA/index-list
---

# IndexList 索引列表

通过右侧索引快速定位分组内容，与 `IndexAnchor` 配合使用。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-index-list :index-list="['A', 'B']">
  <snake-index-anchor :index="0" text="A" />
  <view>Apple</view>
  <snake-index-anchor :index="1" text="B" />
  <view>Banana</view>
</snake-index-list>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `indexList` | 右侧索引文字 | `string[]` | `[]` | - |
| `activeColor` | 当前索引颜色 | `string` | `#26273a` | CSS 颜色 |
| `inactiveColor` | 其他索引颜色 | `string` | `#acacb7` | CSS 颜色 |

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 索引锚点和列表内容 |

源码：`src/uni_modules/snake-ui/components/snake-index-list/snake-index-list.vue`
