---
preview: /pages/componentsA/badge/index
---

# Badge 徽标

在任意内容右上角挂载数字或圆点徽标，徽标圆心对准角点；无插槽内容时可作独立徽标使用。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

包裹内容即在右上角挂载徽标，超过 `max` 显示 `max+`：

```vue
<snake-badge :value="12" :max="99">
    <text>消息</text>
</snake-badge>
```

## 圆点徽标

`isDot` 忽略内容显示为圆点；`hidden` 可强制隐藏徽标但保留插槽内容：

```vue
<snake-badge is-dot>
    <view class="box">待办</view>
</snake-badge>
```

## 独立徽标

不传插槽时作为独立徽标使用：

```vue
<snake-badge :value="8" />
```

## API

### Props

| 参数                          | 说明                                                                    | 类型               | 默认值     |
| ----------------------------- | ----------------------------------------------------------------------- | ------------------ | ---------- |
| `value`                       | 徽标内容，数字或文本                                                    | `number \| string` | —          |
| `max`                         | 最大值，超过显示 `max+`                                                 | `number`           | —          |
| `isDot`                       | 是否显示为圆点（忽略内容）                                              | `boolean`          | `false`    |
| `showZero`                    | `value` 为 0 时是否仍显示                                               | `boolean`          | `false`    |
| `hidden`                      | 强制隐藏徽标，插槽内容照常渲染                                          | `boolean`          | `false`    |
| `top` / `right`               | 相对角点的偏移，`top` 正值向下，`right` 正值向左，数值单位 px（375 稿） | `number \| string` | `0` / `0`  |
| `bgColor`                     | 徽标背景色                                                              | `string`           | 主题错误色 |
| `color`                       | 徽标文字颜色                                                            | `string`           | `#fff`     |
| `customClass` / `customStyle` | 根节点自定义类和样式                                                    | `string` / 样式值  | 空         |

### Slots

| 插槽名  | 说明                                   |
| ------- | -------------------------------------- |
| default | 徽标挂载的内容；不传时作为独立徽标展示 |

## 主题变量

| 变量名                | 说明       |
| --------------------- | ---------- |
| `--snake-color-error` | 徽标背景色 |
