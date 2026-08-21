# CMS 快速接入

Snake CMS 用来把后端保存的页面装修配置渲染成 uni-app 页面。纯展示模块可以直接渲染；商品、优惠券和跳转等业务能力由宿主应用通过服务接口注入，Snake UI 不绑定具体后端、路由或登录体系。

## 接入流程

一条完整的数据链路通常是：

```text
装修编辑器 -> 业务后端 -> 页面接口 -> 页面数据适配 -> <snake-cms>
```

接入时完成四件事：

1. 从页面接口取得 `pageInfo` 和有序的 `pageComponents`。
2. 在业务层解析 JSON、补齐数组并过滤无效数据。
3. 在安装 Snake UI 时注入需要的 CMS 业务服务。
4. 页面把配置传给 `<snake-cms>`，并监听状态、诊断和错误事件。

## 1. 准备页面数据

`pageComponents` 中每一项至少需要一个 `component`。`setStyle` 是传给对应装修组件的配置：

```ts
import type { SnakeCmsComponentConfig, SnakeCmsPageInfo } from 'snake-ui';

const pageInfo: SnakeCmsPageInfo = {
    pageId: 'home',
    name: '商城首页'
};

const pageComponents: SnakeCmsComponentConfig[] = [
    {
        id: 'notice-1',
        component: 'notice',
        setStyle: {
            direction: 'row',
            noticeText: '今日上新',
            textList: [],
            backColor: '#effaf5',
            textColor: '#176b4b'
        }
    },
    {
        id: 'goods-1',
        component: 'goodslist',
        setStyle: {
            listType: 'default',
            filterParams: { pageSize: 10 }
        }
    }
];
```

接口返回的 JSON 不应直接当成可信类型。先在业务层完成最小校验：

```ts
function normalizeCmsPage(input: Record<string, unknown>) {
    const rawComponents = Array.isArray(input.pageComponents) ? input.pageComponents : [];

    return {
        pageInfo: {
            pageId: String(input.pageId || 'default'),
            name: String(input.name || '')
        },
        pageComponents: rawComponents.filter((item): item is SnakeCmsComponentConfig =>
            Boolean(item && typeof item === 'object' && typeof (item as any).component === 'string')
        )
    };
}
```

`visible === false` 或 `setStyle.showComponent === false` 的配置不会渲染。更完整的数据规则见[组件数据约定](/guide/component-data)。

## 2. 注入业务服务

只使用图片、公告、富文本等展示模块时，不需要配置 CMS 服务。出现以下模块时按需注入：

| 服务       | 使用场景                               |
| ---------- | -------------------------------------- |
| `commerce` | 商品列表、活动场次、筛选、商品详情跳转 |
| `coupon`   | 查询优惠券状态、领取优惠券             |
| `link`     | 外链、小程序、URL Scheme 和统一跳转    |

建议在 `main.ts` 中集中配置：

```ts
import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI, { type SnakeCmsCommerceService, type SnakeCmsCouponService, type SnakeCmsLinkService } from 'snake-ui';
import { api } from '@/services/api';

const commerce: SnakeCmsCommerceService = {
    async getActivities({ params, pageInfo }) {
        const result = await api.activities.list({ ...params, pageId: pageInfo.pageId });
        return { items: result.items || [] };
    },

    async getFilters({ component, params }) {
        return api.filters.get({ scene: component.setStyle.scene, ...params });
    },

    async getGoods({ params, pageInfo }) {
        const result = await api.goods.list({ ...params, pageId: pageInfo.pageId });
        return {
            items: result.items || [],
            total: result.total,
            hasMore: result.hasMore
        };
    },

    navigateGoods({ item, index, pageInfo }) {
        uni.navigateTo({
            url: `/pages/goods/detail?id=${item.id}&index=${index}&pageId=${pageInfo.pageId}`
        });
    }
};

const coupon: SnakeCmsCouponService = {
    async check({ config, pageInfo }) {
        const result = await api.coupons.check({ couponId: config.couponId, pageId: pageInfo?.pageId });
        return { claimable: result.claimable, message: result.message };
    },

    async receive({ config, pageInfo }) {
        const result = await api.coupons.receive({ couponId: config.couponId, pageId: pageInfo?.pageId });
        return { success: result.success, message: result.message };
    }
};

const link: SnakeCmsLinkService = {
    async open(action) {
        if (action.type === 'navigate' && action.url) {
            await uni.navigateTo({ url: action.url });
            return;
        }

        if (action.type === 'mini-program' && action.appId) {
            await uni.navigateToMiniProgram({
                appId: action.appId,
                path: action.path,
                extraData: action.extraData,
                envVersion: action.envVersion
            });
            return;
        }

        if (action.type === 'external' && action.url) {
            // 小程序通常跳转到宿主项目提供的 web-view 页面。
            await uni.navigateTo({ url: `/pages/web-view/index?url=${encodeURIComponent(action.url)}` });
        }
    }
};

export function createApp() {
    const app = createSSRApp(App);
    app.use(SnakeUI, {
        cms: {
            legacy: false,
            cachePrefix: 'my-app:cms',
            services: { commerce, coupon, link },
            onDiagnostic(diagnostic) {
                console.warn('[CMS]', diagnostic);
            }
        }
    });
    return { app };
}
```

服务返回值必须符合 Snake CMS 的结果结构。宿主接口字段不同，应在服务中转换，不要让组件依赖后端原始响应。

## 3. 在页面中渲染

下面是一份可直接改造的 uni-app Vue 3 页面：

```vue
<script setup lang="ts">
import { onLoad, onPageScroll, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type {
    SnakeCmsComponentConfig,
    SnakeCmsDiagnostic,
    SnakeCmsError,
    SnakeCmsExposed,
    SnakeCmsPageInfo,
    SnakeCmsStateChange
} from 'snake-ui';
import { api } from '@/services/api';

const cmsRef = ref<SnakeCmsExposed>();
const pageInfo = ref<SnakeCmsPageInfo>({});
const pageComponents = ref<SnakeCmsComponentConfig[]>([]);
const scrollTop = ref(0);

onLoad(async query => {
    const response = await api.pages.detail(String(query.id || 'home'));
    const page = normalizeCmsPage(response);
    pageInfo.value = page.pageInfo;
    pageComponents.value = page.pageComponents;
});

onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});

onReachBottom(() => cmsRef.value?.loadMore());

onPullDownRefresh(async () => {
    try {
        await cmsRef.value?.init();
    } finally {
        uni.stopPullDownRefresh();
    }
});

function handleStateChange(state: SnakeCmsStateChange) {
    console.log('CMS state:', state.status, state.itemCount);
}

function handleDiagnostic(diagnostic: SnakeCmsDiagnostic) {
    // 建议接入日志平台，保留 pageId、component 和 code。
    console.warn('CMS diagnostic:', diagnostic);
}

function handleError(error: SnakeCmsError) {
    console.error('CMS error:', error.stage, error.cause);
}
</script>

<template>
    <snake-cms
        ref="cmsRef"
        :page-info="pageInfo"
        :page-components="pageComponents"
        :scroll-top="scrollTop"
        :sticky-offset-top="0"
        @state-change="handleStateChange"
        @diagnostic="handleDiagnostic"
        @error="handleError"
    />
</template>
```

页面触底时调用 `loadMore()`。失败后可调用 `retry()`，更换整页配置后可调用 `init()` 重新初始化。

## 4. 扩展私有组件

业务私有模块不需要加入 Snake UI。未知 `component` 会产生 `unknown-component` 诊断，并交给静态 `extension` 插槽：

```vue
<snake-cms :page-info="pageInfo" :page-components="pageComponents">
    <template #extension="{ item, pageInfo }">
        <partner-card
            v-if="item.component === 'partner-card'"
            :config="item.setStyle"
            :page-info="pageInfo"
        />
    </template>
</snake-cms>
```

该方式兼容 H5、小程序和 App。不要依赖微信小程序不支持的动态 `<component :is>`。

如果只是组件标识不同，优先使用 `cms.aliases`；如果数据结构不同，使用 `cms.normalizers`：

```ts
app.use(SnakeUI, {
    cms: {
        aliases: {
            banner: 'pictureads'
        },
        normalizers: {
            legacyGoods(component) {
                return {
                    ...component,
                    component: 'goodslist',
                    setStyle: {
                        ...component.setStyle,
                        filterParams: component.setStyle?.query || {}
                    }
                };
            }
        }
    }
});
```

## 5. 状态、错误与诊断

商品区域可能处于以下状态：

| 状态              | 含义                     |
| ----------------- | ------------------------ |
| `idle`            | 尚未初始化               |
| `initial-loading` | 首次加载                 |
| `ready`           | 可以继续加载             |
| `empty`           | 没有商品                 |
| `loading-more`    | 正在加载下一页           |
| `no-more`         | 已加载全部数据           |
| `error`           | 商品、筛选或活动请求失败 |

重点处理以下诊断：

- `invalid-component`：配置项缺少字符串 `component`。
- `unknown-component`：没有内置分发、别名或扩展实现。
- `normalizer-error`：自定义数据转换抛出异常。
- `duplicate-commerce-section`：同一页面配置了多个 `goodslist`，只有第一个会渲染。
- `legacy-adapter`：仍在自动使用旧 Joker 兼容层。

CMS 会忽略过期请求结果，页面切换或重新初始化后，较早返回的请求不会覆盖当前数据。

## 6. 旧项目迁移

旧项目只配置 `request`、`cache`、`config` 时，0.x 版本可能自动启用 Joker 兼容适配器。新项目应显式配置 `cms.services` 并设置：

```ts
cms: {
    legacy: false;
}
```

迁移时先把商品、优惠券和跳转逻辑分别移入 `commerce`、`coupon`、`link` 服务，再移除旧接口地址和旧详情路由配置。

## 上线前检查

- 页面接口异常、空数组和非法 JSON 不会导致整页白屏。
- 每个编辑器组件标识都有内置组件、别名或 `extension` 兜底。
- 商品分页、筛选缓存、详情跳转和重试在真实接口下可用。
- 优惠券登录态、重复领取和接口失败有明确反馈。
- H5 外链、小程序 web-view、小程序跳转和 App Scheme 分别在目标平台验证。
- `diagnostic` 和 `error` 已接入日志平台，并能关联 `pageId`。
- 页面滚动位置正确传给 CMS，吸顶和悬浮组件在真机上正常。

## 延伸阅读

- [Snake CMS 组件 API](/components/snake-cms)
- [组件数据约定](/guide/component-data)
- [装修编辑器数据对接](/guide/sanke-editor)
- [运行环境与能力边界](/guide/compatibility)
- [常见问题](/guide/troubleshooting)
