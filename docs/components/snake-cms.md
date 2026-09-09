---
preview: /pages/componentsB/snakeCms/index
cms: true
---

# Snake CMS <span class="cms-badge">CMS</span>

`snake-cms` 是 Snake UI 的页面装修门面。内容组件只负责渲染；商品、活动、筛选、优惠券和跳转统一由宿主应用通过 CMS 服务注入。组件支持 H5、微信小程序和 App，不使用小程序不支持的动态组件。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

新页面使用 v2 信封；纯展示页面不要求配置请求或缓存：

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
import SnakeUI from '@r2nd/snake-ui';

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
                    return api.filter.list(component.setStyle.scene, params);
                },
                async getGoods({ component, params }) {
                    const data = await api.goods.list(component.setStyle.scene, params);
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
                    return api.coupon.check(config.couponId);
                },
                async receive({ config }) {
                    return api.coupon.receive(config.couponId);
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

单个实例也可通过 `cms-options` 覆盖全局配置。

## API

### Props

| 参数              | 说明                                   | 类型                        | 默认值 | 可选值 |
| ----------------- | -------------------------------------- | --------------------------- | ------ | ------ |
| `pageInfo`        | 页面 ID、名称和页面级业务信息          | `SnakeCmsPageInfo`          | `{}`   | -      |
| `pageComponents`  | 按顺序排列的装修配置                   | `SnakeCmsComponentConfig[]` | `[]`   | -      |
| `scrollTop`       | 页面滚动位置                           | `number`                    | `0`    | -      |
| `stickyOffsetTop` | 商品区吸顶顶部偏移                     | `number`                    | `0`    | -      |
| `cmsOptions`      | 当前实例的服务、别名、资源和规范化配置 | `SnakeCmsOptions`           | `{}`   | -      |

### Events

| 事件           | 参数                  | 说明                               |
| -------------- | --------------------- | ---------------------------------- |
| `ready`        | `SnakeCmsStateChange` | 本轮初始化首次进入可展示状态       |
| `state-change` | `SnakeCmsStateChange` | 加载状态、页码或商品数量变化       |
| `diagnostic`   | `SnakeCmsDiagnostic`  | 配置无效、未知组件或重复商品区     |
| `error`        | `SnakeCmsError`       | 活动、筛选、商品、优惠券或跳转失败 |
| `goods-click`  | `{ item, index }`     | 点击商品；随后调用宿主导航服务     |
| `offer-click`  | `{ item, index }`     | 点击拍卖报价；随后调用宿主导航服务 |

### Expose

| 方法                            | 说明                         |
| ------------------------------- | ---------------------------- |
| `init()`                        | 重新初始化当前 CMS 页面      |
| `loadMore()`                    | 在 `ready` 状态加载下一页    |
| `retry()`                       | 错误后重新初始化             |
| `refreshQuotePay(price, index)` | 更新列表中指定商品的当前报价 |

同时暴露只读的 `auctionSetParams`。

### Slots

| 插槽名       | 说明                                | 参数                 |
| ------------ | ----------------------------------- | -------------------- |
| 配置的插槽名 | 渲染 v1 自定义模块或 v2 custom 内容 | `{ item }`           |
| `extension`  | 渲染未注册的扩展组件                | `{ item, pageInfo }` |

## 组件映射

### v2 主协议

| 配置键           | 能力               |
| ---------------- | ------------------ |
| `v2.carousel`    | 轮播图             |
| `v2.images`      | 单图/图片网格      |
| `v2.video`       | 视频               |
| `v2.hotzone`     | 热区图             |
| `v2.magiccube`   | 魔方布局与定时投放 |
| `v2.notice`      | 公告               |
| `v2.divider`     | 空白/分割线        |
| `v2.search`      | 商品搜索           |
| `v2.floatbutton` | 悬浮按钮           |
| `v2.popup`       | 页面弹窗           |
| `v2.coupon`      | 优惠券             |
| `v2.goodslist`   | 商品楼层           |
| `v2.richtext`    | 富文本             |
| `v2.custom`      | 自定义插槽         |

v2 配置使用 `{ component, active, props }`。以下 v1 配置仅用于历史页面兼容，不再增加新能力。

### v1 冻结兼容

| 配置键                  | 渲染组件   |
| ----------------------- | ---------- |
| `commoditysearch`       | 商品搜索   |
| `auxiliarysegmentation` | 辅助分割线 |
| `richtext`              | 富文本     |
| `graphicnavigation`     | 图文导航   |
| `images`                | 图片展示   |
| `pictureads`            | 轮播广告   |
| `magiccube`             | 魔方布局   |
| `videos`                | 视频       |
| `notice`                | 公告       |
| `jumpApplet`            | 小程序跳转 |
| `follow`                | 关注       |
| `suspension`            | 悬浮气泡   |
| `coupon`                | 优惠券     |
| `pagePopup`             | 页面弹窗   |
| `goodslist`             | 商品组合区 |
| `custommodule`          | 自定义模块 |

旧键 `videoss` 会自动规范化为 `videos`，但新配置应统一使用 `videos`。页面只渲染第一个 `goodslist`，重复项会产生诊断并跳过。

## 扩展组件

未知组件不会让页面崩溃。容器会发出 `unknown-component` 诊断，并交给静态 `extension` 插槽渲染：

```vue
<snake-cms :page-components="components">
  <template #extension="{ item, pageInfo }">
    <partner-card v-if="item.component === 'partner-card'" :config="item.setStyle" :page="pageInfo" />
  </template>
</snake-cms>
```

这是跨端扩展点；不要在微信小程序端依赖 `<component :is>`。

## 状态与并发

商品区状态为 `idle`、`initial-loading`、`ready`、`empty`、`loading-more`、`no-more` 或 `error`。每次初始化都会生成新的请求代次，旧请求即使晚返回也不会覆盖新页面数据。筛选缓存使用 `cachePrefix:pageId:componentId:filters` 命名空间。

## 旧项目兼容

0.x 在已配置 `request`、但未配置新 CMS 服务时，会自动启用 `createLegacyJokerCmsOptions()`。旧接口、详情路由、审核过滤和 CDN 资源全部隔离在该适配器中，并会在调试模式给出迁移提示。

自动兼容仅用于过渡；移除前会先确认宿主侧实际用量，不预设删除版本。新项目请显式配置 `cms.services`；也可以设置 `cms: { legacy: false }` 禁止自动启用。

## 主题变量

| 变量名                         | 说明                       |
| ------------------------------ | -------------------------- |
| `--snake-color-background`     | 页面及商品区默认背景色     |
| `--snake-color-text`           | 激活标签文字颜色           |
| `--snake-color-text-secondary` | 未激活标签文字颜色         |
| `--snake-color-primary`        | 商品筛选等强调状态的主题色 |

源码：`src/uni_modules/snake-ui/components/snake-cms/snake-cms.vue`
