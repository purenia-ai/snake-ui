---
preview: /pages/componentsA/indexListPanel/index
---

# IndexListPanel 容器索引列表

用于弹窗、抽屉和定高区域的索引列表。组件内部创建 `scroll-view`，不依赖页面滚动位置。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

父容器必须提供确定高度。

```vue
<view style="height: 600rpx">
  <snake-index-list-panel :index-list="['A', 'B']" @select="onSelect">
    <snake-index-anchor index="A" />
    <view>Apple</view>
    <snake-index-anchor index="B" />
    <view>Banana</view>
  </snake-index-list-panel>
</view>
```

## API

### Props

| 参数                            | 说明                 | 类型                        | 默认值            |
| ------------------------------- | -------------------- | --------------------------- | ----------------- |
| `indexList`                     | 右侧索引值           | `Array<string \| number>`   | `[]`              |
| `scrollTop`                     | 内部容器目标滚动位置 | `number \| string`          | `0`               |
| `zIndex`                        | 索引栏和吸顶锚点层级 | `number`                    | `965`             |
| `sticky`                        | 锚点是否吸顶         | `boolean`                   | `true`            |
| `offsetTop`                     | 容器内吸顶偏移       | `string \| number`          | `0`               |
| `activeColor` / `inactiveColor` | 当前和默认索引颜色   | `string`                    | 主题色 / 弱文本色 |
| `railStyle`                     | 右侧索引栏样式       | `string \| object \| array` | `''`              |
| `customClass` / `customStyle`   | 自定义类名和样式     | `string \| object \| array` | `''`              |

### Events

| 事件名   | 触发时机           | 参数               |
| -------- | ------------------ | ------------------ |
| `select` | 点击或拖动选择索引 | 索引值             |
| `change` | 当前分组变化       | `{ index, value }` |

### Expose

| 方法                     | 说明                       |
| ------------------------ | -------------------------- |
| `scrollTo(indexOrValue)` | 滚动到序号或索引值         |
| `update()`               | 内容尺寸变化后重新测量锚点 |

### Slots

| 插槽名    | 说明                     |
| --------- | ------------------------ |
| `default` | 索引锚点及对应的分组内容 |

## 主题变量

| 变量名                        | 说明                   |
| ----------------------------- | ---------------------- |
| `--snake-color-primary`       | 当前索引默认颜色       |
| `--snake-color-text-muted`    | 未激活索引默认颜色     |
| `--snake-color-primary-light` | 当前索引提示层背景颜色 |

源码：`src/uni_modules/snake-ui/components/snake-index-list-panel/snake-index-list-panel.vue`
