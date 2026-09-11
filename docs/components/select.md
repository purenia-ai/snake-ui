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

## API

### Props

| 参数                          | 说明                           | 类型                                                 | 默认值                         |
| ----------------------------- | ------------------------------ | ---------------------------------------------------- | ------------------------------ |
| `list`                        | 列数据                         | `array`                                              | `[]`                           |
| `modelValue`                  | 双向绑定控制弹出与收起         | `boolean`                                            | `false`                        |
| `mode`                        | 模式选择                       | `single-column \| mutil-column \| mutil-column-auto` | `single-column`                |
| `labelName` / `valueName`     | 自定义 label/value 属性名      | `string`                                             | `label` / `value`              |
| `childName`                   | 多列联动模式的 children 属性名 | `string`                                             | `children`                     |
| `defaultValue`                | 默认选中的下标数组             | `number[]`                                           | `[0]`                          |
| `preserveSelection`           | 是否保留上次确认的选择         | `boolean`                                            | `true`                         |
| `title`                       | 顶部标题                       | `string`                                             | `''`                           |
| `cancelText` / `confirmText`  | 取消/确认按钮文字              | `string`                                             | 语言包默认值                   |
| `cancelColor`                 | 取消按钮颜色                   | `string`                                             | `--snake-color-text-secondary` |
| `confirmColor`                | 确认按钮颜色                   | `string`                                             | `--snake-color-primary`        |
| `zIndex`                      | 弹出层级，0 使用弹层默认层级   | `number \| string`                                   | `0`                            |
| `maskCloseAble`               | 是否允许点击遮罩关闭           | `boolean`                                            | `true`                         |
| `safeAreaInsetBottom`         | 是否开启底部安全区适配         | `boolean`                                            | `false`                        |
| `customClass` / `customStyle` | 自定义类名和样式               | `string \| object \| array`                          | `''`                           |

### Events

| 事件名              | 触发时机                 | 参数                         |
| ------------------- | ------------------------ | ---------------------------- |
| `update:modelValue` | 弹出/收起                | `boolean`                    |
| `confirm`           | 点击确认按钮             | `[{ value, label, extra? }]` |
| `cancel`            | 点击取消按钮             | `[{ value, label, extra? }]` |
| `close`             | 点击遮罩等非按钮方式关闭 | -                            |

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
