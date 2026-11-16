---
preview: /pages/componentsA/picker/index
---

# Picker 列选择器

用于单列、多列、多列联动的选择场景，基于原生 picker-view 与 Popup 实现，底部弹出。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-picker v-model="show" :list="list" @confirm="handleConfirm" @cancel="handleCancel" />
```

```ts
// 单列
const list = [
    { label: '选项一', value: 'a' },
    { label: '选项二', value: 'b' }
];
// 多列联动
const cascade = [{ label: '华东', value: 'east', children: [{ label: '上海', value: 'sh' }] }];
```

## 模式与回传

- `single-column` 单列；`mutil-column` 多列（list 为二维数组）；`mutil-column-auto` 多列联动（按 `childName` 级联）。
- `confirm` / `cancel` / `change` 回调统一携带 `[{ value, label, extra? }]` 数组。
- `change` 在滚动过程中每次落定后触发，适合做实时预览；`confirm` 只在点击确认时触发。
- `close` 在点击遮罩等非确认/取消方式关闭时触发。
- `preserveSelection` 为 true（默认）时，下次打开保留上次确认的选择。

## 多列联动

联动模式使用树形数据；每一列变化后会根据 `child-name` 生成下一列。确认结果始终按列返回。

```vue
<snake-picker v-model="show" :list="regions" mode="mutil-column-auto" @confirm="onConfirm" />
```

```ts
const regions = [
    {
        label: '华东',
        value: 'east',
        children: [
            { label: '上海', value: 'sh' },
            { label: '杭州', value: 'hz' }
        ]
    }
];

function onConfirm(values) {
    // values: [{ value: 'east', label: '华东' }, { value: 'sh', label: '上海' }]
}
```

## 受控打开与默认值

`v-model` 只控制弹层显示，选择结果由 `confirm`/`cancel` 接收。首次打开可用 `default-value` 指定各列下标；需要每次按默认值重置时设置 `:preserve-selection="false"`。

组件实例暴露 `open()` / `close()`，适合「工具栏按钮打开选择器」的场景：

```vue
<snake-picker ref="selectRef" v-model="show" :list="list" />
<snake-button @click="selectRef?.open()">选择</snake-button>
```

```ts
import type { PickerExpose } from '@puresnake/snake-ui/components/snake-picker/types';

const selectRef = ref<PickerExpose | null>(null);
```

## 行高与可见行数

`item-height` 决定滚轮每一行的高度，`visible-item-count` 决定可见行数，弹层高度 = 两者相乘。

```vue
<snake-picker v-model="show" :list="list" :item-height="52" :visible-item-count="5" />
```

默认 `44px × 6 行`。行高在 H5 通过 `--picker-view-column-indicator-height` 生效，运行时切换会在下次打开时应用。

## 样式

选中行的视觉由三层叠加而成：中间一条圆角浅色条 + 选中项字重加粗，滚轮上下再盖一层「表面色 → 透明」的渐变遮罩，越靠近选中框越透明，所以相邻选项始终读得清。浅色条会跟着明暗主题取值，不用逐端适配。

| 元素       | 默认表现                                                                | 覆盖方式                                                                                      |
| ---------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 面板圆角   | 顶部 `--snake-radius-large`（10px），由 `round` 交给 `snake-popup` 绘制 | `:round="false"` 直角，或 `:round="24"` 自定义                                                |
| 选中框底色 | `--snake-color-background` 极浅色条，左右内缩 12px、圆角 6px            | `--snake-picker-roller-bg` / `--snake-picker-roller-inset-x` / `--snake-picker-roller-radius` |
| 选中项文字 | 与其它选项同色，字重加粗到 600                                          | `--snake-picker-item-active-color` / `--snake-picker-item-active-font-weight`                 |
| 渐变遮罩   | 表面色渐变到透明，跟随明暗主题                                          | `--snake-picker-mask-color`                                                                   |
| 工具栏     | 44px 高，标题 15px/600，操作按钮 16px，左右按钮各留 16px 内边距         | `--snake-picker-toolbar-*` / `--snake-picker-title-*`                                         |
| 长文案     | 单行省略，选项左右各留 12px 内边距                                      | `--snake-picker-item-padding-x`                                                               |

选中框上下默认**不画** hairline（色条已经有边界）。想要 iOS / uView 那种「只有两条线」的样式，把底色关掉、再给 hairline 一个颜色：

```vue
<snake-picker v-model="show" :list="list" class="line-picker" />
```

```css
.line-picker {
    --snake-picker-roller-bg: transparent;
    --snake-picker-indicator-border-color: var(--snake-color-border, #dcdfe6);
}
```

## 异步校验

`before-confirm` 在关闭前执行：只有**显式** `return true` 或 resolve `true` 才会关闭并派发 `confirm`；返回 `false`、不返回值、抛错都会保持弹层打开，等待期间确认按钮置灰。

```vue
<snake-picker v-model="show" :list="list" :before-confirm="beforeConfirm" @confirm="onConfirm" />
```

```ts
async function beforeConfirm(values) {
    // values: [{ value, label }]
    const ok = await checkRemote(values); // 远程校验
    return ok; // 返回 false 时弹层保持打开
}
```

## 空态

`list` 无可用数据时不渲染滚轮，改为展示 `--snake-picker-empty-*` 样式的空态文案，默认取语言包（`暂无数据` / `No data`），可用 `empty-text` 覆盖。

## 禁用

`disabled` 会阻止 `open()`；放进 `snake-form-item` 后还会跟随表单项与整表的 `disabled`。

## 表单联动

确认成功后组件会触发 `snake-form-item` 的 `change` 校验，配合 `required` 规则即可做到「选完即校验」：

```vue
<snake-form :model="form" :rules="rules">
    <snake-form-item label="收件城市" prop="city" required>
        <view @click="show = true">{{ form.city || '请选择' }}</view>
        <snake-picker v-model="show" :list="list" @confirm="onConfirm" />
    </snake-form-item>
</snake-form>
```

```ts
const form = reactive({ city: '' });
const rules = { city: [{ required: true, message: '请选择收件城市' }] };

function onConfirm(values) {
    form.city = values[0].value;
    // 组件随后会自动触发该表单项的 change 校验
}
```

## API

### Props

| 参数                  | 说明                                                                                          | 类型                             | 默认值          |
| --------------------- | --------------------------------------------------------------------------------------------- | -------------------------------- | --------------- |
| `customStyle`         | 根节点自定义样式                                                                              | `StyleValue`                     | `''`            |
| `customClass`         | 根节点自定义类名                                                                              | `string`                         | `''`            |
| `list`                | 列数据，`mutil-column` 模式为二维数组                                                         | `PickerItem[] \| PickerItem[][]` | `[]`            |
| `border`              | 是否显示工具栏底部分隔线                                                                      | `boolean`                        | `true`          |
| `round`               | 面板圆角，`true` 取 `--snake-radius-large`，数字/字符串按 CSS 尺寸，`false` 为直角            | `boolean \| number \| string`    | `true`          |
| `modelValue`          | 双向绑定控制选择器的弹出与收起（v-model）                                                     | `boolean`                        | `false`         |
| `cancelColor`         | 取消按钮的颜色                                                                                | `string`                         | 主题次要文字色  |
| `confirmColor`        | 确认按钮的颜色                                                                                | `string`                         | 主题色          |
| `zIndex`              | 弹出时的层级，`0` 表示使用弹层默认层级                                                        | `UnitValue`                      | `0`             |
| `safeAreaInsetBottom` | 是否开启底部安全区适配                                                                        | `boolean`                        | `false`         |
| `maskCloseAble`       | 是否允许通过点击遮罩关闭选择器                                                                | `boolean`                        | `true`          |
| `rootPortal`          | 是否把弹层传送到页面根节点渲染，避免被祖先的 `transform`、`overflow` 裁剪                     | `boolean`                        | `false`         |
| `disabled`            | 是否禁用选择器，禁用后无法打开                                                                | `boolean`                        | `false`         |
| `defaultValue`        | 默认选中的下标数组                                                                            | `number[]`                       | `[0]`           |
| `preserveSelection`   | 是否保留用户上次确认的选择                                                                    | `boolean`                        | `true`          |
| `mode`                | 模式，可选值 `single-column`（单列）/ `mutil-column`（多列）/ `mutil-column-auto`（多列联动） | `PickerMode`                     | `single-column` |
| `valueName`           | 自定义 value 属性名                                                                           | `string`                         | `'value'`       |
| `labelName`           | 自定义 label 属性名                                                                           | `string`                         | `'label'`       |
| `childName`           | 自定义多列联动模式的 children 属性名                                                          | `string`                         | `'children'`    |
| `itemHeight`          | 每一行选项的高度，单位 px（375 设计稿）                                                       | `number`                         | `44`            |
| `visibleItemCount`    | 可见行数，与 `itemHeight` 共同决定弹层高度                                                    | `number`                         | `6`             |
| `beforeConfirm`       | 确认前拦截器，需显式返回 `true` 才会关闭                                                      | `PickerBeforeConfirm`            | -               |
| `title`               | 顶部标题                                                                                      | `string`                         | `''`            |
| `cancelText`          | 取消按钮的文字                                                                                | `string`                         | 语言包默认值    |
| `confirmText`         | 确认按钮的文字                                                                                | `string`                         | 语言包默认值    |
| `emptyText`           | 无选项时的空态文案                                                                            | `string`                         | 语言包默认值    |

### Events

| 事件名              | 触发时机                 | 参数                         |
| ------------------- | ------------------------ | ---------------------------- |
| `update:modelValue` | 弹出/收起                | `boolean`                    |
| `open`              | 弹层打开                 | -                            |
| `change`            | 滚动过程中选中项变化     | `[{ value, label, extra? }]` |
| `confirm`           | 点击确认按钮             | `[{ value, label, extra? }]` |
| `cancel`            | 点击取消按钮             | `[{ value, label, extra? }]` |
| `close`             | 点击遮罩等非按钮方式关闭 | -                            |

### Methods

| 方法名  | 说明                                      | 参数 | 返回值 |
| ------- | ----------------------------------------- | ---- | ------ |
| `open`  | 打开选择器（需要绑定 `v-model` 才能生效） | -    | -      |
| `close` | 关闭选择器                                | -    | -      |

## 主题变量

| 变量                                     | 用途                                       |
| ---------------------------------------- | ------------------------------------------ |
| `--snake-color-primary`                  | 默认确认按钮颜色                           |
| `--snake-color-text`                     | 当前选项文字颜色                           |
| `--snake-color-text-secondary`           | 默认取消按钮颜色                           |
| `--snake-color-border`                   | 可选：选中框上下 hairline 颜色（默认不画） |
| `--snake-color-divider`                  | 工具栏分隔线颜色                           |
| `--snake-color-surface`                  | 选择器背景、渐变遮罩颜色                   |
| `--snake-color-background`               | 选中框底色                                 |
| `--snake-radius-large`                   | `round` 为 `true` 时的面板圆角             |
| `--snake-picker-panel-bg`                | 面板背景                                   |
| `--snake-picker-body-bg`                 | 滚轮区背景                                 |
| `--snake-picker-toolbar-height`          | 工具栏高度，默认 `44px`                    |
| `--snake-picker-toolbar-font-size`       | 工具栏按钮字号，默认 `16px`                |
| `--snake-picker-toolbar-padding-x`       | 工具栏按钮左右内边距，默认 `16px`          |
| `--snake-picker-title-font-size`         | 标题字号，默认 `15px`                      |
| `--snake-picker-title-font-weight`       | 标题字重，默认 `600`                       |
| `--snake-picker-title-color`             | 标题颜色                                   |
| `--snake-picker-divider-color`           | 工具栏分隔线颜色                           |
| `--snake-picker-item-font-size`          | 选项字号，默认 `16px`                      |
| `--snake-picker-item-color`              | 选项颜色                                   |
| `--snake-picker-item-padding-x`          | 选项左右内边距，默认 `12px`                |
| `--snake-picker-item-active-color`       | 选中项文字颜色                             |
| `--snake-picker-item-active-font-weight` | 选中项字重，默认 `600`                     |
| `--snake-picker-roller-bg`               | 选中框底色，设为 `transparent` 即关闭      |
| `--snake-picker-roller-inset-x`          | 选中框左右内缩，默认 `12px`                |
| `--snake-picker-roller-radius`           | 选中框圆角，默认 `6px`                     |
| `--snake-picker-indicator-border-color`  | 可选：选中框上下 hairline 颜色             |
| `--snake-picker-mask-color`              | 滚轮渐变遮罩颜色，默认表面色               |
| `--snake-picker-empty-color`             | 空态文字颜色                               |
| `--snake-picker-empty-font-size`         | 空态字号，默认 `14px`                      |
| `--snake-picker-pending-opacity`         | 等待拦截器时确认按钮透明度                 |

`confirmColor` 和 `cancelColor` 可以覆盖单个实例的操作颜色；其余变量可通过 `custom-class` 或全局主题覆盖。
