# 热区图 `v2.hotzone`

在一张背景图上按百分比坐标放置多个可点击区域。

## 完整信封

```ts
{
    component: 'v2.hotzone', text: '热区图', type: '3-3', active: true,
    props: {
        image: 'https://example.com/map.png',
        zones: [{ id: 'zone-1', top: 10, left: 5, width: 40, height: 25, httpType: 10, http: '/pages/activity' }]
    }
}
```

## Props

| 字段                            | 类型               | 默认值 | 说明             |
| ------------------------------- | ------------------ | ------ | ---------------- |
| `image`                         | `string`           | `''`   | 背景图地址       |
| `zones`                         | `CmsV2Hotzone[]`   | `[]`   | 热区列表         |
| `zones[].id`                    | `string \| number` | -      | 稳定标识         |
| `zones[].top/left/width/height` | `number`           | -      | 0–100 百分比坐标 |
| `zones[].httpType`              | `10 \| 11`         | -      | 内部或外部链接   |
| `zones[].http`                  | `string`           | `''`   | 链接地址         |

坐标超出范围时运行时限制到 0–100。跳转依赖 [link service](/cms/v2/services#链接服务)。该区块替代 v1 `hotzone`。
