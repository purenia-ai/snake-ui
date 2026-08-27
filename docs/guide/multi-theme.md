# 多主题与暗黑模式

Snake UI 的主题由 CSS 变量驱动，支持快速改色、多主题切换、暗色模式和本地持久化。

## 快速修改主色

只需要一套品牌色时，直接传入色板片段；未提供的令牌会继承默认主题：

```ts
app.use(SnakeUI, {
    theme: {
        primary: '#7C3AED',
        primaryDark: '#6D33D1',
        primaryDeep: '#5D2CB2',
        primaryLight: '#F3EFF9',
        primaryInk: '#FFFFFF'
    }
});
```

## 注册多套主题

```ts
import SnakeUI, { type SnakeTheme } from '@puresnake/snake-ui';

const themes: SnakeTheme[] = [
    {
        name: 'brand',
        label: '品牌紫',
        color: {
            primary: '#7C3AED',
            primaryDark: '#6D33D1',
            primaryDeep: '#5D2CB2',
            primaryLight: '#F3EFF9',
            primaryInk: '#FFFFFF'
        },
        darkColor: {
            primary: '#CBB0F8',
            primaryDeep: '#31196B',
            primaryLight: '#150F1F'
        }
    }
];

app.use(SnakeUI, {
    theme: {
        themes,
        defaultTheme: 'brand',
        defaultDarkMode: 'auto'
    }
});
```

`name` 是 `setSnakeTheme()` 使用的唯一标识。`color` 和 `darkColor` 都允许只覆盖需要定制的键。

::: tip 对比度
`primaryInk` 是主色实心背景上的文字色。设计按钮等关键交互时，应检查文字与背景的实际对比度；亮主色通常需要深色文字。
:::

## 让主题覆盖所有页面

需要在页面根部注入主题变量时，使用 [ConfigProvider](/components/config-provider)。本地 `uni_modules` 示例：

```vue
<script setup lang="ts">
import SnakeConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <SnakeConfigProvider>
        <slot />
    </SnakeConfigProvider>
</template>
```

仓库 demo 通过 `App.root.vue` 配合根包装插件实现。宿主项目也可以按自身页面架构显式包裹。

## 在样式和脚本中使用

```scss
.card {
    color: var(--snake-color-text);
    background: var(--snake-color-surface);
    border-color: var(--snake-color-border);
}
```

```vue
<view :style="{ color: 'var(--snake-color-primary)' }" />
```

```ts
import { snakeColor } from '@puresnake/snake-ui';

console.log(snakeColor.primary);
```

主题切换后，CSS 变量和响应式色板都会更新。写死的十六进制颜色不会随主题变化。

## 主题与暗色 API

| API                         | 作用                           |
| --------------------------- | ------------------------------ |
| `setSnakeTheme(name)`       | 切换主题并持久化，返回是否成功 |
| `setSnakeThemeColor(color)` | 更新当前主题的颜色片段         |
| `currentSnakeTheme`         | 当前主题的响应式引用           |
| `snakeThemes`               | 已注册主题列表                 |
| `setSnakeDarkMode(mode)`    | 设置 `light`、`dark` 或 `auto` |
| `toggleSnakeDarkMode()`     | 在明暗模式间快速切换           |
| `isSnakeDarkMode()`         | 返回当前是否渲染暗色           |
| `snakeColor`                | 当前响应式色板                 |

## 暗色跟随与持久化

`auto` 会在平台支持时跟随系统主题。主题名和暗色策略分别保存在 `@puresnake/snake-ui-theme` 与 `@puresnake/snake-ui-dark-mode`，重新进入应用后自动恢复。

## 使用主题生成器

需要可视化配置色板、生成暗色值并导出多套主题时，使用[主题生成器](/guide/theme-generate)。

需要覆盖页面或单个组件的布局、颜色和状态样式时，查看[自定义样式](/guide/custom-style)。

主题未覆盖、颜色未变化等问题见[常见问题](/guide/troubleshooting)。
