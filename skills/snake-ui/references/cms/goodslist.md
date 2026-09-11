---
name: 'goodslist'
description: 'Snake UI 商品列表参考。处理 goodslist、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['goodslist', '商品列表']
---

# 商品列表

查询驱动的商品楼层，包含受众、数据来源、展现方式、顶部栏、样式和空态。

## 完整信封

```ts
{
    component: 'v2.goodslist', text: '商品列表', type: '4-3', active: true,
    props: {
        audience: 'all',
        query: { source: 'activity', activityId: '', activityType: '', activityStatus: 'ing', userRule: 'all', gender: [], low: '', high: '', categoryId: '', brands: [], sellingDays: '', sort: 'auto', pageSize: 20, showOutOfStock: false },
        display: { layout: 'grid', columns: 2, cardType: 'sale', subType: '', showAttendance: true, showTag: false },
        bars: { filter: false, filterList: [], priceFilter: true, tabs: { enabled: false, list: [] }, activitySession: false, sticky: false },
        style: { pageMargin: 5, gap: 10, radius: 0, backgroundColor: '#F8F8F8' },
        empty: { mode: 'default', image: '', text: '列表为空', color: '#000000' }
    }
}
```

## Props：数据来源

| 字段                   | 类型                                                              | 默认值       | 说明               |
| ---------------------- | ----------------------------------------------------------------- | ------------ | ------------------ |
| `audience`             | `'all' \| 'new' \| 'old'`                                         | `'all'`      | 页面受众           |
| `query.source`         | `'activity' \| 'condition'`                                       | `'activity'` | 指定活动或条件筛选 |
| `query.activityId`     | `string \| number`                                                | `''`         | 活动 ID            |
| `query.activityType`   | `'' \| 'auction' \| 'down_buy' \| 'fixed_price' \| 'fixed_ratio'` | `''`         | 活动类型           |
| `query.activityStatus` | `'ing' \| 'finished'`                                             | `'ing'`      | 活动状态           |
| `query.userRule`       | `'all' \| 'new' \| 'old'`                                         | `'all'`      | 活动用户规则       |
| `query.gender`         | `string[]`                                                        | `[]`         | 性别筛选           |
| `query.low/high`       | `string \| number`                                                | `''`         | 价格区间           |
| `query.categoryId`     | `string \| number`                                                | `''`         | 类目 ID            |
| `query.brands`         | `{ id, name }[]`                                                  | `[]`         | 品牌               |
| `query.sellingDays`    | `string \| number`                                                | `''`         | 最近上架天数       |
| `query.sort`           | `'auto' \| 'newest' \| 'highest' \| 'lowest'`                     | `'auto'`     | 排序               |
| `query.pageSize`       | `number`                                                          | `20`         | 每页数量           |
| `query.showOutOfStock` | `boolean`                                                         | `false`      | 展示已售商品       |

## Props：展示与顶部栏

| 字段                             | 类型                                | 默认值       | 说明                 |
| -------------------------------- | ----------------------------------- | ------------ | -------------------- |
| `display.layout`                 | `'grid' \| 'swipe'`                 | `'grid'`     | 网格或横滑           |
| `display.columns`                | `2 \| 3`                            | `2`          | 网格列数             |
| `display.cardType`               | `'sale' \| 'auction' \| 'new'`      | `'sale'`     | 商品卡类型           |
| `display.subType`                | `string`                            | `''`         | 拍卖场次子类型       |
| `display.showAttendance/showTag` | `boolean`                           | `true/false` | 出价人数和商品标签   |
| `bars.filter`                    | `false \| true \| 'custom'`         | `false`      | 筛选栏               |
| `bars.filterList`                | `{ name }[]`                        | `[]`         | 自定义筛选项         |
| `bars.priceFilter`               | `boolean`                           | `true`       | 价格筛选             |
| `bars.tabs.enabled`              | `boolean`                           | `false`      | 启用 tabs            |
| `bars.tabs.list`                 | `{ id, label, paramType, value }[]` | `[]`         | tabs 参数            |
| `bars.activitySession`           | `boolean`                           | `false`      | 活动场次栏           |
| `bars.sticky`                    | `boolean`                           | `false`      | 顶部栏吸顶，正向语义 |

## Props：样式与空态

| 字段                          | 类型                                  | 默认值                    | 说明         |
| ----------------------------- | ------------------------------------- | ------------------------- | ------------ |
| `style.pageMargin/gap/radius` | `number`                              | `5/10/0`                  | rpx 尺寸     |
| `style.backgroundColor`       | `string`                              | `'#F8F8F8'`               | 背景色       |
| `empty.mode`                  | `'default' \| 'forSale' \| 'downBuy'` | `'default'`               | 空态回退模式 |
| `empty.image/text/color`      | `string`                              | `''/'列表为空'/'#000000'` | 空态内容     |

数据、筛选、分页和商品点击依赖 [commerce service](/cms/services#商品服务)。页面触底调用 `snake-cms` 的 `loadMore()`。
