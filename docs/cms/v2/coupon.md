# 优惠券 `v2.coupon`

查询领取资格，以页面或弹窗形态显示领取前后图片，并调用宿主优惠券服务。

## 完整信封

```ts
{
    component: 'v2.coupon', text: '优惠券', type: '4-1', active: true,
    props: {
        mode: 'page', popupMode: 'bottom', coupon: { id: 'coupon-1', name: '新人券' },
        before: { image: 'https://example.com/before.png', link: { httpType: 10, http: '' } },
        after: { image: 'https://example.com/after.png', link: { httpType: 10, http: '/pages/coupons' } }
    }
}
```

## Props

| 字段                | 类型                   | 默认值     | 说明           |
| ------------------- | ---------------------- | ---------- | -------------- |
| `mode`              | `'page' \| 'popup'`    | `'page'`   | 页面或弹窗展示 |
| `popupMode`         | `'bottom' \| 'center'` | `'bottom'` | 弹窗位置       |
| `coupon`            | `object \| null`       | `null`     | 优惠券对象     |
| `before.image/link` | `string / CmsV2Link`   | 空值       | 领取前状态     |
| `after.image/link`  | `string / CmsV2Link`   | 空值       | 领取后状态     |

`coupon` 可包含 `id/name/newUser/startDate/endDate/url/content/remark`，实际接口字段由宿主适配。领取依赖 [coupon service](/cms/v2/services#优惠券服务)，领取后跳转依赖 link service。该区块替代 v1 `coupon`。
