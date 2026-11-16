# snake-image 加载态默认值修正（去掉默认动画）

- 日期：2026-11-16
- 目标版本：0.1.1（patch，仅默认值与尺寸策略）
- 状态：**已确认**（2026-11-16，方案 B）
- 参照：`wot-design-uni` `wd-img`（docs/component/img.md）、`uView-Pro` 0.6.24 `u-image`（uviewpro.cn/zh/components/image.html）

---

## 1. 问题

`snake-image` 在加载态的兜底渲染是 `<snake-loading size="24">`（`snake-image.vue` 模板，2026-08-14 `f2ee63e` 首批组件起就是这样，`fc0ae44` 只是把 `snake-loading-icon` 换成 `snake-loading`）。两个后果：

1. **默认就在转圈**：`loading-icon` / `loading-img` 都为空时一定落到动画兜底，图片是全站最高频元素（r2nd-joker 22 处、snake-appraise 9 处），列表里会出现成排的绿色转圈。
2. **尺寸写死 24px**（375 口径 = 48rpx）：48rpx / 64rpx 的缩略图上图标铺满整个容器。

## 2. 参照系（两家都不是默认动画）

|                           | 加载态默认                                                                                                       | 动画怎么来                                                                                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `wot-design-uni` `wd-img` | 什么都不渲染（`image` 被收成 `0×0`，只留 `<slot name="loading">`）；props 里没有 `show-loading` / `loading-icon` | 官方示例自己往插槽里放 `<wd-loading />`                                                                |
| `uView-Pro` `u-image`     | `loadingIcon` 默认 `'photo'`，**静态小图标**                                                                     | 文档原话：“默认显示一个小图标，可以通过 `loading` 自定义插槽，结合 `u-loading` **实现加载的动画效果**” |

结论：**加载态可以默认存在，动画必须显式选择**。我们的动画兜底是唯一的异类。

## 3. 决策（方案 B）

对齐 `uView-Pro`：兜底换成静态 `photo` 图标，并把图标尺寸改为跟随容器；动画/自定义内容只走配置项与插槽。

选 B 而非“纯占位底色”的原因：

1. 与 `uView-Pro` 同构，改动面最小、风险最低。
2. 组件内部对称：加载 `photo`、失败 `error-circle`，都是静态图标、都走 muted 色。
3. 弱网下保留可见反馈，不会退化成“看起来没反应”。
4. `uView-Pro` 在此处把容器的 `width/height` 直接传给 `u-icon`（`100%` 会失真），我们的尺寸算法更稳。

## 4. 行为契约（0.1.1 起）

渲染优先级不变：**同名插槽 > `loading-img` / `error-img` > 默认图标**。

| 状态     | 默认表现                                                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 加载中   | `--snake-image-status-bg` 占位底色 + 居中静态 `photo` 图标（`loading-icon` 默认值改为 `'photo'`；传 `loading-icon=""` 只留底色；`show-loading="false"` 整层隐藏） |
| 加载失败 | 占位底色 + 居中静态 `error-circle` 图标（`error-icon` 默认值不变）                                                                                                |
| 想要动画 | `<template #loading><snake-loading size="24" /></template>`，与两家文档写法一致                                                                                   |

图标尺寸规则（`statusSize`）：

| 容器短边（`width` / `height` 中可解析的更短边） | 图标尺寸   |
| ----------------------------------------------- | ---------- |
| 无法解析（`100%`、`vh`、`auto`）                | 24         |
| `side / 2` 落在 12–24 之间                      | 取整后原值 |
| `side / 2 < 12`（如 48rpx = 24px）              | 12         |
| `side / 2 > 24`                                 | 24         |

“可解析”仅限裸数字、`px`、`rpx`；百分比 / `vh` / `vw` / `auto` 一律回落 24，不做猜测（避免 `width="100%"` 被当成 100px）。

## 5. 实现要点

- `snake-image.vue`：模板删除 `<snake-loading v-else size="24" />` 兜底，`snake-icon` 的 `size` 改为 `:size="statusSize"`（加载态与失败态共用）；`withDefaults` 中 `loadingIcon` 默认值 `'' → 'photo'`。
- `statusSize`：新增 computed，复用 `libs/function/unit` 的 `unitToPx`，规则见 §4。
- `types.ts`：更新 `loadingIcon` / `showLoading` 注释，不新增 prop、不改事件。
- 文档与 demo：`docs/components/image.md` 的“加载中”段改写为静态图标 + 插槽动画；demo 交互说明同步，`customLoading` 开关已是显式动画示例。
- 测试：`tests/foundation-parity.test.mjs` 增加 `loadingIcon: 'photo'` 断言与“模板中不再出现 `snake-loading` 兜底”的反向断言。

## 6. 不做（YAGNI）

- 不加 `loading-delay`（缓存命中闪一帧的问题留待真机确认后再评估）。
- 不加“容器小于阈值不显示图标”的规则（先看 12px 图标的实际观感）。
- 不改 `errorIcon` 默认值，不改 `showLoading` / `showError` 语义。
- 兼容性：`0.1.0` 起的公开 API 不变；这是默认值修正，属 patch。

## 7. 影响面

| 对象                                            | 影响                                                                                            |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 消费方（r2nd-joker 22 处、snake-appraise 9 处） | 无需改代码，升级后自动生效；要动画再加 `#loading`                                               |
| 破坏性                                          | 无（无 prop / 事件 / 插槽改名或删除）                                                           |
| 视觉                                            | 小图（≤48rpx 短边）图标从 24px 缩到 12px；中大图为静态图标替代动画                              |
| 验证                                            | `pnpm test:all`、`pnpm type-check`（基线 40 条）、`pnpm docs:build`、prettier / eslint 变更文件 |
