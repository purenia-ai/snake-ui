# 组件起步信息架构设计

## 背景

Snake UI 当前的组件侧栏直接从“组件总览”进入组件分类。安装、插件注册、样式引入、easycom 和首次使用集中在指南的“快速开始”中，用户从“组件”入口无法获得连续的接入路径。

参考 uView Pro 的组件信息架构，在组件分类之前增加逻辑上的“起步”分组。该分组只改变 VitePress 侧栏组织，不移动现有文件，也不破坏既有路由。

## 目标

- 在组件侧栏中增加“起步”分组。
- 将安装、工程配置、首次使用、内置样式和注意事项拆成职责清晰的页面。
- 复用现有指南中的完整全局配置、平台边界和排错内容，通过链接避免重复维护。
- 保留 Snake UI 的基础组件、表单组件、CMS 组件等现有产品分类。

## 侧栏结构

组件侧栏顶部调整为：

1. 起步
   - 组件总览 `/components/intro`
   - 安装 `/components/install`
   - 配置 `/components/setting`
   - 快速上手 `/components/quickstart`
   - 内置样式 `/components/common`
   - 组件使用注意事项 `/components/note`
2. 现有组件分类

“起步”是侧栏逻辑分组，页面继续平铺在 `docs/components/`，不创建物理子目录。

## 页面职责

### 安装

说明 Vue 3 与 uni-app 前提、npm 安装和 `uni_modules` 安装。页面不承担插件配置和组件示例。

### 配置

说明 `app.use(SnakeUI)`、`index.scss`、easycom、手动导入和配置完成后的最小组件调用。主题、国际化、HTTP 与 CMS 的完整选项链接到“全局配置总览”。

### 快速上手

提供一个可直接复制的 Vue 3 `<script setup lang="ts">` 页面，展示按钮与 Toast，并给出接入结果检查项和后续阅读入口。

### 内置样式

只记录源码中实际存在的 `common.scss` 类：定位、字号、Flex、文字对齐、显隐、等分和内外边距。明确这些类由 `index.scss` 引入，不虚构色彩、边框或重置按钮类。

### 组件使用注意事项

集中说明安装方式不可混用、easycom 修改后需重新编译、SCSS 与样式作用域、平台差异、公开 API 边界，以及 CMS 组件的业务服务依赖。

## 既有页面调整

- `/guide/getting-started` 保留为全库快速开始，并在开头链接组件起步页面。
- `/components/intro` 保留当前组件检索总览，在正文中增加起步阅读提示。
- `/guide/foundation`、`/guide/compatibility` 和 `/guide/troubleshooting` 保持原职责，新页面只链接到它们。

## 验证

- 文档结构测试应验证“起步”分组及六个链接存在。
- 检查新增页面之间以及与指南页面的内部链接。
- 运行文档结构测试、VitePress 构建和 `git diff --check`。

## 非目标

- 不移动现有组件文档。
- 不改变组件源码、公共 API 或包安装方式。
- 不照搬 uView Pro 尚未在 Snake UI 中实现的内置样式。
- 不新增依赖、不提交或发布文档。
