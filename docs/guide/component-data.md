# 组件数据约定

Snake UI 同时使用普通 Props 和 CMS 配置对象。基础组件通常直接传 Props；装修组件常把编辑器产出的复杂配置放在 `datas` 或 `setStyle` 中。

## 普通 Props 与 `datas`

```vue
<!-- 基础组件：直接传 Props -->
<snake-button type="primary">确定</snake-button>

<!-- 装修组件：datas 接收配置对象 -->
<snake-notice :datas="noticeConfig" />
```

各组件文档的 API 表描述公开 Props；`datas` 字段表描述源码实际读取的配置键。字段表不是后端完整响应协议，接口数据仍需在业务层校验。

## CMS 页面数据

`snake-cms` 主要接收：

| 参数              | 作用                               |
| ----------------- | ---------------------------------- |
| `pageInfo`        | 页面标识与业务查询上下文           |
| `pageComponents`  | 按渲染顺序排列的装修组件配置       |
| `scrollTop`       | 吸顶、悬浮等组件使用的页面滚动距离 |
| `stickyOffsetTop` | 吸顶区域的顶部偏移                 |

最小数据结构：

```ts
const pageInfo = { pageId: 'home' };

const pageComponents = [
    {
        id: 'banner-1',
        component: 'images',
        setStyle: {
            src: 'https://example.com/banner.png',
            url: '/pages/activity/index'
        }
    }
];
```

`component` 决定渲染哪个模块，`setStyle` 会作为该模块的配置数据。`visible === false` 或 `setStyle.showComponent === false` 时，CMS 会跳过该项。

## 在业务层规范化

接口数据可能缺少数组或嵌套对象。建议在进入组件前集中补齐，而不是在多个页面重复处理：

```ts
function normalizeNotice(input: Record<string, unknown> = {}) {
    return {
        textList: [],
        imageList: [],
        ...input
    };
}
```

重点校验数组、枚举、颜色、尺寸、链接和深层对象。不要仅依靠 TypeScript 类型信任远端 JSON。

## 事件与诊断

历史业务组件的事件命名并未完全统一，例如同时存在 kebab-case 和驼峰名称。组件文档保留源码真实事件名，调用时不要自行转换。

`snake-cms` 会通过 `diagnostic` 报告无效组件、未知组件、规范化失败、重复商品区域和 legacy 适配器等情况：

```vue
<snake-cms
    :page-info="pageInfo"
    :page-components="pageComponents"
    @diagnostic="reportDiagnostic"
    @error="reportError"
/>
```

## 数据从哪里来

装修数据通常由 SankeEditor 生成，经后端保存后交给 C 端。字段存储、组件标识和扩展方式见[装修编辑器数据对接](/guide/sanke-editor)。
