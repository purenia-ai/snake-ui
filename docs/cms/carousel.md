# 轮播图

用于带自动播放、循环和指示器的图片轮播。

## 完整信封

```ts
{
    component: 'v2.carousel', text: '轮播图', type: '3-2', active: true,
    props: {
        play: { autoplay: true, interval: 3, loop: true },
        indicator: { type: 'bullets', color: '#1989fa' },
        style: { heightMode: 'auto', height: 200, pageMargin: 0, imageRadius: 0, backgroundColor: '#FFFFFF' },
        items: [{ id: 'slide-1', src: 'https://example.com/a.png', link: { httpType: 11, http: 'https://example.com' } }]
    }
}
```

## Props

| 字段              | 类型                                                 | 默认值      | 说明           |
| ----------------- | ---------------------------------------------------- | ----------- | -------------- |
| `play.autoplay`   | `boolean`                                            | `true`      | 自动播放       |
| `play.interval`   | `number`                                             | `3`         | 播放间隔，秒   |
| `play.loop`       | `boolean`                                            | `true`      | 循环播放       |
| `indicator.type`  | `'none' \| 'bullets' \| 'fraction' \| 'progressbar'` | `'bullets'` | 指示器类型     |
| `indicator.color` | `string`                                             | `'#1989fa'` | 指示器颜色     |
| `style.*`         | [共享图片样式](/cms/data-contract#共享图片样式)      | -           | 视觉样式       |
| `items`           | `CmsV2ImageItem[]`                                   | `[]`        | 轮播图片及链接 |

运行时把秒转换为 swiper 使用的毫秒。
