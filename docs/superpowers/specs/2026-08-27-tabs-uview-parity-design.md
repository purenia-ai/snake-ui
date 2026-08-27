# Snake Tabs 对齐 uView Pro 设计

## 背景与目标

`snake-tabs` 已提供与 uView Pro Tabs 相近的 Props，但当前滚动定位、指示条动画、单位处理和部分边界行为尚未对齐。此次改造以本地 uView Pro `u-tabs` 源码为行为参考，在不依赖 `$u`、`u-badge` 或 uView 运行时的前提下补齐体验，并保持 Snake UI 现有 API 兼容。

## 组件结构与布局

- 根节点继续接收主题样式、`customClass` 和 `customStyle`，内部使用横向 `scroll-view` 与内容轨道。
- 所有 Tab 后只渲染一条绝对定位指示条，不再为激活项条件渲染独立指示条。
- 组件挂载后测量根容器、内容轨道和全部 Tab。测量通过 `uni.createSelectorQuery().in(instance.proxy)` 限定在当前组件实例，避免多实例选择器冲突。
- 激活项中心在内容轨道中的坐标用于定位指示条；目标 `scrollLeft` 为该中心减去容器宽度的一半，并限制为非负值。滚动容器负责限制最大滚动距离。
- 指示条采用 `left: <center>px` 与 `translateX(-50%)`，确保 `barStyle` 覆盖宽度后仍保持居中。
- 首次有效测量不播放动画；后续切换按 `duration` 秒设置文字和指示条过渡。

## 状态、数据与边界

- `current` 保持受控：组件只根据 Prop 计算激活索引，不在点击后私自更新。
- 数字或数字字符串会截断为整数并限制在列表范围内；空列表使用无激活项状态，不显示指示条。
- 对象项支持 `hidden` 和 `disabled`。隐藏项保留原数组索引但不显示；若外部把 `current` 指向隐藏项，组件不擅自改值且隐藏指示条。
- 标签仍支持字符串或对象，以及 `name`、`count` 自定义字段。徽标值为 `0` 时仍可显示，空字符串、`null` 和 `undefined` 不显示。
- 列表、`current`、`name`、`fontSize`、`gutter`、`itemWidth` 或滚动模式变化后，在 `nextTick` 后重新测量。排队任务使用序号和可清理定时器，防止旧布局覆盖新状态。
- 数值型 `height`、`fontSize`、`gutter`、`barWidth`、`barHeight` 和徽标 `offset` 按 rpx 解释；带单位字符串原样保留。

## API 与兼容性

- 保留全部现有 Props，包括 `scrollable`、`isScroll`、`lineColor`、`activeItemStyle`、`barStyle`、`customClass` 和 `customStyle`。
- `isScroll` 继续优先于 `scrollable`；默认值继续使用 Snake UI 当前主题和 `duration: 0.3`，不强制改成 uView Pro 默认值。
- `gutter` 继续遵循 uView Pro 实际源码和 Snake 当前行为：左右各应用一份，而不是按文档描述除以二。
- 点击任意项先派发 `click({ index, item })`。禁用项、隐藏项和当前项不派发 `change`；其他项派发 `change(index)`。
- 暴露 `init()` 和 `scrollByIndex()`，用于容器从隐藏变为可见或外部布局变化后的主动重算。
- `snake-list-switching` 的 Tabs 回调改为接收单个 `index`，修复其将当前 `change(index)` 误当成双参数事件的问题。

## 文档与演示

- Tabs 文档明确 `duration` 单位为秒、尺寸数值默认单位为 rpx、`offset` 为 rpx，并准确描述 `click` 与 `change`。
- 演示至少包含可滚动长列表、自定义颜色和尺寸、数量徽标、圆点徽标、隐藏项及禁用项，切换后能观察激活项居中。
- 文档列出 `init()` 和 `scrollByIndex()` 的使用场景，但不把内部测量结果作为公共 API。

## 验证

- 静态契约测试确认组件只渲染一条指示条，使用实例作用域节点测量，并包含 `scrollLeft` 居中计算。
- 测试 Props、事件和公开方法保持兼容，覆盖隐藏、禁用、空列表、越界 current 和动态列表重测。
- 回归 `snake-cms`、`snake-list-switching` 与文档 Demo 的受控切换。
- 执行 Tabs 相关交互测试、组件文档测试、TypeScript 检查、H5 构建和差异格式检查。

## 非目标

- 不引入 uView Pro 依赖，不复制 `$u` 工具或 `u-badge`。
- 不新增 TabsSwiper、滑动手势联动、颜色渐变或非受控 `v-model`。
- 不改变 Snake UI 的主题色、全局配置或其他导航组件。
