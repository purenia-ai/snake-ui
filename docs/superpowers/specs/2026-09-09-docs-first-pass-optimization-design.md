# Snake UI 文档站第一批优化设计

## 目标

在保留现有 Snake UI 视觉风格和 VitePress 信息架构的前提下，缩短新用户从首页到完成首次接入的路径，并让 Button 成为后续组件文档标准化的样板。

## 范围

本批次只处理以下五项：

1. 首页“开发指南”入口直接指向 `/components/quickstart`，避免进入仅包含迁移提示的中间页。
2. 组件总览中的 CMS 入口统一指向 `/cms/v2/overview`，旧版入口继续保留在侧边栏的兼容分组中。
3. 首页首屏增加可复制的 pnpm 安装命令；复制成功或失败都提供可读反馈。
4. Button 文档补齐“何时使用”“Slots”“主题变量”和“无障碍”，并与当前单按钮交互示例保持一致。
5. Button 交互示例增加当前代码展示、复制和恢复默认；同时修复组件搜索的移动端字号、触控尺寸和首页动画降级。

不在本批次中批量重写其余 70 篇组件文档，也不调整组件运行时 API、站点依赖、发布流程或整体品牌视觉。
预览服务失败后的重试入口留到后续批次，本批次保持现有提示行为。

## 交互设计

### 首页安装命令

首屏操作区下方展示 `pnpm add @puresnake/snake-ui`。使用原生 Clipboard API 复制；成功后按钮短暂显示“已复制”，失败时显示“复制失败，请手动复制”。不引入第三方依赖。服务端渲染阶段不访问浏览器 API。

### Button 示例

示例仍只渲染一个 `snake-button`。现有参数面板继续控制主题、尺寸、形状、朴素、加载、禁用和水波纹状态。页面根据当前状态计算一段最小化 Vue 标签：默认值不输出，非默认属性才写入代码。

代码区域提供：

- “复制代码”：复制当前生成的标签，并显示短暂反馈；
- “恢复默认”：依据 `controls` 中的 `defaultValue` 重建状态，避免维护第二套默认配置。

复制能力失败时不阻断示例操作，只显示可读失败提示。

### 移动端与动画

- 组件总览搜索框在 640px 以下使用至少 16px 字号；
- 搜索清空按钮和空状态操作在移动端保证至少 44px 触控高度；
- `prefers-reduced-motion: reduce` 下取消首页的循环动画、卡片位移和非必要平滑过渡；
- 文档标题锚点增加顶部滚动余量，避免被固定导航遮挡。

## 文档结构

Button 文档采用以下顺序：简介、何时使用、平台兼容性、基础用法、主题尺寸与形状、水波纹与节流、原生开放能力、API、Slots、主题变量、无障碍、源码。

主题变量只记录源码中实际存在且与 Button 直接相关的变量；若组件没有独立公开变量，则明确说明其继承全局主题令牌，不虚构 API。

## 文件边界

预计修改：

- `docs/.vitepress/components/HomePage.vue`
- `docs/.vitepress/components/ComponentOverview.vue`
- `docs/.vitepress/theme/custom.css`
- `docs/components/intro.md`
- `docs/components/button.md`
- `src/pages/componentsA/button/index.vue`
- 与上述行为直接对应的现有测试文件

不新增依赖，不修改组件库公共接口。

## 验证

- 文档结构测试覆盖首页目标链接、CMS v2 链接和 Button 新章节；
- 预览结构测试覆盖单按钮约束、生成代码、复制与重置入口；
- 运行 `pnpm test:docs-homepage`、`pnpm test:docs-structure`、`pnpm test:component-docs`、`pnpm test:preview-structure`；
- 运行 `pnpm type-check` 和 `pnpm docs:build:preview`；
- 使用 `git diff --check` 检查格式问题。

## 完成标准

首页主路径不再进入迁移占位页；用户能在首屏复制安装命令；Button 页面只显示一个可配置按钮，同时能复制与重置当前配置；Button 文档章节完整；移动端搜索和减少动态效果满足本批次定义的可访问性要求；相关测试、类型检查与文档构建通过。
