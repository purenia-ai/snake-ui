---
name: 'skills'
description: 'Snake UI Skills 能力包参考。处理 skills、guide 或相关 uni-app 使用问题时按需读取。'
triggers: ['skills', 'Skills', '能力包']
---

# Skills 能力包

Skills 是可复用的 AI 能力包。Snake UI 通过它把组件、CMS、主题、图标和 uni-app 跨端约束整理成 AI 可按需读取的资料，使 AI 能更稳定地理解组件库并生成符合项目约定的代码。

通过 Skills，开发者可以：

- 快速让 AI 了解 Snake UI 的组件与使用方式；
- 让组件 API、平台差异和关键行为有统一的核对入口；
- 减少从其他组件库错误推断 API 的情况；
- 在文档更新后自动同步 AI reference，保持上下文可维护。

## 安装 Skills

Snake UI 发布到 GitHub 后，在项目根目录执行：

```bash
pnpx skills add purenia-ai/snake-ui --skill snake-ui
```

安装器会识别仓库中的 `skills/snake-ui/`，并将它安装到所选 AI 编码工具的 Skills 目录。也可以先查看可安装内容：

```bash
pnpx skills add purenia-ai/snake-ui --list
```

## 开源仓库

- GitHub：[purenia-ai/snake-ui](https://github.com/purenia-ai/snake-ui)
- 问题反馈：[GitHub Issues](https://github.com/purenia-ai/snake-ui/issues)

## 如何使用

安装后，AI 会根据任务选择所需资料。处理具体组件时，应读取该组件的 reference、当前源码和类型；遇到主题、图标或 CMS 集成，则读取相应指南或 CMS reference。

例如修改 `snake-tabbar` 时，除了组件文档，还要检查原生 tabBar 隐藏、`pagePath`、`beforeSwitch` 与 `switchTab` 的行为；修改图标时，需同步核对 `icon-names.ts` 和内联字库中的 `.sicon-*` 类名。

## 文件结构

```text
skills/snake-ui/
├── SKILL.md
└── references/
    ├── INDEX.md
    ├── components/
    ├── cms/
    ├── guide/
    └── tools/
```

`references/INDEX.md` 汇总每份资料的名称、描述和触发关键词。处理单个组件或能力时，AI 优先读取最相关的一两份 reference，而不是加载整个目录。

## 为什么使用 Skills

### 标准化

每份 reference 都来自当前 VitePress 文档，并配有触发关键词，帮助 AI 以一致方式定位资料和核对公开 API。

### 可扩展

团队可以在保持 `SKILL.md` 路由规则的前提下，继续补充组件、CMS 或项目专属 reference。
