# Snake Icon uView Pro 等价迁移设计

## 目标

保留 Snake UI 对外组件名 `<snake-icon>`，将组件的公开接口、渲染逻辑、交互行为和样式模型完整迁移为本地 uView Pro `u-icon` 的实现。当前 Snake UI 自定义的字符图标兜底和行为扩展不继续保留；后续扩展能力另行设计。

参考源码：`D:\development\Projects\UniApp\uView-Pro\src\uni_modules\uview-pro\components\u-icon`。

## 组件边界

- 组件仍位于 `src/uni_modules/snake-ui/components/snake-icon`，名称保持 `SnakeIcon`。
- Props 与 uView Pro `IconProps` 对齐，包括图片图标、标签方位和间距、DecimalIcon、字体前缀及主题色相关字段。
- 默认值与 uView Pro 一致；仅把 Snake UI 命名空间必需的类名和默认字体前缀从 `u-` 替换为 `snake-`。
- `click` 和 `touchstart` 均按 uView Pro 规则返回 `index`；未设置 `index` 时返回原始事件。
- 图片识别遵循 uView Pro 规则：`name` 中包含 `/` 时按图片渲染。

## 移除内容

- 删除 Unicode 字符 `glyphs` 兜底映射。
- 删除图标名称别名映射和运行时图标白名单。
- 删除 `stop` 属性及组件内部阻止冒泡逻辑。
- 删除旧版 `click(event, index)` 双参数事件约定。
- 不在本次迁移中设计新的扩展图标 API。

## 字体与样式

- 使用 Snake UI 包内的 `iconfont.css`，组件不引入或依赖 uView Pro 运行时。
- 内置图标采用 Snake UI 对应字体基类和图标类前缀；结构、方位类、图片样式和 DecimalIcon 遮罩逻辑与 uView Pro 对齐。
- 主题色通过 Snake UI 已有主题配置或 CSS 变量表达，避免引入 `$u` 全局依赖。
- 保留跨端所需的 `virtualHost`、`addGlobalClass` 和共享样式隔离配置。

## 类型、文档与示例

- 重写 `SnakeIconProps` 和 `SnakeIconEmits`，准确反映 uView Pro 契约。
- 文档和演示页改为展示字体图标、图片图标、标签位置、主题色和 DecimalIcon。
- 删除只属于旧实现的字符兜底、别名和 `stop` 示例。

## 兼容性处理

迁移前搜索 Snake UI 与 r2nd-joker 中的 `<snake-icon>` 调用。对于使用已移除属性或旧事件参数的调用点，只做维持 uView Pro 契约所需的最小调整。其他组件和业务逻辑不纳入本次重构。

## 验证

- 增加或更新契约测试，验证 Props、默认值、类名、图片识别、DecimalIcon 和事件参数。
- 运行 Snake UI 类型检查、lint、相关测试及全量测试。
- 运行 H5 构建验证组件可被实际打包；不执行微信小程序构建。
- 对改动文件执行 `git diff --check`。
