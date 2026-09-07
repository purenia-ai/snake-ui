# Snake Checkbox 对齐 uView Pro 设计

## 目标

以本地 uView Pro 的 `u-checkbox`/`u-checkbox-group` 为唯一行为基准，重写 `snake-checkbox`/`snake-checkbox-group`，解决当前实现与参考组件在通信机制、选中状态归属、max 约束、布局和公开接口上的偏差。本次与 radio 对齐采用同一套原则与机制。

## 实现范围

- 父子通信从 provide/inject(`snakeCheckboxGroupKey`) 切换为 uView 式 `useCompRelation`：子组件 `useChildren('SnakeCheckbox', 'SnakeCheckboxGroup')`，父组件 `useParent('SnakeCheckboxGroup')` 并完整 `defineExpose`。
- 移植 uView 的状态模型：子组件自持 `checkedValue` 布尔状态并 emit `update:modelValue`（独立 v-model 为参考行为，保留）；group 持有选中 name 数组，通过 `syncChildrenSelection` 遍历 children 的 `isChecked`/`value` 与 modelValue 比对，经 `setChecked` 广播同步。
- 移植 `sizeConfig` 尺寸预设（small 28/24/16、default 34/28/20、large 40/32/24），优先级 `props.size > group.size > form.size`（form 读取 snake 原生 `snakeFormKey`）。
- 对齐 props 默认值与行为：checkbox 增加 `value` 兼容别名；group 改为 `width`/`wrap` 布局，`max` 默认 999，新增组级 `labelDisabled` 与 form 标识 `name`。
- 对齐事件契约：子级 `change(checked)` 携带自身新状态，随后延迟通知父组收集；group 经 debounce 收集全部选中项后 emit `change(values)` 与 `update:modelValue(values)`。
- 对齐 max 约束：选中前经 `parentExposed.validateSelection()` 守卫，超限时以 `uni.showToast` 提示（替代 uView 的 `$u.toast`）。
- 保留 Snake UI 组件命名、主题变量、`addUnit`/`useDebounce` 工具函数和 TypeScript 风格；表单联动走 snake 原生 `formItem?.notify('change')`。
- 同步更新组件演示、文档和契约测试。

## 移除的非参考能力

当前实现中 uView Pro 不具备的能力不再保留：`direction`/`placement` 布局、`inactiveColor`/`iconColor` 定制、group 的 `labelSize`、无障碍属性（role/aria/tabindex/键盘导航/focus-visible）、`Number(iconSize) * (20 / 34)` 勾号缩放，以及 snake 的 `max: 0` 表示不限的语义（uView 为 `max: 999`）。`libs/internal/checkbox.ts` 随之删除。

## 布局与数据流

group 容器 `inline-flex + flex-wrap`，通过 `width`/`wrap` 控制每个 checkbox 的占宽与换行（MP 下 float + clearfix，H5/App 下 flex-basis，width 原样透传需带单位）。checkbox 内部为 icon-wrap + label 两段结构，勾号常驻渲染、白/透明切换；选中时 iconStyle 内联写入激活色，禁用态由状态类覆盖为灰底。

点击流程：子组件 `setValue` 先经 max 守卫，翻转自身 `checkedValue` 并 emit `change`，80ms 后通知父组 `emitEvent`；父组 debounce 1ms 后遍历 children 收集选中值，统一 emit 数组并通知 form 校验。外部修改 group 的 modelValue 时，`syncChildrenSelection` 反向广播子组件状态。

## 验证

- 调整契约测试，锁定 useCompRelation 通信、sizeConfig 预设、值收集与广播结构。
- 执行 lint、TypeScript 类型检查、完整测试和 H5 构建。
- 按用户要求，不执行微信小程序构建。

## 边界

本次仅修改 checkbox/checkbox-group 组件及其直接关联的演示、文档和测试，不调整 radio/radio-group（上一轮已完成）及其他组件，也不改动其他未提交工作区内容。
