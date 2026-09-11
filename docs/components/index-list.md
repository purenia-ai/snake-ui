---
preview: /pages/componentsA/indexList/index
---

# IndexList 页面索引列表

跟随页面滚动，通过右侧索引快速定位分组内容，与 `IndexAnchor` 配合使用。

如果列表位于弹窗、抽屉或定高区域，请使用 [`IndexListPanel`](./index-list-panel.md)。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

页面需要在 `onPageScroll` 中记录滚动位置并传给组件。

```vue
<script setup lang="ts">
import { onPageScroll } from '@dcloudio/uni-app';
import { ref } from 'vue';

const scrollTop = ref(0);
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});
</script>

<template>
    <snake-index-list :index-list="['A', 'B']" :scroll-top="scrollTop" @select="onSelect">
        <snake-index-anchor index="A" />
        <view>Apple</view>
        <snake-index-anchor index="B" />
        <view>Banana</view>
    </snake-index-list>
</template>
```

## API

### Props

| 参数                            | 说明                   | 类型                        | 默认值            |
| ------------------------------- | ---------------------- | --------------------------- | ----------------- |
| `indexList`                     | 右侧索引值             | `Array<string \| number>`   | `[]`              |
| `scrollTop`                     | 页面当前滚动位置       | `number \| string`          | `0`               |
| `zIndex`                        | 索引栏和吸顶锚点层级   | `number`                    | `965`             |
| `sticky`                        | 锚点是否吸顶           | `boolean`                   | `true`            |
| `offsetTop`                     | 页面吸顶与滚动目标偏移 | `string \| number`          | `0`               |
| `activeColor` / `inactiveColor` | 当前和默认索引颜色     | `string`                    | 主题色 / 弱文本色 |
| `railStyle`                     | 右侧索引栏样式         | `string \| object \| array` | `''`              |
| `customClass` / `customStyle`   | 自定义类名和样式       | `string \| object \| array` | `''`              |

裸数字和 `rpx` 字符串按 rpx 处理，显式 `px` 字符串按像素处理。

### Events

| 事件名   | 触发时机                 | 参数               |
| -------- | ------------------------ | ------------------ |
| `select` | 点击或拖动选择索引       | 索引值             |
| `change` | 页面滚动导致当前分组变化 | `{ index, value }` |

### Expose

| 方法                     | 说明                       |
| ------------------------ | -------------------------- |
| `scrollTo(indexOrValue)` | 页面滚动到序号或索引值     |
| `update()`               | 页面布局变化后重新测量锚点 |

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

## 从旧版迁移

旧版 `snake-index-list` 内置 `scroll-view`。升级后，页面场景需要传入页面 `scrollTop`；原弹窗和定高容器场景改用 `snake-index-list-panel`。
