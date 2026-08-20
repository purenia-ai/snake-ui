# 装修编辑器数据对接（SankeEditor）

SankeEditor 负责编辑页面配置，Snake UI 负责在 C 端消费配置并渲染。本页只描述两者之间的数据契约与接入链路；编辑器自身 API 以其仓库文档为准。

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
    component: 'hotzone',
    text: '热区图',
    type: '1-19',
    style: 'hotzoneStyle',
    setStyle: { /* 组件配置 */ },
    active: true
}
```

C 端主要消费 `component` 与 `setStyle`。`text`、`type`、`style` 和 `active` 属于编辑态元数据。隐藏和默认值规则见[组件数据约定](/guide/component-data)。

## 内置组件标识

| `component`             | 渲染内容   | 额外依赖                                |
| ----------------------- | ---------- | --------------------------------------- |
| `commoditysearch`       | 商品搜索   | 无                                      |
| `pictureads`            | 轮播广告   | 无                                      |
| `graphicnavigation`     | 图文导航   | 无                                      |
| `magiccube`             | 魔方布局   | 无                                      |
| `notice`                | 公告       | 无                                      |
| `videoss`               | 视频       | 内置别名到 `videos`                     |
| `richtext`              | 富文本     | 无                                      |
| `auxiliarysegmentation` | 辅助分割线 | 无                                      |
| `follow`                | 关注       | 无                                      |
| `suspension`            | 悬浮入口   | `scroll-top`                            |
| `jumpApplet`            | 小程序跳转 | link service                            |
| `images`                | 图片展示   | 无                                      |
| `hotzone`               | 热区图     | 外链需要 link service                   |
| `custommodule`          | 自定义模块 | 命名插槽                                |
| `coupon`                | 优惠券     | coupon/link service                     |
| `goodslist`             | 商品区域   | commerce service，吸顶需要 `scroll-top` |
| `pagePopup`             | 页面弹窗   | 无                                      |

`listswitching` 不是当前内置 CMS 标识。旧数据可通过别名、normalizer 或 `extension` 插槽承接。

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

也可以通过组件的 `cms-options` 覆盖当前页面。旧项目只提供 `request/cache/config` 时可启用 legacy 兼容层，并通过 `diagnostic` 收到迁移提示。

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

装修数据可能保存直接 `url`，也可能保存 `httpType + http`。站内链接可以使用 Snake UI 路由工具；外链、小程序和 scheme 应统一交给 link service，避免业务组件各自判断平台。

小程序外链通常需要宿主提供 web-view 承载页。`uni.navigateToMiniProgram` 也只在平台支持且权限正确时可用。

## 扩展编辑器组件

按以下优先级承接新标识：

1. 通用组件进入 Snake UI，并加入 CMS 内置分发。
2. 仅标识不同，通过 `cms.aliases` 映射。
3. 数据结构不同，通过 `cms.normalizers` 转换或过滤。
4. 业务私有组件通过 `extension` 作用域插槽渲染。

## 上线检查

- 后端 JSON 能稳定还原成数组，异常数据有默认值和日志。
- 所有编辑器标识都有内置分支、别名或扩展兜底。
- 商品、优惠券、内链、外链和小程序跳转均在真实目标端验证。
- 页面监听 `diagnostic`、`error` 和必要的状态事件。
- 重复商品区、未知组件和服务失败不会造成整页白屏。

排查具体症状见[常见问题](/guide/troubleshooting)。
