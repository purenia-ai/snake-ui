---
name: 'services'
description: 'Snake UI CMS 业务服务接入参考。处理 services、cms 或相关 uni-app 使用问题时按需读取。'
triggers: ['services', 'CMS', '业务服务接入']
---

# CMS 业务服务接入

展示区块可以直接渲染。链接、优惠券和商品数据由宿主通过 `cms.services` 注入，Snake UI 不绑定具体接口、登录体系或路由。

## 链接服务

CMS 区块把 `{ httpType, http }` 转换为 `CmsLinkAction`：`10` 对应 `navigate`，`11` 对应 `external`。

```ts
const link: CmsLinkService = {
    open(action) {
        if (action.type === 'navigate' && action.url) return uni.navigateTo({ url: action.url });
        if (action.type === 'external' && action.url) {
            return uni.navigateTo({ url: `/pages/webview/index?url=${encodeURIComponent(action.url)}` });
        }
    }
};
```

## 商品服务

`v2.goodslist.props.query` 会被整理为分页请求参数交给 `commerce.getGoods`。宿主负责把后端响应转换为 `{ items, total?, hasMore? }`。

```ts
const commerce: CmsCommerceService = {
    async getGoods({ params, pageInfo }) {
        const response = await api.goods.list({ ...params, pageId: pageInfo.pageId });
        return { items: response.items || [], total: response.total, hasMore: response.hasMore };
    },
    navigateGoods({ item }) {
        return uni.navigateTo({ url: `/pages/goods/detail?id=${item.id}` });
    }
};
```

需要活动场次或筛选元数据时实现 `getActivities`、`getFilters`。分页由 `snake-cms` 的 `loadMore()` 触发。

## 优惠券服务

v2 优惠券的 `config.coupon` 对应编辑器保存的优惠券对象。为兼容旧服务，v2 适配器也提供同值的 `config.couponObj`；原有 v1 优惠券仍使用 `couponObj`。

```ts
const coupon: CmsCouponService = {
    async check({ config }) {
        return api.coupon.check(config.coupon?.id);
    },
    async receive({ config }) {
        return api.coupon.receive(config.coupon?.id);
    }
};
```

`check` 返回 `{ claimable, message? }`，`receive` 返回 `{ success, message? }`。

## 统一安装

```ts
app.use(SnakeUI, {
    cms: {
        services: { link, commerce, coupon },
        onDiagnostic(diagnostic) {
            console.warn('[CMS]', diagnostic);
        }
    }
});
```

缺少服务时静态内容仍可显示；依赖服务的操作不会自行猜测接口。
