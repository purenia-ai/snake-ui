---
name: 'divider'
description: 'Snake UI 分割线参考。处理 divider、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['divider', '分割线']
---

# 分割线

合并辅助空白和分割线两种能力。

## 完整信封

```ts
{
    component: 'v2.divider', text: '分割线', type: '3-7', active: true,
    props: { mode: 'blank', height: 30, lineStyle: 'solid', margin: 0, style: { lineColor: 'rgb(229, 229, 229)', backgroundColor: 'rgb(255, 255, 255)' } }
}
```

## Props

| 字段                    | 类型                              | 默认值             | 说明               |
| ----------------------- | --------------------------------- | ------------------ | ------------------ |
| `mode`                  | `'blank' \| 'line'`               | `'blank'`          | 空白或线条         |
| `height`                | `number`                          | `30`               | 组件高度，rpx      |
| `lineStyle`             | `'solid' \| 'dashed' \| 'dotted'` | `'solid'`          | 线型，仅 line 生效 |
| `margin`                | `0 \| 1`                          | `0`                | 1 表示左右留边     |
| `style.lineColor`       | `string`                          | `rgb(229,229,229)` | 线条颜色           |
| `style.backgroundColor` | `string`                          | `rgb(255,255,255)` | 背景颜色           |
