# 魔方

把图片格按声明式布局组合，并支持按星期和时间段投放覆盖图片。

## 完整信封

```ts
{
    component: 'v2.magiccube', text: '魔方', type: '3-11', active: true,
    props: {
        layout: 'row', columns: 4,
        style: { pageMargin: 0, gap: 0, radius: 0, height: 188, backgroundColor: '#FFFFFF' },
        play: { interval: 3 },
        cells: [{ src: 'https://example.com/a.png', link: { httpType: 10, http: '/pages/a' }, schedules: [] }]
    }
}
```

## Props

| 字段                                 | 类型                  | 默认值      | 说明             |
| ------------------------------------ | --------------------- | ----------- | ---------------- |
| `layout`                             | `MagicCubeLayout`     | `'row'`     | 布局模板         |
| `columns`                            | `1..6`                | `4`         | row 模式列数     |
| `style.pageMargin/gap/radius/height` | `number`              | `0/0/0/188` | rpx 尺寸         |
| `style.backgroundColor`              | `string`              | `'#FFFFFF'` | 背景色           |
| `play.interval`                      | `number`              | `3`         | 多图轮换间隔，秒 |
| `cells`                              | `MagicCubeCell[]`     | `[]`        | 图片格列表       |
| `cells[].src/link`                   | `string / CmsV2Link`  | -           | 默认图片与链接   |
| `cells[].schedules`                  | `MagicCubeSchedule[]` | `[]`        | 定时覆盖         |
| `schedules[].weeks`                  | `number[]`            | `[]`        | 星期 1–7         |
| `schedules[].startTime/endTime`      | `string`              | `''`        | `HH:mm` 时间段   |

`MagicCubeLayout` 可选 `row`、`grid2x2`、`left1right2`、`top1bottom2`、`left1right3`、`left2right1`、`left3right1`。定时项还包含自己的 `src` 和 `link`。跳转依赖 [link service](/cms/services#链接服务)。
