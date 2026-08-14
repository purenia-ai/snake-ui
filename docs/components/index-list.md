---
preview: /pages/componentsA/index-list
---

# IndexList 索引列表

通过右侧索引快速定位分组内容，与 `IndexAnchor` 配合使用。支持点击、触摸滑动、当前分组同步和吸顶锚点。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-index-list :index-list="['A', 'B']" @select="onSelect">
  <snake-index-anchor index="A" />
  <view>Apple</view>
  <snake-index-anchor index="B" />
  <view>Banana</view>
</snake-index-list>
```

父容器需要提供确定高度；组件内部使用 scroll-view。锚点 `index` 应与 `indexList` 的值一致。

## API

### Props

| 参数                            | 说明                 | 类型                        | 默认值            |
| ------------------------------- | -------------------- | --------------------------- | ----------------- |
| `indexList`                     | 右侧索引值           | `Array<string \| number>`   | `[]`              |
| `scrollTop`                     | 受控滚动位置         | `number \| string`          | `0`               |
| `zIndex`                        | 索引栏和吸顶锚点层级 | `number`                    | `965`             |
| `sticky`                        | 锚点是否吸顶         | `boolean`                   | `true`            |
| `offsetTop`                     | 吸顶偏移             | `string \| number`          | `0`               |
| `activeColor` / `inactiveColor` | 当前和默认索引颜色   | `string`                    | 主题色 / 弱文本色 |
| `railStyle`                     | 右侧索引栏样式       | `string \| object \| array` | `''`              |
| `customClass` / `customStyle`   | 自定义类名和样式     | `string \| object \| array` | `''`              |

### Events

| 事件名   | 触发时机           | 参数               |
| -------- | ------------------ | ------------------ |
| `select` | 点击或滑动选择索引 | 索引值             |
| `change` | 当前分组变化       | `{ index, value }` |

### Expose

| 方法                     | 说明                       |
| ------------------------ | -------------------------- |
| `scrollTo(indexOrValue)` | 滚动到序号或索引值         |
| `update()`               | 内容尺寸变化后重新测量锚点 |

源码：`src/uni_modules/snake-ui/components/snake-index-list/snake-index-list.vue`
