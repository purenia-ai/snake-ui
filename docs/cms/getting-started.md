# CMS 快速接入

Snake CMS 用来把后端保存的页面装修配置渲染成 uni-app 页面。新页面使用 v2 `{ component: 'v2.*', props }` 协议；既有项目的 v1 `{ component, setStyle }` 页面在兼容期内仍可直接渲染。

```text
装修编辑器 -> 业务后端 -> 页面接口 -> 数据适配 -> <snake-cms>
```

Snake UI 只负责渲染和调度。商品、优惠券和跳转等业务能力仍由宿主应用提供，因此不会绑定具体后端、路由或登录体系。

## 1. 准备页面数据

CMS 页面由页面信息和有序组件数组组成。每个组件至少要有一个字符串类型的 `component`；v2 使用 `props` 保存配置。

```ts
import type { SnakeCmsComponentConfig, SnakeCmsPageInfo } from '@puresnake/snake-ui';

const pageInfo: SnakeCmsPageInfo = {
    pageId: 'home',
    name: '商城首页'
};

const pageComponents: SnakeCmsComponentConfig[] = [
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

远端 JSON 不能直接当成可信类型。建议在页面适配层统一补齐数组并过滤无效配置：

```ts
function normalizeCmsPage(input: Record<string, unknown>) {
    const rawComponents = Array.isArray(input.pageComponents) ? input.pageComponents : [];

    return {
        pageInfo: {
            pageId: String(input.pageId || 'default'),
            name: String(input.name || '')
        },
        pageComponents: rawComponents.filter((item): item is SnakeCmsComponentConfig =>
            Boolean(item && typeof item === 'object' && typeof (item as SnakeCmsComponentConfig).component === 'string')
        )
    };
}
```

v2 的 `active === false` 不会渲染；v1 仍识别 `visible === false` 和 `setStyle.showComponent === false`。字段规则见[组件数据约定](/cms/component-data)。

## 2. 在页面中渲染

纯展示组件不需要配置业务服务。页面取得数据后，直接传入 `pageInfo` 和 `pageComponents`：

```vue
<script setup lang="ts">
import { onLoad, onPageScroll, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app';
import { ref } from 'vue';
import type {
    SnakeCmsComponentConfig,
    SnakeCmsDiagnostic,
    SnakeCmsError,
    SnakeCmsExposed,
    SnakeCmsPageInfo
} from '@puresnake/snake-ui';
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

function reportDiagnostic(diagnostic: SnakeCmsDiagnostic) {
    console.warn('[CMS]', diagnostic);
}

function reportError(error: SnakeCmsError) {
    console.error('[CMS]', error.stage, error.cause);
}
</script>

<template>
    <snake-cms
        ref="cmsRef"
        :page-info="pageInfo"
        :page-components="pageComponents"
        :scroll-top="scrollTop"
        @diagnostic="reportDiagnostic"
        @error="reportError"
    />
</template>
```

页面触底时调用 `loadMore()`；下拉刷新或更换整页配置后调用 `init()`；加载失败后可以调用 `retry()`。

## 3. 按需注入业务服务

图片、公告、富文本等展示组件可以直接渲染。配置中出现业务组件时，再注入对应服务：

| 服务       | 使用场景                               |
| ---------- | -------------------------------------- |
| `commerce` | 商品列表、活动场次、筛选、商品详情跳转 |
| `coupon`   | 查询优惠券状态、领取优惠券             |
| `link`     | 站内链接、外链、小程序和 URL Scheme    |

服务应在 `main.ts` 中集中配置。下面只接入商品列表；接口字段不同的项目，也在这里转换成 Snake CMS 需要的结果结构：

```ts
import SnakeUI, { type SnakeCmsCommerceService } from '@puresnake/snake-ui';
import { api } from '@/services/api';

const commerce: SnakeCmsCommerceService = {
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
        legacy: false,
        services: { commerce },
        onDiagnostic(diagnostic) {
            console.warn('[CMS]', diagnostic);
        }
    }
});
```

`coupon` 和 `link` 的方法签名、返回结构及完整示例见 [Snake CMS 组件 API](/components/snake-cms)。业务服务必须返回规范结构，不要让装修组件依赖后端原始响应。

## 4. 处理诊断与失败

至少监听 `diagnostic` 和 `error`，并把 `pageId`、组件标识和错误阶段接入日志平台。常见诊断包括：

- `invalid-component`：配置项缺少字符串类型的 `component`。
- `unknown-component`：没有内置组件、别名或扩展实现。
- `duplicate-commerce-section`：页面包含多个 v1/v2 商品楼层，只有第一个会渲染。
- `legacy-adapter`：项目仍在自动使用旧版兼容层。

CMS 会忽略过期请求结果，页面切换或重新初始化后，较早返回的请求不会覆盖当前页面。具体状态、事件和 Ref 方法见 [Snake CMS 组件 API](/components/snake-cms)，排错步骤见[常见问题](/guide/troubleshooting)。

## 上线前检查

- 页面接口异常、空数组和非法 JSON 不会导致整页白屏。
- 每个编辑器组件标识都有内置组件、别名或扩展兜底。
- 商品分页、优惠券状态和跳转服务已在真实接口下验证。
- H5、小程序和 App 的外链及页面滚动行为已在目标平台验证。
- `diagnostic` 和 `error` 已接入日志平台，并能关联 `pageId`。

## 下一步

- [Snake CMS 组件 API](/components/snake-cms)：查看 Props、事件、Ref 方法和服务配置。
- [组件数据约定](/cms/component-data)：了解字段、可见性和数据规范化规则。
- [装修编辑器数据对接](/cms/sanke-editor)：对接编辑器保存的数据和组件标识。
- [CMS 组件总览](/cms/components)：查找可用于装修页面的组件。
- [运行环境与能力边界](/guide/compatibility)：确认不同平台的可用能力。
