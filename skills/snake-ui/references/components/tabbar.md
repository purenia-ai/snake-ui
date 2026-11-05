---
name: 'tabbar'
description: 'Snake UI Tabbar 底部导航栏参考。处理 tabbar、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['tabbar', 'snake-tabbar', 'Tabbar', '底部导航栏']
---

# Tabbar 底部导航栏

用于页面底部的一级导航。支持选中态图标、角标、安全区、固定定位和中间凸起按钮。

## 使用建议

Tabbar 只用于应用的一级目的地，项目应保持固定的项目数量与顺序。临时操作、筛选或页面内切换分别使用 Button、DropMenu 或 Tabs。

## 平台兼容性

| H5  | App | 微信小程序 | 支付宝小程序 |
| :-: | :-: | :--------: | :----------: |
|  √  |  √  |     √      |      √       |

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue';

const current = ref('home');
const items = [
    { key: 'home', text: '首页', iconPath: 'home', selectedIconPath: 'home-fill' },
    { key: 'category', text: '分类', iconPath: 'list', selectedIconPath: 'list-dot' },
    { key: 'mine', text: '我的', iconPath: 'account', selectedIconPath: 'account-fill', badge: 3 }
];
</script>

<template>
    <snake-tabbar :items="items" :current="current" @change="current = $event" />
</template>
```

通过 `v-model` 按索引维护选中项：

```vue
<snake-tabbar v-model="currentIndex" :items="items" />
```

为中间项设置 `mid-button`，并在对应项中设置 `midButton: true`，即可显示凸起按钮：

```vue
<snake-tabbar :items="items" :current="current" mid-button />

<!-- items 中的中间项 -->
{ key: 'publish', text: '发布', iconPath: 'plus', midButton: true }
```

## 无障碍

- 每一项都提供简短且唯一的文字标签，不能只显示图标。
- 当前项除颜色外还应保持选中状态语义；角标数量变化需要有对应的业务提示。
- 中间凸起按钮若代表“发布”等操作，应使用动作文案，不要伪装成导航目的地。

## API

### Props

| 参数                  | 说明                                                   | 类型                                             | 默认值         |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------ | -------------- |
| `items`               | 导航项列表（推荐使用）                                 | `TabbarItem[]`                                   | `[]`           |
| `list`                | 备用导航项列表，未传 `items` 时使用                    | `TabbarItem[]`                                   | `[]`           |
| `current`             | 当前激活项的 `key`                                     | `string \| number`                               | `''`           |
| `modelValue`          | 通过 `v-model` 绑定的激活项索引                        | `string \| number`                               | `0`            |
| `show`                | 是否显示导航栏                                         | `boolean`                                        | `true`         |
| `fixed`               | 是否固定在页面底部                                     | `boolean`                                        | `true`         |
| `safeAreaInsetBottom` | 是否预留底部安全区                                     | `boolean`                                        | `true`         |
| `customStyle`         | 根节点自定义样式                                       | `StyleValue`                                     | `''`           |
| `customClass`         | 根节点自定义类名                                       | `string`                                         | `''`           |
| `activeColor`         | 激活颜色                                               | `string`                                         | 主题主色       |
| `inactiveColor`       | 未激活颜色                                             | `string`                                         | 主题弱化文字色 |
| `bgColor`             | 导航栏背景色                                           | `string`                                         | 主题表面色     |
| `borderTop`           | 是否显示顶部边框                                       | `boolean`                                        | `true`         |
| `hideTabBar`          | 挂载时是否隐藏原生 tabBar，非原生 tabBar 页安全忽略    | `boolean`                                        | `true`         |
| `beforeSwitch`        | 切换拦截器，返回 `true` 或 resolve 的 Promise 才会切换 | `(index: number) => boolean \| Promise<unknown>` | -              |
| `midButton`           | 是否启用中间凸起按钮                                   | `boolean`                                        | `false`        |
| `iconSize`            | 常规图标尺寸，数字单位为 px（375 稿）                  | `string \| number`                               | `20`           |
| `midButtonSize`       | 中间凸起按钮图标尺寸，数字单位为 px（375 稿）          | `string \| number`                               | `50`           |
| `textSize`            | 文字尺寸，数字单位为 px（375 稿）                      | `string \| number`                               | `11`           |
| `gap`                 | 图标与文字间距，数字单位为 px（375 稿）                | `string \| number`                               | `2.5`          |
| `height`              | 导航栏高度，数字单位为 px（375 稿）                    | `string \| number`                               | `52`           |
| `zIndex`              | 固定导航栏层级                                         | `number`                                         | `120`          |

## 原生 tabBar

将 `snake-tabbar` 放在 `pages.json` 的原生 tabBar 页面时，组件默认调用 `uni.hideTabBar()`，由自定义栏替代原生栏。普通页面也可以复用组件：该 API 的预期失败会被内部安全处理。传入 `:hide-tab-bar="false"` 可保留原生 tabBar。

### TabbarItem

| 参数               | 说明                                                             | 类型                | 默认值       |
| ------------------ | ---------------------------------------------------------------- | ------------------- | ------------ |
| `key`              | 导航项唯一标识                                                   | `string \| number`  | 当前索引     |
| `text`             | 导航文字                                                         | `string`            | `''`         |
| `icon`             | 未选中图标名称，`iconPath` 优先                                  | `string`            | `''`         |
| `iconPath`         | 未选中图标名称，优先于 `icon`                                    | `string`            | `''`         |
| `selectedIconPath` | 选中图标名称，未设置时沿用未选中图标                             | `string`            | 未选中图标   |
| `customIcon`       | 图标字体前缀，传 `true` 使用 `custom-icon`，传字符串直接作为前缀 | `boolean \| string` | `false`      |
| `pagePath`         | 页面路径，传入后按当前页面自动确定激活项                         | `string`            | `''`         |
| `midButton`        | 是否作为中间凸起项                                               | `boolean`           | `false`      |
| `width`            | 单项宽度，任一项设置后其余项填充剩余空间                         | `string \| number`  | 自动均分     |
| `iconSize`         | 单项图标尺寸                                                     | `string \| number`  | 继承组件属性 |
| `textSize`         | 单项文字尺寸                                                     | `string \| number`  | 继承组件属性 |
| `gap`              | 单项图标与文字间距                                               | `string \| number`  | 继承组件属性 |
| `count`            | 角标数量，`badge` 优先                                           | `string \| number`  | -            |
| `isDot`            | 是否仅显示点状角标                                               | `boolean`           | `false`      |
| `disabled`         | 是否禁用点击                                                     | `boolean`           | `false`      |
| `badge`            | 徽标文字或数字，优先于 `count`                                   | `string \| number`  | -            |

### Events

| 事件名              | 触发时机                     | 参数                                      |
| ------------------- | ---------------------------- | ----------------------------------------- |
| `change`            | 点击未禁用的导航项           | `key: string \| number, item: TabbarItem` |
| `update:modelValue` | 点击无 `pagePath` 的导航项时 | `index: number`                           |

`pagePath` 存在时，组件会调用 `uni.switchTab()`；不需要由父组件重复处理跳转。`beforeSwitch` 返回 `false` 或 rejected Promise 时，组件不发出事件、不更新值、也不跳转。

## 主题变量

| 变量名                        | 说明                     |
| ----------------------------- | ------------------------ |
| `--snake-color-primary`       | 默认激活颜色             |
| `--snake-color-text-muted`    | 默认未激活颜色           |
| `--snake-color-surface`       | 导航栏和中间按钮背景色   |
| `--snake-color-surface-muted` | 按压背景色               |
| `--snake-color-divider`       | 顶部边框和中间按钮描边色 |
| `--snake-color-error`         | 角标背景色               |
