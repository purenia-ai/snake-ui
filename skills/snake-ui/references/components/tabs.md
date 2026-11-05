---
name: 'tabs'
description: 'Snake UI Tabs 标签页参考。处理 tabs、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['tabs', 'snake-tabs', 'Tabs', '标签页']
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

`name` 和 `count` 可指定对象中的字段名；`isDot` 可将数字徽标改成圆点。徽标由 snake-badge 渲染，圆心锚定标签文字的右上角点，`offset` 在此基础上偏移。`hidden` 隐藏标签但不改变其原数组索引；`disabled` 置灰标签并拦截切换，点击触发 `disabled` 事件。

## 动态数据

异步更新 `list` 后，等待视图更新再调用实例的 `init()`，重新测量标签宽度与滑块位置；如果当前索引已超出新列表范围，应由业务先重置 `current`。标签宽度与滑块位置在每次切换时都会重新测量，字体晚到或语言切换后无需手动补偿。

```ts
tabs.value = await getTabs();
current.value = Math.min(current.value, Math.max(tabs.value.length - 1, 0));
await nextTick();
tabsRef.value?.init();
```

## API

### Props

| 参数              | 说明                                                              | 类型               | 默认值       |
| ----------------- | ----------------------------------------------------------------- | ------------------ | ------------ |
| `customStyle`     | 根节点自定义样式                                                  | `StyleValue`       | `''`         |
| `customClass`     | 根节点自定义类名                                                  | `string`           | `''`         |
| `isScroll`        | 是否允许横向拖动，关闭后标签均分宽度                              | `boolean`          | `true`       |
| `list`            | 标签对象数组                                                      | `TabItem[]`        | `[]`         |
| `current`         | 当前激活索引                                                      | `number \| string` | `0`          |
| `height`          | 导航栏高度，数值单位 px（375 稿）                                 | `UnitValue`        | `40`         |
| `fontSize`        | 标签字号，数值单位 px（375 稿）                                   | `UnitValue`        | `15`         |
| `duration`        | 动画时长，单位秒                                                  | `number \| string` | `0.5`        |
| `activeColor`     | 激活文字及滑块颜色                                                | `string`           | 主题主色     |
| `inactiveColor`   | 未激活文字颜色                                                    | `string`           | 主题主文字色 |
| `barWidth`        | 滑块宽度，数值单位 px（375 稿）                                   | `UnitValue`        | `20`         |
| `barHeight`       | 滑块高度，数值单位 px（375 稿）                                   | `UnitValue`        | `3`          |
| `gutter`          | 滚动模式标签左右内边距，数值单位 px（375 稿）                     | `UnitValue`        | `15`         |
| `bgColor`         | 导航栏背景色                                                      | `string`           | `#fff`       |
| `name`            | 标签内容字段名                                                    | `string`           | `name`       |
| `count`           | 徽标内容字段名                                                    | `string`           | `count`      |
| `offset`          | 徽标相对文字右上角点的 `[top, right]` 偏移，数值单位 px（375 稿） | `[number, number]` | `[0, 0]`     |
| `isDot`           | 是否显示圆点徽标                                                  | `boolean`          | `false`      |
| `bold`            | 激活项是否加粗                                                    | `boolean`          | `true`       |
| `activeItemStyle` | 激活标签附加样式                                                  | `CSSProperties`    | `{}`         |
| `showBar`         | 是否显示底部滑块                                                  | `boolean`          | `true`       |
| `barStyle`        | 底部滑块附加样式                                                  | `CSSProperties`    | `{}`         |
| `itemWidth`       | 单个标签宽度                                                      | `UnitValue`        | `auto`       |

### Events

| 事件名     | 触发时机                     | 参数            |
| ---------- | ---------------------------- | --------------- |
| `change`   | 点击非当前且未禁用的标签     | `index: number` |
| `click`    | 点击任意标签（含当前与禁用） | `index: number` |
| `disabled` | 点击禁用标签                 | `index: number` |

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
