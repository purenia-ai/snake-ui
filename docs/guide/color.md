---
preview: /pages/other/color/index
---

<script setup lang="ts">
const themes = [
    { name: 'Snake 绿', value: '#06D290', dark: '#2EBD7C', disabled: '#A6EBD3', light: '#EEFFE0', ink: '#FFFFFF' },
    { name: '霞光紫', value: '#7C3AED', dark: '#6D28D9', disabled: '#C4B5FD', light: '#F3E8FF', ink: '#FFFFFF' },
    { name: '绯樱红', value: '#E11D48', dark: '#BE123C', disabled: '#FDA4AF', light: '#FFF1F2', ink: '#FFFFFF' },
    { name: '暖阳橙', value: '#FF6B35', dark: '#EA580C', disabled: '#FED7AA', light: '#FED7AA', ink: '#4D2004' },
    { name: '深邃蓝', value: '#1E3A8A', dark: '#1E40AF', disabled: '#93C5FD', light: '#DBEAFE', ink: '#FFFFFF' }
];

const semanticColors = [
    { name: 'Success', value: '#19BE6B', dark: '#18B566', disabled: '#71D5A1', light: '#DBF1E1' },
    { name: 'Warning', value: '#FF9900', dark: '#F29100', disabled: '#FCBD71', light: '#FDF6EC' },
    { name: 'Error', value: '#FA3534', dark: '#DD6161', disabled: '#FAB6B6', light: '#FEF0F0' },
    { name: 'Info', value: '#909399', dark: '#82848A', disabled: '#C8C9CC', light: '#F4F4F5' }
];

const neutralColors = [
    { name: '主要文字', token: '--snake-color-text', value: '#303133' },
    { name: '常规文字', token: '--snake-color-text-secondary', value: '#606266' },
    { name: '次要文字', token: '--snake-color-text-muted', value: '#909399' },
    { name: '占位文字', token: '--snake-color-text-light', value: '#C0C4CC' },
    { name: '页面背景', token: '--snake-color-background', value: '#F6F6F6' },
    { name: '内容表面', token: '--snake-color-surface', value: '#FFFFFF' },
    { name: '弱表面', token: '--snake-color-surface-muted', value: '#F1F1F1' },
    { name: '边框', token: '--snake-color-border', value: '#DCDFE6' },
    { name: '分割线', token: '--snake-color-divider', value: '#E4E7ED' }
];
</script>

# Color 色彩

Snake UI 使用统一的主题令牌表达品牌、状态、文字和界面层级。组件优先读取 CSS 变量，因此切换主题或暗黑模式时无需逐个修改组件颜色。

## 主题主色

默认主色是 Snake 绿。项目演示内置五套主题，每套均提供常规、加深、禁用和浅色状态。

<div class="palette-grid">
    <div v-for="theme in themes" :key="theme.name" class="palette-card" :style="{ background: theme.value, color: theme.ink }">
        <strong>{{ theme.name }}</strong>
        <code>{{ theme.value }}</code>
        <div class="palette-steps">
            <span :style="{ background: theme.dark, color: '#fff' }">Dark<br>{{ theme.dark }}</span>
            <span :style="{ background: theme.disabled, color: '#303133' }">Disabled<br>{{ theme.disabled }}</span>
            <span :style="{ background: theme.light, color: '#303133' }">Light<br>{{ theme.light }}</span>
        </div>
    </div>
</div>

主色令牌可直接用于组件状态：

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

## 辅助色

辅助色表达稳定的业务语义，不应仅凭视觉偏好互换：绿色表示成功，橙色表示警告，红色表示错误，灰色表示普通信息。

<div class="palette-grid">
    <div v-for="color in semanticColors" :key="color.name" class="palette-card" :style="{ background: color.value, color: '#fff' }">
        <strong>{{ color.name }}</strong>
        <code>{{ color.value }}</code>
        <div class="palette-steps">
            <span :style="{ background: color.dark, color: '#fff' }">Dark<br>{{ color.dark }}</span>
            <span :style="{ background: color.disabled, color: '#303133' }">Disabled<br>{{ color.disabled }}</span>
            <span :style="{ background: color.light, color: '#303133' }">Light<br>{{ color.light }}</span>
        </div>
    </div>
</div>

对应变量为 `--snake-color-success-*`、`--snake-color-warning-*`、`--snake-color-error-*` 和 `--snake-color-info-*`；不带状态后缀时表示基础色。

## 文字、背景与边框

<div class="neutral-grid">
    <div v-for="color in neutralColors" :key="color.token" class="neutral-card">
        <span class="neutral-swatch" :style="{ background: color.value }"></span>
        <span><strong>{{ color.name }}</strong><code>{{ color.token }}</code><small>{{ color.value }}</small></span>
    </div>
</div>

文字层级从主要内容逐步减弱。页面使用 `background`，卡片和面板使用 `surface`，轻量分区使用 `surfaceMuted`；描边优先使用 `border`，内容分隔优先使用 `divider`。

Snake UI 将页面背景定制为 `#F6F6F6`，比 uView Pro 默认的 `#F3F4F6` 更接近当前产品的浅灰基底。

## SCSS 变量

主题文件会同时提供 CSS 变量和 SCSS 变量。组件或业务样式中可以直接使用以下变量，主题切换时会通过 CSS 变量保持同步：

```scss
.title {
    color: $snake-color-text;
}

.card {
    color: $snake-color-primary;
    background: $snake-color-surface;
    border: 1px solid $snake-color-border;
}

.card:active {
    background: $snake-color-primary-dark;
}
```

常用变量如下：

| 分类     | SCSS 变量                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| 品牌主色 | `$snake-color-primary`、`$snake-color-primary-dark`、`$snake-color-primary-disabled`、`$snake-color-primary-light` |
| 成功色   | `$snake-color-success`、`$snake-color-success-dark`、`$snake-color-success-disabled`、`$snake-color-success-light` |
| 警告色   | `$snake-color-warning`、`$snake-color-warning-dark`、`$snake-color-warning-disabled`、`$snake-color-warning-light` |
| 错误色   | `$snake-color-error`、`$snake-color-error-dark`、`$snake-color-error-disabled`、`$snake-color-error-light`         |
| 信息色   | `$snake-color-info`、`$snake-color-info-dark`、`$snake-color-info-disabled`、`$snake-color-info-light`             |
| 文字层级 | `$snake-color-text`、`$snake-color-text-secondary`、`$snake-color-text-muted`、`$snake-color-text-light`           |
| 界面层级 | `$snake-color-background`、`$snake-color-surface`、`$snake-color-surface-muted`                                    |
| 描边层级 | `$snake-color-border`、`$snake-color-divider`                                                                      |

## 在脚本中使用

`snakeColor` 是当前主题的响应式色板，主题切换后会自动更新：

```ts
import { snakeColor, useTheme } from '@puresnake/snake-ui';

const { color } = useTheme();

console.log(snakeColor.primary);
console.log(color.primary);
```

::: tip 暗黑模式
不要在业务样式中复制暗黑色值。使用 `--snake-color-*` 变量或响应式色板，主题系统会自动应用当前明暗色板。完整配置方式见[多主题与暗黑模式](/guide/multi-theme)。
:::

<style scoped>
.palette-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin: 20px 0 28px;
}

.palette-card {
    position: relative;
    min-height: 150px;
    padding: 22px 24px 72px;
    overflow: hidden;
    border-radius: 8px;
    box-sizing: border-box;
}

.palette-card strong,
.palette-card code {
    display: block;
    color: inherit;
}

.palette-card code {
    margin-top: 4px;
    background: transparent;
}

.palette-steps {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}

.palette-steps span {
    min-width: 0;
    padding: 10px 12px;
    font-size: 12px;
    line-height: 1.45;
}

.neutral-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    gap: 12px;
    margin: 20px 0 28px;
}

.neutral-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
}

.neutral-swatch {
    width: 54px;
    height: 54px;
    flex: none;
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
}

.neutral-card strong,
.neutral-card code,
.neutral-card small {
    display: block;
}

.neutral-card code {
    margin: 3px 0;
    padding: 0;
    background: transparent;
    font-size: 12px;
}

.neutral-card small {
    color: var(--vp-c-text-2);
}

@media (max-width: 640px) {
    .palette-grid,
    .neutral-grid {
        grid-template-columns: 1fr;
    }

    .palette-steps span {
        padding: 9px 8px;
        font-size: 11px;
    }
}
</style>
