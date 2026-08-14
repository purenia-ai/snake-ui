# Snake UI uni_modules 结构规范化设计

## 背景

当前 `src/uni_modules/snake-ui` 已包含 Snake UI 的主要组件源码，但目录名、组件文件名和公开标签没有遵循 uni-app easycom 的一致约定。模块也缺少 `package.json`、README、变更记录和显式导出入口。VitePress 文档仍指向重构前的源码路径。

本阶段只解决组件库结构与发现机制，不修改组件业务逻辑，也不补造当前缺失的请求、缓存或业务配置实现。

## 目标

- 将所有公开组件统一为 `snake-kebab-case/snake-kebab-case.vue`。
- 通过 easycom 自动发现 `<snake-*>` 组件。
- 补齐一个可识别、可继续维护的 `uni_modules` 模块骨架。
- 提供可选的 TypeScript 具名导出入口，不进行全量全局注册。
- 同步文档中的组件名、示例标签和源码位置。
- 防止内部设计资料随 VitePress 发布。

## 非目标

- 不兼容旧组件目录或旧文件路径。
- 不迁移现有 Options API 组件到 Composition API。
- 不安装或复制 uView Pro。
- 不实现 `@/utils/request`、缓存管理器、业务配置或当前缺失的其他 `snake-*` 组件。
- 不新增组件演示页面，不调整文档站视觉风格。

## 目录与命名

每个公开组件使用相同的目录名、文件名和 easycom 标签名：

| 现有位置 | 新公开组件 |
| --- | --- |
| `snake-cms.vue` | `components/snake-cms/snake-cms.vue` |
| `components/activity-list/index.vue` | `components/snake-activity-list/snake-activity-list.vue` |
| `components/auxiliarysegmentation/index.vue` | `components/snake-auxiliary-segmentation/snake-auxiliary-segmentation.vue` |
| `components/commoditysearch/index.vue` | `components/snake-commodity-search/snake-commodity-search.vue` |
| `components/coupon/index.vue` | `components/snake-coupon/snake-coupon.vue` |
| `components/custommodule/index.vue` | `components/snake-custom-module/snake-custom-module.vue` |
| `components/filter-sorts/index.vue` | `components/snake-filter-sorts/snake-filter-sorts.vue` |
| `components/follow/index.vue` | `components/snake-follow/snake-follow.vue` |
| `components/goodsList/index.vue` | `components/snake-goods-list/snake-goods-list.vue` |
| `components/graphicnavigation/index.vue` | `components/snake-graphic-navigation/snake-graphic-navigation.vue` |
| `components/images/index.vue` | `components/snake-images/snake-images.vue` |
| `components/jumpApplet/index.vue` | `components/snake-jump-applet/snake-jump-applet.vue` |
| `components/listswitching/index.vue` | `components/snake-list-switching/snake-list-switching.vue` |
| `components/magiccube/index.vue` | `components/snake-magic-cube/snake-magic-cube.vue` |
| `components/notice/notice.vue` | `components/snake-notice/snake-notice.vue` |
| `components/page-popup/index.vue` | `components/snake-page-popup/snake-page-popup.vue` |
| `components/pictureads/index.vue` | `components/snake-picture-ads/snake-picture-ads.vue` |
| `components/richtext/richtext.vue` | `components/snake-rich-text/snake-rich-text.vue` |
| `components/suspension/index.vue` | `components/snake-suspension/snake-suspension.vue` |
| `components/videos/index.vue` | `components/snake-videos/snake-videos.vue` |

`filter-page.vue` 和 `tree-select` 是公开组件的内部实现，不纳入 easycom 公共命名规则。移动公开组件时必须同步修正这些内部组件的相对引用。

## easycom 配置

`src/pages.json` 增加以下配置：

```json
"easycom": {
  "autoscan": true,
  "custom": {
    "^snake-(.*)": "@/uni_modules/snake-ui/components/snake-$1/snake-$1.vue"
  }
}
```

业务页面以 `<snake-cms />`、`<snake-goods-list />` 等标签使用组件，无需手动注册。

## 模块元数据与导出

在 `src/uni_modules/snake-ui` 下新增：

- `package.json`：模块 ID 为 `snake-ui`，版本为 `0.1.0`，入口为 `index.ts`，声明 Vue 3 和 `uview-pro` 模块依赖。未经验证的平台不标记为已支持。
- `index.ts`：对所有公开组件提供具名导出；不执行 `app.component()`，避免全量注册和无意增加包体。
- `readme.md`：说明 easycom 用法、手动导入方式、uView Pro 依赖和当前业务适配依赖。
- `changelog.md`：记录 `0.1.0` 的结构规范化。

## 依赖边界

组件当前使用若干 `<u-*>` 标签和 `$u`/`uni.$u` 能力，因此模块元数据和 README 明确声明 uView Pro 为宿主依赖。本阶段不自动复制或安装该依赖。

以下既有依赖仍由宿主工程提供，并作为已知限制记录：

- `@/utils/request`
- `@/utils/cache/cacheManager`
- `@/config/config`
- 当前源码引用但仓库中不存在的其他 `snake-*` 组件

这些依赖将在独立阶段通过适配器、注入配置或补齐组件解决。本阶段不创建空实现或虚假占位，以免把运行错误隐藏成错误数据。

## 文档与工程脚本

- 更新 20 个 VitePress 组件页面中的源码路径、组件标签及结构说明。
- VitePress 配置排除 `superpowers/**`，避免内部规格和计划被构建为公开页面。
- 根工程 `package.json` 改为私有演示工程，并增加 `docs:dev`、`docs:build`，桥接到独立的 `docs` 包。
- 保持 `docs/package.json` 及其锁文件独立，避免 VitePress 与 uni-app 的 Vite/Vue 依赖相互影响。

## 错误处理

- 重命名后若发现旧路径仍被引用，结构验证直接失败，不创建兼容转发文件。
- 若 uni-app 构建因当前已知的宿主依赖缺失而失败，记录具体缺失项，不在本阶段临时伪造依赖。
- JSON、导出入口或文档构建错误属于本阶段范围，必须在交付前修复。

## 验证标准

1. 所有公开组件均满足 `components/snake-x/snake-x.vue`。
2. easycom 正则可映射每一个公开 `<snake-*>` 标签。
3. 仓库内不存在指向旧公开组件位置的引用。
4. `src/pages.json` 与模块 `package.json` 可解析。
5. `index.ts` 的每个具名导出都指向真实文件。
6. VitePress 构建成功，产物中不包含 `superpowers` 页面。
7. 在根依赖可用时运行 uni-app H5 构建；若被既有宿主依赖阻塞，交付说明列出原始错误与未验证范围。

## 后续阶段

结构规范化完成后，再独立处理运行时依赖解耦、缺失组件、演示页面和跨平台验证。后续工作不得反向恢复旧目录或破坏本设计确定的 easycom 公共命名。
