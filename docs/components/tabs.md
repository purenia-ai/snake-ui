---
preview: /pages/componentsA/tabs/index
---

# Tabs 标签页

用于分类导航和状态筛选。标签较多时，激活项会自动滚动到容器中间；同时支持隐藏或禁用标签、数量或圆点徽标及自定义指示线。

## 何时使用

- 用于同一页面内并列内容的快速切换，例如推荐、新品和热门。
- 标签表达的是页面层级导航时，应改用 Navbar 或页面路由，避免把 Tabs 当成全局导航。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

`current` 由父级控制，`change` 返回待切换的原数组索引：

```vue
<script setup lang="ts">
import { ref } from 'vue';

const current = ref(0);
const tabs = ['推荐', '新品', '热门'];
</script>

<template>
    <snake-tabs :list="tabs" :current="current" @change="current = $event" />
</template>
```

## 滚动与居中

滚动模式默认开启。标签超过容器宽度时，激活项会自动移动到中间；少量标签可以关闭滚动，让各项平分宽度：

```vue
<snake-tabs :list="tabs" :current="current" :scrollable="false" @change="current = $event" />
```

`isScroll` 是兼容 uView Pro 命名的别名；同时传入时优先使用 `isScroll`。

H5 中标签组使用 `tablist` / `tab` 语义。Tab 键进入当前项后，可使用左右方向键跳过隐藏或禁用项并切换标签。

## 对象列表与徽标

```vue
<snake-tabs
    :list="[
        { name: '全部', count: 12 },
        { name: '待付款', count: 2 },
        { name: '内部分类', hidden: true },
        { name: '已关闭', disabled: true }
    ]"
    :current="current"
    :is-dot="false"
    @change="current = $event"
/>
```

- `name` 和 `count` 可以改为后端数据实际使用的字段名。
- `hidden: true` 不渲染标签，但数组索引保持不变。
- `disabled: true` 保留点击反馈，但不会触发切换。
- `isDot` 为 `true` 时，存在徽标值的标签显示为圆点。

## 自定义指示线

```vue
<snake-tabs
    :list="tabs"
    :current="current"
    line-color="#06D290"
    :bar-width="48"
    :bar-height="6"
    :duration="0.3"
    :bar-style="{ borderRadius: '3rpx' }"
/>
```

`duration` 的单位是秒。数值形式的高度、字号、间距、指示线尺寸和徽标偏移均按 rpx 解释；传入带单位字符串时原样使用。

## API

### Props

| 参数                                          | 说明                                       | 类型                        | 默认值                    |
| --------------------------------------------- | ------------------------------------------ | --------------------------- | ------------------------- |
| `list`                                        | 字符串或对象标签列表                       | `Array<string \| object>`   | `[]`                      |
| `current`                                     | 当前原数组索引                             | `number \| string`          | `0`                       |
| `name` / `count`                              | 对象标题和徽标字段名                       | `string`                    | `name` / `count`          |
| `scrollable` / `isScroll`                     | 是否横向滚动，`isScroll` 为兼容别名        | `boolean`                   | `true`                    |
| `height` / `fontSize` / `gutter`              | 高度、字号、标签左右内边距，数值单位为 rpx | `string \| number`          | `80` / `30` / `30`        |
| `duration`                                    | 文字和指示线动画时长，单位秒               | `number \| string`          | `0.3`                     |
| `lineColor` / `activeColor` / `inactiveColor` | 指示线、激活、未激活颜色                   | `string`                    | 主题默认值                |
| `barWidth` / `barHeight`                      | 指示线宽高，数值单位为 rpx                 | `string \| number`          | `40` / `6`                |
| `offset`                                      | 徽标 `[top, right]` 偏移，单位 rpx         | `[number, number]`          | `[5, 20]`                 |
| `isDot` / `bold` / `showBar`                  | 圆点徽标、激活加粗、显示指示线             | `boolean`                   | `false` / `true` / `true` |
| `itemWidth`                                   | 单项宽度或 `auto`，数值单位为 rpx          | `string \| number`          | `auto`                    |
| `activeItemStyle` / `barStyle`                | 激活项和指示线附加样式                     | `string \| object \| array` | `''`                      |
| `bgColor` / `customClass` / `customStyle`     | 背景与自定义样式                           | `string \| object \| array` | 主题默认值                |

### Events

| 事件名   | 触发时机                          | 参数              |
| -------- | --------------------------------- | ----------------- |
| `click`  | 点击任意可见标签                  | `{ index, item }` |
| `change` | 点击可用且与 `current` 不同的标签 | `index`           |

### Methods

通过模板 ref 可以调用：

| 方法              | 说明                                             |
| ----------------- | ------------------------------------------------ |
| `init()`          | 等待视图更新后重新测量，并同步指示线和滚动位置   |
| `scrollByIndex()` | 按当前 `current` 重新计算滚动位置，行为等同 init |

当 Tabs 初始位于隐藏容器中，容器显示后调用 `init()` 即可重新获取正确宽度。

## 无障碍

标签支持键盘聚焦，并使用 `tab` / `aria-selected` 表达当前状态。禁用项不会触发切换；业务侧应为纯图标或缩写标签提供可理解的文字名称。

## 类型定义

Props、事件和实例方法类型从包根导出，可使用 `SnakeTabsProps`、`SnakeTabsEmits` 与 `SnakeTabsExpose`，无需从组件内部路径导入。

源码：`src/uni_modules/snake-ui/components/snake-tabs/snake-tabs.vue`
