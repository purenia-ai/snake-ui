---
name: 'select-picker'
description: 'Snake UI SelectPicker 单复选选择器参考。处理 select-picker、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['select-picker', 'snake-select-picker', 'SelectPicker', '单复选选择器']
---

# SelectPicker 单复选选择器

底部弹层内以列表勾选：默认单选，开 `multiple` 变多选。组件自带标题、关闭、本地搜索、选择数量上下限、确认栏与异步确认，触发入口由页面自己放（通常是一个 [cell](/components/cell)）。

和 [picker](/components/picker) 的区别：`snake-picker` 是滚轮列选择、`v-model` 只控制开合；`snake-select-picker` 是列表勾选，`v-model` 就是选中值，`v-model:visible` 控制开合。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-cell title="选择城市" :value="cityLabel || '请选择'" is-link @click="show = true" />
<snake-select-picker v-model="city" v-model:visible="show" :list="cities" title="选择城市" />
```

```ts
const cities = [
    { value: 'sh', label: '上海' },
    { value: 'hz', label: '杭州' },
    { value: 'bj', label: '北京' }
];
const city = ref('');
const show = ref(false);
const cityLabel = computed(() => cities.find(item => item.value === city.value)?.label ?? '');
```

单选默认「点选即提交」：不给 `show-confirm` 时单选没有确认栏，点中一行就派发 `confirm` 并关闭。需要两步确认时加 `:show-confirm="true"`。

## 多选与数量限制

```vue
<snake-select-picker v-model="tags" v-model:visible="show" :list="tags" multiple :min="1" :max="3" title="选择标签" />
```

- `v-model` 在多选时是数组。
- 达到 `max` 后未选项自动置灰不可点；`max` 为 `0`（默认）表示不限。
- 未满足 `min` 时确认按钮禁用，底部显示提示（`min-text` 可覆盖，`{n}` 会替换为 `min`）。
- 未确认就关掉弹层（遮罩、关闭图标、`close()`）时草稿丢弃，`v-model` 保持原值。

## 搜索

```vue
<snake-select-picker v-model="city" v-model:visible="show" :list="cities" filterable />
```

`filterable` 开启本地搜索：按 `label` 做大小写不敏感的包含匹配，命中片段高亮；过滤不会改变已选集合，提交时仍以草稿为准。关键字为空时展示 `empty-text`，有值但无结果时展示 `no-match-text`。

## 异步确认

`before-confirm` 在提交前执行：只有**显式** `return true` 或 resolve `true` 才会提交并关闭；返回 `false`、不返回值、抛错都会保持弹层打开，等待期间确认按钮显示加载态。

```vue
<snake-select-picker v-model="ids" v-model:visible="show" :list="list" multiple :before-confirm="beforeConfirm" />
```

```ts
async function beforeConfirm(value) {
    // value：单选为标量，多选为数组
    return await checkRemote(value); // 返回 false 时弹层保持打开
}
```

## 加载与空态

- `loading` 时内容区盖一层加载遮罩，选项与确认按钮都不可用。
- `list` 为空时展示空态文案（默认取语言包 `暂无数据` / `No data`），可用 `empty-text` 覆盖。
- 选项自带 `disabled: true` 时该行置灰不可点；字段名可用 `disabled-name` 改。

## 外观

- 头部 48px：左侧标题、右侧关闭图标。
- 行高 44px：文案在左、指示器在右；多选是圆角方框 + 对勾，单选是圆圈 + 圆点。
- 列表区最大高度由 `max-height` 控制（默认 `264px`，约 6 行），超出滚动。
- 选中色取主题主色，可用 `active-color` 按实例覆盖。

## API

### Props

| 参数                  | 说明                                                                  | 类型                          | 默认值       |
| --------------------- | --------------------------------------------------------------------- | ----------------------------- | ------------ |
| `customStyle`         | 根节点自定义样式                                                      | `StyleValue`                  | `''`         |
| `customClass`         | 根节点自定义类名                                                      | `string`                      | `''`         |
| `modelValue`          | 选中值，单选为标量、多选为数组（v-model）                             | `SelectPickerValue`           | `undefined`  |
| `visible`             | 弹层开合（v-model:visible）                                           | `boolean`                     | `false`      |
| `list`                | 选项数据                                                              | `SelectPickerItem[]`          | `[]`         |
| `multiple`            | 是否多选，开启后 `modelValue` 为数组                                  | `boolean`                     | `false`      |
| `valueName`           | 值字段名                                                              | `string`                      | `'value'`    |
| `labelName`           | 文案字段名                                                            | `string`                      | `'label'`    |
| `disabledName`        | 禁用字段名                                                            | `string`                      | `'disabled'` |
| `title`               | 弹层标题                                                              | `string`                      | 语言包默认值 |
| `confirmText`         | 确认按钮文案                                                          | `string`                      | 语言包默认值 |
| `showConfirm`         | 是否显示确认栏；不传时单选为 `false`（点选即提交）、多选为 `true`     | `boolean`                     | `undefined`  |
| `min`                 | 多选最少选中数，单选忽略                                              | `number`                      | `0`          |
| `max`                 | 多选最多选中数，`0` 为不限，单选忽略                                  | `number`                      | `0`          |
| `filterable`          | 是否开启本地搜索                                                      | `boolean`                     | `false`      |
| `filterPlaceholder`   | 搜索框占位文案                                                        | `string`                      | 语言包默认值 |
| `loading`             | 加载态，遮罩内容区并禁用确认                                          | `boolean`                     | `false`      |
| `emptyText`           | 空数据文案                                                            | `string`                      | 语言包默认值 |
| `noMatchText`         | 搜索无结果文案                                                        | `string`                      | 语言包默认值 |
| `minText`             | 未达 `min` 的提示文案，`{n}` 替换为 `min`                             | `string`                      | 语言包默认值 |
| `beforeConfirm`       | 确认前拦截器，需显式返回 `true` 才会提交                              | `SelectPickerBeforeConfirm`   | -            |
| `scrollIntoView`      | 打开时是否滚动到首个已选项                                            | `boolean`                     | `true`       |
| `closeOnClickOverlay` | 是否允许点击遮罩关闭（未确认则回滚）                                  | `boolean`                     | `true`       |
| `safeAreaInsetBottom` | 是否开启底部安全区适配                                                | `boolean`                     | `true`       |
| `rootPortal`          | 是否把弹层传送到页面根节点，避免被祖先的 `transform`、`overflow` 裁剪 | `boolean`                     | `false`      |
| `round`               | 面板圆角，`true` 取 `--snake-radius-large`，`false` 为直角            | `boolean \| number \| string` | `true`       |
| `maxHeight`           | 列表区最大高度，单位 px（375 设计稿）                                 | `number`                      | `264`        |
| `activeColor`         | 选中色，缺省取主题主色                                                | `string`                      | `''`         |
| `disabled`            | 是否禁用整组件，禁用后无法打开                                        | `boolean`                     | `false`      |
| `zIndex`              | 弹出时的层级，`0` 表示使用弹层默认层级                                | `number \| string`            | `0`          |

### Events

| 事件名              | 触发时机                                 | 参数                                         |
| ------------------- | ---------------------------------------- | -------------------------------------------- |
| `update:modelValue` | 确认提交                                 | `value`：单选标量 / 多选数组                 |
| `update:visible`    | 打开或关闭弹层                           | `boolean`                                    |
| `open`              | 打开动画完成                             | -                                            |
| `change`            | 草稿变化（多选每次勾选、单选点选时）     | `value`、`items`（按 `list` 顺序的已选选项） |
| `confirm`           | 确认提交                                 | `value`、`items`                             |
| `close`             | 弹层关闭后（含确认关闭、遮罩与关闭图标） | -                                            |

### Methods

| 方法名  | 说明                                    | 参数 | 返回值 |
| ------- | --------------------------------------- | ---- | ------ |
| `open`  | 打开弹层（需要绑定 `visible` 才能生效） | -    | -      |
| `close` | 关闭弹层并丢弃未确认的草稿              | -    | -      |

## 无障碍

- 每一行带 `role="checkbox"` / `role="radio"` 与 `aria-checked`、`aria-disabled`。
- 关闭图标是 `role="button"` 并带 `aria-label`（取语言包 `关闭` / `Close`）。
- 禁用整组件时根节点带 `aria-disabled="true"`。

## 主题变量

| 变量                                             | 用途                              |
| ------------------------------------------------ | --------------------------------- |
| `--snake-color-primary`                          | 默认选中色、确认按钮颜色          |
| `--snake-color-text`                             | 选项文字颜色                      |
| `--snake-color-text-muted`                       | 关闭图标、禁用项与空态文字颜色    |
| `--snake-color-border`                           | 指示器未选中描边颜色              |
| `--snake-color-divider`                          | 头部分隔线颜色                    |
| `--snake-color-surface`                          | 面板背景                          |
| `--snake-color-surface-muted`                    | 行按下态背景                      |
| `--snake-color-error`                            | `min` 提示文字颜色                |
| `--snake-radius-large`                           | `round` 为 `true` 时的面板圆角    |
| `--snake-select-picker-bg`                       | 面板背景                          |
| `--snake-select-picker-header-height`            | 头部高度，默认 `48px`             |
| `--snake-select-picker-header-padding-x`         | 头部与行的左右内边距，默认 `16px` |
| `--snake-select-picker-title-font-size`          | 标题字号，默认 `16px`             |
| `--snake-select-picker-title-font-weight`        | 标题字重，默认 `600`              |
| `--snake-select-picker-title-color`              | 标题颜色                          |
| `--snake-select-picker-close-size`               | 关闭按钮尺寸，默认 `24px`         |
| `--snake-select-picker-close-color`              | 关闭图标颜色                      |
| `--snake-select-picker-search-padding-y`         | 搜索区上内边距，默认 `8px`        |
| `--snake-select-picker-item-height`              | 行高，默认 `44px`                 |
| `--snake-select-picker-item-padding-y`           | 行上下内边距，默认 `10px`         |
| `--snake-select-picker-item-font-size`           | 选项字号，默认 `14px`             |
| `--snake-select-picker-item-color`               | 选项文字颜色                      |
| `--snake-select-picker-item-hover-bg`            | 行按下态背景                      |
| `--snake-select-picker-active-color`             | 选中项文字、命中片段与指示器颜色  |
| `--snake-select-picker-disabled-color`           | 禁用项文字颜色                    |
| `--snake-select-picker-indicator-size`           | 指示器尺寸，默认 `18px`           |
| `--snake-select-picker-indicator-radius`         | 多选指示器圆角，默认 `4px`        |
| `--snake-select-picker-indicator-border-color`   | 未选中指示器描边颜色              |
| `--snake-select-picker-indicator-disabled-color` | 禁用指示器描边颜色                |
| `--snake-select-picker-indicator-color`          | 对勾与单选圆点颜色，默认白色      |
| `--snake-select-picker-dot-size`                 | 单选圆点尺寸，默认 `8px`          |
| `--snake-select-picker-empty-color`              | 空态文字颜色                      |
| `--snake-select-picker-empty-font-size`          | 空态字号，默认 `14px`             |
| `--snake-select-picker-empty-padding-y`          | 空态上下内边距，默认 `32px`       |
| `--snake-select-picker-loading-mask`             | 加载遮罩颜色，默认半透明白        |
| `--snake-select-picker-footer-padding-y`         | 底栏上下内边距，默认 `8px`        |
| `--snake-select-picker-tip-color`                | `min` 提示文字颜色                |
| `--snake-select-picker-tip-font-size`            | `min` 提示字号，默认 `12px`       |

`activeColor` 可以按实例覆盖选中色；其余变量可通过 `custom-class` 或全局主题覆盖。
