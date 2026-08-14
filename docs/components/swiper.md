---
preview: /pages/componentsA/swiper
---

# Swiper 轮播图

封装 uni-app `swiper`，用于广告、Banner 和图片内容轮播，支持字符串与对象两种数据源。

## 平台兼容性

| H5 | 微信小程序 | App |
| :-: | :-: | :-: |
| 支持 | 支持 | 支持 |

## 基础用法

```vue
<snake-swiper :list="['/static/a.png', '/static/b.png']" :height="360" indicator />
```

## 对象数据与标题

```vue
<snake-swiper
  :list="[{ image: '/static/a.png', title: '新品上市' }]"
  name="image"
  show-title
  :autoplay="false"
  :radius="16"
  @change="current = $event.current"
  @click="openBanner"
/>
```

对象图片地址优先读取 `name` 指定字段，随后回退到 `src` 和 `url`；标题读取 `title` 或 `text`。

## 卡片间距与自定义指示器

```vue
<snake-swiper :list="list" previous-margin="30px" next-margin="30px">
  <template #indicator><text>{{ current + 1 }}/{{ list.length }}</text></template>
</snake-swiper>
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 | 可选值 |
| --- | --- | --- | --- | --- |
| `list` | 图片字符串或对象列表 | `Array<string \| object>` | `[]` | - |
| `current` | 当前索引 | `number` | `0` | - |
| `height` | 轮播高度，数字按 rpx 处理 | `string \| number` | `300` | - |
| `autoplay` | 是否自动播放 | `boolean` | `true` | `true` / `false` |
| `interval` | 自动切换间隔，单位 ms | `number` | `3000` | - |
| `duration` | 切换动画时长，单位 ms | `number` | `300` | - |
| `circular` | 是否循环播放 | `boolean` | `true` | `true` / `false` |
| `indicator` | 是否显示原生指示点 | `boolean` | `false` | `true` / `false` |
| `name` | 对象图片字段名 | `string` | `url` | - |
| `radius` | 容器圆角，数字按 rpx 处理 | `string \| number` | `0` | - |
| `previousMargin` | 前边距 | `string` | `0px` | - |
| `nextMargin` | 后边距 | `string` | `0px` | - |
| `imgMode` | 图片裁剪模式 | `string` | `aspectFill` | uni-app image mode |
| `showTitle` | 是否显示对象标题 | `boolean` | `false` | `true` / `false` |

### Events

| 事件名 | 触发时机 | 回调参数 |
| --- | --- | --- |
| `change` | 自动或手动切换后 | `{ current: number }` |
| `click` | 点击某个轮播项 | `index: number` |

### Slots

| 插槽名 | 说明 | 作用域参数 |
| --- | --- | --- |
| `indicator` | 自定义指示器内容 | - |

## 注意事项

- 当前只渲染图片，不支持视频项、加载态和自动类型识别。
- 自定义指示器插槽不提供当前索引，需要监听 `change` 自行维护。
- `indicator` 控制原生指示点，可与自定义插槽分别使用。

源码：`src/uni_modules/snake-ui/components/snake-swiper/snake-swiper.vue`
