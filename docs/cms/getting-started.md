---
description: 将后端保存的页面装修配置接入 Snake CMS，并处理业务服务、诊断、失败和分页。
---

# CMS 快速接入

Snake CMS 用来把后端保存的页面装修配置渲染成 uni-app 页面。新页面使用 `{ component: 'v2.*', active, props }` 信封；已有 v1 配置仍可渲染，见[版本共存](/cms/data-contract#版本共存)。

```text
装修编辑器 -> 业务后端 -> 页面接口 -> 数据适配 -> <snake-cms>
```

Snake UI 只负责渲染和调度。商品、优惠券和跳转等业务能力仍由宿主应用提供，因此不会绑定具体后端、路由或登录体系。

## 1. 准备页面数据

CMS 页面由页面信息和有序组件数组组成。每个组件至少要有一个字符串类型的 `component`，并使用 `props` 保存配置。

```ts
import type { CmsComponentConfig, CmsPageInfo } from '@puresnake/snake-ui';

const pageInfo: CmsPageInfo = {
    pageId: 'home',
    name: '商城首页'
};

const pageComponents: CmsComponentConfig[] = [
    {
        id: 'notice-1',
        component: 'v2.notice',
        active: true,
        props: {
            direction: 'row',
            noticeText: '今日上新',
            textList: [],
            style: {
                height: 72,
                pageMargin: 10,
                backgroundColor: '#effaf5',
                textColor: '#176b4b'
            }
        }
    }
];
```

远端 JSON 不能直接当成可信类型。下面的页面示例把数组和组件标识校验放在 `normalizeCmsPage()` 中；宿主可按自己的接口结构补充字段转换。

`active === false` 的区块不会渲染。完整字段规则见[页面数据协议](/cms/data-contract)。

## 2. 在页面中渲染

纯展示组件不需要配置业务服务。下面假设宿主的 `api.pages.detail(id)` 返回已解析的 `{ pageId, pageSetup?, pageComponents }` 对象；请替换为项目中的页面接口：

```vue
<script setup lang="ts">
import { onLoad, onPageScroll, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type { CmsComponentConfig, CmsDiagnostic, CmsError, CmsExposed, CmsPageInfo } from '@puresnake/snake-ui';
import { api } from '@/services/api';

const cmsRef = ref<CmsExposed | null>(null);
const pageInfo = ref<CmsPageInfo>({});
const pageComponents = ref<CmsComponentConfig[]>([]);
const scrollTop = ref(0);
const pageId = ref('home');
const loadError = ref('');

function normalizeCmsPage(input: unknown): { pageInfo: CmsPageInfo; pageComponents: CmsComponentConfig[] } {
    const record =
        input && typeof input === 'object' && !Array.isArray(input) ? (input as Record<string, unknown>) : {};
    const setup =
        record.pageSetup && typeof record.pageSetup === 'object' && !Array.isArray(record.pageSetup)
            ? (record.pageSetup as Record<string, unknown>)
            : {};
    const rawComponents = Array.isArray(record.pageComponents) ? record.pageComponents : [];

    return {
        pageInfo: {
            pageId: String(record.pageId ?? record.id ?? 'default'),
            name: String(setup.name ?? record.name ?? '')
        },
        pageComponents: rawComponents.filter((item): item is CmsComponentConfig =>
            Boolean(item && typeof item === 'object' && typeof item.component === 'string')
        )
    };
}

async function loadPage() {
    try {
        const response = await api.pages.detail(pageId.value);
        const page = normalizeCmsPage(response);
        pageInfo.value = page.pageInfo;
        pageComponents.value = page.pageComponents;
        loadError.value = '';
    } catch (error) {
        loadError.value = '页面加载失败，请重试';
        console.error('[CMS] page load failed', error);
    }
}

onLoad(async query => {
    pageId.value = String(query.id || 'home');
    await loadPage();
});

onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});

onReachBottom(() => cmsRef.value?.loadMore());

onPullDownRefresh(async () => {
    try {
        await loadPage();
    } finally {
        uni.stopPullDownRefresh();
    }
});

function reportDiagnostic(diagnostic: CmsDiagnostic) {
    console.warn('[CMS]', diagnostic);
}

function reportError(error: CmsError) {
    console.error('[CMS]', error.stage, error.cause);
}
</script>

<template>
    <view>
        <view v-if="loadError" @click="loadPage">{{ loadError }}</view>
        <snake-cms
            ref="cmsRef"
            :page-info="pageInfo"
            :page-components="pageComponents"
            :scroll-top="scrollTop"
            @diagnostic="reportDiagnostic"
            @error="reportError"
        />
    </view>
</template>
```

页面触底时调用 `loadMore()`。下拉刷新重新请求页面配置；`pageInfo` 或 `pageComponents` 变化时，容器会自动初始化商品数据，无需再次调用 `init()`。如果只想用当前配置重新加载商品，可调用 `init()` 或 `retry()`；页面接口失败时重新调用 `loadPage()`。

## 3. 按需注入业务服务

图片、公告、富文本等展示组件可以直接渲染。配置中出现业务组件时，再注入对应服务：

| 服务       | 使用场景                               |
| ---------- | -------------------------------------- |
| `commerce` | 商品列表、活动场次、筛选、商品详情跳转 |
| `coupon`   | 查询优惠券状态、领取优惠券             |
| `link`     | 站内链接、外链、小程序和 URL Scheme    |

服务应在 `main.ts` 中集中配置。下面只接入商品列表；接口字段不同的项目，也在这里转换成 Snake CMS 需要的结果结构：

```ts
import SnakeUI, { type CmsCommerceService } from '@puresnake/snake-ui';
import { api } from '@/services/api';

const commerce: CmsCommerceService = {
    async getGoods({ params, pageInfo }) {
        const result = await api.goods.list({ ...params, pageId: pageInfo.pageId });
        return {
            items: result.items || [],
            total: result.total,
            hasMore: result.hasMore
        };
    },
    navigateGoods({ item }) {
        uni.navigateTo({ url: `/pages/goods/detail?id=${item.id}` });
    }
};

app.use(SnakeUI, {
    cms: {
        services: { commerce },
        onDiagnostic(diagnostic) {
            console.warn('[CMS]', diagnostic);
        }
    }
});
```

`coupon` 和 `link` 的方法签名、返回结构及完整示例见 [CMS 容器 API](/cms/overview#api)。业务服务必须返回规范结构，不要让装修组件依赖后端原始响应。

## 4. 处理诊断与失败

至少监听 `diagnostic` 和 `error`，并把 `pageId`、组件标识和错误阶段接入日志平台。常见诊断包括：

- `invalid-component`：配置项缺少字符串类型的 `component`。
- `unknown-component`：没有内置组件、别名或扩展实现。
- `duplicate-commerce-section`：页面包含多个商品楼层，只有第一个会渲染。

CMS 会忽略过期请求结果，页面切换或重新初始化后，较早返回的请求不会覆盖当前页面。具体状态、事件和 Ref 方法见 [CMS 容器 API](/cms/overview#api)，排错步骤见[常见问题](/guide/troubleshooting)。

## 上线前检查

- 页面接口异常、空数组和非法 JSON 不会导致整页白屏。
- 每个编辑器组件标识都有内置组件、别名或扩展兜底。
- 商品分页、优惠券状态和跳转服务已在真实接口下验证。
- H5、小程序和 App 的外链及页面滚动行为已在目标平台验证。
- `diagnostic` 和 `error` 已接入日志平台，并能关联 `pageId`。

## 下一步

- [CMS 容器 API](/cms/overview#api)：查看 Props、事件、Ref 方法和服务配置。
- [CMS 组件总览](/cms/overview)：选择页面装修区块。
- [页面数据协议](/cms/data-contract)：了解信封、链接和共享字段。
- [业务服务接入](/cms/services)：接入商品、优惠券和跳转能力。
- [装修编辑器数据对接](/cms/sanke-editor)：对接编辑器保存的数据和组件标识。
- [运行环境与能力边界](/guide/compatibility)：确认不同平台的可用能力。
