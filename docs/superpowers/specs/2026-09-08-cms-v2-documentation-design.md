# CMS v2 文档信息架构设计

## 背景

Snake UI 已支持 long-editor 的 14 个 CMS v2 区块，同时继续兼容 `r2nd-joker` 等老项目使用的 v1 页面数据。现有文档仍以通用 CMS 和 v1 组件页面为主体，只在快速接入及 `snake-cms` 页面中简要列出 v2 标识，无法让新项目完整查询 v2 `props` 契约。

新项目必须明确使用 v2；v1 文档仅承担历史系统维护和兼容排错职责。

## 目标

- CMS 文档默认路径、示例和导航以 v2 为主。
- 为 14 个 v2 区块分别提供完整配置契约。
- 将 v1 协议和组件索引集中到默认折叠的兼容专区。
- 保留老项目查阅 v1 数据、别名和 legacy adapter 的入口。
- 用自动化测试保证 v2 运行时清单、文档文件和侧边栏入口一致。

## 非目标

- 不把 v2 内部渲染器发布为公共 easycom 组件。
- 不删除现有 `/components/*.md` 公共组件 API 页面。
- 不删除 v1 运行时代码或历史文档 URL。
- 不在本任务中修改 long-editor 或 r2nd-joker。

## 导航结构

CMS 侧边栏采用版本优先结构：

```text
开始
  CMS v2 快速接入
  CMS v2 组件总览
数据与服务
  v2 页面数据协议
  业务服务接入
  装修编辑器数据对接
CMS v2 内容区块
  图片展示
  轮播图
  视频
  热区图
  魔方
  公告
  分割线
  富文本
CMS v2 互动区块
  搜索框
  悬浮按钮
  页面弹窗
  自定义模块
CMS v2 商城区块
  优惠券
  商品列表
v1 旧版兼容（默认折叠）
  v1 兼容说明
  v1 组件索引
```

v2 分组默认展开。v1 分组设置 `collapsed: true` 并置于末尾。顶部 CMS 导航继续进入快速接入，但页面标题与首屏明确标识 v2。

## 文件结构

新增：

```text
docs/cms/v2/
  overview.md
  data-contract.md
  services.md
  carousel.md
  coupon.md
  custom.md
  divider.md
  floatbutton.md
  goodslist.md
  hotzone.md
  images.md
  magiccube.md
  notice.md
  popup.md
  richtext.md
  search.md
  video.md

docs/cms/legacy/
  overview.md
  components.md
```

现有 `/cms/getting-started` 保留 URL，内容改为 v2 快速接入；现有 `/cms/component-data` 和 `/cms/components` 保留为兼容跳转/摘要页，避免外部链接失效。

## v2 区块文档模板

每个区块页面必须包含：

1. 用途和编辑器技术标识。
2. 可直接传入 `pageComponents` 的完整信封示例。
3. `props` 字段表，包括字段路径、类型、默认值和说明。
4. 枚举值、尺寸单位、嵌套数组项结构等约束。
5. link、commerce 或 coupon 服务依赖。
6. 运行时行为和跨端注意事项。
7. v1 近似对应关系，仅链接到旧版兼容说明，不在当前页展开 v1 字段。

文档字段必须以 long-editor 各 `components/v2/*/schema.js` 为来源，并与 Snake UI 实际消费逻辑核对。编辑器面板字段、拖拽状态和预览缩放不属于落库协议，不写入运行时字段表。

## 总览与发现

`/cms/v2/overview` 是新组件发现入口，按内容、互动和商城三类列出 14 个区块，并说明这些是配置协议而非独立 easycom 标签。

原 `/cms/components` 改为短入口页：首先引导 v2 总览；底部提供弱化的 v1 兼容入口。公共组件总览继续展示 `snake-*` 公共组件，不把内部 `cms-v2-*` 渲染器加入公共组件计数。

## v1 兼容专区

`/cms/legacy/overview` 说明：

- v1 信封 `{ component, setStyle }`。
- v1 已冻结，只接受兼容性和严重缺陷修复。
- `visible`、`showComponent`、aliases、normalizers 与 legacy adapter。
- v1/v2 可以混排，但只允许一个商品楼层。
- 新页面不得再生成 v1 配置。

`/cms/legacy/components` 提供旧技术标识到公共组件文档的索引。旧版各公共组件 API 页面保留，不复制一套相同内容。

## 服务文档

`/cms/v2/services` 统一描述 link、commerce、coupon 三类服务：

- v2 link `{ httpType, http }` 到 `SnakeCmsLinkAction` 的行为。
- `v2.goodslist.props.query` 如何传给 commerce service。
- `v2.coupon` 如何调用 check/receive。
- 缺少服务、请求失败和诊断事件的处理方式。

各区块页只保留与自身有关的摘要并链接到服务页，避免复制实现示例。

## 测试与验收

- CMS v2 元数据清单中的 14 个标识都有对应 Markdown 文件。
- 每个 v2 文件都包含技术标识、完整信封、Props 字段表和服务/兼容说明。
- CMS 侧边栏包含全部 14 个页面，且 v2 分组位于 v1 之前。
- v1 分组明确设置 `collapsed: true`。
- 快速接入的首个完整示例使用 `v2.*` 和 `props`，不使用 v1 `setStyle`。
- v1 兼容页面可访问，现有历史 URL不失效。
- VitePress 构建、本地链接结构测试和全量测试通过。

## 交付范围

本任务只修改 Snake UI 文档、VitePress 导航和文档一致性测试，不修改 CMS 运行时代码。
