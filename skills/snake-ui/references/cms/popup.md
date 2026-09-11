---
name: 'popup'
description: 'Snake UI 页面弹窗参考。处理 popup、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['popup', '页面弹窗']
---

# 页面弹窗

以底部或居中模式显示一张可点击图片。

## 完整信封

```ts
{
    component: 'v2.popup', text: '弹窗', type: '4-2', active: true,
    props: { image: 'https://example.com/popup.png', link: { httpType: 11, http: 'https://example.com' }, popupMode: 'center' }
}
```

## Props

| 字段        | 类型                   | 默认值     | 说明         |
| ----------- | ---------------------- | ---------- | ------------ |
| `image`     | `string`               | `''`       | 弹窗图片     |
| `link`      | `CmsV2Link`            | 空内链     | 图片点击链接 |
| `popupMode` | `'bottom' \| 'center'` | `'bottom'` | 弹出位置     |

用户可关闭弹窗；点击图片依赖 [link service](/cms/services#链接服务)。
