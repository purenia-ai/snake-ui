# 从 uView Pro 迁移

Snake UI 已覆盖当前项目使用的一批 uView Pro 基础能力，但不是完整兼容层。建议按页面或组件逐步迁移，并在删除旧依赖前完成目标端回归。

## 迁移前盘点

先搜索以下内容：

```text
<u-
uni.$u
$u
uview-pro/index.scss
uview-pro/theme.scss
```

记录使用到的组件、Props、事件、插槽、工具函数和全局样式。只有 Snake UI 已覆盖的部分才能直接替换。

## 常用组件映射

| uView Pro      | Snake UI           |
| -------------- | ------------------ |
| `u-icon`       | `snake-icon`       |
| `u-popup`      | `snake-popup`      |
| `u-mask`       | `snake-overlay`    |
| `u-button`     | `snake-button`     |
| `u-image`      | `snake-image`      |
| `u-lazy-load`  | `snake-lazy-image` |
| `u-tabs`       | `snake-tabs`       |
| `u-sticky`     | `snake-sticky`     |
| `u-notice-bar` | `snake-notice-bar` |
| `u-loadmore`   | `snake-loadmore`   |
| `u-empty`      | `snake-empty`      |
| `u-swiper`     | `snake-swiper`     |

常用的 `v-model`、`mode`、`color`、`size`、`bg-color`、`custom-style`、`current`、`list` 以及部分 `change`、`close`、`click` 事件已有兼容接口。请以具体组件文档为准，未列出的历史属性不属于兼容承诺。

## 工具迁移

原先的 `uni.$u` 工具优先改为按需导入：

```ts
import { addUnit, formatTime, getRect, guid, route, sleep, toast } from 'snake-ui';
```

安装插件后，也可以使用 `uni.$snake` 或模板 `$snake`：

```ts
uni.$snake.toast('迁移完成');
await uni.$snake.route('/pages/index/index');
```

`uni.$u.route()` 可以直接迁移为 `route()`，字符串简写和对象形式均兼容：

```ts
await route('/pages/goods/detail', { id: 1 });
await route({ type: 'redirect', url: '/pages/login' });
```

完整的别名、参数编码与平台限制见[工具介绍](/tools/intro)。

## 分阶段替换

1. 按[快速开始](/guide/getting-started)接入 Snake UI，暂时保留 uView Pro。
2. 逐页替换已覆盖的组件，并核对 Props、事件和插槽差异。
3. 替换 `uni.$u`、`$u` 与工具导入。
4. 将主题色和业务样式迁移到 Snake UI 变量。
5. 确认项目中不再使用 uView Pro 后，再删除旧插件、样式、easycom 规则和依赖。

## 删除旧配置

- 删除 `app.use(uViewPro)`。
- 删除 `uview-pro/index.scss` 和 `uview-pro/theme.scss`。
- 删除 `pages.json` 中的 `^u-(.*)` easycom 规则。
- 删除 `uview-pro` 依赖。

## 验收清单

- 搜索不到预期移除的 `<u-*>`、`uni.$u` 和 `$u` 用法。
- H5 与实际目标小程序/App 上的弹层、滚动、表单和导航行为正常。
- 主题、字号、间距和禁用状态没有明显视觉回归。
- 构建产物不再包含 uView Pro 依赖。

遇到组件不识别或样式异常时，查看[常见问题](/guide/troubleshooting)。
