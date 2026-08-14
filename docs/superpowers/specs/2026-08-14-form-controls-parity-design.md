# Snake UI 表单核心组件设计

## 背景与目标

Snake UI 已完成两批基础与交互组件，但尚无正式的表单体系。本批以
`D:\development\Projects\UniApp\uView-Pro\src\uni_modules\uview-pro`
中的 Form、Input、Textarea、Checkbox、Radio、Switch 和 Slider 为成熟行为参考，新增 Snake UI 自有实现。

目标是提供可独立 npm 安装、支持 H5/微信小程序/App、具备完整类型和文档的表单组件。实现不要求宿主安装 uView Pro，不引入 `uni.$u`，标签、类型、主题和运行时统一使用 Snake UI 命名。

## 组件范围

本批新增以下公共组件：

- `snake-form`、`snake-form-item`
- `snake-input`、`snake-textarea`
- `snake-checkbox`、`snake-checkbox-group`
- `snake-radio`、`snake-radio-group`
- `snake-switch`
- `snake-slider`

不在本批实现 Picker、Select、Upload、Search、Modal、Toast 和 ActionSheet；这些组件后续复用本批表单协议。

## 总体架构

### 表单协议

`snake-form` 通过类型化 provide/inject 向 `snake-form-item` 提供模型、规则、尺寸、错误展示方式和字段注册能力。`snake-form-item` 再向输入类组件提供 `change`、`blur` 校验通知。协议文件放在 `libs/internal`，不从 npm 公共入口导出。

每个 FormItem 注册字段名、初始值、校验、重置和清错方法。卸载时注销，动态表单不会残留失效字段。模型读取和写入支持 `profile.name`、`items.0.title` 等嵌套路径。

### 校验器

Snake UI 内置轻量校验器，不新增 `async-validator` 依赖。规则支持：

- `required`、`type`、`min`、`max`、`len`
- `pattern`、`enum`、`whitespace`、`transform`
- 同步 `validator` 和异步 `asyncValidator`
- `change`、`blur` 或两者组合触发
- 单规则、规则数组、动态替换规则和嵌套字段

校验结果统一为包含字段名和消息的错误对象。并发校验使用字段级执行序号丢弃过期结果，避免慢请求覆盖新值。自定义校验异常转换为可展示错误，不让未处理 Promise 泄漏到页面。

Form 暴露：

- `validate(callback?)`
- `validateField(props, callback?)`
- `resetFields(props?)`
- `clearValidate(props?)`
- `setRules(rules)`

方法同时返回 Promise，并兼容回调写法。`validate` 失败时 Promise reject 错误数组，回调接收 `(valid, errors)`。

## 组件契约

### Form / FormItem

Form 支持 `model`、`rules`、`errorType`、`borderBottom`、`labelPosition`、`labelWidth`、`labelAlign`、`labelStyle` 和 `size`。错误展示支持 `message`、`border`、`border-bottom` 和 `none`；本批不依赖 Toast，因此不提供隐式 toast 提示。

FormItem 支持 `label`、`prop`、`required`、`leftIcon`、`rightIcon`、标签位置/宽度/对齐、边线、额外样式和 `label`、`left`、`right`、`default` 插槽。它展示当前错误，并把错误状态传给内部输入组件。

### Input

Input 基于 uni-app 原生 `input`，支持受控 `modelValue`，并覆盖 text、number、idcard、digit、password 等跨端输入类型。公共能力包括：

- placeholder、maxlength、clearable、password icon
- prefix/suffix 图标和插槽
- border、shape、size、disabled、readonly
- formatter、formatTrigger、trim、confirmType、holdKeyboard
- focus、cursor、selectionStart、selectionEnd、adjustPosition
- input/change/focus/blur/confirm/clear/keyboardheightchange 事件

格式化只影响组件派发值，不直接修改传入 Props。disabled 和 readonly 不派发用户修改。

### Textarea

Textarea 基于原生 `textarea`，支持 maxlength、autoHeight、fixed、count、height、disabled、readonly、confirmType、focus/cursor/selection 和键盘避让配置。提供 input/change/focus/blur/confirm/linechange/keyboardheightchange 事件，并与 FormItem 的 change/blur 校验联动。

### Checkbox / Radio

CheckboxGroup 和 RadioGroup 使用类型化父子协议管理注册、禁用、尺寸、颜色与布局。

Checkbox 支持独立 boolean v-model，也支持在 Group 中用 `name` 维护数组值；Group 支持 `max` 限制。Radio 在 Group 中维护单值。两者支持 labelDisabled、iconSize、labelSize、shape、activeColor、inactiveColor、横纵布局和 change 事件。

父级 disabled 优先于子级；子组件单独配置的尺寸和颜色优先于 Group。卸载后不主动篡改 Group 值。

### Switch

Switch 支持 boolean/string/number v-model、activeValue、inactiveValue、loading、disabled、size、activeColor、inactiveColor、space 和 vibrateShort。点击后依次派发 `update:modelValue` 与 `change`；loading 和 disabled 状态不可操作。短震动仅在平台 API 可用时调用，失败不影响状态切换。

### Slider

Slider 支持 modelValue、min、max、step、height、blockWidth、activeColor、inactiveColor、blockColor、disabled、showValue、valuePosition、showEdgeValue 和默认滑块插槽。

组件通过 `uni.createSelectorQuery` 测量轨道，使用 touchstart/touchmove/touchend 计算值，统一夹取范围和步长。轨道点击也可定位。派发 `update:modelValue`、`change`、`start`、`moving`、`end`；change 仅在交互结束时触发。宽度变化后提供 `update()` 重新测量。

## 视觉与主题

视觉密度参考 uView2/uView Pro，但所有颜色、圆角、字号、边框和阴影使用 Snake UI 主题变量及安全 fallback。每个控件都有默认、聚焦、选中、错误、禁用和加载状态。

组件样式局部隔离，不依赖文档站 CSS。数值尺寸经 Snake UI 单位工具处理；跨端模板不使用浏览器专属 DOM。

## 导出、演示与文档

所有组件和公共类型从 `src/uni_modules/snake-ui/index.ts`、`index.d.ts` 和 npm 类型入口导出。easycom 继续使用现有 `snake-*` 通配规则。

组件示例加入 componentsA 路由、总览和 DemoRenderer。Form 示例展示完整提交/重置/异步校验；其余页面展示受控状态、禁用、尺寸、颜色和关键事件。手机预览直接运行真实 uni-app 组件。

每个组件文档包含平台兼容性、基础用法、组合用法、完整 Props、Events、Slots、Expose、主题与注意事项。它们是公共基础组件，不添加 CMS 标识。

## 兼容和错误处理

- 不增加 `<u-*>`、`uni.$u` 或 uView Pro 包导入。
- 自定义校验函数可返回 boolean、字符串、Error、Promise 或使用 callback。
- 无法测量 Slider 时保留当前值，并在下一次挂载/更新重试，不产生 NaN。
- 输入法组合、空值、非法数值和 min 大于 max 均进行安全归一化。
- 组件不存在 Form/FormItem 父级时仍可独立使用。

## 验证策略

新增表单契约与行为测试，覆盖：

- 根导出、类型、文档、路由和演示一一对应
- 嵌套字段、同步/异步规则、触发方式、重置和清错
- Checkbox/Radio 父子注册与受控值
- Input/Textarea 的事件和 FormItem 通知
- Switch 自定义值与禁用/加载状态
- Slider 范围、步长、触摸和事件顺序
- 源码不含 uView 运行时依赖

整批完成后运行类型检查、lint、现有全部测试以及 H5、微信小程序、App、VitePress 构建。lint 只允许保留与本批无关的既有警告，本批文件不得新增错误或警告。

## 实施顺序

1. 新增失败的公共契约和校验器测试。
2. 实现嵌套路径、规则校验和 Form 父子协议。
3. 实现 Form/FormItem、Input、Textarea。
4. 实现 Checkbox/Group、Radio/Group、Switch。
5. 实现 Slider 测量与触摸交互。
6. 补齐导出、类型、主题、路由、演示和文档。
7. 完成全量测试与四端构建验证。

## 非目标

- 不复制 uView Pro 的品牌主题、示例素材或 `uni.$u` 工具接口。
- 不新增外部校验依赖。
- 不在本批修改 CMS 数据模型或业务组件。
- 不实现未列入范围的反馈、上传和选择器组件。
