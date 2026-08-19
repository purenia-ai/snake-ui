# 多主题与暗黑模式

Snake UI 支持单主题、多主题切换与暗黑模式,主题通过 CSS 变量驱动,切换即时生效且持久化。

::: tip 可视化配置
需要可视化配置色值并导出主题文件时,可以使用 [主题生成器](/guide/theme-generate)。
:::

## 核心能力

- **声明式注册**:在应用入口 `app.use(SnakeUI, { theme: ... })` 一次注入,支持多套主题。
- **深度合并**:每套主题只需覆盖 `primary` 家族等需要定制的键,其余功能色(success/warning/error/info)、文字、背景与默认色板自动合并。
- **暗黑模式策略**:支持 `auto` 跟随系统、`light`、`dark` 三种模式,运行时可切换。
- **全局注入**:配合 `snake-config-provider`(经 [Config Provider](/components/config-provider) 全局包裹),主题变量对每个页面全量生效,H5 与小程序行为一致。
- **持久化**:主题名与暗黑模式存入本地 Storage,重启自动恢复。

## 内置主题预设

| name     | 名称   | 主色      | 品牌语境                   |
| -------- | ------ | --------- | -------------------------- |
| `snake`  | 蛇绿   | `#06D290` | 主 CTA / 成功 / 鉴别通过   |
| `pupple` | 潮玩紫 | `#7A3BFF` | 潮玩 / 活动 / 专家鉴别     |
| `blue`   | 鉴别蓝 | `#2D57E7` | 次要链接 / Info / 机器鉴别 |
| `red`    | 品牌红 | `#FF3367` | KV / 节日 / 价格红         |
| `orange` | 警示橙 | `#FF6A0C` | 待处理 / 待鉴别            |

色板基于 PURESNAKE 品牌体系推导:品牌绿承载确认感,深墨蓝 `#26273A` 承载深底与主文字,绿底主 CTA 按品牌规范使用白字。预设文件见 demo 工程 `src/snake-ui.theme.ts`,可按需删改。

## 注册主题

### 多主题(推荐)

```ts
// main.ts
import { createSSRApp } from 'vue';
import App from './App.vue';
import SnakeUI from './uni_modules/snake-ui';
import themes from './snake-ui.theme';

export function createApp() {
    const app = createSSRApp(App);
    app.use(SnakeUI, {
        theme: {
            themes, // 主题数组
            defaultTheme: 'snake', // 默认主题
            defaultDarkMode: 'light' // 默认暗黑模式:light | dark | auto
        }
    });
    return { app };
}
```

### 单主题改色

只想换主色时,直接传色板片段,缺失键自动沿用默认值:

```ts
app.use(SnakeUI, {
    theme: {
        primary: '#7C3AED',
        primaryDark: '#6D33D1',
        primaryDeep: '#5D2CB2',
        primaryDeeper: '#442082',
        primaryLight: '#F3EFF9',
        primaryInk: '#FFFFFF'
    }
});
```

## 主题对象结构

```ts
import type { SnakeTheme } from './uni_modules/snake-ui';

const myTheme: SnakeTheme = {
    name: 'purple', // 唯一标识(setSnakeTheme 用)
    label: '紫', // 展示名
    description: '雾紫主题',
    color: {
        primary: '#7C3AED', // 主色(实心/图形)
        primaryDark: '#6D33D1', // hover/按压
        primaryDeep: '#5D2CB2', // 白字安全锚点(白字 >= 4.5:1)
        primaryDeeper: '#442082', // 渐变深端
        primaryDisabled: '#C7B7E3',
        primaryLight: '#F3EFF9', // 浅底
        primaryInk: '#FFFFFF' // 主色实心上的文字(取对比更高一侧)
        // 其余键省略,自动继承默认色板
    },
    darkColor: {
        primary: '#CBB0F8', // 暗色模式主色(亮化)
        primaryDeep: '#31196B',
        primaryLight: '#150F1F' // 暗色浅底(深色微 tint)
        // 省略键自动继承默认暗色板
    }
};
```

::: tip 对比度规则
`primaryDeep` 上放白字需 >= 4.5:1;`primaryInk` 与主色实心的对比需 >= 4.5:1——主色偏亮时 ink 取深色(如蛇绿配 `#003D2A`),主色偏暗时 ink 取白字(如紫配 `#FFFFFF`)。
:::

## 全局注入

主题切换要对**所有页面**生效,需用 [Config Provider](/components/config-provider) 包裹页面根部,推荐配合 `vite-plugin-snake-root` 零侵入接入(见 [Config Provider 文档](/components/config-provider)):

```vue
<!-- src/App.root.vue -->
<script setup lang="ts">
import SnakeConfigProvider from './uni_modules/snake-ui/components/snake-config-provider/snake-config-provider.vue';
</script>

<template>
    <SnakeConfigProvider>
        <slot />
    </SnakeConfigProvider>
</template>
```

## 在样式中使用

SCSS 与 CSS 变量随时可用(切换主题即变):

```scss
.title {
    color: $snake-color-primary;
    /* 或 */
    color: var(--snake-color-primary);
}
```

模板行内样式使用 `var()` 或 `snakeColor`:

```vue
<view :style="{ backgroundColor: 'var(--snake-color-primary-light)' }" />
<view :style="{ color: `rgba(var(--snake-color-primary-rgb), 0.16)` }" />
```

## 主题 API

| API                      | 说明                                     |
| ------------------------ | ---------------------------------------- |
| `setSnakeTheme(name)`    | 切换主题,持久化;返回是否成功             |
| `currentSnakeTheme`      | 当前主题 ref(name/label/color/darkColor) |
| `snakeThemes`            | 已注册主题列表 ref                       |
| `setSnakeDarkMode(mode)` | 设置暗黑策略 `light` / `dark` / `auto`   |
| `toggleSnakeDarkMode()`  | 亮暗快速切换                             |
| `isSnakeDarkMode()`      | 当前是否处于暗黑渲染                     |
| `snakeColor`             | 响应式色板对象,JS 中取实时色值           |

## 构建主题切换 UI

```vue
<script setup lang="ts">
import { currentSnakeTheme, setSnakeTheme, snakeThemes, toggleSnakeDarkMode } from './uni_modules/snake-ui';
</script>

<template>
    <view class="theme-switcher">
        <view
            v-for="theme in snakeThemes"
            :key="theme.name"
            :class="['theme-dot', { 'theme-dot--active': currentSnakeTheme?.name === theme.name }]"
            @click="setSnakeTheme(theme.name)"
        >
            <view class="theme-dot__color" :style="{ background: theme.color?.primary }" />
            <text>{{ theme.label || theme.name }}</text>
        </view>
        <snake-switch :model-value="false" @update:model-value="toggleSnakeDarkMode()" />
    </view>
</template>
```

## 暗黑模式与持久化

- `defaultDarkMode: 'auto'` 时读取系统主题(`uni.onThemeChange` / `matchMedia`)并持续跟随。
- 主题名与暗黑模式分别存于 Storage(`snake-ui-theme` / `snake-ui-dark-mode`),跨页面、重启仍生效。

## 常见问题

- **Q: 切换主题后个别颜色没变?**
  A: 该处可能写死了十六进制色值。改用 `$snake-color-*` 或 `var(--snake-color-*)`。
- **Q: 只传一个主题对象可以吗?**
  A: 可以,会与默认主题合并,仍具备暗黑模式。
- **Q: 如何定制某个主题的暗黑色?**
  A: 在 `darkColor` 里写需要覆盖的键,其余继承默认暗色板。
