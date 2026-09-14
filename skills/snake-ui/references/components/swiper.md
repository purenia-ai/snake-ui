---
name: 'swiper'
description: 'Snake UI Swiper 轮播图参考。处理 swiper、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['swiper', 'snake-swiper', 'Swiper', '轮播图']
---

# Swiper 轮播图

基于 uni-app swiper 封装，支持图片或对象数据、自定义指示器、标题和 3D 卡片效果。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-swiper :list="['/static/a.png', '/static/b.png']" :height="360" indicator />
```

## 指示器与 3D 卡片

```vue
<snake-swiper :list="banners" name="image" mode="number" indicator-pos="bottomRight" effect3d show-title @change="onChange" @click="openBanner" />
```

对象图片依次读取 `name` 指定字段、`src`、`url`；标题读取 `title` 或 `text`。

```ts
const banners = [
    { id: 'new', image: '/static/banner-new.png', title: '新品上市' },
    { id: 'sale', image: '/static/banner-sale.png', title: '限时活动' }
];
```

## 受控切换与自定义指示器

将 `current` 绑定到状态可由业务主动切换轮播项；`change` 返回的新索引应同步回状态。`indicator` 插槽携带 `current` 与 `total`。

```vue
<snake-swiper :list="banners" :current="current" indicator @change="current = $event">
  <template #indicator="{ current, total }">
    <view class="banner-count">{{ current + 1 }} / {{ total }}</view>
  </template>
</snake-swiper>
```

## API

### Props

| 参数                                              | 说明                                                           | 类型                        | 默认值                           |
| ------------------------------------------------- | -------------------------------------------------------------- | --------------------------- | -------------------------------- |
| `list`                                            | 图片地址或对象列表                                             | `Array<string \| object>`   | `[]`                             |
| `current` / `height`                              | 当前索引、轮播高度                                             | `number \| string`          | `0` / `250`                      |
| `autoplay` / `interval` / `duration` / `circular` | 自动播放、间隔、动画时长、循环                                 | `boolean \| number`         | `true` / `3000` / `300` / `true` |
| `indicator`                                       | 是否显示自定义指示器；也兼容配置对象                           | `boolean \| object`         | `{}`                             |
| `mode`                                            | round/dot/rect/line/number                                     | `string`                    | `round`                          |
| `indicatorPos`                                    | topLeft/topCenter/topRight/bottomLeft/bottomCenter/bottomRight | `string`                    | `bottomCenter`                   |
| `indicatorColor` / `indicatorActiveColor`         | 普通和激活指示器颜色                                           | `string`                    | 半透明白 / 白色                  |
| `name`                                            | 对象图片字段                                                   | `string`                    | `image`                          |
| `radius` / `borderRadius`                         | 圆角，borderRadius 优先                                        | `string \| number`          | `8`                              |
| `previousMargin` / `nextMargin`                   | 前后边距                                                       | `string`                    | `0px`                            |
| `effect3d` / `effect3dPreviousMargin`             | 3D 卡片及露出边距                                              | `boolean \| UnitValue`      | `false` / `50`                   |
| `imgMode`                                         | 图片裁剪模式                                                   | `string`                    | `aspectFill`                     |
| `showTitle` / `title` / `titleStyle`              | 标题显示、兼容别名和样式                                       | `boolean \| style`          | `false`                          |
| `bgColor` / `customClass` / `customStyle`         | 背景与自定义样式                                               | `string \| object \| array` | 主题默认值                       |

### Events

| 事件名            | 触发时机   | 参数                   |
| ----------------- | ---------- | ---------------------- |
| `change`          | 当前项变化 | `current: number`      |
| `animationfinish` | 动画结束   | `{ current, source? }` |
| `click`           | 点击轮播项 | `index: number`        |

### Slots

| 插槽名      | 说明                                        |
| ----------- | ------------------------------------------- |
| `indicator` | 替换内置指示器，参数为 `{ current, total }` |

## 主题变量

组件未直接使用 CSS 主题变量。可通过 `indicatorColor`、`indicatorActiveColor`、`bgColor` 和 `customStyle` 调整视觉样式。
