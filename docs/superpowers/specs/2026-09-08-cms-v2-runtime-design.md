# CMS v2 运行时接入设计

## 背景

`long-editor-manger/packages/editor/src/components/v2` 已建立新一代页面装修协议。v2 使用 `{ component, text, type, active, props }` 信封，组件技术标识带 `v2.` 命名空间，并对内容、样式和业务查询字段做了重新分组。

`r2nd-joker` 等既有项目仍从接口取得 v1 `{ component, setStyle }` 数据并原样传给 `snake-cms`，部分页面还使用本地 `snake-cms-home` 和 v1 normalizer。历史页面在一段兼容期内必须继续可用，但 v1 不再承接新功能。

## 目标

- `snake-cms` 在同一个页面中安全渲染 v1 与 v2 配置。
- v2 直接消费编辑器保存的 `props`，不降级或转换成 v1 `setStyle`。
- 完整接入编辑器当前发布的 14 个 v2 区块。
- 保持 v1 标签、数据协议、服务适配和渲染行为兼容。
- 保持 H5、微信小程序和 App 的静态组件引用能力。
- 建立编辑器 v2 schema 与 Snake UI 消费端之间可测试的契约清单。

## 非目标

- 不修改或维护 long-editor 的 v1 组件。
- 不在第一阶段把 v2 内部渲染器发布为可独立使用的 easycom 组件。
- 不把 v2 数据转换为 v1 数据。
- 不在本阶段删除 `r2nd-joker` 的本地 `snake-cms-home`。
- 不自动迁移数据库中的历史页面 JSON。

## 协议识别与标准化

标准化层按 `component` 技术标识识别协议：

- `component` 以 `v2.` 开头时为 v2。
- 现有 v1 标识和别名继续按 v1 处理。
- 其他标识作为扩展组件，保留原数据并输出 unknown-component 诊断。

标准化结果显式携带 `version: 1 | 2`。v2 保留 `props`，v1 保留 `setStyle`：

```ts
type SnakeCmsNormalizedComponent =
    | {
          version: 1;
          component: SnakeCmsV1BuiltinComponent | string;
          setStyle: Record<string, unknown>;
      }
    | {
          version: 2;
          component: SnakeCmsV2BuiltinComponent | string;
          props: Record<string, unknown>;
      };
```

两种标准化结果继续包含 `id`、`originalComponent` 和 `builtin`。v1 的 `visible === false`、`setStyle.showComponent === false` 与 v2 的 `active === false` 分开判断，不跨协议复用哨兵字段。

v2 缺少对象类型的 `props` 时使用空对象并产生 `invalid-component` 诊断；单个错误区块不阻断页面其余内容。

## 内置组件清单

CMS 元数据目录分为 v1 冻结清单和 v2 主清单。v2 清单必须包含：

| 技术标识 | 显示能力 | v1 近似对应 |
| --- | --- | --- |
| `v2.carousel` | 轮播图 | `pictureads` 的轮播模式 |
| `v2.coupon` | 优惠券 | `coupon` |
| `v2.custom` | 自定义插槽 | `custommodule` |
| `v2.divider` | 空白/分割线 | `auxiliarysegmentation` |
| `v2.floatbutton` | 悬浮按钮 | `suspension` |
| `v2.goodslist` | 商品楼层 | `goodslist` |
| `v2.hotzone` | 热区图 | `hotzone` |
| `v2.images` | 单图/图片网格 | `images`、`pictureads` 的静态模式 |
| `v2.magiccube` | 魔方布局 | `magiccube` |
| `v2.notice` | 公告 | `notice` |
| `v2.popup` | 页面弹窗 | `pagePopup` |
| `v2.richtext` | 富文本 | `richtext` |
| `v2.search` | 商品搜索 | `commoditysearch` |
| `v2.video` | 视频 | `videoss`/`videos` |

v2 技术标识不设为 v1 alias，因为两侧字段结构和能力不等价。

## 渲染架构

`snake-cms.vue` 仍是唯一公共入口，并继续使用显式静态分支以兼容小程序。v1 模板与逻辑冻结；v2 分支转交内部渲染器：

```text
components/snake-cms/
  snake-cms.vue
  blocks/v2/
    cms-v2-carousel.vue
    cms-v2-coupon.vue
    cms-v2-custom.vue
    cms-v2-divider.vue
    cms-v2-floatbutton.vue
    cms-v2-goods-list.vue
    cms-v2-hotzone.vue
    cms-v2-images.vue
    cms-v2-magiccube.vue
    cms-v2-notice.vue
    cms-v2-popup.vue
    cms-v2-richtext.vue
    cms-v2-search.vue
    cms-v2-video.vue
```

这些文件是 `snake-cms` 的内部实现，不加入 easycom 公共组件清单，不从包根组件类型入口导出。内部渲染器可以复用 Snake UI 的基础组件和运行时服务，但不能依赖 long-editor 的 Vue 组件或编辑器专用模块。

第一阶段以 long-editor 各 `schema.js` 的默认信封作为数据契约基线。渲染器支持 schema 声明的全部有效字段，不读取编辑器面板路由、预览缩放或拖拽状态。

## 各区块职责

- `carousel`：图片轮播、自动播放、循环及指示器；间隔从秒转换为组件所需单位。
- `images`：单列或 1–4 列网格，处理统一图片项与链接契约。
- `video`：视频地址、封面、自动播放和通用视觉样式。
- `hotzone`：背景图上按百分比定位热区，通过 link service 跳转。
- `magiccube`：按 v2 layout/cells/schedules 渲染 CSS Grid，并根据当前日期时间选择有效投放图。
- `notice`：横向滚动或纵向轮播，文本项使用统一 link 契约。
- `divider`：辅助空白或实线、虚线、点线分割。
- `search`：搜索外观、热词、右侧图片与图标；提交和点击通过 link service。
- `floatbutton`：固定位置图片按钮及链接。
- `popup`：底部或居中图片弹窗及链接。
- `coupon`：页面或弹窗形态，领取前后状态连接 coupon/link service。
- `goodslist`：用 `props.query` 请求商品，以 `display`、`bars`、`style` 和 `empty` 渲染；独立维护 v2 查询和展示状态。
- `richtext`：消费 HTML `content`，使用安全能力与现有富文本组件一致。
- `custom`：按 `slotName` 将内容交给宿主命名插槽。

## 服务与数据流

链接统一转换为现有 `SnakeCmsLinkAction` 后调用 `cms.services.link.open`。v2 link 的 `httpType: 10 | 11` 映射为内部导航与外部链接；无效或空链接不执行跳转。

`v2.coupon` 继续复用 coupon service，但以 v2 `coupon`、`before` 和 `after` 字段构建上下文。`v2.goodslist` 复用 commerce service；请求参数由 `props.query` 和当前 tabs/filter/activity 状态产生，不读取 v1 `filterParams`。v1 和 v2 商品楼层各自维护控制器状态，避免混排页面状态串联。

缺少可选服务时展示静态内容；触发依赖服务的操作时沿用 Snake UI 运行时错误/诊断机制，不让单次交互导致整个 CMS 页面崩溃。

## v1 兼容策略

- 当前 v1 内置标识、aliases、normalizers、legacy adapter 和 `setStyle` 读取保持不变。
- v1 只接受兼容性修复和严重缺陷修复，不增加编辑器新能力。
- `r2nd-joker` 当前直接传入的 v1 `pageComponent` 无需调用方改造。
- `snake-cms-home` 的统一替换属于后续宿主迁移任务，不阻塞 Snake UI v2 接入。
- 未来移除 v1 前，先加入诊断统计或宿主侧用量确认；本设计不设未经验证的删除日期。

## 与 long-editor 的契约同步

Snake UI 不在运行时读取另一个仓库。测试夹具固定记录 long-editor 当前 14 个 v2 默认信封和技术标识。新增 v2 编辑器模块时必须同步：

1. CMS v2 元数据清单。
2. 静态渲染分支与内部渲染器。
3. 默认信封契约测试。
4. CMS 文档。

测试应明确报出“编辑器存在但消费端未支持”的技术标识，避免静默遗漏。

## 错误处理

- 非数组页面配置：返回空组件并报告 `invalid-component`。
- v2 缺失或非法 `props`：使用空对象保证渲染安全，同时报告诊断。
- 未知 `v2.*`：报告 `unknown-component`，交给现有 extension slot。
- 单个图片、链接、布局或时间配置非法：该字段回退默认值，不阻断其他区块。
- commerce/coupon/link 服务错误：转换为带阶段信息的 `SnakeCmsError`，由现有诊断和 UI 状态呈现。

## 测试与验收

- 14 个 v2 默认信封全部被识别为 `version: 2` 和 builtin。
- v1 正式标识、别名、normalizer 和 legacy adapter 测试原样通过。
- 增加 v1/v2 混排、`active: false`、非法 props、未知 v2 区块测试。
- 每个 v2 内部渲染器至少覆盖默认态、关键分支和链接/服务交互。
- `goodslist` 覆盖分页、筛选、tabs、活动、空态及 v1/v2 状态隔离。
- 结构测试确认 v2 清单、静态分支和渲染器一一对应。
- 执行 TypeScript、ESLint、全量单元测试、VitePress 文档构建和 H5 构建。
- 检查小程序构建不使用运行时动态组件，并至少执行微信小程序构建或对应结构测试。

## 实施顺序

1. 扩展 CMS 元数据、版本化标准化类型和协议测试。
2. 实现无业务请求的内容区块：divider、images、carousel、video、richtext、notice。
3. 实现链接互动区块：hotzone、search、floatbutton、popup、custom。
4. 实现 magiccube 的布局与定时投放。
5. 实现 coupon 和 goodslist 服务接入及状态隔离。
6. 接入 `snake-cms` 静态分支，补齐混排与结构测试。
7. 更新文档并完成多目标构建验证。

## 交付边界

本任务只修改 `snake-ui`。对 `long-editor-manger` 和 `r2nd-joker` 进行只读契约核对，不在本任务中提交跨仓库改动。
