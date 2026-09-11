---
preview: /pages/componentsA/tabs/index
---

# Tabs 标签页

用于同层级内容切换：滚动模式下激活标签自动居中，非滚动模式下标签均分宽度，所有标签保持单行。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

`current` 由父级控制，点击其他标签时 `change` 返回新索引：

```vue
<script setup lang="ts">
import { ref } from 'vue';

const current = ref(0);
const tabs = [{ name: '推荐' }, { name: '新品' }, { name: '热门' }];
</script>

<template>
    <snake-tabs :list="tabs" :current="current" @change="current = $event" />
</template>
```

## 均分标签

默认 `isScroll=true`，标签可左右拖动。少量标签可关闭滚动并均分容器宽度：

```vue
<snake-tabs :list="tabs" :current="current" :is-scroll="false" @change="current = $event" />
```

## 徽标和隐藏项

```vue
<snake-tabs
    :list="[
        { name: '全部', count: 12 },
        { name: '待付款', count: 2 },
        { name: '内部分类', hidden: true }
    ]"
    :current="current"
    @change="current = $event"
/>
```

`name` 和 `count` 可指定对象中的字段名；`isDot` 可将数字徽标改成圆点。`hidden` 隐藏标签但不改变其原数组索引。

## API

### Props

| 参数                            | 说明                             | 类型               | 默认值                    |
| ------------------------------- | -------------------------------- | ------------------ | ------------------------- |
| `list`                          | 标签对象数组                     | `TabItem[]`        | `[]`                      |
| `current`                       | 当前激活索引                     | `number \| string` | `0`                       |
| `isScroll`                      | 是否允许横向拖动                 | `boolean`          | `true`                    |
| `height` / `fontSize`           | 高度和字号，数值单位 rpx         | `number \| string` | `80` / `30`               |
| `duration`                      | 动画时长，单位秒                 | `number \| string` | `0.5`                     |
| `activeColor` / `inactiveColor` | 激活与未激活文字颜色             | `string`           | 主题色 / 主文字色         |
| `barWidth` / `barHeight`        | 滑块宽高，数值单位 rpx           | `number \| string` | `40` / `6`                |
| `gutter`                        | 滚动模式单侧内边距，数值单位 rpx | `number \| string` | `30`                      |
| `bgColor`                       | 背景色                           | `string`           | `#fff`                    |
| `name` / `count`                | 标题与徽标字段名                 | `string`           | `name` / `count`          |
| `offset`                        | 徽标 `[top, right]` 偏移         | `[number, number]` | `[5, 20]`                 |
| `isDot` / `bold` / `showBar`    | 圆点徽标、激活加粗、显示滑块     | `boolean`          | `false` / `true` / `true` |
| `activeItemStyle` / `barStyle`  | 激活项和滑块附加样式             | `object`           | `{}`                      |
| `itemWidth`                     | 标签宽度                         | `number \| string` | `auto`                    |
| `customClass` / `customStyle`   | 根节点自定义类和样式             | `string` / 样式值  | 空                        |

### Events

| 事件名   | 触发时机       | 参数    |
| -------- | -------------- | ------- |
| `change` | 点击非当前标签 | `index` |

### Methods

| 方法              | 说明                             |
| ----------------- | -------------------------------- |
| `init()`          | 重新测量标签布局                 |
| `clickTab(index)` | 执行与点击标签一致的逻辑         |
| `scrollByIndex()` | 按当前激活索引更新滚动位置和滑块 |

## 主题变量

| 变量名                  | 说明               |
| ----------------------- | ------------------ |
| `--snake-color-primary` | 激活文字和滑块颜色 |
| `--snake-color-text`    | 未激活文字颜色     |
| `--snake-color-error`   | 徽标默认背景色     |
