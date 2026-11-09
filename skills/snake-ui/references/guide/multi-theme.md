---
name: 'multi-theme'
description: 'Snake UI 多主题与暗黑模式参考。处理 multi-theme、guide 或相关 uni-app 使用问题时按需读取。'
triggers: ['multi-theme', '多主题与暗黑模式']
---

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
import SnakeUI, { type Theme } from '@puresnake/snake-ui';

const themes: Theme[] = [
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

`name` 是 `setTheme()` 使用的唯一标识。`color` 和 `darkColor` 都允许只覆盖需要定制的键。

::: tip 对比度
`primaryInk` 是主色实心背景上的文字色。设计按钮等关键交互时，应检查文字与背景的实际对比度；亮主色通常需要深色文字。
:::

## 默认色板速查

未定制的令牌继承默认主题。下表为亮色默认值（暗色模式另有独立色板）；颜色令牌可通过主题 API 覆盖。CSS 变量名按 `--snake-color-<token>` 映射（camelCase 转 kebab-case，如 `primaryDark` → `--snake-color-primary-dark`），尺寸与动效令牌为 `--snake-<token>` 静态值。

### 品牌与状态

| 令牌               | 默认值      | 用途                 |
| ------------------ | ----------- | -------------------- |
| `primary`          | `#06d290`   | 品牌主色             |
| `primaryDark`      | `#2ebd7c`   | 品牌深档（按压态）   |
| `primaryDeep`      | `#26273a`   | 品牌深底             |
| `primaryDeeper`    | `#22242e`   | 品牌最深底           |
| `primaryDisabled`  | `#a6ebd3`   | 品牌禁用态           |
| `primaryLight`     | `#06d2901a` | 品牌浅底（10% 透明） |
| `primaryInk`       | `#ffffff`   | 主色实心背景上的文字 |
| `success`          | `#19be6b`   | 成功态               |
| `successDark`      | `#18b566`   | 成功深档             |
| `successDisabled`  | `#71d5a1`   | 成功禁用态           |
| `successLight`     | `#dbf1e1`   | 成功浅底             |
| `warning`          | `#ff9900`   | 警告态               |
| `warningDark`      | `#f29100`   | 警告深档             |
| `warningDisabled`  | `#fcbd71`   | 警告禁用态           |
| `warningLight`     | `#fdf6ec`   | 警告浅底             |
| `error`            | `#fa3534`   | 错误态               |
| `errorDark`        | `#dd6161`   | 错误深档             |
| `errorDisabled`    | `#fab6b6`   | 错误禁用态           |
| `errorLight`       | `#fef0f0`   | 错误浅底             |
| `info`             | `#909399`   | 信息态               |
| `infoDark`         | `#82848a`   | 信息深档             |
| `infoDisabled`     | `#c8c9cc`   | 信息禁用态           |
| `infoLight`        | `#f4f4f5`   | 信息浅底             |
| `notice`           | `#ff9900`   | 通知栏强调色         |
| `noticeBackground` | `#fdf6ec`   | 通知栏底色           |
| `formError`        | `#fa3534`   | 表单校验错误色       |

### 文本与描边

| 令牌            | 默认值    | 用途          |
| --------------- | --------- | ------------- |
| `text`          | `#303133` | 主要文字      |
| `textSecondary` | `#606266` | 常规文字      |
| `textMuted`     | `#909399` | 次要/提示文字 |
| `textLight`     | `#c0c4cc` | 占位/弱文字   |
| `white`         | `#ffffff` | 纯白          |
| `black`         | `#000000` | 纯黑          |
| `border`        | `#dcdfe6` | 边框          |
| `divider`       | `#e4e7ed` | 分割线        |

### 背景与表面

| 令牌           | 默认值               | 用途          |
| -------------- | -------------------- | ------------- |
| `background`   | `#f6f6f6`            | 页面背景      |
| `surface`      | `#ffffff`            | 卡片/面板表面 |
| `surfaceMuted` | `#f1f1f1`            | 弱表面        |
| `disabledBg`   | `#f1f1f1`            | 禁用背景      |
| `mask`         | `rgba(0, 0, 0, 0.4)` | 遮罩          |
| `shadow`       | `rgba(0, 0, 0, 0.1)` | 阴影          |

### 尺寸与动效

| 令牌                 | 默认值                           | 用途           |
| -------------------- | -------------------------------- | -------------- |
| `controlHeightSmall` | `32px`                           | 小尺寸控件高度 |
| `controlHeight`      | `40px`                           | 默认控件高度   |
| `controlHeightLarge` | `46px`                           | 大尺寸控件高度 |
| `radiusSmall`        | `4px`                            | 小圆角         |
| `radiusBase`         | `6px`                            | 基础圆角       |
| `radiusLarge`        | `10px`                           | 大圆角         |
| `durationFast`       | `180ms`                          | 快速动效时长   |
| `durationBase`       | `300ms`                          | 基础动效时长   |
| `easingStandard`     | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 标准缓动       |
| `zIndexOverlay`      | `10070`                          | 遮罩层级       |
| `zIndexPopup`        | `10075`                          | 弹窗层级       |

## 让主题覆盖所有页面

主题变量分两层供给：

- **默认主题**：`theme.scss` 把 `--snake-color-*` 静态声明在 `:root, page`，所有平台无需任何注入即可生效。
- **运行时换肤**（多主题切换 / 暗黑模式）：组件本身不再内联主题变量，注入点收敛到 [ConfigProvider](/components/config-provider)——把当前色板内联到页面根部。本地 `uni_modules` 示例：

```vue
<script setup lang="ts">
import ConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <ConfigProvider>
        <slot />
    </ConfigProvider>
</template>
```

仓库 demo 通过 `App.root.vue` 配合根包装插件实现，宿主项目也可以按自身页面架构显式包裹，详见[虚拟根组件](/guide/root)。

## 自定义 CSS 变量

除了颜色令牌，主题还可以直接注入自定义 CSS 变量：`css` 在亮色模式生效，`darkCss` 在暗色模式下**覆盖同名键**，其余键继续沿用 `css`。

```ts
const themes: Theme[] = [
    {
        name: 'brand',
        color: { primary: '#7C3AED' },
        css: {
            '--snake-brand-accent': '#7C3AED',
            '--snake-brand-accent-soft': '#F3E8FF'
        },
        darkCss: {
            // 只覆盖暗色需要变化的键
            '--snake-brand-accent-soft': '#241436'
        }
    }
];
```

暗色下 `--snake-brand-accent` 仍是 `#7C3AED`，`--snake-brand-accent-soft` 变为 `#241436`。切换主题时会清掉上一套主题独有的变量，不会残留。

### 全部主题共享的变量

`theme` 配置顶层的 `css` / `darkCss` 会广播到每一套主题，主题自身同名键优先：

```ts
app.use(SnakeUI, {
    theme: {
        themes,
        css: { '--snake-page-gutter': '16px' },
        darkCss: { '--snake-page-gutter': '12px' }
    }
});
```

### 只改亮色时的暗色推导

`color` 里声明、但 `darkColor` 里没声明的令牌，会按亮色的色相与饱和度、配合基线暗色的明度推导出暗色值。因此只改亮色不会让暗色退回内置颜色。

```ts
{
    name: 'brand',
    color: { primary: '#E11D48' } // 暗色 primary 推导为同色相的暗色值
}
```

`background`、`surface`、`text`、`border`、`divider`、`mask`、`shadow` 以及 `primaryInk` 等结构性令牌不参与推导，继续使用基线暗色，避免随明暗模式整体反转的令牌被亮色值覆盖。

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
import { color } from '@puresnake/snake-ui';

console.log(color.primary);
```

主题切换后，CSS 变量和响应式色板都会更新。写死的十六进制颜色不会随主题变化。

## 主题与暗色 API

| API                    | 作用                           |
| ---------------------- | ------------------------------ |
| `setTheme(name)`       | 切换主题并持久化，返回是否成功 |
| `setThemeColor(color)` | 更新当前主题的颜色片段         |
| `currentTheme`         | 当前主题的响应式引用           |
| `themes`               | 已注册主题列表                 |
| `setDarkMode(mode)`    | 设置 `light`、`dark` 或 `auto` |
| `toggleDarkMode()`     | 在明暗模式间快速切换           |
| `isDarkMode()`         | 返回当前是否渲染暗色           |
| `color`                | 当前响应式色板                 |

## 暗色跟随与持久化

`auto` 会在平台支持时跟随系统主题。主题名和暗色策略分别保存在 `snake-ui-theme` 与 `snake-ui-dark-mode`，重新进入应用后自动恢复。

## 使用主题生成器

需要可视化配置色板、生成暗色值并导出多套主题时，使用[主题生成器](/guide/theme-generate)。

需要覆盖页面或单个组件的布局、颜色和状态样式时，查看[自定义样式](/guide/custom-style)。

主题未覆盖、颜色未变化等问题见[常见问题](/guide/troubleshooting)。
