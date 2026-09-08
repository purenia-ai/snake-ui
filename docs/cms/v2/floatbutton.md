# 悬浮按钮 `v2.floatbutton`

在页面固定位置显示一张可点击图片。

## 完整信封

```ts
{
    component: 'v2.floatbutton', text: '悬浮按钮', type: '3-9', active: true,
    props: { src: 'https://example.com/service.png', link: { httpType: 10, http: '/pages/service' }, position: { right: 0, bottom: 20 }, style: { width: 76, height: 76 } }
}
```

## Props

| 字段                 | 类型        | 默认值  | 说明          |
| -------------------- | ----------- | ------- | ------------- |
| `src`                | `string`    | `''`    | 按钮图片      |
| `link`               | `CmsV2Link` | 空内链  | 点击链接      |
| `position.right`     | `number`    | `0`     | 距右百分比    |
| `position.bottom`    | `number`    | `20`    | 距下百分比    |
| `style.width/height` | `number`    | `76/76` | 按钮尺寸，rpx |

固定定位可能受宿主安全区和自定义 tabbar 影响，应在目标页面实测。跳转依赖 [link service](/cms/v2/services#链接服务)。该区块替代 v1 `suspension`。
