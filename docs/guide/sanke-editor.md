# 装修编辑器数据对接（SankeEditor）

snake-ui 的 CMS 组件消费的装修数据由 **SankeEditor**（独立组件库 `sanke-editor`，仓库 `long-editor-manger`）产出。本文说明数据从编辑到渲染的完整链路与契约，宿主项目按此对接即可打通"装修 → 发布 → C 端展示"。

SankeEditor 自身的完整 API（props、services、事件）请以编辑器仓库文档为准，本文只覆盖与 C 端对接相关的内容。

## 端到端链路

```
SankeEditor 工作台          宿主后端                     C 端页面
┌──────────────┐   save   ┌──────────────┐   拉取    ┌──────────────────┐
│ 三栏装修编辑器 │ ───────→ │ cms 文章存储  │ ───────→ │ <snake-cms> 渲染  │
│ v-model JSON │          │ templateJson │          │ pageComponents   │
└──────────────┘          │ + component  │          └──────────────────┘
                          └──────────────┘
```

- 编辑器通过 `@save` 事件吐出标准值 `{ pageSetup, pageComponents }`，由宿主提交后端。
- 后端按/cms/ 文章接口存储为两个字段：`templateJson`（= `pageSetup`，页面标题、背景色等）与 `component`（= `pageComponents`，组件数组）。
- C 端拉取后把两个字段还原为 `{ pageSetup, pageComponents }` 传给 `snake-cms`；页面级样式（背景色等）由宿主自行应用到页面容器。

## 数据契约

`pageComponents` 为有序数组，每个元素代表一个装修组件：

```js
{
  component: 'hotzone',   // 组件标识，决定 snake-cms 用哪个子组件渲染
  text: '热区图',           // 编辑器中的显示名，C 端不消费
  type: '1-19',            // 编辑器分组编号，C 端不消费
  style: 'hotzoneStyle',   // 编辑器右侧面板标识，C 端不消费
  setStyle: { ... },       // ★ 组件数据体，各组件文档中的 datas 字段
  active: true,            // 编辑态选中标记，C 端不消费
}
```

C 端只消费 `component` 与 `setStyle` 两个字段。两个字段的具体取值以各组件文档（`docs/components/*.md`）的 `datas` 字段表为准。

隐藏语义：元素 `visible === false` 或 `setStyle.showComponent === false` 时，`snake-cms` 会跳过渲染。

## 组件标识对照

编辑器左栏可添加的组件与 snake-cms 内置分支的对应关系：

| 编辑器 `component` | snake-cms 渲染 | 依赖说明 |
| --- | --- | --- |
| `commoditysearch` | 商品搜索 | - |
| `pictureads` | 轮播广告 | - |
| `graphicnavigation` | 图文导航 | - |
| `magiccube` | 魔方布局 | - |
| `notice` | 公告 | - |
| `videoss` | 视频 | 别名映射为 `videos`，旧数据无需迁移 |
| `richtext` | 富文本 | - |
| `auxiliarysegmentation` | 辅助分割线 | - |
| `follow` | 关注 | - |
| `suspension` | 悬浮入口 | 需传入 `scroll-top` |
| `jumpApplet` | 小程序跳转 | 需 link-service |
| `images` | 图片展示 | - |
| `hotzone` | 热区图 | 外部链接需 link-service |
| `custommodule` | 自定义模块 | 通过命名插槽承接业务内容 |
| `coupon` | 优惠券 | 需 coupon-service / link-service |
| `goodslist` | 商品列表组合 | 需 commerce-service，tab 吸顶需 `scroll-top` |
| `pagePopup` | 页面弹窗 | - |
| `listswitching` | ⚠️ 非内置 | 旧版商品组件，走 `extension` 插槽；新页面请使用 `goodslist` |

未识别的 `component` 不会报错：`snake-cms` 会发出 `unknown-component` 诊断（`diagnostic` 事件），并交给 `extension` 插槽兜底渲染。

## 跳转链接约定

装修数据中的跳转链接有两种形态：

| 形态 | 字段 | 行为 |
| --- | --- | --- |
| 直接地址 | `url`（图片广告、图文导航、图片、弹窗等） | 交给 `uni.$snake.navTo`：站内路径 `navigateTo`，失败降级 `switchTab`；H5 下 http 链接由浏览器接管 |
| 内外部链接 | `httpType` + `http`（热区图、标题"查看更多"等） | `10` 内部链接走 `navTo`；`11` 外部链接必须经 link-service 打开 |

外部链接（`httpType: 11`）在小程序端无法直接 `navigateTo`，需要宿主提供 web-view 承载页（如 `/pages/custom/webview?url=...`），并通过 `cmsOptions.services.link` 注入跳转服务。若宿主只配置了 `request` 适配器而未注入新服务，snake-ui 会自动启用 legacy 兼容 link-service（由它导航 web-view 页面），并在 `diagnostic` 中给出迁移提示。

## 宿主接入清单

1. 安装与注册：`pnpm add snake-ui`（或复制 `src/uni_modules/snake-ui`），配置 easycom 与插件安装（见[快速开始](./getting-started.md)）。
2. 按需注入适配器：`request` / `cache` / `config`，CMS 业务组件依赖它们获取商品、优惠券等数据。
3. 拉取装修数据，把 `templateJson`、`component` 还原后传给渲染器：

```vue
<snake-cms
  :page-info="pageInfo"
  :page-components="pageComponents"
  :scroll-top="scrollTop"
  @diagnostic="onDiagnostic"
  @error="onError"
/>
```

4. 提供外链承载页（web-view），并通过 `cmsOptions.services.link` 注入跳转服务（或依赖 legacy 自动回退）。
5. 监听 `diagnostic` / `error` 事件上报未知组件、加载失败等问题。
6. 装修数据来自接口，字段并不总是完整：在业务适配层补齐默认结构（见[组件数据约定](./component-data.md)）。

## 编辑器扩展组件的承接

编辑器新增装修组件后，C 端有三种承接方式，按优先级：

1. **内置组件**：在 snake-ui 中实现对应子组件并加入 `snake-cms` 分发（参考热区图 `snake-hotzone` 的接入方式）。
2. **别名**：仅改标识名时，通过 `cmsOptions.aliases` 映射（如内置的 `videoss → videos`）。
3. **extension 插槽**：业务私有组件不必进库，用 `snake-cms` 的 `extension` 作用域插槽自行渲染；需要数据整形时配合 `cmsOptions.normalizers`。

## 装修数据的展示校验

`snake-cms` 内置的规范化（`normalizeSnakeCmsComponents`）会：过滤无效元素、应用别名与 normalizer、跳过隐藏组件、对未知组件给出诊断、去重重复商品区。宿主仍应在接口层校验数组与嵌套结构，详见[组件数据约定](./component-data.md)。
