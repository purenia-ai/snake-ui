---
outline: [2, 3]
---

# LLMs 支持

Snake UI 为大语言模型（LLMs）提供两种上下文文件，帮助 AI 更准确地理解组件库及其 uni-app 跨端约束。

## 上下文文件

### 标准版：llms.txt

地址：<https://raw.githubusercontent.com/zwbcode/snake-ui/main/llms.txt>

标准版提供项目概述、组件与文档入口、关键行为和验证命令，适合让 AI 快速建立 Snake UI 的基础认知。

### 完整版：llms-full.txt

地址：<https://raw.githubusercontent.com/zwbcode/snake-ui/main/llms-full.txt>

完整版由 VitePress 文档自动生成，包含组件、CMS、指南和工具的完整 Markdown 内容，适合需要详细 API、使用示例和平台差异的任务。

## 如何使用

将上述 URL 提供给支持 URL 上下文的 AI 工具或 IDE；在本地开发时，也可直接把根目录的对应文件加入项目上下文。

- 常规问答、快速检索：使用 `llms.txt`；
- 需要完整 API 或大量组件资料：使用 `llms-full.txt`；
- 修改源码或排查行为：结合 [Skills](./skills)、当前源码、类型和测试。

例如，`llms.txt` 能提示 `snake-tabbar` 依赖 `uni.hideTabBar()`；实际修改时仍必须核对组件实现、文档和测试，不能只依赖摘要。

## 内容覆盖

- 平台范围、包名和推荐注册方式；
- 组件、CMS、工具文档的高价值入口；
- `snake-tabbar`、`snake-icon`、CMS 注入等关键行为；
- 组件 API、使用示例、主题与跨端说明（完整版）；
- 类型检查、组件契约、运行时和文档构建命令。

## 维护原则

修改项目目录、公开入口、关键约束或验证命令后，应同步更新 `llms.txt`。组件 API 的完整说明维护在 `docs/`；运行 `pnpm skill:sync` 会同时更新 AI reference 与 `llms-full.txt`。
