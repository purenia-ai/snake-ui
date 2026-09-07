# Snake Button 对齐 uView Pro 设计

## 目标

以本地 `uView-Pro` 仓库中的 `u-button` 为唯一行为与视觉基准，将 `snake-button` 完整对齐到相同的属性默认值、尺寸、主题状态、交互反馈和原生按钮能力。

组件仍使用 `snake-button` 名称、`snake-*` 样式命名和 Snake UI 主题变量，调用方无需改用 `u-button`。

## 对齐范围

- 对齐 uView Pro 的公开 Props、默认值和可选值。
- 对齐原生 `button` 属性透传以及开放能力事件转发。
- 对齐 `default`、`primary`、`success`、`info`、`warning`、`error` 的普通、镂空、禁用和按压状态。
- 对齐 `large`、`default`、`medium`、`small`、`mini` 的高度、字号、宽度与内边距。
- 对齐 `square`、`circle`、hairline、loading、hover 和 ripple 行为。
- 同步类型声明、组件文档、示例页和回归测试。

## 兼容边界

这是一次以 uView 一致性优先的调整。Snake UI 现有扩展属性或行为如果与 uView 冲突，将被移除或改为 uView 语义，包括默认块级宽度、自定义 loading 内容、图标快捷属性以及不同的水波纹覆盖算法。

不与 uView 冲突且属于 Snake UI 基础组件通用能力的 `customClass`、`customStyle` 可以保留，但不得改变 uView 默认行为。仓库内现有调用需要搜索并迁移，避免删除扩展后产生类型或运行时回归。

## 实现结构

- 根节点继续使用 uni-app 原生 `button`，保证表单与各小程序开放能力可用。
- 派生类名负责主题、尺寸、形状、禁用、plain 和 hairline 状态，结构与 uView 的状态组合保持对应。
- 点击入口统一处理节流、禁用、loading 和水波纹，再发出 `click`。
- 开放能力事件只做透明转发；支付宝授权按 `scope` 映射到对应事件。
- ripple 使用 uView 的最长边正方形波纹和平台坐标分支，不额外引入依赖。

## 错误与边界处理

- `disabled` 或 `loading` 时不触发业务点击和 ripple，并禁用开放能力入口。
- 查询不到按钮尺寸时跳过 ripple，不影响点击事件。
- 数字字符串形式的节流时间和 hover 时间按 uView 的转换方式处理。
- 自定义 `hoverClass` 优先于内置主题按压类；ripple、disabled、loading 时关闭 hover 类。

## 验证

- 增加静态契约测试，覆盖 Props 默认值、类名组合、点击拦截、节流、事件转发和 ripple 关键路径。
- 搜索并处理仓库内所有已移除扩展属性的调用。
- 运行 lint、TypeScript 类型检查、完整测试和 H5 构建。
- 不执行微信小程序构建，除非用户另行要求。

## 验收标准

- 相同 Props 下，`snake-button` 与本地 uView Pro `u-button` 的尺寸、颜色、边框、圆角和按压反馈一致。
- Props 默认值和交互结果与 uView 一致。
- 原生按钮开放能力及其事件可正常透传。
- 仓库内示例和调用不再依赖已移除的 Snake UI 独有属性。
- lint、类型检查、测试和 H5 构建通过。
