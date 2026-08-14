# 固定手机预览的正文避让设计

## 问题

固定手机模型不参与 VitePress 布局计算。当前页面仍为右侧“本页内容”分配 224px，手机又占用最右侧 250–320px，二者发生覆盖。继续压缩正文会导致 1366px 桌面下阅读区域过窄。

## 方案

参考 uView2 的预览页策略：在带 `preview` frontmatter 的组件文档页上，桌面端隐藏 VitePress 固定右侧“本页内容”栏，并为 fixed 手机模型显式预留右侧空间。

布局组件根据当前 frontmatter 为根布局添加 `snake-preview-layout` 页面类，仅影响有实时预览的组件页面，不影响指南、首页或无预览文档。

桌面断点下：

- 隐藏 `.snake-preview-layout .VPDoc .aside`。
- 正文容器通过右侧 padding/margin 为手机预留 `手机宽度 + 页面右距 + 安全间隔`。
- 正文最大宽度保持 620px，不再为了兼容第四列而压缩到 500px 左右。
- fixed 手机继续沿用 uView2 风格的最右侧定位。

小于 1280px 时手机模型隐藏，取消右侧预留；VitePress 顶部的本页导航继续提供章节跳转。

## 验证

- 结构测试断言布局根据 `frontmatter.preview` 添加 `snake-preview-layout`。
- 结构测试断言仅预览页面隐藏 `.aside`，并有明确的右侧预留变量。
- 结构测试断言窄屏取消预留。
- 运行预览结构测试、类型检查和 VitePress 构建。
