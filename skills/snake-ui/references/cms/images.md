---
name: 'images'
description: 'Snake UI 图片展示参考。处理 images、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['images', '图片展示']
---

# 图片展示

用于一行一图或 1–4 列图片网格。图片项点击通过 [link service](/cms/services#链接服务) 跳转。

## 完整信封

```ts
{
    component: 'v2.images', text: '图片展示', type: '3-1', active: true,
    props: {
        layout: { mode: 'single', columns: 2 },
        style: { heightMode: 'auto', height: 200, pageMargin: 0, imageRadius: 0, backgroundColor: '#FFFFFF', gap: 8 },
        items: [{ id: 'image-1', src: 'https://example.com/a.png', link: { httpType: 10, http: '/pages/a' } }]
    }
}
```

## Props

| 字段             | 类型                                            | 默认值     | 说明                   |
| ---------------- | ----------------------------------------------- | ---------- | ---------------------- |
| `layout.mode`    | `'single' \| 'grid'`                            | `'single'` | 单列或网格             |
| `layout.columns` | `1 \| 2 \| 3 \| 4`                              | `2`        | 网格列数               |
| `style.*`        | [共享图片样式](/cms/data-contract#共享图片样式) | -          | 高度、边距、圆角和背景 |
| `style.gap`      | `number`                                        | `8`        | 图片间距，rpx          |
| `items`          | `CmsV2ImageItem[]`                              | `[]`       | 图片、ID 和链接        |

`single` 模式忽略 `columns`。
