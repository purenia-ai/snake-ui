# 从 uView Pro 迁移

Snake UI 已内置当前业务所需的基础组件，不再依赖 uView Pro。

## 删除旧配置

1. 删除 `uview-pro` npm 依赖。
2. 删除 `app.use(uViewPro)`。
3. 删除 `uview-pro/index.scss` 和 `uview-pro/theme.scss`。
4. 删除 `pages.json` 中的 `^u-(.*)` easycom 规则。

## 组件映射

| 原组件 | Snake UI |
| --- | --- |
| `u-icon` | `snake-icon` |
| `u-popup` | `snake-popup` |
| `u-mask` | `snake-overlay` |
| `u-button` | `snake-button` |
| `u-image` | `snake-image` |
| `u-lazy-load` | `snake-lazy-image` |
| `u-tabs` | `snake-tabs` |
| `u-sticky` | `snake-sticky` |
| `u-notice-bar` | `snake-notice-bar` |
| `u-loadmore` | `snake-loadmore` |
| `u-empty` | `snake-empty` |
| `u-swiper` | `snake-swiper` |

常用的 `v-model`、`mode`、`color`、`size`、`bg-color`、`custom-style`、`current`、`list`、`change`、`close` 和 `click` 已提供兼容接口。未使用的 uView Pro 历史属性不属于兼容承诺。

## 工具函数

原先通过 `uni.$u` 使用的工具改为按需导入：

```ts
import { addUnit, formatTime, getRect, guid, navTo, sleep, toast } from 'snake-ui/libs'
```

安装 Snake UI 插件后，也可在模板和 Options API 中使用 `$snake`，在脚本中使用 `uni.$snake`。
