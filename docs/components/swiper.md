---
preview: /pages/componentsA/swiper/index
---

# Swiper 轮播图

基于 uni-app swiper 封装，支持图片或对象数据、自定义指示器、标题和 3D 卡片效果。

## 平台兼容性

|  H5  | 微信小程序 | App  |
| :--: | :--------: | :--: |
| 支持 |    支持    | 支持 |

## 基础用法

```vue
<snake-swiper :list="['/static/a.png', '/static/b.png']" :height="360" indicator />
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

## API

### Props

| 参数                                              | 说明                                                           | 类型                        | 默认值                           |
| ------------------------------------------------- | -------------------------------------------------------------- | --------------------------- | -------------------------------- |
| `list`                                            | 图片地址或对象列表                                             | `Array<string \| object>`   | `[]`                             |
| `current` / `height`                              | 当前索引、轮播高度                                             | `number \| string`          | `0` / `300`                      |
| `autoplay` / `interval` / `duration` / `circular` | 自动播放、间隔、动画时长、循环                                 | `boolean \| number`         | `true` / `3000` / `300` / `true` |
| `indicator`                                       | 是否显示自定义指示器；也兼容配置对象                           | `boolean \| object`         | `false`                          |
| `mode`                                            | round/dot/line/number                                          | `string`                    | `round`                          |
| `indicatorPos`                                    | topLeft/topCenter/topRight/bottomLeft/bottomCenter/bottomRight | `string`                    | `bottomCenter`                   |
| `indicatorColor` / `indicatorActiveColor`         | 普通和激活指示器颜色                                           | `string`                    | 半透明白 / 白色                  |
| `name`                                            | 对象图片字段                                                   | `string`                    | `url`                            |
| `radius` / `borderRadius`                         | 圆角，borderRadius 优先                                        | `string \| number`          | `0`                              |
| `previousMargin` / `nextMargin`                   | 前后边距                                                       | `string`                    | `0px`                            |
| `effect3d` / `effect3dPreviousMargin`             | 3D 卡片及露出边距                                              | `boolean \| UnitValue`      | `false` / `50`                   |
| `imgMode`                                         | 图片裁剪模式                                                   | `string`                    | `aspectFill`                     |
| `showTitle` / `title` / `titleStyle`              | 标题显示、兼容别名和样式                                       | `boolean \| style`          | `false`                          |
| `bgColor` / `customClass` / `customStyle`         | 背景与自定义样式                                               | `string \| object \| array` | 主题默认值                       |

### Events

| 事件名            | 触发时机   | 参数                   |
| ----------------- | ---------- | ---------------------- |
| `change`          | 当前项变化 | `{ current, source? }` |
| `animationfinish` | 动画结束   | `{ current, source? }` |
| `click`           | 点击轮播项 | `(index, item)`        |

### Slots

| 插槽名      | 说明           |
| ----------- | -------------- |
| `indicator` | 替换内置指示器 |

源码：`src/uni_modules/snake-ui/components/snake-swiper/snake-swiper.vue`
