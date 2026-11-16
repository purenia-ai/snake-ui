# 第一批组件 API 草案（tag / action-sheet / steps / collapse / grid / swipe-action）

- 日期：2026-11-13
- 目标版本：0.1.0（若确认，公开 API 从此冻结）
- 状态：**已确认**（2026-11-13 按建议全量执行），实现进行中
- 参照：`wot-ui` 2.4.0（`D:\development\Projects\UniApp\wot-ui`）、`uView-Pro` 0.6.24（`D:\development\Projects\UniApp\uView-Pro`）

---

## 0. 通用约定（沿用现有 78 个组件的事实标准）

| 约定                                                                                       | 依据                                    |
| ------------------------------------------------------------------------------------------ | --------------------------------------- |
| 每个组件目录 = `snake-xxx.vue` + `types.ts`                                                | `snake-button`、`snake-cell-item`       |
| `defineProps(xxxProps)` 或 `withDefaults(defineProps<XxxProps>())`，类型从 `types.ts` 导入 | `snake-button` / `snake-checkbox-group` |
| `interface XxxProps`（对外）+ `type XxxEmits` + 可选 `XxxExpose`                           | 全部现有组件                            |
| 根节点 `customStyle: StyleValue`（来自 `../../types/global`）+ `customClass: string`       | `snake-popup`、`snake-cell-item`        |
| **裸数字 = 375 设计稿 px**，带单位字符串原样透传                                           | `libs/function/unit.ts`（0.0.6 起）     |
| 颜色一律 `var(--snake-color-xxx, #fallback)`，不在组件里写死色值                           | 全库 CSS                                |
| 1px 边框用 `hairLine` → `snake-hairline-border` 类，`::after` 半像素                       | `snake-button`                          |
| 父子通信：`useChildren` / `useParent` + `provide/inject` 的 `xxxKey`                       | `snake-checkbox-group`                  |
| `defineOptions({ name: 'Xxx', options: { virtualHost: true, styleIsolation: 'shared' } })` | 全部现有组件                            |
| 事件名用 `click` / `change` / `close`，不用 `tap`                                          | `snake-button`                          |
| 组件头 `@component` / `@description` / `@see /components/xxx`                              | 全部现有组件                            |

新增两个本批统一的约定：

1. **控制器类组件同时支持 `v-model` 与函数式调用**（action-sheet 走 `v-model`，轻量场景后续再补 `showActionSheet()`）。
2. **不加组件级全局默认值**（即 wot 的 `useGlobalConfig`）。理由见文末决策 4。

---

## 1. `snake-tag` 标签

**用途**：商品属性、状态标记、筛选结果、列表角标文案。
**依赖**：`snake-icon`。
**不做**：可选态 tag（checkable）、`mark` 形态——需要时用 `snake-checkbox` 组合。

### Props

| 名称          | 类型                                                                    | 默认        | 说明                                              |
| ------------- | ----------------------------------------------------------------------- | ----------- | ------------------------------------------------- |
| `text`        | `string`                                                                | `''`        | 文本，被默认插槽覆盖                              |
| `type`        | `'default' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | 主题                                              |
| `size`        | `'default' \| 'medium' \| 'small' \| 'mini'`                            | `'default'` | 尺寸                                              |
| `plain`       | `boolean`                                                               | `false`     | 描边 + 浅底                                       |
| `round`       | `boolean`                                                               | `false`     | 全圆角                                            |
| `closable`    | `boolean`                                                               | `false`     | 显示右侧关闭图标                                  |
| `icon`        | `string`                                                                | `''`        | 左侧图标名（透传 `snake-icon`）                   |
| `hairLine`    | `boolean`                                                               | `true`      | `plain` 时 1px 描边走半像素；填充态无边框，不参与 |
| `customStyle` | `StyleValue`                                                            | `''`        | 根节点样式                                        |
| `customClass` | `string`                                                                | `''`        | 根节点类名                                        |

### Events

`click(event)`、`close()`（`closable` 时点击关闭图标）。

### Slots

- `default`：文本内容
- `icon`：自定义左侧图标

### 主题 token

`--snake-tag-height` / `--snake-tag-padding-x` / `--snake-tag-font-size` / `--snake-tag-radius` / `--snake-tag-bg` / `--snake-tag-color` / `--snake-tag-border-color`，均带 fallback。

### 取舍

- 只做展示，不内置 `v-model:selected`。uView 的 `u-tag` 带 `closeable` + `plain` 两套，接口一致。
- `plain` + 自定义背景色时，描边逻辑复用 `snake-button` 的 `hasCustomBackground` 判断，避免重演白线问题。

---

## 2. `snake-action-sheet` 动作面板

**用途**：客服、分享、更多操作、选择器入口。
**依赖**：`snake-popup`（`mode="bottom"`）、`snake-icon`、`snake-loading`。

### Props

| 名称                          | 类型                  | 默认     | 说明                        |
| ----------------------------- | --------------------- | -------- | --------------------------- |
| `modelValue`                  | `boolean`             | `false`  | 是否显示                    |
| `title`                       | `string`              | `''`     | 面板标题                    |
| `description`                 | `string`              | `''`     | 标题下说明                  |
| `actions`                     | `ActionSheetAction[]` | `[]`     | 动作列表，见下              |
| `showCancel`                  | `boolean`             | `true`   | 显示取消按钮                |
| `cancelText`                  | `string`              | `'取消'` | 走 i18n key `common.cancel` |
| `closeOnClickAction`          | `boolean`             | `true`   | 点动作后自动关闭            |
| `closeOnClickOverlay`         | `boolean`             | `true`   | 点遮罩关闭                  |
| `round`                       | `boolean \| number`   | `true`   | 顶部圆角（透传 popup）      |
| `safeAreaInsetBottom`         | `boolean`             | `true`   | 底部安全区                  |
| `zIndex`                      | `number \| string`    | `''`     | 层级                        |
| `customStyle` / `customClass` |                       |          | 根节点                      |

```ts
interface ActionSheetAction {
    /** 动作名称 */
    name: string;
    /** 名称下方的次要说明 */
    subname?: string;
    /** 文字颜色，统一影响名称与图标 */
    color?: string;
    /** 图标名 */
    icon?: string;
    /** 禁用 */
    disabled?: boolean;
    /** 加载中，点击不触发 select */
    loading?: boolean;
}
```

### Events

- `update:modelValue(boolean)`
- `select(action: ActionSheetAction, index: number)`
- `cancel()`
- `close()` / `opened()`

### Slots

- `action`：完全自定义动作区（作用域参数 `{ action, index }`），给了就忽略 `actions`

### Expose

`open()`、`close()`

### 主题 token

`--snake-action-sheet-bg` / `--snake-action-sheet-item-height` / `--snake-action-sheet-font-size` / `--snake-action-sheet-cancel-gap`（取消按钮与列表之间的 8px 留白）。

### 取舍

- **`actions` 数组为主、`action` 插槽兜底**，与 wot 的 `wd-action-sheet` 一致；uView 的 `u-action-sheet` 用 `list` 数组，语义相同。
- 遮罩与动画完全交给 `snake-popup`，不重复实现 `lockScroll`。
- 不做 `tip`、`mode`（只有底部）等长尾。

---

## 3. `snake-steps` + `snake-step` 步骤条

**用途**：订单状态、售后进度、物流轨迹、多步表单。
**依赖**：`snake-icon`、`useChildren` / `useParent`。

### Steps Props

| 名称                          | 类型                         | 默认                                     | 说明                     |
| ----------------------------- | ---------------------------- | ---------------------------------------- | ------------------------ |
| `current`                     | `number`                     | `0`                                      | 当前进行到的索引（0 基） |
| `direction`                   | `'horizontal' \| 'vertical'` | `'horizontal'`                           | 方向                     |
| `activeColor`                 | `string`                     | `var(--snake-color-primary, #06D290)`    | 已完成/进行中颜色        |
| `inactiveColor`               | `string`                     | `var(--snake-color-text-muted, #909399)` | 未开始颜色               |
| `errorColor`                  | `string`                     | `var(--snake-color-error, #FA3534)`      | 异常颜色                 |
| `alignCenter`                 | `boolean`                    | `false`                                  | 横向时文字居中           |
| `customStyle` / `customClass` |                              |                                          |                          |

### Step Props

| 名称                          | 类型                                         | 默认       | 说明                 |
| ----------------------------- | -------------------------------------------- | ---------- | -------------------- |
| `title`                       | `string`                                     | `''`       | 标题                 |
| `description`                 | `string`                                     | `''`       | 描述                 |
| `icon`                        | `string`                                     | `''`       | 自定义图标，覆盖序号 |
| `status`                      | `'wait' \| 'process' \| 'finish' \| 'error'` | 由父级推导 | 显式覆盖             |
| `customStyle` / `customClass` |                                              |            |                      |

### Slots（Step）

`title` / `description`（默认插槽）/ `icon`

### Events

本批**不派发**交互事件，纯展示；需要点击切换时由业务在 Step 外套可点击容器。

### 主题 token

`--snake-step-circle-size` / `--snake-step-line-width` / `--snake-step-title-font-size` / `--snake-step-description-font-size` / `--snake-step-gap`

### 取舍与风险

- 子项顺序由 `useChildren` 的 vnode 序决定（与 `snake-checkbox-group` 同一机制），不依赖 `index` 手传。
- **竖向连线用绝对定位 + 最后一项 `:last-child` 断开**，横向连线用 flex + `flex:1`，避免用 JS 测量（小程序测量在 `onPageScroll` 下易抖动）。
- 不做 `steps` 的点击切换语义，避免和 `snake-tabs` 职责重叠。

---

## 4. `snake-collapse` + `snake-collapse-item` 折叠面板

**用途**：商品参数、FAQ、售后说明、筛选条件。
**依赖**：`snake-cell-item` 的交互样式、`snake-icon`、`useChildren` / `useParent`。

### Collapse Props

| 名称                          | 类型                                       | 默认    | 说明                         |
| ----------------------------- | ------------------------------------------ | ------- | ---------------------------- |
| `modelValue`                  | `string \| number \| (string \| number)[]` | `''`    | 展开项；`accordion` 时为单值 |
| `accordion`                   | `boolean`                                  | `false` | 手风琴模式                   |
| `border`                      | `boolean`                                  | `true`  | 上下分割线                   |
| `customStyle` / `customClass` |                                            |         |                              |

### CollapseItem Props

| 名称                          | 类型               | 默认     | 说明            |
| ----------------------------- | ------------------ | -------- | --------------- |
| `name`                        | `string \| number` | 子项序号 | 唯一标识        |
| `title`                       | `string`           | `''`     | 标题            |
| `disabled`                    | `boolean`          | `false`  | 禁用            |
| `icon`                        | `string`           | `''`     | 标题左侧图标    |
| `duration`                    | `number`           | `250`    | 展开动画时长 ms |
| `border`                      | `boolean`          | `true`   | 单项分割线      |
| `customStyle` / `customClass` |                    |          |                 |

### Slots（CollapseItem）

`default`（内容）/ `title` / `icon` / `value`（右侧自定义）

### Events

- `update:modelValue`
- `change(value)`：展开态变化

### 主题 token

`--snake-collapse-header-height` / `--snake-collapse-font-size` / `--snake-collapse-arrow-color` / `--snake-collapse-bg`

### 取舍与风险

- **默认只用「标题 + 内容」**，不做 `u-collapse` 那种 `value` 双向绑定的复杂用法。
- 高度动画：采用 `max-height` 过渡而非逐帧测量（测量在 `scroll-view` 内会触发重排抖动）。代价是动画时长与实际高度不完全线性，可接受。
- `accordion` 下 `v-model` 单值、非手风琴下数组，类型联合要在运行时做归一化（`normalizeValue`），避免父组件传错类型时静默失效。

---

## 5. `snake-grid` + `snake-grid-item` 宫格

**用途**：首页金刚区、CMS 快捷入口、功能入口九宫格。
**依赖**：`snake-badge`（角标）、`useChildren` / `useParent`。

### Grid Props

| 名称                          | 类型               | 默认    | 说明               |
| ----------------------------- | ------------------ | ------- | ------------------ |
| `column`                      | `number`           | `4`     | 每行列数           |
| `border`                      | `boolean`          | `false` | 显示格线（半像素） |
| `gutter`                      | `number \| string` | `0`     | 格子间距（px@375） |
| `square`                      | `boolean`          | `false` | 格子等宽等高       |
| `clickable`                   | `boolean`          | `false` | 子项出现点击态     |
| `customStyle` / `customClass` |                    |         |                    |

### GridItem Props

| 名称                          | 类型               | 默认    | 说明                           |
| ----------------------------- | ------------------ | ------- | ------------------------------ |
| `text`                        | `string`           | `''`    | 文案                           |
| `icon`                        | `string`           | `''`    | 图标名                         |
| `iconColor`                   | `string`           | `''`    | 图标颜色                       |
| `iconSize`                    | `number \| string` | `''`    | 图标尺寸                       |
| `badge`                       | `string \| number` | `''`    | 右上角角标，透传 `snake-badge` |
| `disabled`                    | `boolean`          | `false` | 禁用                           |
| `customStyle` / `customClass` |                    |         |                                |

### Slots（GridItem）

`default`（覆盖 `text`）/ `icon`

### Events

- GridItem：`click(index: number, event: unknown)`

### 主题 token

`--snake-grid-gutter` / `--snake-grid-icon-size` / `--snake-grid-text-font-size` / `--snake-grid-border-color`

### 取舍

- 布局用 flex + `width: (100% / column)` 计算，不用 CSS Grid（小程序低版本对 `grid` 支持不稳）。
- `square` 通过 `padding-bottom: 100%` 撑高，避免 JS 测量。
- 边框用「父级 `::after` + 子项 `border-right/bottom`」画格线，不能用 `gap` 模拟（`gap` 下格线不连续）。
- 不做 `swiper` 分页（`u-grid` 支持 `swiper` 翻页），需要时用 `snake-swiper` + `snake-grid` 组合。

---

## 6. `snake-swipe-action` 滑动操作

**用途**：列表左滑删除 / 收藏 / 取消订单 / 置顶。
**依赖**：`snake-overlay`（点击内容区收起）、`useTouch`（新增，见下）。

### Props

| 名称                          | 类型                | 默认    | 说明                             |
| ----------------------------- | ------------------- | ------- | -------------------------------- |
| `actions`                     | `SwipeActionItem[]` | `[]`    | 右侧按钮配置                     |
| ~~`leftActions`~~             | `SwipeActionItem[]` | —       | **首版未实现**，见下方“实现偏差” |
| `buttonWidth`                 | `number`            | `72`    | 单个按钮宽度（px，375 稿）       |
| `disabled`                    | `boolean`           | `false` | 禁用滑动                         |
| `autoClose`                   | `boolean`           | `true`  | 打开时关闭同组其他已打开项       |
| `threshold`                   | `number`            | `0`     | 拖出超过该 px 才停留，否则回弹   |
| `duration`                    | `number`            | `300`   | 回弹动画 ms                      |
| `customStyle` / `customClass` |                     |         |                                  |

```ts
interface SwipeActionItem {
    /** 按钮文字 */
    text: string;
    /** 按钮背景色，默认按 type 取语义色 */
    color?: string;
    /** 文字颜色 */
    textColor?: string;
    /** 语义类型，决定默认背景色 */
    type?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    /** 图标名 */
    icon?: string;
    /** 禁用 */
    disabled?: boolean;
    /** 点击后是否自动收起，默认 true */
    autoClose?: boolean;
}
```

### Events

- `click(item: SwipeActionItem, direction: 'left' | 'right', index: number)`
- `open(direction)` / `close()`

### Slots

- `default`：被滑动的整条内容
- `actions`：完全自定义右侧按钮区（作用域 `{ close }`），给了就忽略 `actions`

### Expose

`open(direction?)`、`close()`

### 主题 token

`--snake-swipe-action-button-width` / `--snake-swipe-action-font-size` / `--snake-swipe-action-transition`

### 取舍与风险

- **单组件 + 插槽**，不做 `swipe-action-item` 子组件：左滑对象通常是一整行 `snake-cell-item` 或商品卡，插槽最灵活。
- 需要新增一个 `libs/hooks/useTouch.ts`（现有只有 `useRect`），负责 `touchstart/move/end` 归一化、方向判定（横向位移 > 纵向位移才接管，否则放行给页面滚动）。**这是本批唯一的新基础设施**，也是主要风险点。
- ~~`autoClose` 用模块级 `activeInstance` 记录~~ —— 首版把 `activeClose` 写进了 `<script setup>`，编译后是 `setup()` 局部变量、每实例私有，互斥从未生效；已改为模块级登记表，见第 11 节。
- iOS 上 `transform` 回弹用 `transition` 而非 `requestAnimationFrame`，避免 `useRaf` 带来的多端差异。

---

## 7. 已确认的决策（2026-11-13）

四条均按建议执行：`swipe-action` 用 `actions` 数组 + 插槽兜底；`collapse` 用 `max-height` 过渡；本批不引入组件级全局默认值；版本号定为 `0.1.0`。

### 实现偏差（落地时同步修正）

| 项                         | 设计稿                                                     | 实际实现                                            | 原因                                                                               |
| -------------------------- | ---------------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `swipe-action.leftActions` | 支持左右两侧                                               | 首版只做右侧                                        | 左右两侧需要额外的位移符号与方向分支，收益低于风险，先保证左滑这条主路径稳定       |
| `swipe-action.buttonWidth` | 设计稿未列                                                 | 新增 `number`，默认 `72`                            | 位移量必须与按钮实际宽度一致，宽度改用 props 驱动，避免 CSS 变量与 JS 偏移量对不上 |
| `grid.square`              | `padding-bottom: 100%`                                     | 子项 `::before` + `padding-top: 100%`，内容绝对定位 | 用伪元素撑高不会干扰子项自身的 `padding`（`gutter`）                               |
| `action-sheet.zIndex`      | `number \| string`                                         | `number`                                            | `snake-popup` 的 `zIndex` 只接受 `number`，类型收窄避免运行时被字符串污染          |
| #                          | 决策                                                       | 我的建议                                            | 备选                                                                               |
| ---                        | ---------------------------------------------------------- | ----------------------------------------------      | -------------------------------------------------------------------                |
| 1                          | `swipe-action` 用 `actions` 数组还是纯插槽                 | **数组为主 + 插槽兜底**（上表）                     | 纯插槽（更灵活，但每个页面都要自己画按钮、自己关）                                 |
| 2                          | `collapse` 展开动画用 `max-height` 还是逐帧测高            | **`max-height`**（稳、不抖）                        | 测高（动画精确，但 `scroll-view` 内会抖）                                          |
| 3                          | 是否本批就引入组件级全局默认值（wot 的 `useGlobalConfig`） | **不引入**，保持 props 显式                         | 引入后 `ConfigProvider` 可一次改全站按钮尺寸/圆角，但要动 78 个组件                |
| 4                          | 版本号                                                     | **0.1.0**，并把「公开 API 冻结」写进 changelog      | 0.0.21（保持现状，但信号弱）                                                       |

第 3 条要单独说明：wot 的 `effectiveSize = props.size || globalConfig.button?.size || 'medium'` 确实好用，但它要求**所有组件**都改，只给新组件加会造成两套语义。建议作为下一批的独立议题，一次全量铺。

---

## 8. 每个组件的产出物（评审通过后统一执行）

```
src/uni_modules/snake-ui/components/snake-xxx/
├── snake-xxx.vue      # 实现（含 @component 头注释）
└── types.ts           # xxxProps / XxxProps / XxxEmits / [XxxExpose]
docs/components/xxx.md                     # Props/Events/Slots 表 + 2~3 个真实场景示例
docs/.vitepress/component-groups.ts        # 归入对应分组（tag/grid → 基础；steps/collapse → 数据或反馈）
tests/xxx-contract.test.mjs                # 契约测试：props 默认值、事件契约、类名与 token 存在性
src/uni_modules/snake-ui/changelog.md      # 条目
pnpm changelog:sync && pnpm skill:sync     # 镜像文档与 AI 上下文
```

**验收标准**（每个组件都要过）：

1. `pnpm type-check` 不新增错误（基线 41 个，允许持平不允许变多）；
2. `pnpm test:all` 全绿，且新增至少 5 条断言；
3. H5 + 微信小程序各跑一次 demo 页，确认无 `::after` 白线、无 `scroll` 穿透；
4. 暗色模式下颜色正确（token 有 dark 值）；
5. 文档页有「注意」小节，写清已知限制。

**工作量估计**：单个组件含文档与测试约 0.5 人日，6 个组件（8 个文件）约 3 人日。

---

## 9. 对照 wot-ui 2.4.0 复审后的修正（2026-11-13）

落地完成后按 `wd-action-sheet` / `wd-grid-item` / `wd-swipe-action` 的写法逐个复审，修掉 5 处「设计稿承诺了但实现没做到」或直接是缺陷的地方：

| #   | 组件                                | 问题                                                                                                       | 修正                                                                                                                                                                                                                       |
| --- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `snake-action-sheet`                | `loading` 只把整行置灰，没有渲染转圈（第 2 节写的依赖 `snake-loading` 没接上）                             | `loading` 行渲染 `snake-loading` 并保留文案；`disabled` 才置灰                                                                                                                                                             |
| 2   | `snake-action-sheet`                | 想只改某一行只能整块替换 `action` 插槽，代价是 `select` / `closeOnClickAction` 全部失效                    | 新增 `action-item` 作用域插槽（`{ action, index }`），只替换行内容，行容器与交互仍由组件负责                                                                                                                               |
| 3   | `snake-swipe-action`                | 模板上写死 `@touchmove.stop.prevent`，纵向手势的默认行为也被阻止，页面滚动被吞掉，与「纵向放行」的承诺相反 | 去掉修饰符，改为判定为横向后才在 handler 内 `preventDefault()`（与 `wd-swipe-action` 一致）                                                                                                                                |
| 4   | `snake-step`                        | 横向连接线从圆心画到圆心，未开始状态的透明圆点会透出连线                                                   | 改为只画两圆之间的线段：`left` 让出半径、`width` 减去一个直径                                                                                                                                                              |
| 5   | `snake-tag` / `snake-collapse-item` | 设计稿列了 `icon` 插槽，实现里没有（collapse 文档已经写了但代码没有）                                      | 补 `icon` 插槽，缺省仍渲染内置 `snake-icon`                                                                                                                                                                                |
| 6   | `snake-grid-item`                   | 点击态用 CSS `:active`，而 WXSS 的选择器白名单不含伪类，小程序端根本没有按下反馈                           | 改用 `hover-class` + `hover-stay-time`（与 `snake-cell-item` 一致），类名 `snake-grid-item--hover`                                                                                                                         |
| 7   | `snake-grid` 主题变量               | 计划 `--snake-grid-gutter` / `--snake-grid-icon-size` / `--snake-grid-text-font-size`                      | 实际为 `--snake-grid-bg` / `--snake-grid-border-color` / `--snake-grid-icon-color` / `--snake-grid-text-size`；`gutter` 走 props，`--snake-grid-icon-size` 不做（图标尺寸由 `iconSize` 内联，CSS 变量盖不住 inline style） | 维持「尺寸/间距走 props、颜色与字号走变量」的既有分工 |

### 仍然不做的（明确记录，避免下次又当成 bug）

| 组件                 | 未支持                                                                       | 原因                                                                                  |
| -------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `snake-action-sheet` | `panels` 宫格模式、标题栏关闭按钮、`beforeClose`、`lazyRender`、`rootPortal` | 宫格模式是另一套数据结构；标题栏关闭与 `beforeClose` 属于增量需求，等真实页面提出再补 |
| `snake-grid`         | `swiper` 分页、内置 `url` 跳转、`ellipsis` 多行截断                          | 分页用 `snake-swiper` 组合；内置跳转会与路由层耦合，交给业务在 `click` 里处理         |
| `snake-collapse`     | `viewmore` + `lineNum`（折叠超长文本）                                       | 需要逐帧测量高度，和本批「不做 JS 测高」的取舍冲突                                    |
| `snake-tag`          | `variant`（light/dark/plain/dashed/text 五态）                               | 与现有 `plain` + token 体系重复，先用 token 覆盖                                      |

### 已知约束（写进文档，不算 bug）

- `snake-badge` 用「圆心对准包裹内容右上角」的定位（`translate(-50%, 50%)`），所以角标会**向上溢出 7px**（对齐 uView 的 `is-center` 模式，wot 是同样的恒溢出写法）。`snake-grid` / `snake-grid-item` 自身不裁剪，但祖先节点一旦设 `overflow: hidden`（做圆角卡片、放进 `snake-collapse-item` 等），首行角标就会被切掉一半。示例页原先的 `.snake-grid { border-radius: 8px; overflow: hidden }` 就是这个坑，已改为「圆角 + 不裁剪，有格线时改直角」。
    - 对照结论：uView-Pro 靠 `u-badge` 默认 `top/right: 20rpx` + `translate(0,0)` **向内收**，结构上不溢出（`is-center` 才是溢出模式）；wot-ui 的 `wd-badge` 恒 `is-fixed` 溢出 8px，靠子项 12px 内边距兜住（算术平衡，改 `--wot-grid-item-padding` 就会裁）。
    - 我们的补法：新增 `--snake-grid-item-padding`（默认 `0`，与 `gutter/2` 相加），需要裁剪容器的场景由业务设 8px 以上自留缓冲，不改变默认视觉。

### 需要真机确认的两点

1. `snake-swipe-action` 在微信小程序上无法条件性 `catchtouchmove`，横向拖拽时页面可能同时轻微滚动（H5 已用 `preventDefault` 解决）。
2. ~~`snake-steps` 横向模式依赖 `.snake-steps--horizontal .snake-step` 这个父级 scoped 后代选择器给子项等分宽度~~ —— 已解决：等分宽度移到子项自身的 `flex: 1 1 0`，不再依赖跨组件作用域（见第 10 节）。

## 10. `snake-steps` 二次优化（对照 wot-ui / uView-Pro 的实现方式）

以 `wd-steps` + `wd-step`、`u-steps` + `u-step` 为参照重看了一遍：配色与信息层级已经对齐，但**三处实现方式不如两家稳**，另有五处语义/细节缺口。

| #   | 问题                                        | 两家的做法                                                                                    | 本次修正                                                                                   |
| --- | ------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 1   | 最后一段连接线靠 `:last-child` 断开         | 都用 `v-if` 渲染真实节点（`wd-step` 判 `index < childrenLength - 1`，`u-step` 判 `showLine`） | 连接线改为真实 `<view>` + `showLine`，删掉 `::after` 与伪类（WXSS 选择器白名单里没有伪类） |
| 2   | 横向等分宽度靠父级 scoped 后代选择器        | `wd-step` 在自身 `rootStyle` 写 `width: 100/n%`，`u-step` 在自身写 `flex: 1 0 auto`           | 移到 `.snake-step--horizontal { flex: 1 1 0 }`，跨组件作用域失效也不会挤到左侧             |
| 3   | 已完成与进行中视觉完全相同                  | `wd-step` 已完成画对勾、异常画叉；`u-step` 已完成/进行中画对勾                                | 已完成 `checkmark`、异常 `close`；`icon` 与 `#icon` 优先级更高                             |
| 4   | 没有点状模式                                | `wd-steps` 有 `dot`，`u-steps` 默认就是 `dot`                                                 | 新增 `dot`：已完成实心、进行中空心环、未开始描边                                           |
| 5   | `alignCenter` 不生效（横向本来就居中）      | `wd-steps` 默认左对齐、`alignCenter` 才居中                                                   | 默认改 `true`（保持既有视觉），`false` 时圆点与文字左对齐                                  |
| 6   | `word-break: break-all` 把运单号逐字劈开    | 两家都没用 `break-all`（`u-step` 用 `u-line-1` 单行省略）                                     | 改 `overflow-wrap: break-word`，整词放不下时才换行                                         |
| 7   | 异常态只染圆点，标题仍是正文色              | `wd-step` 异常态标题同为 `danger-main`                                                        | 标题跟随 `--snake-step-status-color`                                                       |
| 8   | 纵向末项多 16px 底部空白；图标字号写死 12px | `wd-step` 无尾留白，图标字号走 `$step-icon-size`                                              | 末项 `padding-bottom: 0`；图标字号改 `--snake-step-icon-size`（13px）                      |

### 与两家的差异（有意为之）

| 点                 | 我们的做法                         | 说明                                                                                                          |
| ------------------ | ---------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 点状模式的进行中   | 空心环 + 2px 描边                  | `wd-step` 是实心点 + 浅色描边（靠明度区分），`u-step` 与已完成同色；空心环区分度最高                          |
| 连接线末端判定     | `parent.children.length` + `index` | 依赖父级子项注册完成；首帧 `index` 为 `-1` 时不画线，挂载后补齐                                               |
| `alignCenter` 默认 | `true`                             | `wd-steps` 默认 `false`（左对齐），Vant 与 `u-steps` 默认居中；电商订单流居中更常见，也是本组件此前的默认视觉 |
| 标题是否跟随状态色 | 只有 `error` 变色                  | `wd-step` / Element Plus 的进行中标题也用主色；这里保守处理，避免整排文字都被染色                             |

## 11. `snake-swipe-action` 二次优化（对照 wot-ui / uView-Pro 的实现方式）

以 `wd-swipe-action`、`u-swipe-action` 为参照重看，**同组互斥是死代码、插槽路由不通、越界拖动有 160px 死区**，属于功能级失效而非观感问题。以下结论均在 H5 用 Playwright 复现并回归。

| #   | 问题                                                                                          | 两家的做法                                                                                                      | 本次修正                                                                                                         |
| --- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 1   | 同组互斥从未生效（`activeClose` 是 `setup()` 局部变量）                                       | `wd-swipe-action` 用模块级 `useQueue` 登记 + `touchstart` 即收起其他；`u-swipe-action` 靠消费方维护 `show` 数组 | 新增 `registry.ts` 模块级登记表，`touchstart` 与 `open()` 都先收起其他项（实测两项可同时停在 -160 → 现只剩一项） |
| 2   | 越界拖动后不重设手势原点，回拉有 160px 死区                                                   | `wd-swipe-action` 越界时 `startDrag(event, false)` 重锚；`u-swipe-action` 交给 `movable-view` 原生边界          | `startOffset = clamped - state.deltaX`，越界贴边后回拉立即跟手                                                   |
| 3   | `#actions` 插槽是死路（`!props.actions.length` 与 `!actionsWidth` 双闸，宽度只由 props 推导） | `wd-swipe-action` 每次 `getRect` 实测左右区宽度；`u-swipe-action` 用 `movable-area` 撑开                        | 左右操作区实测宽度，props 推导值仅作兜底（实测插槽行展开 176px 而非 0）                                          |
| 4   | 按钮区压在内容底下，靠不透明内容遮挡                                                          | `wd-swipe-action` 把左右区放到 `translate3d(±100%)`，在可视区外                                                 | 同款结构；`--snake-swipe-action-bg` 默认值由白底改为 `transparent`，内容透明也不再透出按钮                       |
| 5   | 只有右侧按钮                                                                                  | `wd-swipe-action` 有 `#left` / `#right`；`u-swipe-action` 只有右侧                                              | 新增 `leftActions` 与 `#left`，`v-model` 状态含 `'left'`                                                         |
| 6   | 无受控状态、无关闭前拦截                                                                      | `wd-swipe-action` 有 `v-model` + `beforeClose`；`u-swipe-action` 只有 `show`                                    | 新增 `modelValue: 'close' \| 'left' \| 'right'` 与 `beforeClose(reason, position)`                               |
| 7   | `threshold` 未钳制（大于按钮总宽时永远打不开）；`open`/`close` 事件不幂等                     | `u-swipe-action` 用 1/4 展开、3/4 收起双阈值；`wd-swipe-action` 固定 0.3                                        | `limit = Math.min(threshold, width)`；停留状态与位移解耦，只在状态真正变化时派发事件                             |

### 与两家的差异（有意为之）

| 点             | 我们的做法                                | 说明                                                                                                     |
| -------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 关闭前拦截放行 | 必须明确 `true` / `resolve(true)`         | 与库内 `snake-tabbar.beforeSwitch` 的既有约定一致；`wd-swipe-action` 同款，`u-swipe-action` 没有拦截能力 |
| 插槽按钮高度   | 侧边容器 `top:0;bottom:0` + flex 拉伸     | `wd-swipe-action` 的示例要自己写 `height:100%`；这里按钮不用管高度                                       |
| 停留阈值       | 单一阈值，默认按钮宽一半                  | `u-swipe-action` 用 25%/75% 双阈值（迟滞）；单一阈值在 320–414px 各屏行为一致，状态机也少一半            |
| 点击内容区     | 收起并拦下冒泡，另派发 `contentClick`     | `wd-swipe-action` 派发 `click({ value: 'inside' })`；这里保持原"只收起"语义，避免与按钮点击混淆          |
| 动画曲线       | 300ms `cubic-bezier(0.18, 0.89, 0.32, 1)` | `wd-swipe-action` 固定 600ms；列表项上 600ms 偏慢，且时长仍需可配                                        |
