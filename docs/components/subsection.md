---
preview: /pages/componentsA/subsection/index
---

# Subsection 分段选择器

用于在少量互斥选项之间快速切换，支持按钮式滑块和描边分段两种模式。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

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

## API

### Props

| 参数                            | 说明                     | 类型                                                    | 默认值          |
| ------------------------------- | ------------------------ | ------------------------------------------------------- | --------------- |
| `list`                          | 字符串或对象选项列表     | `Array<string \| { name: string; disabled?: boolean }>` | `[]`            |
| `current`                       | 当前选中索引             | `number \| string`                                      | `0`             |
| `mode`                          | 按钮滑块或描边分段模式   | `button \| subsection`                                  | `button`        |
| `activeColor` / `inactiveColor` | 激活和未激活文字颜色     | `string`                                                | 主题默认值      |
| `fontSize` / `height`           | 字号与组件高度           | `string \| number`                                      | `28` / `70`     |
| `animation` / `bold`            | 滑块动画与激活项加粗     | `boolean`                                               | `true` / `true` |
| `bgColor` / `buttonColor`       | 按钮模式的轨道和滑块颜色 | `string`                                                | 主题默认值      |
| `customClass` / `customStyle`   | 自定义类名和样式         | `string \| object \| array`                             | `''`            |

### Events

| 事件名           | 触发时机         | 参数    |
| ---------------- | ---------------- | ------- |
| `change`         | 选中新的可用选项 | `index` |
| `update:current` | 选中索引更新     | `index` |

## 主题变量

| 变量名                         | 说明                     |
| ------------------------------ | ------------------------ |
| `--snake-color-primary`        | 激活文字及描边颜色       |
| `--snake-color-text-secondary` | 未激活文字颜色           |
| `--snake-color-surface-muted`  | 按钮模式轨道背景色       |
| `--snake-color-surface`        | 描边模式背景色           |
| `--snake-color-white`          | 按钮模式激活文字默认颜色 |

源码：`src/uni_modules/snake-ui/components/snake-subsection/snake-subsection.vue`
