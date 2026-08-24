# Snake UI 示例应用底部导航设计

## 背景

Snake UI 示例应用目前只有 `pages/index/index` 一个一级页面，组件示例、CMS 示例和工具示例均通过分包详情页进入。uView Pro 的示例应用则将组件、工具、体验、模板和关于注册为 tab 页面，并在公共页面外壳中渲染可主题化的自定义底栏。

本次只借鉴其信息架构和公共外壳模式，不复制页面数量或视觉细节。Snake UI 第一版底部导航限定为“组件、工具、关于”三个入口，与当前已有内容保持一致。

## 目标

- 为示例应用提供三个稳定的一级入口：组件、工具、关于。
- 使用符合 uni-app 页面模型的 tab 路由，保证 H5、小程序和 App 的切换语义一致。
- 让底栏跟随 Snake UI 明暗主题与示例语言切换。
- 让示例应用的物理目录表达页面职责，并统一详情页面的文件组织方式。

## 非目标

- 不新增“体验地图”“模板”等当前没有独立内容体系的栏目。
- 不改变 `componentsA`、`componentsB` 的分包容量职责，也不重新划分组件所属分包。
- 不把底栏作为本次对外发布的 Snake UI 组件；它先作为示例应用公共组件使用。
- 不修改组件库运行时 API、依赖或文档站导航。

## 页面与路由结构

三个 tab 页面统一放在主包的 `pages/example` 目录：

| 栏目 | 路由 | 内容 |
| --- | --- | --- |
| 组件 | `pages/example/components` | 保留当前组件分组、搜索、主题和语言入口 |
| 工具 | `pages/example/tools` | 汇总 HTTP、节流与防抖、路由、主题与语言四个现有工具示例 |
| 关于 | `pages/example/about` | 品牌定位、主要能力、当前版本和文档入口 |

`pages/example/components.config.ts` 保存组件总览配置，`pages/example/tools.config.ts` 保存工具总览配置。主包不再保留 `pages/index`、`pages/toolbox` 或独立 `pages/about` 目录。

详情页面统一采用“功能目录 + `index.vue`”：

```text
pages/
├─ example/
│  ├─ components.vue
│  ├─ components.config.ts
│  ├─ tools.vue
│  ├─ tools.config.ts
│  └─ about.vue
├─ componentsA/
│  └─ button/index.vue
├─ componentsB/
│  └─ snakeCms/index.vue
├─ library/
│  ├─ http/index.vue
│  ├─ debounceThrottle/index.vue
│  └─ route/index.vue
└─ other/
   └─ themeLocale/index.vue
```

组件目录使用与组件名一致的 lower camelCase，例如 `loadingIcon`、`checkboxGroup`、`buttonSort` 和 `snakeCms`。内部演示路由同步迁移为 `/pages/componentsA/button/index`、`/pages/library/http/index` 等新路径；本次不保留旧演示 URL 的空壳兼容页面。

## 组件设计

新增示例应用内部组件 `DemoTabbar`：

- 接收当前 tab 标识，内部维护三个固定入口配置。
- 使用 `uni.switchTab` 切换一级页面。
- 图标优先复用 Snake UI 已有图标能力；若缺少匹配图标，则使用简洁的文本符号，不新增图片依赖。
- 标签通过现有 `useDemoLocale` 翻译，至少覆盖中英文。
- 使用 Snake UI CSS 主题变量表现背景、分割线、普通色和选中色。
- 处理 `safe-area-inset-bottom`，避免被全面屏底部区域遮挡。

扩展 `DemoPage`：

- 增加可选的 `tabbar` 属性，默认不显示。
- 增加当前 tab 标识属性，仅在 `tabbar` 开启时使用。
- 开启底栏时为正文预留底部空间，避免最后一项被遮挡。
- 三个一级页面关闭返回与首页按钮；详情页行为保持不变。

## 页面内容

### 组件

现有首页迁移为 `pages/example/components.vue`，不改变组件筛选、主题切换和语言切换逻辑。

### 工具

工具总览采用与组件首页一致的卡片语言，展示四个现有工具示例。点击卡片使用 `uni.navigateTo` 进入对应分包页面。每项包含名称、简短说明和进入提示，不在总览页复制交互演示。

### 关于

关于页展示：

- Snake UI 名称与商城/CMS 场景定位。
- Vue 3、uni-app、多主题、国际化、HTTP 与常用工具等已有能力。
- 从 `package.json` 对应的示例版本信息；若构建链不适合直接导入，则使用集中常量并通过测试约束。
- 文档入口；跨端打开能力不可用时给出可复制的文档地址，不静默失败。

## 状态与交互

- 当前选中项由页面显式传入，不依赖解析运行时路由。
- 点击当前项不重复导航。
- 切换 tab 使用 `uni.switchTab`，失败时不降级为普通详情页导航。
- 主题和语言状态继续复用现有响应式能力，不创建第二套状态。
- 底栏只出现在三个一级页面，所有示例详情页保持沉浸式内容空间。

## 视觉与可访问性

- 高度和间距以触控目标不小于约 44px 为基准。
- 文本标签始终显示，不只依赖图标表达含义。
- 选中态同时使用颜色和字重，避免只依赖细微色差。
- 深色模式使用现有表面色、分割线和文本变量。
- 尊重 `prefers-reduced-motion`，不添加必要性低的位移动画。

## 验证

- 结构测试确认三个主包页面、`tabBar` 配置和三个标签存在。
- 结构测试确认所有组件配置、文档 preview 和 `pages.json` 使用新的“目录 + index”路由。
- 结构测试确认工具详情分别位于 `library` 与 `other` 语义目录，并且不存在 `index`、`toolbox`、`tools` 旧页面目录。
- 类型检查覆盖新增 Vue/TypeScript 文件。
- 运行相关现有测试与 H5 构建。
- 手工检查三个入口可相互切换、详情页可返回、底部内容不被遮挡，以及明暗主题和中英文状态。

## 变更边界

本次修改示例应用页面、公共示例外壳、路由配置、组件配置、文档 preview 路径和相关测试。组件库源码目录与公共 API 不变。工作区中已有的文档删除状态属于用户现有改动，不恢复、不覆盖，也不纳入本功能提交。
