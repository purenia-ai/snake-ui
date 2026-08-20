---
preview: /pages/componentsA/tabs
---

# Tabs 标签页

用于分类导航和状态筛选，支持滚动定位、禁用项、数量或圆点徽标及自定义指示线。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-tabs :list="['推荐', '新品', '热门']" :current="current" @change="current = $event" />
```

## 对象列表与徽标

```vue
<snake-tabs
    :list="[
        { name: '全部', count: 12 },
        { name: '待付款', count: 2 },
        { name: '已关闭', disabled: true }
    ]"
    count="count"
    :current="current"
    :is-dot="false"
    @change="current = $event"
/>
```

组件由父级控制 `current`；当前项变化时会自动滚到可视区域。

## API

### Props

| 参数                                          | 说明                              | 类型                        | 默认值                    |
| --------------------------------------------- | --------------------------------- | --------------------------- | ------------------------- |
| `list`                                        | 字符串或对象标签列表              | `Array<string \| object>`   | `[]`                      |
| `current`                                     | 当前索引                          | `number \| string`          | `0`                       |
| `name` / `count`                              | 对象标题和徽标字段名              | `string`                    | `name` / `count`          |
| `scrollable` / `isScroll`                     | 是否横向滚动，isScroll 为兼容别名 | `boolean`                   | `true`                    |
| `height` / `fontSize` / `gutter`              | 高度、字号、项目间距              | `string \| number`          | `80` / `30` / `30`        |
| `duration`                                    | 指示线动画时长，ms                | `number \| string`          | `300`                     |
| `lineColor` / `activeColor` / `inactiveColor` | 指示线、激活、未激活颜色          | `string`                    | 主题默认值                |
| `barWidth` / `barHeight`                      | 指示线宽高                        | `string \| number`          | `40` / `6`                |
| `offset`                                      | 徽标偏移 `[x, y]`                 | `[number, number]`          | `[0, 0]`                  |
| `isDot` / `bold` / `showBar`                  | 圆点徽标、激活加粗、显示指示线    | `boolean`                   | `false` / `true` / `true` |
| `itemWidth`                                   | 单项宽度或 auto                   | `string \| number`          | `auto`                    |
| `activeItemStyle` / `barStyle`                | 激活项和指示线附加样式            | `string \| object \| array` | `''`                      |
| `bgColor` / `customClass` / `customStyle`     | 背景与自定义样式                  | `string \| object \| array` | 主题默认值                |

对象项设置 `disabled: true` 后不可切换。

### Events

| 事件名   | 触发时机                | 参数              |
| -------- | ----------------------- | ----------------- |
| `click`  | 点击可用标签            | `{ index, item }` |
| `change` | 点击索引与 current 不同 | `index`           |

源码：`src/uni_modules/snake-ui/components/snake-tabs/snake-tabs.vue`
