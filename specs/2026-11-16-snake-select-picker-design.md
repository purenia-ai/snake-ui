# snake-select-picker 单复选选择器（新增组件）

- 日期：2026-11-16
- 目标版本：0.2.0（minor，新增组件；若与尚未发布的 0.1.1 图片修正一起发，则合并进 0.2.0）
- 状态：**已确认**（2026-11-16，方案 B：自绘行 + 复用弹层与搜索）
- 参照：wot-ui `wd-select-picker`（wot-ui.cn/component/select-picker.html）、uView-Pro `u-select`（只有滚轮列选择，无等价组件）、uni-ui `uni-data-checkbox` / `uni-data-select`、Vant `Picker` + `Checkbox`、Ant Design Mobile `Selector` / `CheckList` / `Picker`

---

## 1. 背景

库里的 `snake-picker` 是**滚轮列选择器**：基于 `picker-view`，`v-model` 是布尔值、只控制开合，没有「列表勾选」。要做「多选城市 / 多选标签」这类需求，消费方只能自己拼 `snake-popup` + `snake-checkbox-group`，于是每个页面重复写一遍：确认栏、未确认回滚、`min`/`max`、滚动定位、安全区。

市场上的两种流派：

| 流派 | 代表                                                                                    | 形态                                                          |
| ---- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 拆分 | Vant（`Picker` + `Checkbox`）、Ant Design Mobile（`Selector` / `CheckList` / `Picker`） | 多选列表交给复选框组，弹层自己配                              |
| 打包 | wot-ui `wd-select-picker`                                                               | 一个组件给全：标题、搜索、列表、确认栏、`min`/`max`、异步确认 |

uni-ui 的 `uni-data-checkbox` 是平铺勾选组（无弹层、无确认栏），`uni-data-select` 才有触发框但面板是 absolute 下拉。uView-Pro 没有对应组件。

决策：**跟随 wot 打包成一个组件**，内部复用 `snake-popup` 与 `snake-search`，把上面那套样板内置。

## 2. 命名与形态决策

- 名称 `snake-select-picker`（与 wot 同名）。`snake-select` 继续预留给「带触发框的选择控件」，本组件**不含触发框**，触发入口由消费方用 `snake-cell-item` 等自己放。
- `v-model` 承载**选中值**，`v-model:visible` 控开合。与 `snake-picker`（`v-model` 布尔控开合）语义不同，文档与 demo 必须显著提示：**picker 是滚轮列，select-picker 是列表勾选**。
- 单/多选用 `multiple` 布尔，**默认单选**：默认 `v-model` 是标量，最常用；开 `multiple` 后 `v-model` 为数组。
    - 不采用 wot 的 `type="checkbox|radio"`：默认多选会让最常见的单选场景反而要传数组。
    - 不做「按 `v-model` 类型推断」：隐式魔法在空数组、布尔值、类型声明上都会出坑。

## 3. 对外契约

### 3.1 Props

| 属性                          | 类型                          | 默认值       | 说明                                                                    |
| ----------------------------- | ----------------------------- | ------------ | ----------------------------------------------------------------------- |
| `modelValue`                  | `SelectPickerValue`           | `undefined`  | 选中值：单选为标量，多选为数组；未选时内部按 `''` / `[]` 归一化，不回写 |
| `visible`                     | `boolean`                     | `false`      | 弹层开合，配 `v-model:visible`                                          |
| `list`                        | `SelectPickerItem[]`          | `[]`         | 数据源，字段名可配                                                      |
| `multiple`                    | `boolean`                     | `false`      | 多选开关，开启后 `v-model` 为数组                                       |
| `valueName`                   | `string`                      | `'value'`    | 值字段名，与 `snake-picker` 同名同义                                    |
| `labelName`                   | `string`                      | `'label'`    | 文案字段名，与 `snake-picker` 同名同义                                  |
| `disabledName`                | `string`                      | `'disabled'` | 禁用字段名                                                              |
| `title`                       | `string`                      | `''`         | 标题，缺省取语言包                                                      |
| `confirmText`                 | `string`                      | `''`         | 确认按钮文案，缺省取语言包                                              |
| `showConfirm`                 | `boolean \| undefined`        | `undefined`  | 未传时：单选 `false`（选中即提交并关闭）、多选 `true`                   |
| `min`                         | `number`                      | `0`          | 多选最少选中数；单选忽略                                                |
| `max`                         | `number`                      | `0`          | 多选最多选中数，`0` 为不限；单选忽略                                    |
| `filterable`                  | `boolean`                     | `false`      | 开启本地搜索                                                            |
| `filterPlaceholder`           | `string`                      | `''`         | 搜索占位，缺省取语言包                                                  |
| `loading`                     | `boolean`                     | `false`      | 加载态，内容区遮罩 + 确认不可用                                         |
| `emptyText`                   | `string`                      | `''`         | 空数据文案，缺省取语言包                                                |
| `noMatchText`                 | `string`                      | `''`         | 搜索无结果文案，缺省取语言包                                            |
| `minText`                     | `string`                      | `''`         | 未达 `min` 的提示，缺省取语言包（含 `{n}` 占位）                        |
| `beforeConfirm`               | `SelectPickerBeforeConfirm`   | `undefined`  | 确认前拦截，返回 `false` / `Promise<false>` 不关闭                      |
| `scrollIntoView`              | `boolean`                     | `true`       | 打开时滚到首个已选项                                                    |
| `closeOnClickOverlay`         | `boolean`                     | `true`       | 点击遮罩关闭（未确认则回滚）                                            |
| `safeAreaInsetBottom`         | `boolean`                     | `true`       | 底部安全区适配                                                          |
| `rootPortal`                  | `boolean`                     | `false`      | 传送到页面根节点，透传 `snake-popup`                                    |
| `round`                       | `boolean \| number \| string` | `true`       | 面板圆角，透传 `snake-popup`                                            |
| `maxHeight`                   | `number`                      | `264`        | 列表区最大高度，单位 px（375 稿），与 picker 的 6×44 视觉对齐           |
| `activeColor`                 | `string`                      | `''`         | 选中色，缺省取 `--snake-color-primary`                                  |
| `disabled`                    | `boolean`                     | `false`      | 禁用整组件，无法打开                                                    |
| `zIndex`                      | `number \| string`            | `0`          | 层级，`0` 用弹层默认值                                                  |
| `customClass` / `customStyle` | `string` / `StyleValue`       | `''`         | 根节点自定义                                                            |

### 3.2 事件

| 事件                | 参数                                                  | 时机                                                               |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| `update:modelValue` | `value: SelectPickerValue`                            | 确认提交时（草稿期间不动 `v-model`）                               |
| `update:visible`    | `visible: boolean`                                    | 打开 / 关闭                                                        |
| `open`              | —                                                     | 打开动画完成后                                                     |
| `change`            | `value: SelectPickerValue, items: SelectPickerItem[]` | 草稿变化（多选每次勾选；单选点选即提交时先 `change` 后 `confirm`） |
| `confirm`           | `value: SelectPickerValue, items: SelectPickerItem[]` | 确认提交并关闭                                                     |
| `close`             | —                                                     | 弹层关闭后（含确认关闭、遮罩关闭、关闭图标）                       |

### 3.3 暴露方法

`open(): void` / `close(): void`（`close` 等同取消，丢弃草稿）。

### 3.4 类型（`types.ts`）

```ts
export type SelectPickerPrimitive = string | number | boolean;
export type SelectPickerValue = SelectPickerPrimitive | SelectPickerPrimitive[];
export type SelectPickerItem = Record<string, unknown>;
export type SelectPickerBeforeConfirm = (value: SelectPickerValue) => boolean | Promise<boolean>;
export type SelectPickerProps = ExtractPropTypes<typeof selectPickerProps>;
export type SelectPickerEmits = {
    'update:modelValue': [value: SelectPickerValue];
    'update:visible': [visible: boolean];
    open: [];
    change: [value: SelectPickerValue, items: SelectPickerItem[]];
    confirm: [value: SelectPickerValue, items: SelectPickerItem[]];
    close: [];
};
export interface SelectPickerExpose {
    open(): void;
    close(): void;
}
```

## 4. 结构与视觉

```
snake-popup(mode=bottom, round, safe-area-inset-bottom, root-portal, z-index)
└─ panel
   ├─ header   标题 + 关闭图标（snake-icon close）
   ├─ search   filterable 时 snake-search（show-action=false）
   ├─ scroll-view(scroll-y, max-height=maxHeight)
   │  ├─ 行 × N（44px：label 左 / 指示器右）
   │  └─ 空态 / 无匹配文案
   └─ footer   showConfirm 时：min 提示行 + snake-button(block)
```

视觉 token（与 `snake-checkbox` 对齐，改 checkbox 时同步改这里）：

| 项目              | 值                                                       |
| ----------------- | -------------------------------------------------------- |
| 行高 / 水平内边距 | 44px / 16px                                              |
| 标签字号 / 颜色   | 14px / `--snake-color-text`                              |
| 选中标签色        | `activeColor`（缺省 `--snake-color-primary`）            |
| 指示器尺寸        | 18×18px；多选圆角 4px，单选 50%                          |
| 未选中            | 1px 边框 `--snake-color-border`，透明底                  |
| 选中              | 实心底色 + 白色 `checkmark` 10px                         |
| 禁用              | 文字 `--snake-color-text-muted`、指示器降透明、不可点    |
| 头部 / 底部       | 头部 48px、标题 16px/600；底部 padding 8px 16px + 安全区 |
| 空态              | 14px muted，垂直 padding 32px                            |

指示器自绘（不是复用 `snake-checkbox`）：需要整行可点、指示器右置、达 `max` 后未选项置灰、搜索高亮，这些都要改 checkbox 内部结构才能做到；复用 `snake-checkbox-group` 还会和它「只支持 max 且只 `console.warn`」的逻辑打架。

## 5. 行为契约

数据流：`snapshot`（已确认值）与 `draft`（弹层内草稿）分离，`v-model` 只在确认时更新。

| 场景                                 | 行为                                                                                                                                   |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| 打开                                 | `draft = snapshot`；清空搜索词；`scrollIntoView` 为真时在 `nextTick` 后把首个已选项滚到可视区                                          |
| 点选（多选）                         | `draft` 增删 → 派发 `change`；已达 `max` 时未选项置灰不可点                                                                            |
| 点选（单选，`showConfirm` 为 false） | `draft` 更新 → `change` → 立即 `confirm` + `update:modelValue` + 关闭                                                                  |
| 点选（单选，`showConfirm` 为 true）  | 只改 `draft`，等确认                                                                                                                   |
| 确认                                 | `beforeConfirm` 返回 `false` / resolve `false` 时不关闭、保留草稿、按钮退出 loading；否则派发 `update:modelValue` + `confirm` 并关闭   |
| 未达 `min`                           | 确认按钮禁用，footer 显示 `minText`（`{n}` 替换为 `min`）                                                                              |
| 关闭（遮罩 / 关闭图标 / `close()`）  | 丢弃 `draft`，`snapshot` 不变，派发 `close`                                                                                            |
| 关闭后                               | `visible = false`，清空搜索词，重置滚动位置                                                                                            |
| `loading`                            | 内容区 `snake-loading` 遮罩，行不可点，确认按钮不可用                                                                                  |
| 空态                                 | 过滤后无数据：有关键字用 `noMatchText`，否则 `emptyText`                                                                               |
| 搜索                                 | 本地 `label` 包含匹配（忽略大小写），不改变选中集合；过滤后重算可见行                                                                  |
| 表单                                 | `inject(formItemKey)`：`disabled` 合并表单禁用；确认后 `formItem.notify('change')`（与 `snake-picker` 一致）                           |
| 无障碍                               | 行 `role="checkbox"` / `role="radio"` + `aria-checked` + `aria-disabled`；关闭图标带 `aria-label`；标题与面板用 `aria-labelledby` 关联 |

## 6. 实现要点

- `components/snake-select-picker/types.ts`：props 用 `as const` + `ExtractPropTypes`，与库内其他组件一致；导出上面的类型。
- `components/snake-select-picker/snake-select-picker.vue`：`defineOptions({ name: 'SnakeSelectPicker', options: { virtualHost: true, styleIsolation: 'shared' } })`；`defineOptions` 名字同时满足 easycom 与测试断言。
- 语言包 `locale/lang/zh-CN.ts` / `en-US.ts` 新增 `selectPicker` 分组：`title`、`confirmText`、`filterPlaceholder`、`emptyText`、`noMatchText`、`minText`，`minText` 含 `{n}` 占位由组件替换。
- 滚动定位用 `scroll-view` 的 `scroll-into-view` + 稳定行 id（`snake-select-picker-item-${index}`），不用 `scroll-top` 计算；关闭时置空以复位。
- 关闭回滚用 `watch(visible)`：`true` 时装载草稿，`false` 时丢弃草稿并复位搜索词与滚动 id。
- 平台差异：`root-portal` 直接透传 `snake-popup`；不写任何 `rpx` 字面量（沿用 375 稿 px + `addUnit`）；危险选择器（`:active` / `:first-child` / `:not(`）不用，避免小程序不支持。

## 7. 交付物

| 类型   | 文件                                                                                                                   |
| ------ | ---------------------------------------------------------------------------------------------------------------------- |
| 组件   | `src/uni_modules/snake-ui/components/snake-select-picker/snake-select-picker.vue`、`types.ts`                          |
| 语言包 | `locale/lang/zh-CN.ts`、`locale/lang/en-US.ts`（`selectPicker` 分组）                                                  |
| 文档   | `docs/components/select-picker.md`；`docs/.vitepress/component-groups.ts` 增加侧栏条目；`llms.txt` 增加文档路径        |
| 示例页 | `src/pages/componentsA/select-picker/index.vue` + `src/pages.json` 路由（标题「单复选选择器」）                        |
| 测试   | 新增 `tests/select-picker-parity.test.mjs`（契约、默认值、单选即提交、`min`/`max`、文档与 demo 覆盖、无 `rpx` 字面量） |
| 生成物 | `pnpm skill:sync`（`skills/**` + `llms-full.txt`）                                                                     |

## 8. 不做（YAGNI）

- 不做分组 / 级联数据（`children`）；不做自定义选项插槽、头部/底部插槽。
- 不做虚拟滚动、远程搜索、拖拽排序、全选/反选。
- 不做「按 `v-model` 类型推断单多选」；不做 `preserveSelection`（值由 `v-model` 持有，无需）。
- 不做带触发框的 `snake-select`（下一步在弹层之上包一层即可）。
- 不做行高 / 尺寸枚举（先固定 44px，与 picker 对齐）。

## 9. 影响面与验证

| 对象   | 影响                                                                                                                           |
| ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| 破坏性 | 无：纯新增，不动 `snake-picker` / `snake-popup` / `snake-checkbox` 契约                                                        |
| 体积   | 新增一个组件目录；无新增第三方依赖                                                                                             |
| 验证   | `pnpm test:all`（当前 238 条）、新增测试、`pnpm type-check`（基线 40 条 error）、`pnpm docs:build`、prettier / eslint 变更文件 |

## 10. 风险与未验证项

- **本环境无法实机验证 mp-weixin / App**：原生 `scroll-view` 在弹层内的层级与滚动、`root-portal`、搜索框被键盘顶起，只能保证 H5 构建通过 + 代码层条件编译正确，真机需另测。
- 长列表是 `v-for` 全量渲染，几千条会卡（与 wot、uView-Pro 同病），文档里注明建议分页或预过滤。
- `snake-search` 在弹层内的 `adjust-position` 行为未验证；若真机键盘遮挡，改为自绘 `input` 并显式设置 `adjust-position` / `cursor-spacing`。
- `min`/`max` 与 `snake-checkbox-group` 语义不同（后者只有 `max` 且只告警），文档需说明本组件是**拦截式**。
