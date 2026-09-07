# Snake Radio 对齐 uView Pro 设计

## 目标

以本地 uView Pro 的 `u-radio`/`u-radio-group` 为唯一行为基准，重写 `snake-radio`/`snake-radio-group`，解决当前实现与参考组件在通信机制、props 面、尺寸体系、事件契约和禁用态视觉上的偏差。

## 实现范围

- 父子通信从 provide/inject(`snakeRadioGroupKey`) 切换为 uView 式 `useCompRelation`：子组件 `useChildren('SnakeRadio', 'SnakeRadioGroup')` 按组件 name 链查找父上下文，父组件 `useParent()` 注册并 `defineExpose({ props, getData, setValue })`。`useCompRelation` 首次投入使用。
- 移植 `sizeConfig` 尺寸预设（small 28/24/16、default 34/28/20、large 40/32/24），`size` 驱动盒子尺寸、勾号与字号，优先级 `props.size > group.size > form.size`（form 读取 snake 原生 `snakeFormKey`）。
- 对齐 props 默认值与行为：radio 增加 `value` 兼容别名（非空时优先于 `name`）、`labelDisabled`；group 改为 `width`/`wrap` 布局，增加组级 `labelDisabled`。
- 对齐事件契约：子级未选中→点击时 emit `change(radioValue)`，再调父级 `setValue`；group 无条件 emit `update:modelValue` + `change`。选中判定使用宽松 `==`。
- 对齐禁用态视觉：灰底图标 + 灰字（`--snake-color-disabled-bg`），替代整条 opacity。
- 保留 Snake UI 组件命名、主题变量、`addUnit` 工具函数和 TypeScript 风格；表单联动继续走 snake 原生 `formItem?.notify('change')`。
- 同步更新组件演示、文档和契约测试。

## 移除的非参考能力

当前实现中 uView Pro 不具备的能力不再保留：radio 的独立 `modelValue` 布尔绑定（脱离 group 后点击不再改变状态）、`iconColor`/`inactiveColor` 定制、group 的 `direction`/`placement` 布局、无障碍属性（role/aria/tabindex/键盘导航/focus-visible）、`Number(iconSize) * (20 / 34)` 勾号缩放。`libs/internal/radio.ts` 随之删除；checkbox 的 inject 体系不在本次范围。

## 布局与数据流

group 容器 `inline-flex + flex-wrap`，通过 `width`/`wrap` 控制每个 radio 的占宽与换行（MP 下 float + clearfix，H5/App 下 flex-basis）。radio 内部为 icon-wrap + label 两段结构，勾号常驻渲染、白/透明切换；选中时 iconStyle 内联写入激活色，禁用态由状态类覆盖为灰底。

子组件通过 `parentExposed.value.getData()` 读取父级 props 快照（exposed 的 props 为响应式代理，父级变化可追踪）；点击 label 受 `labelDisabled` 约束，点击已选中项不 emit 子级 `change`。

## 验证

- 调整契约测试，锁定 useCompRelation 通信、sizeConfig 预设、width/wrap 布局与事件语义。
- 执行 lint、TypeScript 类型检查、完整测试和 H5 构建。
- 按用户要求，不执行微信小程序构建。

## 边界

本次仅修改 radio/radio-group 组件及其直接关联的演示、文档和测试，不调整 checkbox/checkbox-group 等其他组件，也不改动其他未提交工作区内容。
