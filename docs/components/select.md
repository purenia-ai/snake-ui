---
preview: /pages/componentsA/select/index
---

# Select 列选择器

用于单列、多列、多列联动的选择场景，基于原生 picker-view 与 Popup 实现，底部弹出。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-select v-model="show" :list="list" @confirm="handleConfirm" @cancel="handleCancel" />
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
- `confirm` / `cancel` 回调携带 `[{ value, label, extra? }]` 数组。
- `close` 在点击遮罩等非确认/取消方式关闭时触发。
- `preserveSelection` 为 true（默认）时，下次打开保留上次确认的选择。

## 多列联动

联动模式使用树形数据；每一列变化后会根据 `child-name` 生成下一列。确认结果始终按列返回。

```vue
<snake-select v-model="show" :list="regions" mode="mutil-column-auto" @confirm="onConfirm" />
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

## API

### Props

| 参数                  | 说明                                                                                          | 类型                             | 默认值          |
| --------------------- | --------------------------------------------------------------------------------------------- | -------------------------------- | --------------- |
| `customStyle`         | 根节点自定义样式                                                                              | `StyleValue`                     | `''`            |
| `customClass`         | 根节点自定义类名                                                                              | `string`                         | `''`            |
| `list`                | 列数据，`mutil-column` 模式为二维数组                                                         | `SelectItem[] \| SelectItem[][]` | `[]`            |
| `border`              | 是否显示边框（当前版本未参与渲染，仅作声明保留）                                              | `boolean`                        | `true`          |
| `modelValue`          | 双向绑定控制选择器的弹出与收起（v-model）                                                     | `boolean`                        | `false`         |
| `cancelColor`         | 取消按钮的颜色                                                                                | `string`                         | 主题次要文字色  |
| `confirmColor`        | 确认按钮的颜色                                                                                | `string`                         | 主题色          |
| `zIndex`              | 弹出时的层级，`0` 表示使用弹层默认层级                                                        | `UnitValue`                      | `0`             |
| `safeAreaInsetBottom` | 是否开启底部安全区适配                                                                        | `boolean`                        | `false`         |
| `maskCloseAble`       | 是否允许通过点击遮罩关闭选择器                                                                | `boolean`                        | `true`          |
| `defaultValue`        | 默认选中的下标数组                                                                            | `number[]`                       | `[0]`           |
| `preserveSelection`   | 是否保留用户上次确认的选择                                                                    | `boolean`                        | `true`          |
| `mode`                | 模式，可选值 `single-column`（单列）/ `mutil-column`（多列）/ `mutil-column-auto`（多列联动） | `SelectMode`                     | `single-column` |
| `valueName`           | 自定义 value 属性名                                                                           | `string`                         | `'value'`       |
| `labelName`           | 自定义 label 属性名                                                                           | `string`                         | `'label'`       |
| `childName`           | 自定义多列联动模式的 children 属性名                                                          | `string`                         | `'children'`    |
| `title`               | 顶部标题                                                                                      | `string`                         | `''`            |
| `cancelText`          | 取消按钮的文字                                                                                | `string`                         | 语言包默认值    |
| `confirmText`         | 确认按钮的文字                                                                                | `string`                         | 语言包默认值    |

### Events

| 事件名              | 触发时机                 | 参数                         |
| ------------------- | ------------------------ | ---------------------------- |
| `update:modelValue` | 弹出/收起                | `boolean`                    |
| `confirm`           | 点击确认按钮             | `[{ value, label, extra? }]` |
| `cancel`            | 点击取消按钮             | `[{ value, label, extra? }]` |
| `close`             | 点击遮罩等非按钮方式关闭 | -                            |
| `click`             | 点击触发入口（兼容声明） | -                            |

## 主题变量

| 变量                           | 用途             |
| ------------------------------ | ---------------- |
| `--snake-color-primary`        | 默认确认按钮颜色 |
| `--snake-color-text`           | 当前选项文字颜色 |
| `--snake-color-text-secondary` | 默认取消按钮颜色 |
| `--snake-color-border`         | 工具栏分隔线     |
| `--snake-color-surface`        | 选择器背景       |
| `--snake-color-surface-rgb`    | 滚轮遮罩渐变背景 |

`confirmColor` 和 `cancelColor` 可以覆盖单个实例的操作颜色。
