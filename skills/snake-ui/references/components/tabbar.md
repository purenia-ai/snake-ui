---
name: 'tabbar'
description: 'Snake UI Tabbar 底部导航栏参考。处理 tabbar、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['tabbar', 'snake-tabbar', 'Tabbar', '底部导航栏']
---

# Tabbar 底部导航栏

用于页面底部的一级导航。支持选中态图标、角标、安全区、固定定位和中间凸起按钮。

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

## API

### Props

| 参数                            | 说明                                                   | 类型                            | 默认值            |
| ------------------------------- | ------------------------------------------------------ | ------------------------------- | ----------------- |
| `items` / `list`                | 导航项列表；优先使用 `items`                           | `TabbarItem[]`                  | `[]`              |
| `current`                       | 当前激活项的 `key`                                     | `string \| number`              | `''`              |
| `modelValue`                    | 通过 `v-model` 绑定的激活项索引                        | `string \| number`              | `0`               |
| `show` / `fixed`                | 显示导航栏、固定在页面底部                             | `boolean`                       | `true` / `true`   |
| `safeAreaInsetBottom`           | 是否预留底部安全区                                     | `boolean`                       | `true`            |
| `activeColor` / `inactiveColor` | 激活和未激活颜色                                       | `string`                        | 主色 / 弱化文字色 |
| `bgColor`                       | 背景色                                                 | `string`                        | 表面背景色        |
| `borderTop`                     | 是否显示顶部边框                                       | `boolean`                       | `true`            |
| `hideTabBar`                    | 挂载时隐藏原生 tabBar；非原生 tabBar 页安全忽略        | `boolean`                       | `true`            |
| `beforeSwitch`                  | 切换拦截器；返回 `true` 或 resolve 的 Promise 才会切换 | `(index) => boolean \| Promise` | -                 |
| `midButton`                     | 是否启用中间凸起按钮                                   | `boolean`                       | `false`           |
| `iconSize` / `midButtonSize`    | 常规图标和凸起图标尺寸，数字单位为 rpx                 | `string \| number`              | `40` / `100`      |
| `textSize` / `gap`              | 文字尺寸、图标与文字间距，数字单位为 rpx               | `string \| number`              | `22` / `5`        |
| `height`                        | 导航栏高度，数字单位为 rpx                             | `string \| number`              | `104`             |
| `zIndex`                        | 固定导航栏层级                                         | `number`                        | `120`             |
| `customClass` / `customStyle`   | 根节点类名和样式                                       | `string` / `StyleValue`         | `''` / `''`       |

## 原生 tabBar

将 `snake-tabbar` 放在 `pages.json` 的原生 tabBar 页面时，组件默认调用 `uni.hideTabBar()`，由自定义栏替代原生栏。普通页面也可以复用组件：该 API 的预期失败会被内部安全处理。传入 `:hide-tab-bar="false"` 可保留原生 tabBar。

### TabbarItem

| 参数                            | 说明                                     | 类型                | 默认值       |
| ------------------------------- | ---------------------------------------- | ------------------- | ------------ |
| `key`                           | 导航项唯一标识                           | `string \| number`  | 当前索引     |
| `text`                          | 导航文字                                 | `string`            | `''`         |
| `icon` / `iconPath`             | 未选中图标名称，`iconPath` 优先          | `string`            | `''`         |
| `selectedIconPath`              | 选中图标名称                             | `string`            | 未选中图标   |
| `customIcon`                    | 图标字体前缀；传字符串时直接作为前缀     | `boolean \| string` | `false`      |
| `pagePath`                      | 页面路径；传入后按当前页面自动确定激活项 | `string`            | `''`         |
| `midButton`                     | 是否作为中间凸起项                       | `boolean`           | `false`      |
| `width`                         | 单项宽度；任一项设置后其余项填充剩余空间 | `string \| number`  | 自动均分     |
| `iconSize` / `textSize` / `gap` | 单项图标尺寸、文字尺寸、间距             | `string \| number`  | 继承组件属性 |
| `badge` / `count`               | 角标文字或数量，`badge` 优先             | `string \| number`  | `undefined`  |
| `isDot`                         | 是否仅显示点状角标                       | `boolean`           | `false`      |
| `disabled`                      | 是否禁用点击                             | `boolean`           | `false`      |

### Events

| 事件名              | 触发时机                     | 参数        |
| ------------------- | ---------------------------- | ----------- |
| `change`            | 点击未禁用的导航项           | `key, item` |
| `update:modelValue` | 点击无 `pagePath` 的导航项时 | `index`     |

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
