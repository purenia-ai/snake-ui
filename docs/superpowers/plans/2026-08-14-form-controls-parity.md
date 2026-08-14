# Snake UI 表单核心组件实施计划

## 目标

参考 `D:\development\Projects\UniApp\uView-Pro\src\uni_modules\uview-pro` 的成熟交互，在不引入 uView Pro 运行时和外部校验依赖的前提下，为 Snake UI 新增 Form/FormItem、Input、Textarea、Checkbox/Group、Radio/Group、Switch 和 Slider，并完成公共导出、真实预览、文档及 H5/微信小程序/App 验证。

设计依据：`docs/superpowers/specs/2026-08-14-form-controls-parity-design.md`。

## 实施原则

- 先写可失败的契约和纯函数测试，再实现组件。
- 公共 API 参考 uView Pro，但使用 `snake-*`、Snake 主题和独立类型。
- 表单校验、嵌套路径、父子协议放入小型独立模块，不塞入单个 SFC。
- 输入控件可脱离 Form 独立使用；存在 FormItem 时才通知校验。
- 不增加 npm 依赖，不修改 CMS 数据模型和业务行为。
- 每个阶段运行最小相关检查，整批结束运行全量测试与四端构建。

## 任务 1：建立第三批失败契约

涉及文件：

- 新增 `scripts/form-controls-parity.test.mjs`
- 修改 `package.json`

步骤：

1. 增加 `test:form-controls-parity` 命令。
2. 断言 10 个组件目录、SFC 和独立 `types.ts` 存在。
3. 断言根入口和声明文件导出组件、Props、Emits、Expose、规则类型。
4. 断言 Form 方法、输入事件、Group 父子协议、Switch 自定义值和 Slider 触摸接口存在。
5. 断言源码不含 `<u-*>`、`uni.$u`、`uview-pro` 导入和 `async-validator` 依赖。
6. 运行测试，确认因组件尚未实现而失败。

验证：

```powershell
npm.cmd run test:form-controls-parity
```

## 任务 2：实现表单纯函数底座

涉及文件：

- 新增 `src/uni_modules/snake-ui/libs/form/path.ts`
- 新增 `src/uni_modules/snake-ui/libs/form/validate.ts`
- 新增 `src/uni_modules/snake-ui/libs/form/types.ts`
- 新增 `src/uni_modules/snake-ui/libs/form/index.ts`
- 修改 `src/uni_modules/snake-ui/libs/index.ts`
- 扩展 `scripts/form-controls-parity.test.mjs`

步骤：

1. 实现点路径和数组路径解析。
2. 实现安全的 `getPathValue`、`setPathValue`，支持对象与数组嵌套。
3. 定义规则、触发方式、错误和校验上下文类型。
4. 实现 required/type/min/max/len/pattern/enum/whitespace/transform。
5. 兼容同步 validator、Promise validator、callback validator 和 asyncValidator。
6. 将异常、Error、字符串及 false 统一为字段错误。
7. 测试嵌套路径、空值、数值、数组、正则和异步校验。

验证：

```powershell
npm.cmd run test:form-controls-parity
npm.cmd run type-check
```

## 任务 3：建立 Form 父子通信协议

涉及文件：

- 新增 `src/uni_modules/snake-ui/libs/internal/form.ts`
- 新增 `src/uni_modules/snake-ui/libs/internal/form-item.ts`
- 新增 `src/uni_modules/snake-ui/libs/internal/checkbox.ts`
- 新增 `src/uni_modules/snake-ui/libs/internal/radio.ts`

步骤：

1. 定义 FormContext、FormField、FormItemContext。
2. 定义字段注册、卸载、校验通知和错误状态协议。
3. 定义 CheckboxGroupContext 与 RadioGroupContext。
4. 明确父级 disabled/size/color 与子级配置的优先级。
5. 内部协议不从 npm 根入口导出。

验证：

```powershell
npm.cmd run type-check
npm.cmd run test:form-controls-parity
```

## 任务 4：实现 Form 与 FormItem

涉及文件：

- 新增 `src/uni_modules/snake-ui/components/snake-form/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-form/snake-form.vue`
- 新增 `src/uni_modules/snake-ui/components/snake-form-item/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-form-item/snake-form-item.vue`

步骤：

1. Form 接收 model/rules/errorType/label 配置/size，并提供字段注册。
2. 实现 setRules、validate、validateField、resetFields、clearValidate。
3. 通过字段执行序号防止异步校验竞态。
4. FormItem 保存初始值并实现 reset、clear、change/blur 校验。
5. 支持 required 星号、label/左右图标、上下或左右标签布局。
6. 支持 message、border、border-bottom、none 错误状态。
7. 暴露 Promise 与 callback 两种校验调用方式。

验证：

```powershell
npm.cmd run test:form-controls-parity
npm.cmd run type-check
```

## 任务 5：实现 Input

涉及文件：

- 新增 `src/uni_modules/snake-ui/components/snake-input/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-input/snake-input.vue`

步骤：

1. 基于 uni-app input 实现受控值、类型、placeholder 和 maxlength。
2. 增加 clearable、password、prefix/suffix 图标和插槽。
3. 增加 border、shape、size、disabled、readonly 和错误态。
4. 实现 formatter、formatTrigger、trim，避免组合输入期间破坏输入法。
5. 透传 focus/cursor/selection/confirm/键盘避让属性。
6. 派发 update:modelValue、input、change、focus、blur、confirm、clear、keyboardheightchange。
7. 在 change/blur 时通知 FormItem。

验证：

```powershell
npm.cmd run test:form-controls-parity
npm.cmd run type-check
npm.cmd run build:mp-weixin
```

## 任务 6：实现 Textarea

涉及文件：

- 新增 `src/uni_modules/snake-ui/components/snake-textarea/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-textarea/snake-textarea.vue`

步骤：

1. 基于原生 textarea 实现受控值、maxlength、height 和 autoHeight。
2. 支持 count、fixed、disabled、readonly、focus/cursor/selection。
3. 透传 confirmType、adjustPosition、holdKeyboard 等跨端属性。
4. 派发 update:modelValue、input、change、focus、blur、confirm、linechange、keyboardheightchange。
5. 在 change/blur 时通知 FormItem。
6. 处理 maxlength=-1、空值和动态 modelValue。

验证：

```powershell
npm.cmd run test:form-controls-parity
npm.cmd run type-check
```

## 任务 7：实现 Checkbox 与 Radio 系列

涉及文件：

- 新增 `src/uni_modules/snake-ui/components/snake-checkbox/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-checkbox/snake-checkbox.vue`
- 新增 `src/uni_modules/snake-ui/components/snake-checkbox-group/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-checkbox-group/snake-checkbox-group.vue`
- 新增 `src/uni_modules/snake-ui/components/snake-radio/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-radio/snake-radio.vue`
- 新增 `src/uni_modules/snake-ui/components/snake-radio-group/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-radio-group/snake-radio-group.vue`

步骤：

1. 实现子项注册、排序和卸载。
2. Checkbox 独立使用时维护 boolean；Group 内维护 name 数组。
3. CheckboxGroup 实现 max、disabled、横纵布局和 change。
4. Radio 独立或 Group 内维护单值；点击已选项不重复派发。
5. 统一 shape、iconSize、labelSize、颜色、labelDisabled 和 size。
6. 父级状态为默认值，子级显式值优先，disabled 使用逻辑或。
7. 组值变化时通知 FormItem change 校验。

验证：

```powershell
npm.cmd run test:form-controls-parity
npm.cmd run type-check
npm.cmd run build:h5
```

## 任务 8：实现 Switch

涉及文件：

- 新增 `src/uni_modules/snake-ui/components/snake-switch/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-switch/snake-switch.vue`

步骤：

1. 支持 boolean/string/number modelValue 和 activeValue/inactiveValue。
2. 实现 loading、disabled、size、space 与活动/非活动颜色。
3. 使用 SnakeLoadingIcon 表示加载状态。
4. 支持 vibrateShort；平台 API 不可用或失败时静默降级。
5. 派发 update:modelValue、change、click，并通知 FormItem change。

验证：

```powershell
npm.cmd run test:form-controls-parity
npm.cmd run type-check
npm.cmd run build:mp-weixin
```

## 任务 9：实现 Slider

涉及文件：

- 新增 `src/uni_modules/snake-ui/components/snake-slider/types.ts`
- 新增 `src/uni_modules/snake-ui/components/snake-slider/snake-slider.vue`

步骤：

1. 实现 min/max/step 归一化和精度安全计算。
2. 使用 createSelectorQuery 测量轨道，禁止浏览器 DOM 依赖。
3. 实现轨道点击和 touchstart/touchmove/touchend 拖动。
4. 支持 disabled、颜色、轨道高度、滑块尺寸与自定义样式。
5. 支持 showValue、valuePosition、showEdgeValue 和默认插槽。
6. 派发 update:modelValue、start、moving、end、change，并通知 FormItem。
7. 暴露 update()，宽度或页面布局改变时可重新测量。

验证：

```powershell
npm.cmd run test:form-controls-parity
npm.cmd run type-check
npm.cmd run build:app
```

## 任务 10：统一公共导出与声明

涉及文件：

- 修改 `src/uni_modules/snake-ui/index.ts`
- 修改 `src/uni_modules/snake-ui/index.d.ts`
- 修改 `src/uni_modules/snake-ui/types/index.d.ts`
- 修改 `src/uni_modules/snake-ui/theme.scss`
- 修改组件契约测试

步骤：

1. 导出 10 个组件和全部公共类型。
2. 增加全局组件类型声明。
3. 验证 easycom 通配规则能识别所有标签，无需逐项映射。
4. 增加表单、输入、选择、错误和禁用态主题变量。
5. 检查 npm 发布清单包含新增目录。

验证：

```powershell
npm.cmd run test:component-contracts
npm.cmd run test:uview-dependency
npm.cmd run type-check
```

## 任务 11：增加真实演示和组件总览

涉及文件：

- 修改 `src/pages.json`
- 修改 `src/pages/index/components.config.ts`
- 修改 `src/demo/demo-config.ts`
- 修改 `src/demo/DemoRenderer.vue`
- 按现有模式新增或复用 componentsA 示例页

步骤：

1. 为每个公共组件增加独立路由和目录总览项。
2. DemoRenderer 增加真实组件分支，不写静态替代界面。
3. Form 页面展示必填、嵌套规则、异步校验、提交与重置。
4. 输入和选择控件展示受控值、禁用、尺寸、颜色与关键事件。
5. Slider 展示步长、气泡、边界值和自定义滑块。
6. 所有页面提供可交互控制项，并保持手机预览完整显示。

验证：

```powershell
npm.cmd run test:preview-structure
npm.cmd run test:component-contracts
```

## 任务 12：编写详细文档

涉及文件：

- 新增 `docs/components/form.md`
- 新增 `docs/components/form-item.md`
- 新增 `docs/components/input.md`
- 新增 `docs/components/textarea.md`
- 新增 `docs/components/checkbox.md`
- 新增 `docs/components/checkbox-group.md`
- 新增 `docs/components/radio.md`
- 新增 `docs/components/radio-group.md`
- 新增 `docs/components/switch.md`
- 新增 `docs/components/slider.md`
- 修改 `docs/.vitepress/config.mts`

步骤：

1. 每篇包含平台兼容、基础/组合用法、Props、Events、Slots、Expose、主题和注意事项。
2. Form 文档完整描述规则、嵌套路径、同步/异步验证和错误展示。
3. 明确与 uView Pro 的迁移关系，不展示 `uni.$u` 写法。
4. 组件为公共基础组件，不增加 CMS 标识。
5. 校验文档路由、示例路由和组件总览一一对应。

验证：

```powershell
npm.cmd run test:component-docs
npm.cmd run test:preview-structure
npm.cmd run docs:build
```

## 任务 13：完整回归与提交

按顺序执行：

```powershell
npm.cmd run test:form-controls-parity
npm.cmd run test:runtime
npm.cmd run test:unit-conversion
npm.cmd run test:foundation
npm.cmd run test:foundation-parity
npm.cmd run test:interaction-parity
npm.cmd run test:component-contracts
npm.cmd run test:component-docs
npm.cmd run test:preview-structure
npm.cmd run test:uview-dependency
npm.cmd run test:cms
npm.cmd run type-check
npm.cmd run lint
npm.cmd run build:h5
npm.cmd run build:mp-weixin
npm.cmd run build:app
npm.cmd run docs:build
git diff --check
```

检查本批文件无 lint 错误或警告；仓库既有警告单独如实记录。确认工作区只包含本计划变更后提交，建议拆分为：

1. `feat: add snake form validation foundation`
2. `feat: add snake input and selection controls`
3. `feat: add snake form component docs and demos`

## 完成标准

- 10 个组件均具备正式公共类型、受控状态、事件和独立使用能力。
- Form 支持嵌套路径、同步/异步规则、触发校验、重置和清错。
- Checkbox/Radio 父子联动、Switch 自定义值和 Slider 触摸交互可用。
- 根导出、声明、easycom、总览、预览和文档一致。
- 源码和依赖中不存在新增 uView Pro 运行时或 async-validator。
- H5、微信小程序、App 和 VitePress 构建通过。
