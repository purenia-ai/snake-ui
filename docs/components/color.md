---
preview: /pages/other/color/index
---

<script setup lang="ts">
const colorGroups = [
    {
        title: '主题主色',
        items: [{ name: 'Snake 绿', token: 'primary', value: '#06D290', dark: '#2EBD7C', disabled: '#A6EBD3', light: '#EEFFE0', ink: '#FFFFFF' }]
    },
    {
        title: '辅助色',
        items: [
            { name: 'Success', token: 'success', value: '#19BE6B', dark: '#18B566', disabled: '#71D5A1', light: '#DBF1E1', ink: '#FFFFFF' },
            { name: 'Warning', token: 'warning', value: '#FF9900', dark: '#F29100', disabled: '#FCBD71', light: '#FDF6EC', ink: '#FFFFFF' },
            { name: 'Error', token: 'error', value: '#FA3534', dark: '#DD6161', disabled: '#FAB6B6', light: '#FEF0F0', ink: '#FFFFFF' },
            { name: 'Info', token: 'info', value: '#909399', dark: '#82848A', disabled: '#C8C9CC', light: '#F4F4F5', ink: '#FFFFFF' }
        ]
    }
];

const neutralColors = [
    { name: '主要文字', token: 'text', value: '#303133' },
    { name: '常规文字', token: 'text-secondary', value: '#606266' },
    { name: '次要文字', token: 'text-muted', value: '#909399' },
    { name: '占位文字', token: 'text-light', value: '#C0C4CC' },
    { name: '边框', token: 'border', value: '#DCDFE6' },
    { name: '分割线', token: 'divider', value: '#E4E7ED' },
    { name: '页面背景', token: 'background', value: '#F6F6F6' },
    { name: '内容表面', token: 'surface', value: '#FFFFFF' },
    { name: '弱表面', token: 'surface-muted', value: '#F1F1F1' }
];
</script>

# Color 色彩

Snake UI 用统一的色彩 token 表达品牌、状态、文字与界面层级。组件优先读取 CSS 变量，因此主题或明暗模式切换时无需逐个改色。

## 主题颜色

`primary` 是 Snake 绿，代表品牌和主要操作；`dark`、`disabled`、`light` 分别用于按压、禁用和浅底状态。

<template v-for="group in colorGroups" :key="group.title">
    <h3>{{ group.title }}</h3>
    <div class="color-grid">
        <div v-for="color in group.items" :key="color.token" class="color-card" :style="{ background: color.value, color: color.ink }">
            <strong>{{ color.name }}</strong>
            <code>--snake-color-{{ color.token }}</code>
            <div class="color-steps">
                <span :style="{ background: color.dark, color: '#fff' }">Dark<br>{{ color.dark }}</span>
                <span :style="{ background: color.disabled, color: '#303133' }">Disabled<br>{{ color.disabled }}</span>
                <span :style="{ background: color.light, color: '#303133' }">Light<br>{{ color.light }}</span>
            </div>
        </div>
    </div>
</template>

辅助色表达固定业务语义：成功、警告、错误和普通信息，不应仅因视觉偏好互换。

## 文本与界面

<div class="neutral-grid">
    <div v-for="color in neutralColors" :key="color.token" class="neutral-card">
        <i class="neutral-card__swatch" :style="{ background: color.value }"></i>
        <span><strong>{{ color.name }}</strong><code>--snake-color-{{ color.token }}</code><small>{{ color.value }}</small></span>
    </div>
</div>

页面使用 `background`，卡片和面板使用 `surface`，轻量分区使用 `surface-muted`；外框使用 `border`，内容分隔使用 `divider`。Snake UI 的页面背景为 `#F6F6F6`。

## 遮罩与阴影

| Token                                         | 默认值                | 用途     |
| --------------------------------------------- | --------------------- | -------- |
| `--snake-color-mask`                          | `rgba(0, 0, 0, 0.4)`  | 弹层遮罩 |
| `--snake-color-shadow`                        | `rgba(0, 0, 0, 0.1)`  | 浮层阴影 |
| `--snake-color-white` / `--snake-color-black` | `#FFFFFF` / `#000000` | 纯色对比 |

## 在样式与脚本中使用

```scss
.action {
    color: var(--snake-color-primary-ink);
    background: var(--snake-color-primary);

    &:active {
        background: var(--snake-color-primary-dark);
    }
    &:disabled {
        background: var(--snake-color-primary-disabled);
    }
}
```

```ts
import { useTheme } from '@puresnake/snake-ui';

const { color } = useTheme();
console.log(color.primary, color.text);
```

::: tip 多主题与暗黑模式
通过 `--snake-color-*` 或 `color` 读取颜色，不要在业务代码复制暗色值。主题配置方式见[多主题与暗黑模式](/guide/multi-theme)。
:::

<style scoped>
.color-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 16px 0 28px; }
.color-card { position: relative; min-height: 148px; padding: 22px 24px 70px; overflow: hidden; border-radius: 8px; box-sizing: border-box; }
.color-card strong, .color-card code { display: block; color: inherit; }
.color-card code { margin-top: 5px; padding: 0; background: transparent; }
.color-steps { position: absolute; right: 0; bottom: 0; left: 0; display: grid; grid-template-columns: repeat(3, 1fr); }
.color-steps span { min-width: 0; padding: 10px 12px; font-size: 12px; line-height: 1.45; }
.neutral-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 12px; margin: 20px 0 28px; }
.neutral-card { display: flex; align-items: center; gap: 14px; padding: 12px; border: 1px solid var(--vp-c-divider); border-radius: 8px; }
.neutral-card__swatch { width: 50px; height: 50px; flex: none; border: 1px solid var(--vp-c-divider); border-radius: 6px; }
.neutral-card strong, .neutral-card code, .neutral-card small { display: block; }
.neutral-card code { margin: 3px 0; padding: 0; background: transparent; font-size: 12px; }
.neutral-card small { color: var(--vp-c-text-2); }
@media (max-width: 640px) { .color-grid, .neutral-grid { grid-template-columns: 1fr; } .color-steps span { padding: 9px 8px; font-size: 11px; } }
</style>
