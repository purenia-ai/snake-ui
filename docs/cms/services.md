# CMS 业务服务接入

展示区块可以直接渲染。链接、优惠券和商品数据由宿主通过 `cms.services` 注入，Snake UI 不绑定具体接口、登录体系或路由。

## 链接服务

CMS 区块把 `{ httpType, http }` 转换为 `SnakeCmsLinkAction`：`10` 对应 `navigate`，`11` 对应 `external`。

```ts
const link: SnakeCmsLinkService = {
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
const commerce: SnakeCmsCommerceService = {
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

```ts
const coupon: SnakeCmsCouponService = {
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
