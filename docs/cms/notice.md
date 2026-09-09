# 公告

支持横向公告和纵向文本轮播。

## 完整信封

```ts
{
    component: 'v2.notice', text: '公告', type: '3-6', active: true,
    props: {
        direction: 'row', noticeText: '今日上新', link: { httpType: 10, http: '/pages/new' }, textList: [], isLeftIcon: true,
        style: { height: 72, pageMargin: 10, backgroundColor: 'rgb(234, 241, 255)', textColor: 'rgb(45, 87, 231)' }
    }
}
```

## Props

| 字段                    | 类型                | 默认值             | 说明          |
| ----------------------- | ------------------- | ------------------ | ------------- |
| `direction`             | `'row' \| 'column'` | `'row'`            | 横向或纵向    |
| `noticeText`            | `string`            | 提示文本           | 横向内容      |
| `link`                  | `CmsV2Link`         | 空内链             | 横向点击链接  |
| `textList`              | `CmsV2TextItem[]`   | `[]`               | 纵向轮播项    |
| `isLeftIcon`            | `boolean`           | `true`             | 左侧公告图标  |
| `style.height`          | `number`            | `72`               | 高度，rpx     |
| `style.pageMargin`      | `number`            | `10`               | 左右边距，rpx |
| `style.backgroundColor` | `string`            | `rgb(234,241,255)` | 背景颜色      |
| `style.textColor`       | `string`            | `rgb(45,87,231)`   | 文本颜色      |

横向或文本项点击依赖 [link service](/cms/services#链接服务)。
