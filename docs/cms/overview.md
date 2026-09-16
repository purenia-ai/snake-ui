# CMS 组件总览

页面把 SankeEditor 保存的 `{ component: 'v2.*', active, props }` 数组交给 `<snake-cms>`，由容器按配置渲染对应区块。已有 v1 配置也可继续使用。

> 这里列出的是 `snake-cms` 的 v2 配置能力，不是独立 easycom 标签；v2 区块的组件标识必须带 `v2.` 前缀。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

页面配置使用 `{ component, active, props }` 信封；纯展示页面不要求配置请求或缓存：

```vue
<snake-cms
    ref="cmsRef"
    :page-info="{ pageId: 'home' }"
    :page-components="[
        {
            component: 'v2.notice',
            active: true,
            props: {
                direction: 'row',
                noticeText: '今日上新',
                textList: [],
                style: { backgroundColor: '#effaf5', textColor: '#176b4b' }
            }
        }
    ]"
    :scroll-top="scrollTop"
    @diagnostic="handleDiagnostic"
/>
```

## 注入业务服务

推荐在安装 Snake UI 时统一配置。服务接收规范化后的组件配置和页面上下文，接口地址、响应转换、详情路由均由应用决定：

```ts
import SnakeUI from '@puresnake/snake-ui';

app.use(SnakeUI, {
    cms: {
        cachePrefix: 'my-app:cms',
        services: {
            commerce: {
                async getActivities({ params }) {
                    const data = await api.activity.list(params);
                    return { items: data.items };
                },
                async getFilters({ component, params }) {
                    return api.filter.list(component.props.query, params);
                },
                async getGoods({ component, params }) {
                    const data = await api.goods.list(component.props.query, params);
                    return { items: data.items, total: data.total };
                },
                navigateGoods({ item, index, pageInfo }) {
                    uni.navigateTo({
                        url: `/pages/goods/detail?id=${item.id}&index=${index}&pageId=${pageInfo.pageId}`
                    });
                }
            },
            coupon: {
                async check({ config }) {
                    return api.coupon.check(config.coupon?.id);
                },
                async receive({ config }) {
                    return api.coupon.receive(config.coupon?.id);
                }
            },
            link: {
                open(action) {
                    // 在这里统一处理站内、小程序、外链和 URL Scheme
                }
            }
        }
    }
});
```

单个实例也可通过 `cms-options` 覆盖全局配置。完整服务契约见[业务服务接入](/cms/services)。

## API

### Props

| 参数                    | 说明                                   | 类型                   | 默认值 |
| ----------------------- | -------------------------------------- | ---------------------- | ------ |
| `pageInfo`              | 页面 ID、名称和页面级业务信息          | `CmsPageInfo`          | `{}`   |
| `pageComponents`        | 按顺序排列的装修配置                   | `CmsComponentConfig[]` | `[]`   |
| `scrollTop`             | 页面滚动位置                           | `number`               | `0`    |
| `stickyOffsetTop`       | 商品区和搜索框吸顶顶部偏移             | `number`               | `0`    |
| `stickyCustomNavHeight` | 自定义导航栏高度，px                   | `number`               | `0`    |
| `cmsOptions`            | 当前实例的服务、别名、资源和规范化配置 | `CmsOptions`           | `{}`   |

### Events

| 事件           | 参数              | 说明                               |
| -------------- | ----------------- | ---------------------------------- |
| `ready`        | `CmsStateChange`  | 本轮初始化首次进入可展示状态       |
| `state-change` | `CmsStateChange`  | 加载状态、页码或商品数量变化       |
| `diagnostic`   | `CmsDiagnostic`   | 配置无效、未知组件或重复商品区     |
| `error`        | `CmsError`        | 活动、筛选、商品、优惠券或跳转失败 |
| `goods-click`  | `{ item, index }` | 点击商品；随后调用宿主导航服务     |
| `offer-click`  | `{ item, index }` | 点击拍卖报价；随后调用宿主导航服务 |

### Expose

| 方法                            | 说明                         |
| ------------------------------- | ---------------------------- |
| `init()`                        | 重新初始化当前 CMS 页面      |
| `loadMore()`                    | 在 `ready` 状态加载下一页    |
| `retry()`                       | 错误后重新初始化             |
| `refreshQuotePay(price, index)` | 更新列表中指定商品的当前报价 |

同时暴露只读的 `auctionSetParams`。

### Slots

| 插槽名       | 说明                        | 参数                 |
| ------------ | --------------------------- | -------------------- |
| 配置的插槽名 | 渲染 `v2.custom` 自定义内容 | `{ item }`           |
| `extension`  | 渲染未注册的扩展组件        | `{ item, pageInfo }` |

## 内容区块

| 技术标识       | 文档                    | 用途                   |
| -------------- | ----------------------- | ---------------------- |
| `v2.images`    | [图片展示](/cms/images) | 单图、纵向图片或网格   |
| `v2.carousel`  | [轮播图](/cms/carousel) | 自动播放、循环和指示器 |
| `v2.video`     | [视频](/cms/video)      | 视频、封面和自动播放   |
| `v2.hotzone`   | [热区图](/cms/hotzone)  | 图片百分比点击区域     |
| `v2.magiccube` | [魔方](/cms/magiccube)  | 多布局图片格与定时投放 |
| `v2.notice`    | [公告](/cms/notice)     | 横向公告或纵向轮播     |
| `v2.divider`   | [分割线](/cms/divider)  | 辅助空白和线条         |
| `v2.richtext`  | [富文本](/cms/richtext) | HTML 图文内容          |

## 互动区块

| 技术标识         | 文档                         | 用途                     |
| ---------------- | ---------------------------- | ------------------------ |
| `v2.search`      | [搜索框](/cms/search)        | 搜索入口、热词和右侧图标 |
| `v2.floatbutton` | [悬浮按钮](/cms/floatbutton) | 页面固定图片按钮         |
| `v2.popup`       | [页面弹窗](/cms/popup)       | 居中或底部图片弹层       |
| `v2.custom`      | [自定义模块](/cms/custom)    | 宿主命名插槽             |

## 商城区块

| 技术标识       | 文档                       | 用途                       |
| -------------- | -------------------------- | -------------------------- |
| `v2.coupon`    | [优惠券](/cms/coupon)      | 查询和领取优惠券           |
| `v2.goodslist` | [商品列表](/cms/goodslist) | 查询、筛选、分页和商品展示 |

## 扩展组件

未知组件不会让页面崩溃。容器会发出 `unknown-component` 诊断，并交给静态 `extension` 插槽渲染：

```vue
<snake-cms :page-components="components">
  <template #extension="{ item, pageInfo }">
    <partner-card v-if="item.component === 'partner-card'" :config="item.props" :page="pageInfo" />
  </template>
</snake-cms>
```

这是跨端扩展点；不要在微信小程序端依赖 `<component :is>`。

## 状态与并发

商品区状态为 `idle`、`initial-loading`、`ready`、`empty`、`loading-more`、`no-more` 或 `error`。每次初始化都会生成新的请求代次，旧请求即使晚返回也不会覆盖新页面数据。筛选缓存使用 `cachePrefix:pageId:componentId:filters` 命名空间。

## 主题变量

| 变量名                         | 说明                       |
| ------------------------------ | -------------------------- |
| `--snake-color-background`     | 页面及商品区默认背景色     |
| `--snake-color-text`           | 激活标签文字颜色           |
| `--snake-color-text-secondary` | 未激活标签文字颜色         |
| `--snake-color-primary`        | 商品筛选等强调状态的主题色 |

## 通用规则

- 尺寸采用 750 设计稿基准，运行时按 rpx 使用。
- `active: false` 的区块不会渲染。
- 链接统一为 `{ httpType: 10 | 11, http: string }`。
- 远端 JSON 仍需在宿主边界做数组和对象校验。
- 未识别的 `v2.*` 会产生 `unknown-component` 诊断并进入 extension 插槽。

继续阅读 [页面数据协议](/cms/data-contract) 和 [业务服务接入](/cms/services)。
