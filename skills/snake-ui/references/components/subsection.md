---
name: 'subsection'
description: 'Snake UI Subsection 分段选择器参考。处理 subsection、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['subsection', 'snake-subsection', 'Subsection', '分段选择器']
---

# Subsection 分段选择器

用于在少量互斥选项之间快速切换，提供胶囊滑块与描边分段两种模式。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 两种形态

| `mode`       | 形态     | 选中态怎么表达                                         |
| ------------ | -------- | ------------------------------------------------------ |
| `button`     | 胶囊滑块 | 浅色轨道里放一颗白色胶囊，滑到选中项下面，文字用主题色 |
| `subsection` | 描边分段 | 整条描边，选中的段落被主题色实心填充，文字反白         |

## 基础用法

```vue
<snake-subsection :list="['待付款', '待发货', '待收货']" :current="current" @change="current = $event" />
```

对象选项可通过 `disabled: true` 禁止切换：

```vue
<snake-subsection
    mode="subsection"
    :list="[{ name: '全部' }, { name: '已完成' }, { name: '已关闭', disabled: true }]"
    :current="current"
    @update:current="current = $event"
/>
```

H5 中当前分段可通过 Tab 聚焦，左右方向键会循环切换，并自动跳过禁用选项。

选中态由组件内部兜底：父级更新 `current` 时以 prop 为准；只用 `:current` 而没监听事件时，点击也会真正切到新项。

```vue
<snake-subsection :list="['全部', '已完成']" :current="0" vibrate-short />
```

## API

### Props

| 参数            | 说明                                                                | 类型                 | 默认值         |
| --------------- | ------------------------------------------------------------------- | -------------------- | -------------- |
| `list`          | 用于渲染的数据列表，字符串或对象选项                                | `SubsectionOption[]` | `[]`           |
| `current`       | 当前激活项索引（v-model:current）                                   | `number \| string`   | `0`            |
| `mode`          | 组件展示模式，可选值 `button`（胶囊滑块）/ `subsection`（描边分段） | `SubsectionMode`     | `button`       |
| `activeColor`   | 激活状态颜色                                                        | `string`             | 主题色         |
| `inactiveColor` | 未激活状态颜色                                                      | `string`             | 主题次要文字色 |
| `fontSize`      | 文字尺寸，数值按 px（375 稿）处理                                   | `UnitValue`          | `15`           |
| `height`        | 组件高度，数值按 px（375 稿）处理                                   | `UnitValue`          | `35`           |
| `animation`     | 是否开启滑块动画                                                    | `boolean`            | `true`         |
| `bold`          | 是否使用粗体文字                                                    | `boolean`            | `true`         |
| `bgColor`       | 背景颜色（胶囊滑块模式下的轨道颜色）                                | `string`             | 主题浅色表面   |
| `buttonColor`   | 胶囊滑块模式下滑块的颜色                                            | `string`             | 主题表面色     |
| `vibrateShort`  | 切换分段时是否触发一次短震动（H5 不支持，其余平台按系统能力生效）   | `boolean`            | `false`        |
| `disabled`      | 禁用整组分段，不再响应点击与键盘                                    | `boolean`            | `false`        |
| `customClass`   | 根节点自定义类名                                                    | `string`             | `''`           |
| `customStyle`   | 根节点自定义样式                                                    | `StyleValue`         | `''`           |

### Events

| 事件名           | 触发时机         | 参数    |
| ---------------- | ---------------- | ------- |
| `change`         | 选中新的可用选项 | `index` |
| `update:current` | 选中索引更新     | `index` |

## 主题变量

| 变量名                         | 说明                           |
| ------------------------------ | ------------------------------ |
| `--snake-color-primary`        | 激活文字及描边颜色             |
| `--snake-color-text-secondary` | 未激活文字颜色                 |
| `--snake-color-surface-muted`  | 胶囊滑块模式的轨道背景色       |
| `--snake-color-surface`        | 胶囊滑块模式下滑块的默认颜色   |
| `--snake-color-white`          | 描边分段模式选中项的默认文字色 |
