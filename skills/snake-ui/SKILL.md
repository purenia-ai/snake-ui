---
name: snake-ui
description: 当需要构建、修改、评审、排查或编写 Snake UI 组件、页面、CMS 区块、主题、图标、表单、导航、工具函数或 uni-app 集成时使用。用户提到 Snake UI、`snake-*` 组件、`@puresnake/snake-ui`，或正在处理消费该组件库的页面时，即使没有明确点名此 Skill，也应使用。
---

# Snake UI 技能文档

Snake UI 是面向 uni-app 商城和 CMS 场景的 Vue 3 组件库，支持 H5、小程序与 App。此 Skill 用于定位准确资料；Snake UI 当前源码、类型和测试才是 API 契约。

## 读取顺序

1. 先读仓库根目录 `llms.txt`，快速定位能力和关键约束。
2. 只读任务直接涉及的 `references/` 文档；完整目录见 [references/INDEX.md](references/INDEX.md)。
3. 修改实现或判断 API 时，核对当前组件源码、类型与相邻测试。

| 任务                               | 资料位置                          |
| ---------------------------------- | --------------------------------- |
| 组件、表单、导航                   | `references/components/<name>.md` |
| CMS 接入、装修区块                 | `references/cms/<name>.md`        |
| 主题、国际化、图标、平台能力、排错 | `references/guide/<name>.md`      |
| HTTP、路由、格式化、hooks          | `references/tools/<name>.md`      |

不要一次加载整个 reference 目录，也不要根据 uView Pro 的名称或模板推断 Snake UI API。

## 实现边界

- 优先使用 `snake-*` easycom 标签；手动导入使用 `@puresnake/snake-ui/components/snake-<name>/snake-<name>.vue`。
- 公开 props、事件和类型必须同步。使用 uni-app API 与条件编译处理跨端差异，不假设浏览器 DOM 在小程序或 App 中存在。
- 请求、缓存、配置与 CMS 服务由插件适配器注入；组件库内不绑定业务接口或宿主依赖。
- 修改公开组件契约时同步更新文档与 demo；reference 和 `llms-full.txt` 由 `pnpm skill:sync` 生成，不直接编辑。

## 关键行为

- `snake-tabbar`：原生 tabBar 页面默认调用 `uni.hideTabBar()`；必须保留 `hideTabBar`、`pagePath`、`beforeSwitch` 和 `uni.switchTab()` 行为。详见 `references/components/tabbar.md`。
- `snake-icon`：图标名称必须同时存在于 `icon-names.ts` 与 `iconfont.css` 的 `.sicon-*` 规则；字库内联在 CSS 中，不添加独立运行时字体文件。详见 `references/components/icon.md`。
- 表单控件保持与 form-item 的注册、校验、重置和错误展示契约一致；fixed、sticky、overlay、popup 等布局组件应在目标平台验证。

## 验证

先执行受影响范围的测试。公开组件或类型变更后运行 `pnpm type-check`；文档变更后运行 `pnpm skill:sync` 和 `pnpm docs:build`。未验证的平台或检查需如实说明。
