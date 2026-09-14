---
name: 'calendar'
description: 'Snake UI Calendar 日历参考。处理 calendar、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['calendar', 'snake-calendar', 'Calendar', '日历']
---

# Calendar 日历

用于单个日期或日期范围的选择，日历被包裹在底部弹起的容器中，支持农历、内置/自定义节日、节假日标记与打卡签到。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<snake-calendar v-model="show" :mode="mode" @change="handleChange" />
```

## 范围与农历

```vue
<snake-calendar v-model="show" mode="range" show-lunar />
```

- `mode="date"` 单选：change 载荷为 `{ year, month, day, days, result, week, isToday, lunar }`。
- `mode="range"` 范围：change 载荷为 `{ startYear..., startDate, startWeek, endYear..., endDate, endWeek, startLunar, endLunar }`。
- `minDate`/`maxDate` 之外日期禁用；`defaultSelectToday` 初始化时默认选中今天（优先级低于 defaultDate/startDate/endDate）。
- `close` 在点击遮罩或关闭按钮收起时触发。
- `isPage` 为 true 时以页面内联方式展示，不使用弹窗，选择完成自动触发 change。

## 自定义日期内容

设置 `use-date-slot` 后，可用 `date` 插槽渲染日期下方的补充信息。插槽参数 `date` 为当前日期信息，适合展示价格、库存或签到状态。

```vue
<snake-calendar v-model="show" use-date-slot :checked-dates="['2026-09-14']">
  <template #date="{ date }">
    <text v-if="date.isToday" class="calendar-tip">今天</text>
  </template>
</snake-calendar>
```

`is-page` 适合嵌入预订、签到等页面；此模式不显示弹层标题和遮罩，外层不需要再维护打开/关闭状态。

## API

### Props

| 参数                                 | 说明                                      | 类型                        | 默认值                               |
| ------------------------------------ | ----------------------------------------- | --------------------------- | ------------------------------------ |
| `modelValue`                         | 双向绑定控制弹出与收起                    | `boolean`                   | `false`                              |
| `mode`                               | 选择模式                                  | `date \| range`             | `date`                               |
| `changeYear` / `changeMonth`         | 是否显示年份/月份切换按钮                 | `boolean`                   | `true`                               |
| `maxYear` / `minYear`                | 可切换的最大/最小年份                     | `number \| string`          | `2050` / `1950`                      |
| `minDate` / `maxDate`                | 最小/最大可选日期                         | `number \| string`          | `1950-01-01` / 今天                  |
| `defaultDate`                        | 默认选中的日期，mode 为 date 时生效       | `string`                    | `''`                                 |
| `startDate` / `endDate`              | 默认开始/结束日期，mode 为 range 时生效   | `string`                    | `''`                                 |
| `defaultSelectToday`                 | 初始化时是否默认选中今天                  | `boolean`                   | `true`                               |
| `showLunar`                          | 是否显示农历                              | `boolean`                   | `false`                              |
| `showFestival`                       | 是否显示内置节日                          | `boolean`                   | `false`                              |
| `festivals`                          | 节日配置 `{ '04-04': '清明节' }`          | `object`                    | `{}`                                 |
| `holidays` / `workdays`              | 节假日/加班日列表                         | `string[]`                  | `[]`                                 |
| `checkinMode`                        | 是否启用打卡签到模式                      | `boolean`                   | `false`                              |
| `checkedDates`                       | 已打卡日期列表                            | `string[]`                  | `[]`                                 |
| `todayChecked`                       | 今日是否已打卡                            | `boolean`                   | `false`                              |
| `color`                              | 默认日期字体颜色                          | `string`                    | `--snake-color-text`                 |
| `activeBgColor` / `activeColor`      | 选中日期背景/字体颜色                     | `string`                    | `--snake-color-primary` / white      |
| `rangeBgColor` / `rangeColor`        | 范围内日期背景/字体颜色                   | `string`                    | 主题色浅色 / `--snake-color-primary` |
| `monthArrowColor` / `yearArrowColor` | 月/年切换箭头颜色                         | `string`                    | 文本次要色 / 文本弱化色              |
| `startText` / `endText`              | 起始/结束日期自定义文案                   | `string`                    | 语言包默认值                         |
| `btnType`                            | 确定按钮样式类型                          | `string`                    | `primary`                            |
| `toolTip`                            | 顶部提示文字                              | `string`                    | 语言包默认值                         |
| `closeable`                          | 是否显示右上角关闭图标                    | `boolean`                   | `true`                               |
| `isPage`                             | 是否在页面中直接显示，不使用弹窗          | `boolean`                   | `false`                              |
| `readonly`                           | 是否只读，只读模式下禁止选择              | `boolean`                   | `false`                              |
| `isChange`                           | 切换年月是否触发事件，mode 为 date 时生效 | `boolean`                   | `false`                              |
| `isActiveCurrent`                    | 当前选中日期带选中效果                    | `boolean`                   | `true`                               |
| `borderRadius`                       | 弹窗顶部左右两边的圆角值                  | `number \| string`          | `20`                                 |
| `zIndex`                             | 弹出层级，0 使用弹层默认层级              | `number \| string`          | `0`                                  |
| `maskCloseAble`                      | 是否允许点击遮罩关闭                      | `boolean`                   | `true`                               |
| `safeAreaInsetBottom`                | 是否开启底部安全区适配                    | `boolean`                   | `false`                              |
| `useDateSlot`                        | 是否启用自定义日期内容插槽                | `boolean`                   | `false`                              |
| `customClass` / `customStyle`        | 自定义类名和样式                          | `string \| object \| array` | `''`                                 |

### Events

| 事件名              | 触发时机                     | 参数                    |
| ------------------- | ---------------------------- | ----------------------- |
| `update:modelValue` | 弹出/收起                    | `boolean`               |
| `change`            | 选择结果变化                 | date/range 载荷（见上） |
| `close`             | 点击遮罩或关闭按钮收起       | -                       |
| `input`             | 弹窗通过按钮收起（兼容语义） | `false`                 |

### Slots

| 名称      | 说明                         |
| --------- | ---------------------------- |
| `tooltip` | 替换顶部提示文字             |
| `date`    | 自定义日期内容，携带日期信息 |

## 主题变量

| 变量                           | 用途                       |
| ------------------------------ | -------------------------- |
| `--snake-color-primary`        | 选中日期、范围和工作日标记 |
| `--snake-color-primary-rgb`    | 日期范围浅色背景           |
| `--snake-color-success`        | 今日已打卡状态             |
| `--snake-color-warning`        | 已打卡日期状态             |
| `--snake-color-error`          | 节假日文字                 |
| `--snake-color-white`          | 选中和打卡状态文字         |
| `--snake-color-text`           | 默认日期文字               |
| `--snake-color-text-secondary` | 月份切换与辅助文字         |
| `--snake-color-text-muted`     | 年份切换与弱化文字         |
| `--snake-color-text-light`     | 未打卡日期状态             |
| `--snake-color-border`         | 不可选日期与边界           |
| `--snake-color-surface`        | 日历背景                   |

对应的颜色 Props 可以覆盖单个实例的默认主题值。
