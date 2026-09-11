---
name: 'uview-compatibility-audit'
description: 'Snake UI uView Pro 组件兼容性审计参考。处理 uview-compatibility-audit、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['uview-compatibility-audit', 'snake-uview-compatibility-audit', 'uView', 'Pro']
---

# uView Pro 组件兼容性审计

审计基准：`D:\development\Projects\UniApp\uView-Pro\src\uni_modules\uview-pro\components`。Snake UI 不依赖 uView 运行时；下表是发布前必须维护的本地兼容性清单，`tests/uview-compatibility-audit.test.mjs` 会校验其覆盖率。

## 已有对应组件（43）

这些组件均有独立的 Snake 类型契约和实现；后续变更需同时核对 Props、Events、Slots、Expose、默认值和跨端关键行为。已有组件测试覆盖公开类型、独立运行时和重点交互；本批新增 Tabbar 的原生栏替换回归。

| uView Pro           | Snake UI                | 当前审计结论                                  |
| ------------------- | ----------------------- | --------------------------------------------- |
| `u-button`          | `snake-button`          | 已映射                                        |
| `u-calendar`        | `snake-calendar`        | 已映射                                        |
| `u-cell-group`      | `snake-cell-group`      | 已映射                                        |
| `u-cell-item`       | `snake-cell-item`       | 已映射                                        |
| `u-checkbox`        | `snake-checkbox`        | 已映射                                        |
| `u-checkbox-group`  | `snake-checkbox-group`  | 已映射                                        |
| `u-config-provider` | `snake-config-provider` | 已映射                                        |
| `u-count-down`      | `snake-count-down`      | 已映射                                        |
| `u-empty`           | `snake-empty`           | 已映射                                        |
| `u-form`            | `snake-form`            | 已映射                                        |
| `u-form-item`       | `snake-form-item`       | 已映射                                        |
| `u-icon`            | `snake-icon`            | 已映射                                        |
| `u-image`           | `snake-image`           | 已映射                                        |
| `u-index-anchor`    | `snake-index-anchor`    | 已映射                                        |
| `u-index-list`      | `snake-index-list`      | 已映射                                        |
| `u-input`           | `snake-input`           | 已映射                                        |
| `u-line`            | `snake-line`            | 已映射                                        |
| `u-line-progress`   | `snake-line-progress`   | 已映射                                        |
| `u-link`            | `snake-link`            | 已映射                                        |
| `u-loadmore`        | `snake-loadmore`        | 已映射                                        |
| `u-modal`           | `snake-modal`           | 已映射                                        |
| `u-navbar`          | `snake-navbar`          | 已映射                                        |
| `u-no-network`      | `snake-no-network`      | 已映射                                        |
| `u-notice-bar`      | `snake-notice-bar`      | 已映射                                        |
| `u-popup`           | `snake-popup`           | 已映射                                        |
| `u-radio`           | `snake-radio`           | 已映射                                        |
| `u-radio-group`     | `snake-radio-group`     | 已映射                                        |
| `u-read-more`       | `snake-read-more`       | 已映射                                        |
| `u-search`          | `snake-search`          | 已映射                                        |
| `u-select`          | `snake-select`          | 已映射                                        |
| `u-skeleton`        | `snake-skeleton`        | 已映射                                        |
| `u-slider`          | `snake-slider`          | 已映射                                        |
| `u-sticky`          | `snake-sticky`          | 已映射                                        |
| `u-subsection`      | `snake-subsection`      | 已映射                                        |
| `u-swiper`          | `snake-swiper`          | 已映射                                        |
| `u-switch`          | `snake-switch`          | 已映射                                        |
| `u-tabbar`          | `snake-tabbar`          | 已修复：`hideTabBar` 默认开启并安全处理普通页 |
| `u-tabs`            | `snake-tabs`            | 已映射                                        |
| `u-text`            | `snake-text`            | 已映射                                        |
| `u-textarea`        | `snake-textarea`        | 已映射                                        |
| `u-toast`           | `snake-toast`           | 已映射                                        |
| `u-transition`      | `snake-transition`      | 已映射                                        |
| `u-upload`          | `snake-upload`          | 已映射                                        |

## uView 独有组件（56）

### P0：高频页面基础能力

`u-action-sheet`、`u-badge`、`u-field`、`u-grid`、`u-grid-item`、`u-number-box`、`u-picker`、`u-rate`。

### P1：常用扩展能力

`u-avatar`、`u-back-top`、`u-card`、`u-circle-progress`、`u-collapse`、`u-collapse-item`、`u-count-to`、`u-divider`、`u-dropdown`、`u-dropdown-item`、`u-fab`、`u-keyboard`、`u-pagination`、`u-row`、`u-col`、`u-step`、`u-steps`、`u-swipe-action`、`u-tag`、`u-top-tips`、`u-verification-code`。

### P2：低频、平台特化或可由现有组件组合

`u-action-sheet-item`、`u-alert-tips`、`u-avatar-cropper`、`u-car-keyboard`、`u-city-select`、`u-column-notice`、`u-full-screen`、`u-gap`、`u-lazy-load`、`u-loading`、`u-loading-popup`、`u-mask`、`u-message-input`、`u-number-keyboard`、`u-root-portal`、`u-row-notice`、`u-safe-bottom`、`u-section`、`u-status-bar`、`u-table`、`u-tabs-swiper`、`u-td`、`u-th`、`u-time-line`、`u-time-line-item`、`u-tr`、`u-waterfall`。

## Snake 专属组件

商城、CMS、筛选、活动和页面装修组件属于 Snake UI 产品能力，不应视为 uView 缺失项。后续仅在自身文档和契约测试中维护它们。
