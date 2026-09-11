---
name: 'search'
description: 'Snake UI 搜索框参考。处理 search、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['search', '搜索框']
---

# 搜索框

提供搜索入口、热词轮播、框内右图和最多两个外部图标。

## 完整信封

```ts
{
    component: 'v2.search', text: '搜索框', type: '3-5', active: true,
    props: {
        searchText: '请输入商品名称/货号/关键词', link: { httpType: 10, http: '/pages/search' }, isSearch: false, inputType: 'text', textList: [],
        rightImage: { show: false, src: '', link: { httpType: 10, http: '' }, width: 60, height: 60, borderRadius: 0, marginRight: 0 },
        icons: [],
        style: { position: 0, height: 60, pageMargin: 0, borderRadius: 0, backgroundColor: '#f9f9f9', borderBgColor: '#fff', textColor: '#969799', borderSize: 1, borderColor: '#000', showBorder: true }
    }
}
```

## Props

| 字段                                                        | 类型                 | 默认值     | 说明                     |
| ----------------------------------------------------------- | -------------------- | ---------- | ------------------------ |
| `searchText`                                                | `string`             | 提示文本   | 占位内容                 |
| `link`                                                      | `CmsV2Link`          | 空内链     | 搜索入口                 |
| `isSearch`                                                  | `boolean`            | `false`    | 是否接受回车确认         |
| `inputType`                                                 | `'text' \| 'number'` | `'text'`   | 键盘类型                 |
| `textList`                                                  | `CmsV2TextItem[]`    | `[]`       | 搜索热词                 |
| `rightImage`                                                | `SearchImage`        | 见示例     | 框内右侧图片、链接与尺寸 |
| `icons`                                                     | `SearchIcon[]`       | `[]`       | 框外图标，最多 2 个      |
| `style.position`                                            | `0 \| 1`             | `0`        | 普通或滚动吸顶           |
| `style.height/pageMargin/borderRadius/borderSize`           | `number`             | `60/0/0/1` | rpx 尺寸                 |
| `style.backgroundColor/borderBgColor/textColor/borderColor` | `string`             | 见示例     | 颜色                     |
| `style.showBorder`                                          | `boolean`            | `true`     | 显示边框                 |

`SearchImage` 还包含 `show/src/link/width/height/borderRadius/marginRight`；图标项包含 `src/link/width/height`。所有点击依赖 [link service](/cms/services#链接服务)。
