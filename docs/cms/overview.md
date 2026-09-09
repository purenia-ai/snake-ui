# CMS 组件总览

页面把 long-editor 保存的 `{ component: 'v2.*', active, props }` 数组交给 `<snake-cms>`，由容器按配置渲染对应区块。

> 这里列出的是 `snake-cms` 的配置能力，不是独立 easycom 标签；`v2.*` 是运行时要求的组件标识。

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

## 通用规则

- 尺寸采用 750 设计稿基准，运行时按 rpx 使用。
- `active: false` 的区块不会渲染。
- 链接统一为 `{ httpType: 10 | 11, http: string }`。
- 远端 JSON 仍需在宿主边界做数组和对象校验。
- 未识别的 `v2.*` 会产生 `unknown-component` 诊断并进入 extension 插槽。

继续阅读 [页面数据协议](/cms/data-contract) 和 [业务服务接入](/cms/services)。
