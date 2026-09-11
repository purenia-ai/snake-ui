---
outline: [2, 3]
---

# AI 概述

Snake UI 为 AI 编码助手提供可定位、可验证的上下文资料，帮助助手准确选择组件、核对 API，并遵循 uni-app 的跨端约束。它们不会替代源码、类型和测试；遇到实现问题时，仍应以当前仓库内容为准。

## 提供的资料

| 资料                          | 用途                                           |
| ----------------------------- | ---------------------------------------------- |
| [Skills](./skills)            | 任务路由与开发规则，指导助手按需读取参考资料。 |
| [LLM 上下文](./llms)          | `llms.txt` 的定位、内容范围和使用方式。        |
| `skills/snake-ui/references/` | 按组件、CMS、指南和工具拆分的完整参考资料。    |

## 推荐工作流

1. 从 `llms.txt` 或 reference 索引定位目标能力。
2. 阅读对应 reference 和当前组件源码、类型文件。
3. 实现最小且完整的变更，保留既有公开 API 和平台兼容行为。
4. 运行受影响范围的测试；公开组件或类型变更后，再运行 `pnpm type-check`。
5. 若更新了 `docs/`，同步生成 AI reference。

不要因为组件名称或模板和其他组件库相似，就推断 Snake UI 的 API 或行为。uView Pro 可以用作参考，但 Snake UI 自身的源码、文档与测试才是最终标准。

## 关键约束

### 底部导航

`snake-tabbar` 在原生 tabBar 页面默认调用 `uni.hideTabBar()`，由自定义导航栏替代原生栏。修改时需分别核对普通页面、tabBar 页面、`pagePath` 跳转和 `beforeSwitch` 拦截行为。

### 图标

`snake-icon` 使用 `iconfont.css` 中内联的字库和 `.sicon-*` 类名。图标名称必须同时存在于 `icon-names.ts` 与 `iconfont.css`；不需要也不应添加独立运行时字体文件。

### CMS 与运行时适配

请求、缓存、配置和 CMS 服务由插件适配器注入。组件库内部不能直接绑定业务 API；服务是否必需、缺失时的行为，应以对应 CMS reference 和运行时实现为准。

## 验证

```bash
pnpm skill:sync
pnpm type-check
pnpm test:component-contracts
pnpm test:runtime
pnpm test:cms
pnpm test:component-docs
pnpm docs:build
```

H5 构建通过不代表小程序和 App 已验证。涉及布局、原生 tabBar、节点尺寸或条件编译时，应在实际目标平台继续验证。
