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
<snake-swiper :list="['/static/a.png', '/static/b.png']" :height="180" indicator />
```

## 指示器与 3D 卡片

```vue
<snake-swiper
    :list="banners"
    name="image"
    mode="number"
    indicator-pos="bottomRight"
    effect3d
    show-title
    @change="onChange"
    @click="openBanner"
/>
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

| 参数                     | 说明                                                                                                                                               | 类型                                 | 默认值                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ---------------------- |
| `list`                   | 用于渲染的数据列表，支持图片地址字符串或对象                                                                                                       | `SwiperItem[]`                       | `[]`                   |
| `current`                | 当前激活项索引，可绑定状态受控切换                                                                                                                 | `number \| string`                   | `0`                    |
| `height`                 | 组件高度                                                                                                                                           | `UnitValue`                          | `125`                  |
| `autoplay`               | 是否自动播放                                                                                                                                       | `boolean`                            | `true`                 |
| `interval`               | 自动播放间隔，单位 ms                                                                                                                              | `number`                             | `3000`                 |
| `duration`               | 切换动画时长，单位 ms                                                                                                                              | `number`                             | `500`                  |
| `circular`               | 是否循环播放                                                                                                                                       | `boolean`                            | `true`                 |
| `indicator`              | 是否显示指示器，也可传配置对象，传 `false` 时隐藏                                                                                                  | `boolean \| Record<string, unknown>` | `{}`                   |
| `mode`                   | 指示器样式，可选值 `round`（圆点，激活时拉伸）/ `dot`（圆点）/ `rect`（矩形）/ `line`（横线）/ `number`（数字页码）/ `none`（不渲染内置指示器）    | `SwiperIndicatorMode`                | `round`                |
| `indicatorPos`           | 指示器位置，可选值 `topLeft`（左上）/ `topCenter`（上中）/ `topRight`（右上）/ `bottomLeft`（左下）/ `bottomCenter`（下中）/ `bottomRight`（右下） | `SwiperIndicatorPosition`            | `bottomCenter`         |
| `indicatorColor`         | 指示器未激活颜色                                                                                                                                   | `string`                             | `rgba(0,0,0,.3)`       |
| `indicatorActiveColor`   | 指示器激活颜色                                                                                                                                     | `string`                             | `rgba(255,255,255,.8)` |
| `name`                   | 对象数据中图片地址的字段名，未命中时依次回退 `image` / `src` / `url`                                                                               | `string`                             | `image`                |
| `radius`                 | 圆角大小                                                                                                                                           | `UnitValue`                          | `4`                    |
| `borderRadius`           | 圆角大小，设置后优先于 `radius`                                                                                                                    | `UnitValue`                          | -                      |
| `previousMargin`         | 露出前一项的边距                                                                                                                                   | `string`                             | `0px`                  |
| `nextMargin`             | 露出后一项的边距                                                                                                                                   | `string`                             | `0px`                  |
| `effect3d`               | 是否开启 3D 卡片效果                                                                                                                               | `boolean`                            | `false`                |
| `effect3dPreviousMargin` | 3D 卡片模式下露出前后项的边距                                                                                                                      | `UnitValue`                          | `25`                   |
| `imgMode`                | 图片裁剪与缩放模式                                                                                                                                 | `ImageMode`                          | `aspectFill`           |
| `showTitle`              | 是否在图片底部显示标题，标题取数据项的 `title` 或 `text` 字段                                                                                      | `boolean`                            | `false`                |
| `title`                  | 是否显示标题，`showTitle` 的兼容写法                                                                                                               | `boolean`                            | -                      |
| `titleStyle`             | 标题自定义样式                                                                                                                                     | `StyleValue`                         | `''`                   |
| `bgColor`                | 背景颜色                                                                                                                                           | `string`                             | 主题背景色             |
| `customClass`            | 根节点自定义类名                                                                                                                                   | `string`                             | `''`                   |
| `customStyle`            | 根节点自定义样式                                                                                                                                   | `StyleValue`                         | `''`                   |

### Events

| 事件名            | 触发时机   | 参数                   |
| ----------------- | ---------- | ---------------------- |
| `change`          | 当前项变化 | `current: number`      |
| `click`           | 点击轮播项 | `index: number`        |
| `animationfinish` | 动画结束   | `{ current, source? }` |

### Slots

| 插槽名      | 说明                                        |
| ----------- | ------------------------------------------- |
| `indicator` | 替换内置指示器，参数为 `{ current, total }` |

## 主题变量

组件未直接使用 CSS 主题变量。可通过 `indicatorColor`、`indicatorActiveColor`、`bgColor` 和 `customStyle` 调整视觉样式。
