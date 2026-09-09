# 表单控件文档标准化设计

## 目标

将 Checkbox、Radio、Switch、Select、Calendar 五个高频表单控件纳入已经验证的组件文档标准，帮助开发者快速判断选择场景、理解绑定值和事件，并正确处理键盘、标签及错误反馈。

## 范围

本批次包含：

1. 补齐五篇文档的“何时使用”“主题变量”和“无障碍”；
2. 统一 API 下 Props、Events、Slots、Methods/Expose 的标题层级；
3. 复核基础示例、平台兼容性、默认值和事件参数；
4. 扩展现有样板文档测试，将这五篇加入结构检查。

不修改组件实现、示例页面、侧边栏或全局样式，不新增依赖，也不涉及此前明确暂缓的 GitHub、编辑此页和源码反馈入口。

## 文档结构

每篇文档按以下顺序组织：标题与简介、何时使用、平台兼容性、基础用法、组件特有用法、API、Props、Events、Slots、Methods/Expose（若存在）、主题变量、无障碍、类型定义（若已有）、源码路径。

没有公开插槽或实例方法时可省略相应章节，不使用空表格占位。所有 API 内容必须能在组件 `types.ts`、Vue 模板或 `defineExpose` 中找到依据。

## 组件侧重点

### Checkbox

说明单项布尔选择与 CheckboxGroup 多项集合的区别，记录 `v-model` 值、组内禁用/尺寸继承、change 事件和标签插槽。无障碍部分强调可点击标签和分组名称。

### Radio

说明互斥选择场景、RadioGroup 的单值绑定、禁用状态与 change 事件。无障碍部分强调同组语义、清晰标签，以及不适合用于多选或即时开关。

### Switch

说明即时二元状态与需要提交确认的布尔字段之间的区别，复核 active/inactive 值与 loading、disabled 行为。无障碍部分强调状态名称、焦点和异步失败回滚。

### Select

说明选项集合、默认值、确认/取消流程和弹层边界。复核列数据结构、双向绑定、事件、插槽及实例方法。无障碍部分强调持久标签、当前值、关闭方式和键盘焦点。

### Calendar

说明单选、多选、范围选择和日期限制，复核显示状态、日期格式、确认/关闭事件及公开方法。无障碍部分强调日期状态不能只靠颜色、范围起止说明和弹层关闭后的焦点返回。

## 内容来源

实施前逐个读取：

- 对应组件的 `types.ts`；
- Vue 组件中的 `defineEmits`、`defineExpose` 和插槽；
- 组件样式直接使用的 `--snake-*` 自定义属性。

文档不推断未声明的平台能力，不把演示行为误写为公共 API，也不声明源码没有直接使用的组件专属主题变量。

## 测试设计

扩展 `tests/component-docs.test.mjs` 中的样板列表，对本批五篇检查：

- 何时使用、平台兼容性、基础用法和 API；
- Props 表或明确的无 Props 说明；
- 主题变量、无障碍和源码路径；
- 按实际能力检查 Events、Slots、Methods/Expose。

测试只约束信息结构和关键契约，不约束 Markdown 表格空格、列宽或自然语言句式。

## 预计文件

- `docs/components/checkbox.md`
- `docs/components/radio.md`
- `docs/components/switch.md`
- `docs/components/select.md`
- `docs/components/calendar.md`
- `tests/component-docs.test.mjs`

## 验证

- 运行 `pnpm test:component-docs`；
- 运行 `pnpm test:docs-structure`；
- 运行 `pnpm docs:build`；
- 使用 `git diff --check` 检查差异。

本批只修改 Markdown 和测试；若实施时触及 Vue 或 TypeScript 文件，再补跑 `pnpm type-check`。

## 完成标准

五篇表单控件文档采用一致结构，绑定值、事件、插槽和公开方法均与源码一致，选择场景和无障碍注意事项可直接执行；结构测试能阻止后续退化，文档测试及构建通过。
