---
name: 'color'
description: 'Snake UI Color 色彩参考。处理 color、components 或相关 uni-app 使用问题时按需读取。'
triggers: ['color', 'snake-color', 'Color', '色彩']
---

<script setup lang="ts">
const INK_LIGHT = '#FFFFFF';
const INK_DARK = '#0B1F17';

interface Ramp {
    light: string;
    dark: string;
}

interface Step extends Ramp {
    label: string;
    token: string;
}

interface Family extends Ramp {
    name: string;
    token: string;
    use: string;
    steps: Step[];
}

interface Swatch {
    name: string;
    token: string;
    light: string;
    dark: string;
}

function parseColor(value: string) {
    const match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(value.trim());
    if (!match) return undefined;
    const rgb = Number.parseInt(match[1], 16);
    return { r: (rgb >> 16) & 255, g: (rgb >> 8) & 255, b: rgb & 255, alpha: match[2] ? Number.parseInt(match[2], 16) / 255 : 1 };
}

/** 相对亮度；带 alpha 的令牌按面板底色合成后再算。 */
function luminance(value: string, panel = '#FFFFFF'): number {
    const color = parseColor(value);
    const base = parseColor(panel);
    if (!color || !base) return 1;
    const channel = (channelValue: number) => {
        const ratio = channelValue / 255;
        return ratio <= 0.03928 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
    };
    const mix = (foreground: number, background: number) => foreground * color.alpha + background * (1 - color.alpha);
    return 0.2126 * channel(mix(color.r, base.r)) + 0.7152 * channel(mix(color.g, base.g)) + 0.0722 * channel(mix(color.b, base.b));
}

/** 取对比度更高的前景色，避免色块上的文字踩到 WCAG 下限。 */
function inkOn(value: string, panel = '#FFFFFF'): string {
    const level = luminance(value, panel);
    const onWhite = 1.05 / (level + 0.05);
    const onInk = (level + 0.05) / (luminance(INK_DARK, panel) + 0.05);
    return onWhite >= onInk ? INK_LIGHT : INK_DARK;
}

function contrast(foreground: string, background: string): string {
    const lighter = Math.max(luminance(foreground, background), luminance(background, background)) + 0.05;
    const darker = Math.min(luminance(foreground, background), luminance(background, background)) + 0.05;
    return (lighter / darker).toFixed(2);
}

/** 同一块色板在明暗两套主题下的背景与前景。 */
function paint(light: string, dark: string) {
    return { '--light-bg': light, '--light-ink': inkOn(light), '--dark-bg': dark, '--dark-ink': inkOn(dark, '#000000') };
}

function decorate(family: Family) {
    return {
        ...family,
        head: paint(family.light, family.dark),
        steps: family.steps.map(step => ({ ...step, style: paint(step.light, step.dark) }))
    };
}

const brands: Family[] = [
    {
        name: 'Snake 绿',
        token: 'primary',
        use: '主按钮、选中态、品牌标识',
        light: '#06D290',
        dark: '#06D290',
        steps: [
            { label: '加深', token: 'dark', light: '#2EBD7C', dark: '#2EE6A8' },
            { label: '禁用', token: 'disabled', light: '#A6EBD3', dark: '#1E3A31' },
            { label: '浅色', token: 'light', light: '#06D2901A', dark: '#0C2A1E' }
        ]
    }
];

const semantics: Family[] = [
    {
        name: 'Success',
        token: 'success',
        use: '成功、通过、已完成',
        light: '#19BE6B',
        dark: '#4ADE80',
        steps: [
            { label: '加深', token: 'dark', light: '#18B566', dark: '#1F9D57' },
            { label: '禁用', token: 'disabled', light: '#71D5A1', dark: '#2F4D3D' },
            { label: '浅色', token: 'light', light: '#DBF1E1', dark: '#10291F' }
        ]
    },
    {
        name: 'Warning',
        token: 'warning',
        use: '警告、待处理、即将过期',
        light: '#FF9900',
        dark: '#FBBF24',
        steps: [
            { label: '加深', token: 'dark', light: '#F29100', dark: '#C88F00' },
            { label: '禁用', token: 'disabled', light: '#FCBD71', dark: '#4A3B17' },
            { label: '浅色', token: 'light', light: '#FDF6EC', dark: '#2B1F05' }
        ]
    },
    {
        name: 'Error',
        token: 'error',
        use: '错误、失败、删除等破坏性操作',
        light: '#FA3534',
        dark: '#FF6B6B',
        steps: [
            { label: '加深', token: 'dark', light: '#DD6161', dark: '#D83A3A' },
            { label: '禁用', token: 'disabled', light: '#FAB6B6', dark: '#4F2323' },
            { label: '浅色', token: 'light', light: '#FEF0F0', dark: '#2D1414' }
        ]
    },
    {
        name: 'Info',
        token: 'info',
        use: '普通提示、中性说明',
        light: '#909399',
        dark: '#A0A7B8',
        steps: [
            { label: '加深', token: 'dark', light: '#82848A', dark: '#7C8394' },
            { label: '禁用', token: 'disabled', light: '#C8C9CC', dark: '#3B3F4C' },
            { label: '浅色', token: 'light', light: '#F4F4F5', dark: '#1D2029' }
        ]
    }
];

const swatches: Swatch[] = [
    { name: '主要文字', token: 'text', light: '#303133', dark: '#F5F6F7' },
    { name: '常规文字', token: 'text-secondary', light: '#606266', dark: '#CFD3DC' },
    { name: '次要文字', token: 'text-muted', light: '#909399', dark: '#9AA1AF' },
    { name: '占位文字', token: 'text-light', light: '#C0C4CC', dark: '#6B7082' },
    { name: '边框', token: 'border', light: '#DCDFE6', dark: '#3A4251' },
    { name: '分割线', token: 'divider', light: '#E4E7ED', dark: '#3A4251' },
    { name: '页面背景', token: 'background', light: '#F6F6F6', dark: '#111827' },
    { name: '内容表面', token: 'surface', light: '#FFFFFF', dark: '#000000' },
    { name: '弱表面', token: 'surface-muted', light: '#F1F1F1', dark: '#1A1A1A' }
];

const brandFamilies = brands.map(decorate);
const semanticFamilies = semantics.map(decorate);
const inkSample = { bg: '#06D290', ink: '#FFFFFF', alt: '#073B2A' };
const whiteContrast = contrast(inkSample.ink, inkSample.bg);
const inkContrast = contrast(inkSample.alt, inkSample.bg);
</script>

# Color 色彩

Snake UI 用统一的色彩 token 表达品牌、状态、文字与界面层级。组件只读 `--snake-color-*` 变量，主题或明暗模式切换时不需要逐个改色。

::: tip 色值来源
下面所有取值都来自 `src/uni_modules/snake-ui/libs/config/theme.ts` 的 `lightPalette` / `darkPalette`。改主题不用动这些常量，覆写同名令牌即可，见[多主题与暗黑模式](/guide/multi-theme)。把右上角的明暗开关切到暗色，下面的色值会整体换成 `darkPalette` 的取值，可以对照着看。
:::

## 主题颜色

`primary` 是 Snake 绿，代表品牌和主要操作，派生出四个用途档位：`primary-dark` 按压态、`primary-disabled` 禁用态、`primary-light` 浅底（亮色下是带 10% 透明度的 `#06D2901A`，可直接铺在任意背景上；暗色下换成实色深绿 `#0C2A1E`）、`primary-ink` 整片主色上的前景色。

<div class="color-grid color-grid--brand">
    <div v-for="family in brandFamilies" :key="family.token" class="color-card">
        <div class="color-card__head" :style="family.head">
            <strong>{{ family.name }}</strong>
            <small>{{ family.use }}</small>
            <code>--snake-color-{{ family.token }}</code>
            <em><span class="is-light">{{ family.light }}</span><span class="is-dark">{{ family.dark }}</span></em>
        </div>
        <div class="color-steps">
            <div v-for="step in family.steps" :key="step.token" class="color-step" :style="step.style">
                <span class="color-step__label">{{ step.label }}<code>-{{ step.token }}</code></span>
                <code class="color-step__hex"><span class="is-light">{{ step.light }}</span><span class="is-dark">{{ step.dark }}</span></code>
            </div>
        </div>
    </div>
</div>

主色另外还有两档深的：`primary-deep` 在每个主题里都是该品牌色的深色档（默认 `#26273A`），常用来当浅主色底上的强调文字；`primary-deeper` 再深一档（默认 `#22242E`），用于深色版块底色和渐变的起始色。这两档不参与「实心主色 + 前景」的搭配，所以单独说明，不在上面的色卡里。

### 主色上的前景

`primary-ink` 是「整片主色上的前景色」，默认 `#FFFFFF`。业务代码里画在主色上的文字取这个令牌，而不是直接写 `white` 或 `#fff`：品牌绿上的白字对比度是 **{{ whiteContrast }}:1**，低于 WCAG AA 要求的 4.5:1；主色偏亮、需要更强可读性时把它覆写成墨绿 `#073B2A`，同一块主色上的字就变成 **{{ inkContrast }}:1**。

<div class="ink-demo">
    <div class="ink-demo__sample" :style="{ background: inkSample.bg, color: inkSample.ink }">
        <strong>整片主色上的前景</strong>
        <small>品牌绿 #06D290 上的 primaryInk #FFFFFF</small>
    </div>
    <div class="ink-demo__sample" :style="{ background: inkSample.bg, color: inkSample.alt }">
        <strong>换成墨绿后的同一块主色</strong>
        <small>把 primaryInk 覆写为 #073B2A</small>
    </div>
    <div class="ink-demo__meta">
        <code>--snake-color-primary-ink</code>
        <span>默认 <b>{{ whiteContrast }}:1</b>（WCAG AA 需 4.5:1）</span>
        <span>改成 <b>#073B2A</b> → <b>{{ inkContrast }}:1</b></span>
    </div>
</div>

::: warning 库内组件的反白前景
`snake-button`、`snake-tag` 这类组件内部的白字读的是 `--snake-color-white`（默认同为 `#FFFFFF`），还没有接 `primary-ink`。所以只覆写 `primaryInk` 不会改变组件里的文字颜色；要让实心主色上的组件文字一起换色，同一份主题里把 `white` 覆写成同一个值即可。
:::

## 辅助色

辅助色表达固定业务语义：成功、警告、错误和普通信息，不应仅因视觉偏好互换。每个语义色同样展开四档，暗色板整体提亮基色、压低浅色底，避免在深色背景上糊成一片。

<div class="color-grid">
    <div v-for="family in semanticFamilies" :key="family.token" class="color-card">
        <div class="color-card__head" :style="family.head">
            <strong>{{ family.name }}</strong>
            <small>{{ family.use }}</small>
            <code>--snake-color-{{ family.token }}</code>
            <em><span class="is-light">{{ family.light }}</span><span class="is-dark">{{ family.dark }}</span></em>
        </div>
        <div class="color-steps">
            <div v-for="step in family.steps" :key="step.token" class="color-step" :style="step.style">
                <span class="color-step__label">{{ step.label }}<code>-{{ step.token }}</code></span>
                <code class="color-step__hex"><span class="is-light">{{ step.light }}</span><span class="is-dark">{{ step.dark }}</span></code>
            </div>
        </div>
    </div>
</div>

## 文本与界面

文字用四级灰阶区分信息层级，界面用 `background` / `surface` / `surface-muted` 区分页面、卡片与轻量分区，`border` 画外框、`divider` 分隔内容。文字令牌不参与主题派生：改主色不会连带改灰阶，它们跟着明暗模式整体反转。

<div class="neutral-grid">
    <div v-for="swatch in swatches" :key="swatch.token" class="neutral-card">
        <i class="neutral-card__swatch" :style="{ '--light-bg': swatch.light, '--dark-bg': swatch.dark }"></i>
        <span>
            <strong>{{ swatch.name }}</strong>
            <code>--snake-color-{{ swatch.token }}</code>
            <small><span class="is-light">{{ swatch.light }}</span><span class="is-dark">{{ swatch.dark }}</span></small>
        </span>
    </div>
</div>

`text-muted` 只用于辅助信息，`text-light` 只用于占位符与禁用态；正文不要用它们。`surface` 在暗色下是纯黑 `#000000`、页面背景是 `#111827`，这样卡片靠底色而不是靠阴影浮起来。

## 遮罩与阴影

| Token                                             | 亮色                 | 暗色                 |
| ------------------------------------------------- | -------------------- | -------------------- |
| `--snake-color-mask`<br><small>弹层遮罩</small>   | `rgba(0, 0, 0, 0.4)` | `rgba(0, 0, 0, 0.6)` |
| `--snake-color-shadow`<br><small>浮层投影</small> | `rgba(0, 0, 0, 0.1)` | `rgba(0, 0, 0, 0.3)` |
| `--snake-color-white`<br><small>反白前景</small>  | `#FFFFFF`            | `#F5F6F7`            |
| `--snake-color-black`<br><small>纯黑对照</small>  | `#000000`            | `#F5F6F7`            |

暗色下 `white` 与 `black` 都取 `#F5F6F7`，这是有意为之：`white` 多用于「反白前景」，暗色里继续当白色用会变成一块刺眼的白斑；`black` 跟随同一个基线值，避免在深色界面上直接糊成纯黑。

## 在样式与脚本中使用

```scss
.action {
    color: var(--snake-color-primary-ink);
    background: var(--snake-color-primary);

    &:active {
        background: var(--snake-color-primary-dark);
    }
}

.action--quiet {
    // 10% 主色浅底 + 主色文字，比实心按钮更轻
    background: var(--snake-color-primary-light);
    color: var(--snake-color-primary);
}
```

```ts
import { useTheme } from '@puresnake/snake-ui';

const { color, isInDarkMode } = useTheme();

// color 是响应式对象，主题或明暗模式切换后自动更新
console.log(color.primary, color.primaryInk, isInDarkMode());
```

::: tip 需要自定义透明度
hex 令牌还有分量形式 `--snake-color-<name>-rgb`（例如 `6, 210, 144`），要自定义透明度就套进 `rgba()`：`rgba(var(--snake-color-primary-rgb, 6, 210, 144), 0.13)`。`mask` / `shadow` 本身就是 `rgba()`，没有分量形式；`-rgb` 由主题引擎在运行时补齐，静态 `theme.scss` 里只声明了组件真正用到的那十几个，其余取不到时用兜底值。
:::

## 工具类与 SCSS 变量

`index.scss` 除了引入主题变量，还导出了功能色与文字色工具类：令牌名去掉 `--snake-color-` 前缀再加 `snake-` 就是前景色，末尾补 `-bg` 是背景色。手写少量样式时比重复写 `var()` 更省事。

```html
<view class="snake-success-light-bg snake-text-muted">浅绿底 + 次要文字</view>
```

SCSS 里可以用等价别名 `$snake-color-primary`（`theme.scss` 中声明为 `!default`，需要编译期覆写时用）。完整类名见 `src/uni_modules/snake-ui/libs/css/color.scss`；定位、间距等布局类工具见[内置样式](/components/common)。

## 对比度与可读性

- 品牌绿 `#06D290` 上的白字只有 {{ whiteContrast }}:1，这是品牌色的固有权衡：实心主色块面积大、字号粗，按钮和标签可以照常用，但**正文不要压在主色上**；需要更高对比就把 `primaryInk` 换成 `#073B2A`（{{ inkContrast }}:1）。
- 自定义主色时先量对比度：`primaryInk` 与主色 ≥ 4.5:1 才算稳，示例页底部的读数会跟着主题实时变化。
- 状态色不要只靠颜色区分，同时配图标或文案，色觉障碍用户才能分辨。
- `text-light` 一类的低对比令牌只放在占位符、禁用态这类「本来就不需要读」的位置。

::: tip 多主题与暗黑模式
通过 `--snake-color-*` 或 `color` 读取颜色，不要在业务代码复制暗色值。主题配置方式见[多主题与暗黑模式](/guide/multi-theme)，读取令牌的 API 见 [useTheme](/tools/use-theme)。
:::

<style scoped>
.color-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(252px, 1fr));
    gap: 20px;
    margin: 16px 0 28px;
}
.color-grid--brand {
    max-width: 360px;
}
.color-card {
    overflow: hidden;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
}
.color-card__head {
    padding: 18px 20px 16px;
    background: var(--light-bg);
    color: var(--light-ink);
}
.dark .color-card__head {
    background: var(--dark-bg);
    color: var(--dark-ink);
}
.color-card__head strong,
.color-card__head small,
.color-card__head code,
.color-card__head em {
    display: block;
    color: inherit;
}
.color-card__head strong {
    font-size: 15px;
}
.color-card__head small {
    margin-top: 2px;
    font-size: 12px;
    opacity: 0.75;
}
.color-card__head code {
    margin-top: 10px;
    padding: 0;
    background: transparent;
    font-size: 12px;
}
.color-card__head em {
    margin-top: 1px;
    font-family: var(--vp-font-family-mono);
    font-size: 12px;
    font-style: normal;
    opacity: 0.8;
}
.color-steps {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
}
.color-step {
    padding: 9px 12px 10px;
    background: var(--light-bg);
    color: var(--light-ink);
    box-shadow: inset 0 0 0 1px rgba(128, 128, 128, 0.16);
}
.dark .color-step {
    background: var(--dark-bg);
    color: var(--dark-ink);
}
.color-step__label {
    display: block;
    font-size: 11px;
    font-weight: 600;
}
.color-step__label code {
    margin-left: 3px;
    padding: 0;
    background: transparent;
    color: inherit;
    font-size: 11px;
    font-weight: 400;
    opacity: 0.72;
}
.color-step__hex {
    display: block;
    margin-top: 1px;
    padding: 0;
    background: transparent;
    color: inherit;
    font-size: 11px;
    opacity: 0.9;
}
.ink-demo {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 12px;
    margin: 16px 0 24px;
}
.ink-demo__sample {
    padding: 16px 18px;
    border-radius: 10px;
}
.ink-demo__sample strong,
.ink-demo__sample small {
    display: block;
}
.ink-demo__sample strong {
    font-size: 15px;
}
.ink-demo__sample small {
    margin-top: 2px;
    font-family: var(--vp-font-family-mono);
    font-size: 11px;
    opacity: 0.8;
}
.ink-demo__meta {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    padding: 14px 16px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
    font-size: 12px;
    color: var(--vp-c-text-2);
}
.ink-demo__meta code {
    padding: 0;
    background: transparent;
    color: var(--vp-c-text-1);
    font-size: 12px;
}
.ink-demo__meta b {
    color: var(--vp-c-text-1);
}
.neutral-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 12px;
    margin: 20px 0 24px;
}
.neutral-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 10px;
}
.neutral-card__swatch {
    width: 50px;
    height: 50px;
    flex: none;
    background: var(--light-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 6px;
}
.dark .neutral-card__swatch {
    background: var(--dark-bg);
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
    font-family: var(--vp-font-family-mono);
    font-size: 11px;
    color: var(--vp-c-text-2);
}
.is-dark {
    display: none;
}
.dark .is-light {
    display: none;
}
.dark .is-dark {
    display: inline;
}
:deep(table) code {
    white-space: nowrap;
}
:deep(table) small {
    font-size: 11px;
    color: var(--vp-c-text-3);
}
@media (max-width: 640px) {
    .color-grid,
    .neutral-grid,
    .ink-demo {
        grid-template-columns: 1fr;
    }
}
</style>
