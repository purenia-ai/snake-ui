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

## 默认色板速查

未定制的令牌继承默认主题。完整色板如下：

### 品牌与状态

| 令牌                                                           | 默认值                                        | 用途                 |
| -------------------------------------------------------------- | --------------------------------------------- | -------------------- |
| `primary` / `primaryDark` / `primaryDeep` / `primaryDeeper`    | `#06d290` / `#2ebd7c` / `#26273a` / `#22242e` | 品牌绿七档阶梯       |
| `primaryDisabled` / `primaryLight`                             | `#a6ebd3` / `rgba(6,210,144,0.1)`             | 禁用态与浅底         |
| `primaryInk`                                                   | `#ffffff`                                     | 主色实心背景上的文字 |
| `success` / `successDark` / `successDisabled` / `successLight` | `#19be6b` 系                                  | 成功态               |
| `warning` / `warningDark` / `warningDisabled` / `warningLight` | `#ff9900` 系                                  | 警告态               |
| `error` / `errorDark` / `errorDisabled` / `errorLight`         | `#fa3534` 系                                  | 错误态               |
| `info` / `infoDark` / `infoDisabled` / `infoLight`             | `#909399` 系                                  | 信息态               |

### 文本与描边

| 令牌              | 默认值                | 用途          |
| ----------------- | --------------------- | ------------- |
| `text`            | `#303133`             | 主要文字      |
| `textSecondary`   | `#606266`             | 常规文字      |
| `textMuted`       | `#909399`             | 次要/提示文字 |
| `textLight`       | `#c0c4cc`             | 占位/弱文字   |
| `white` / `black` | `#ffffff` / `#000000` | 纯色          |
| `border`          | `#dcdfe6`             | 边框          |
| `divider`         | `#e4e7ed`             | 分割线        |

### 背景与表面

| 令牌              | 默认值                                | 用途          |
| ----------------- | ------------------------------------- | ------------- |
| `background`      | `#f6f6f6`                             | 页面背景      |
| `surface`         | `#ffffff`                             | 卡片/面板表面 |
| `surfaceMuted`    | `#f1f1f1`                             | 弱表面        |
| `disabledBg`      | `#f1f1f1`                             | 禁用背景      |
| `mask` / `shadow` | `rgba(0,0,0,0.4)` / `rgba(0,0,0,0.1)` | 遮罩与阴影    |

### 尺寸与动效

| 令牌                                                          | 默认值                           | 用途         |
| ------------------------------------------------------------- | -------------------------------- | ------------ |
| `controlHeightSmall` / `controlHeight` / `controlHeightLarge` | `64rpx` / `80rpx` / `92rpx`      | 控件三档高度 |
| `radiusSmall` / `radiusBase` / `radiusLarge`                  | `8rpx` / `12rpx` / `20rpx`       | 圆角三档     |
| `durationFast` / `durationBase`                               | `180ms` / `300ms`                | 动效时长     |
| `easingStandard`                                              | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 标准缓动     |
| `zIndexOverlay` / `zIndexPopup`                               | `10070` / `10075`                | 层级         |

## 让主题覆盖所有页面

主题变量分两层供给：

- **默认主题**：`theme.scss` 把 `--snake-color-*` 静态声明在 `:root, page`，所有平台无需任何注入即可生效。
- **运行时换肤**（多主题切换 / 暗黑模式）：组件本身不再内联主题变量，注入点收敛到 [ConfigProvider](/components/config-provider)——把当前色板内联到页面根部。本地 `uni_modules` 示例：

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

仓库 demo 通过 `App.root.vue` 配合根包装插件实现，宿主项目也可以按自身页面架构显式包裹，详见[虚拟根组件](/guide/root)。

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
