# 视频 `v2.video`

渲染单个视频、封面和自动播放设置。

## 完整信封

```ts
{
    component: 'v2.video', text: '视频', type: '3-4', active: true,
    props: {
        src: 'https://example.com/video.mp4', coverUrl: 'https://example.com/cover.jpg', autoplay: false,
        style: { heightMode: 'auto', height: 200, pageMargin: 0, imageRadius: 0, backgroundColor: '#FFFFFF' }
    }
}
```

## Props

| 字段       | 类型                                               | 默认值  | 说明                   |
| ---------- | -------------------------------------------------- | ------- | ---------------------- |
| `src`      | `string`                                           | `''`    | 视频地址               |
| `coverUrl` | `string`                                           | `''`    | 封面地址               |
| `autoplay` | `boolean`                                          | `false` | 是否自动播放           |
| `style.*`  | [共享图片样式](/cms/v2/data-contract#共享图片样式) | -       | 高度、边距、圆角和背景 |

各端自动播放策略可能受系统静音和用户手势限制。该区块替代 v1 `videoss`/`videos`。
