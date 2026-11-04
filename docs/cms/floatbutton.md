# 悬浮按钮

在页面固定位置显示一张可点击图片。

## 完整信封

```ts
{
    component: 'v2.floatbutton', text: '悬浮按钮', type: '3-9', active: true,
    props: { src: 'https://example.com/service.png', link: { httpType: 10, http: '/pages/service' }, position: { right: 0, bottom: 20 }, style: { width: 38, height: 38 } }
}
```

## Props

| 字段                 | 类型        | 默认值  | 说明                   |
| -------------------- | ----------- | ------- | ---------------------- |
| `src`                | `string`    | `''`    | 按钮图片               |
| `link`               | `CmsV2Link` | 空内链  | 点击链接               |
| `position.right`     | `number`    | `0`     | 距右百分比             |
| `position.bottom`    | `number`    | `20`    | 距下百分比             |
| `style.width/height` | `number`    | `38/38` | 按钮尺寸，px（375 稿） |

右上角可关闭（按页面组件 id 记忆，重进页面不重现），跳转统一走 [link service](/cms/services#链接服务)。页面滚动时按钮向右半藏、露出一半，停止滚动约 2 秒后恢复——这是悬浮组件家族的签名行为，与 v1 悬浮气泡、回到顶部一致。固定定位可能受宿主安全区和自定义 tabbar 影响，应在目标页面实测。
