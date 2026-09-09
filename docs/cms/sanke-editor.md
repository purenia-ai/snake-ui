# 装修编辑器数据对接（SankeEditor）

SankeEditor 负责编辑页面配置，Snake UI 负责在 C 端消费配置并渲染。页面以编辑器 `components/v2` 输出为准，编辑器自身 API 以其仓库文档为准。

## 端到端链路

```text
SankeEditor --save--> 宿主后端 --load--> 页面适配层 --> <snake-cms>
                    pageSetup              pageInfo
                    pageComponents         pageComponents
```

1. 编辑器通过 `save` 提供 `{ pageSetup, pageComponents }`。
2. 宿主后端保存页面信息和有序组件数组。
3. C 端拉取数据并完成 JSON 解析、默认值和业务字段适配。
4. 页面把 `pageInfo` 与 `pageComponents` 传给 `snake-cms`。

如果现有后端使用 `templateJson` 保存页面设置、使用 `component` 保存组件数组，应在页面适配层还原，而不是让 UI 组件理解后端字段名。

## 组件数据契约

```ts
{
    component: 'v2.hotzone',
    text: '热区图',
    type: '3-3',
    props: {
        image: 'https://example.com/map.png',
        zones: []
    },
    active: true
}
```

C 端主要消费 `component`、`active` 与 `props`。`text` 和 `type` 用于编辑器展示和分类；面板路由键按约定推导，不应落库。完整规则见 [页面数据协议](/cms/data-contract)。

## 内置组件标识

| `component`      | 渲染内容   | 额外依赖                  |
| ---------------- | ---------- | ------------------------- |
| `v2.images`      | 图片展示   | 图片链接需要 link service |
| `v2.carousel`    | 轮播图     | 图片链接需要 link service |
| `v2.video`       | 视频       | 无                        |
| `v2.hotzone`     | 热区图     | link service              |
| `v2.magiccube`   | 魔方布局   | link service              |
| `v2.notice`      | 公告       | link service              |
| `v2.divider`     | 分割线     | 无                        |
| `v2.richtext`    | 富文本     | 无                        |
| `v2.search`      | 搜索框     | link service              |
| `v2.floatbutton` | 悬浮按钮   | link service              |
| `v2.popup`       | 页面弹窗   | link service              |
| `v2.custom`      | 自定义模块 | 命名插槽                  |
| `v2.coupon`      | 优惠券     | coupon/link service       |
| `v2.goodslist`   | 商品列表   | commerce service          |

字段详情见 [CMS 组件总览](/cms/overview)。

## 注入业务服务

推荐在安装插件时集中配置：

```ts
app.use(SnakeUI, {
    cms: {
        services: {
            commerce: {
                async getGoods({ params, pageInfo }) {
                    return api.getGoods({ ...params, pageId: pageInfo.pageId });
                },
                async navigateGoods({ item }) {
                    uni.navigateTo({ url: `/pages/goods/detail?id=${item.id}` });
                }
            },
            coupon: {
                check: couponApi.check,
                receive: couponApi.receive
            },
            link: {
                async open(action) {
                    await openLinkForCurrentPlatform(action);
                }
            }
        }
    }
});
```

也可以通过组件的 `cms-options` 覆盖当前页面。

## 页面接入

```vue
<snake-cms
    :page-info="pageInfo"
    :page-components="pageComponents"
    :scroll-top="scrollTop"
    :sticky-offset-top="0"
    @ready="onReady"
    @state-change="onStateChange"
    @diagnostic="onDiagnostic"
    @error="onError"
/>
```

建议把 `diagnostic` 和 `error` 接入日志平台。未知组件不会静默变成其他组件，而是报告诊断并交给 `extension` 插槽兜底。

## 链接约定

装修数据统一保存 `{ httpType, http }`。站内链接可以使用 Snake UI 路由工具；外链、小程序和 scheme 应统一交给 link service，避免业务组件各自判断平台。

小程序外链通常需要宿主提供 web-view 承载页。`uni.navigateToMiniProgram` 也只在平台支持且权限正确时可用。

## 扩展编辑器组件

按以下优先级承接新标识：

1. 在 long-editor `components/v2/<name>` 增加 schema、preview 和 panel。
2. 在 Snake UI 增加同名清单项、静态渲染分支和协议文档。
3. 业务私有组件通过 `extension` 作用域插槽渲染。

新增字段必须进入正式协议，不要通过 alias 或 normalizer 隐式转换。

## 上线检查

- 后端 JSON 能稳定还原成数组，异常数据有默认值和日志。
- 所有编辑器标识都有内置分支、别名或扩展兜底。
- 商品、优惠券、内链、外链和小程序跳转均在真实目标端验证。
- 页面监听 `diagnostic`、`error` 和必要的状态事件。
- 重复商品区、未知组件和服务失败不会造成整页白屏。

排查具体症状见[常见问题](/guide/troubleshooting)。
