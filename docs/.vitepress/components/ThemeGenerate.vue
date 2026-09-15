<template>
    <div class="tg">
        <div class="tg-toolbar">
            <span class="tg-toolbar__label">色票分组</span>
            <span class="tg-toolbar__actions">
                <button type="button" class="tg-btn tg-btn--mini" @click="expandAll">全部展开</button>
                <span class="tg-toolbar__divider" />
                <button type="button" class="tg-btn tg-btn--mini" @click="collapseAll">全部折叠</button>
            </span>
        </div>

        <div v-if="restoredHint" class="tg-restored">{{ restoredHint }}</div>

        <p class="tg-intro">请为下列色票选择颜色，支持可选的暗黑模式色值。支持智能生成颜色值、随机主题颜色等。</p>

        <section v-for="section in colorSections" :key="section.id" class="tg-section">
            <header class="tg-section__header">
                <div>
                    <h3 class="tg-section__title">{{ section.label }}</h3>
                    <p v-if="section.desc" class="tg-section__desc">{{ section.desc }}</p>
                </div>
            </header>
            <div v-for="group in section.groups" :key="group.id" class="tg-group">
                <div class="tg-group__header">
                    <span class="tg-group__label">{{ group.label }}</span>
                    <span class="tg-group__actions">
                        <button
                            v-if="group.random && !collapsed[group.id]"
                            type="button"
                            class="tg-btn tg-btn--mini tg-btn--green"
                            @click="randomizeTheme"
                        >
                            随机主题
                        </button>
                        <button
                            v-if="group.smart && !collapsed[group.id]"
                            type="button"
                            class="tg-btn tg-btn--mini tg-btn--primary"
                            @click="smartGenerateGroup(group)"
                        >
                            智能生成
                        </button>
                        <button type="button" class="tg-btn tg-btn--mini" @click="toggleGroup(group.id)">
                            {{ collapsed[group.id] ? '展开' : '折叠' }}
                        </button>
                    </span>
                </div>
                <div v-if="!collapsed[group.id]" class="tg-grid">
                    <div
                        v-for="key in group.keys"
                        :key="key"
                        class="tg-card"
                        role="button"
                        tabindex="0"
                        @click="openPicker('light', key)"
                        @keydown.enter="openPicker('light', key)"
                    >
                        <div class="tg-card__swatch" :style="swatchStyle('light', key)">
                            <span class="tg-card__name">{{ tokenLabels[key] }}</span>
                            <span class="tg-card__value">{{ light[key] }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="tg-preview">
            <header class="tg-preview__header">
                <h3 class="tg-preview__title">实时预览</h3>
            </header>
            <div class="tg-preview-area" :style="previewStyle">
                <div class="tg-preview-swatches">
                    <span v-for="swatch in previewSwatches" :key="swatch.key" class="tg-preview-swatch">
                        <span class="tg-preview-swatch__dot" :style="{ background: swatch.value }" />
                        <span class="tg-preview-swatch__label">{{ swatch.label }}</span>
                    </span>
                </div>
                <div class="tg-preview-top">
                    <button type="button" class="tg-preview-btn tg-preview-btn--primary">主按钮</button>
                    <button type="button" class="tg-preview-btn tg-preview-btn--ghost">次按钮</button>
                </div>
                <div class="tg-preview-card">
                    <h4 class="tg-preview-card__title">卡片标题</h4>
                    <p class="tg-preview-card__text">这是一段示例内容，用于展示文字色与背景色的搭配。</p>
                    <div class="tg-preview-chips">
                        <span class="tg-preview-chip tg-preview-chip--success">成功</span>
                        <span class="tg-preview-chip tg-preview-chip--warning">警告</span>
                        <span class="tg-preview-chip tg-preview-chip--info">信息</span>
                    </div>
                </div>
            </div>
        </section>

        <div class="tg-darkbar">
            <button
                type="button"
                class="tg-switch"
                :class="{ 'tg-switch--on': darkEnabled }"
                role="switch"
                :aria-checked="darkEnabled"
                @click="toggleDark"
            >
                <span class="tg-switch__knob" />
            </button>
            <span class="tg-darkbar__text">启用暗黑色值（可选）</span>
            <button
                type="button"
                class="tg-btn tg-btn--mini tg-btn--primary"
                :disabled="!darkEnabled"
                @click="refreshDark"
            >
                刷新暗黑色值
            </button>
        </div>
        <p class="tg-darkbar__note">提示：开启暗黑色值后，系统会基于亮色方案智能生成暗黑初始色值，您可以逐项覆盖。</p>

        <div v-if="darkEnabled" class="tg-dark">
            <p class="tg-dark__hint">暗黑色值（可选，默认由亮色智能生成）：</p>
            <section v-for="section in colorSections" :key="'dark-' + section.id" class="tg-section tg-section--dark">
                <header class="tg-section__header">
                    <h3 class="tg-section__title">dark - {{ section.label }}</h3>
                </header>
                <div v-for="group in section.groups" :key="'dark-group-' + group.id" class="tg-group tg-group--compact">
                    <span class="tg-group__label">{{ group.label }}</span>
                    <div class="tg-grid">
                        <div
                            v-for="key in group.keys"
                            :key="'d-' + key"
                            class="tg-card"
                            role="button"
                            tabindex="0"
                            @click="openPicker('dark', key)"
                            @keydown.enter="openPicker('dark', key)"
                        >
                            <div class="tg-card__swatch" :style="swatchStyle('dark', key)">
                                <span class="tg-card__name">dark - {{ tokenLabels[key] }}</span>
                                <span class="tg-card__value">{{ dark[key] }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <section class="tg-meta">
            <p class="tg-meta__tip">请填写主题元信息（name/label/description），为上述已选择颜色赋予名称。</p>
            <div class="tg-meta-row">
                <input class="tg-input" v-model="draftName" placeholder="name（英文必填，如 blue）" />
                <input class="tg-input" v-model="draftLabel" placeholder="label（显示名称，如 蓝色）" />
                <input
                    class="tg-input tg-input--wide"
                    v-model="draftDescription"
                    placeholder="description（简短描述）"
                />
            </div>
            <p class="tg-meta-tip">
                如需多个主题，请先将当前已配置好的变量添加到导出队列，继续进行下一套主题配置，最后导出即可！
            </p>
            <div class="tg-actions">
                <button type="button" class="tg-btn" @click="resetAll">重置</button>
                <button type="button" class="tg-btn tg-btn--info" @click="addToQueue">添加到导出队列</button>
                <button type="button" class="tg-btn tg-btn--danger" @click="clearQueue">清空队列</button>
                <button type="button" class="tg-btn tg-btn--primary" @click="exportThemes">导出</button>
                <button type="button" class="tg-btn tg-btn--ghost" @click="copyCode">复制代码</button>
            </div>
            <div v-if="queued.length" class="tg-queue">
                <p class="tg-queue__title">导出队列（{{ queued.length }}）</p>
                <div v-for="(theme, index) in queued" :key="theme.name" class="tg-queue-item">
                    <span class="tg-queue-item__swatch" :style="{ background: theme.color.primary }" />
                    <span class="tg-queue-item__info">{{ index + 1 }}. {{ theme.label }}（{{ theme.name }}）</span>
                    <button type="button" class="tg-queue-item__remove" @click="removeFromQueue(index)">移除</button>
                </div>
            </div>
            <p class="tg-export-hint">
                导出文件为 snake-ui.theme.ts，覆盖 demo 工程 src/snake-ui.theme.ts 后重新编译即可使用。
            </p>
        </section>

        <div v-if="picker.visible" class="tg-mask" @click="cancelPicker">
            <div class="tg-dialog" role="dialog" @click.stop>
                <p class="tg-dialog__title">{{ tokenLabels[picker.key] }}（{{ picker.key }}）</p>
                <div class="tg-dialog__body">
                    <div
                        class="tg-sv"
                        :style="svPanelStyle"
                        @pointerdown.prevent.stop="onPanelDown"
                        @pointermove="onPanelMove"
                        @pointerup="onPanelUp"
                        @pointercancel="onPanelUp"
                    >
                        <div class="tg-sv__handle" :style="svHandleStyle" />
                    </div>
                    <div
                        class="tg-hue"
                        :style="hueBarStyle"
                        @pointerdown.prevent.stop="onHueDown"
                        @pointermove="onHueMove"
                        @pointerup="onHueUp"
                        @pointercancel="onHueUp"
                    >
                        <div class="tg-hue__handle" :style="hueHandleStyle" />
                    </div>
                    <div class="tg-field">
                        <span class="tg-field__label">颜色值</span>
                        <input class="tg-field__input" v-model="picker.draft" placeholder="#RRGGBB" />
                    </div>
                    <div class="tg-presets">
                        <button
                            v-for="preset in presetColors"
                            :key="preset"
                            type="button"
                            class="tg-preset"
                            :style="{ background: preset }"
                            @click="applyPreset(preset)"
                        />
                    </div>
                </div>
                <div class="tg-dialog__footer">
                    <button type="button" class="tg-btn tg-btn--mini" @click="cancelPicker">取消</button>
                    <button type="button" class="tg-btn tg-btn--mini tg-btn--primary" @click="confirmPicker">
                        确定
                    </button>
                </div>
            </div>
        </div>

        <transition name="tg-toast">
            <div v-if="toast" class="tg-toast" :class="`tg-toast--${toast.type}`">{{ toast.text }}</div>
        </transition>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';

type ColorKey =
    | 'primary'
    | 'primaryDark'
    | 'primaryDeep'
    | 'primaryDeeper'
    | 'primaryDisabled'
    | 'primaryLight'
    | 'primaryInk'
    | 'success'
    | 'successDark'
    | 'successDisabled'
    | 'successLight'
    | 'warning'
    | 'warningDark'
    | 'warningDisabled'
    | 'warningLight'
    | 'error'
    | 'errorDark'
    | 'errorDisabled'
    | 'errorLight'
    | 'info'
    | 'infoDark'
    | 'infoDisabled'
    | 'infoLight'
    | 'white'
    | 'black'
    | 'text'
    | 'textSecondary'
    | 'textMuted'
    | 'textLight'
    | 'border'
    | 'divider'
    | 'mask'
    | 'shadow'
    | 'background'
    | 'surface'
    | 'surfaceMuted'
    | 'notice'
    | 'noticeBackground';

type PaletteMode = 'light' | 'dark';
type FamilyName = 'success' | 'warning' | 'error' | 'info';

interface QueuedTheme {
    name: string;
    label: string;
    description: string;
    color: Record<ColorKey, string>;
    darkColor: Record<ColorKey, string>;
}

interface Hsl {
    h: number;
    s: number;
    l: number;
}

interface Rgb {
    r: number;
    g: number;
    b: number;
}

interface ColorGroupDef {
    id: string;
    label: string;
    keys: ColorKey[];
    random?: boolean;
    smart?: boolean;
}

interface ColorSectionDef {
    id: string;
    label: string;
    desc?: string;
    groups: ColorGroupDef[];
}

interface StoredDraft {
    savedAt: string;
    light: Record<ColorKey, string>;
    dark: Record<ColorKey, string>;
    darkEnabled: boolean;
    manualDarkKeys: ColorKey[];
    name: string;
    label: string;
    description: string;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

function hexToRgb(hex: string): Rgb | undefined {
    const match = /^#([0-9a-f]{6})$/i.exec(hex.trim());
    if (!match) return undefined;
    const value = Number.parseInt(match[1], 16);
    return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

function rgbToHex({ r, g, b }: Rgb): string {
    const channel = (value: number) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, '0');
    return `#${channel(r)}${channel(g)}${channel(b)}`;
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const delta = max - min;
    let h = 0;
    if (delta !== 0) {
        if (max === rn) h = 60 * (((gn - bn) / delta) % 6);
        else if (max === gn) h = 60 * ((bn - rn) / delta + 2);
        else h = 60 * ((rn - gn) / delta + 4);
    }
    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    return { h: (h + 360) % 360, s: s * 100, l: l * 100 };
}

function hslToHex({ h, s, l }: Hsl): string {
    const hn = (((h % 360) + 360) % 360) / 360;
    const sn = clamp(s, 0, 100) / 100;
    const ln = clamp(l, 0, 100) / 100;
    const c = (1 - Math.abs(2 * ln - 1)) * sn;
    const x = c * (1 - Math.abs(((hn * 6) % 2) - 1));
    const m = ln - c / 2;
    let rn = 0;
    let gn = 0;
    let bn = 0;
    if (hn < 1 / 6) {
        rn = c;
        gn = x;
    } else if (hn < 2 / 6) {
        rn = x;
        gn = c;
    } else if (hn < 3 / 6) {
        gn = c;
        bn = x;
    } else if (hn < 4 / 6) {
        gn = x;
        bn = c;
    } else if (hn < 5 / 6) {
        rn = x;
        bn = c;
    } else {
        rn = c;
        bn = x;
    }
    return rgbToHex({ r: (rn + m) * 255, g: (gn + m) * 255, b: (bn + m) * 255 });
}

function hexToHsl(hex: string): Hsl | undefined {
    const rgb = hexToRgb(hex);
    return rgb ? rgbToHsl(rgb) : undefined;
}

function adjustLightness(hex: string, delta: number): string {
    const hsl = hexToHsl(hex);
    if (!hsl) return hex;
    return hslToHex({ ...hsl, l: clamp(hsl.l + delta, 0, 100) });
}

function buildDarkFamily(hex: string, lightRatio: number, saturationRatio: number, lightnessOffset: number): string {
    const hsl = hexToHsl(hex);
    if (!hsl) return hex;
    return hslToHex({
        h: hsl.h,
        s: clamp(hsl.s * saturationRatio, 0, 100),
        l: clamp(hsl.l * lightRatio + lightnessOffset, 4, 100)
    });
}

function luminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    const channel = (value: number) => {
        const n = value / 255;
        return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

const snakeLightPalette: Record<ColorKey, string> = {
    primary: '#06D290',
    primaryDark: '#2EBD7C',
    primaryDeep: '#26273A',
    primaryDeeper: '#22242E',
    primaryDisabled: '#A6EBD3',
    primaryLight: '#EEFFE0',
    primaryInk: '#FFFFFF',
    success: '#06D290',
    successDark: '#2EBD7C',
    successDisabled: '#A6EBD3',
    successLight: '#EEFFE0',
    warning: '#FF6A0C',
    warningDark: '#E05D0B',
    warningDisabled: '#E2C0AB',
    warningLight: '#F9F1EC',
    error: '#FE0832',
    errorDark: '#E0072C',
    errorDisabled: '#DDA5AF',
    errorLight: '#F7EBED',
    info: '#2D57E7',
    infoDark: '#284DCB',
    infoDisabled: '#B2BBDB',
    infoLight: '#EEF0F7',
    white: '#ffffff',
    black: '#000000',
    text: '#0F1113',
    textSecondary: '#404155',
    textMuted: '#707184',
    textLight: '#B1B2C1',
    border: '#E8E8E8',
    divider: '#DBDCE2',
    mask: 'rgba(0, 0, 0, 0.45)',
    shadow: 'rgba(7, 7, 7, 0.12)',
    background: '#F6F6F6',
    surface: '#ffffff',
    surfaceMuted: '#F6F6F6',
    notice: '#FF6A0C',
    noticeBackground: '#F9F1EC'
};

const snakeDarkPalette: Record<ColorKey, string> = {
    primary: '#06D290',
    primaryDark: '#2EE6A8',
    primaryDeep: '#1A1B29',
    primaryDeeper: '#14151F',
    primaryDisabled: '#1E3A31',
    primaryLight: '#0C2A1E',
    primaryInk: '#26273A',
    success: '#06D290',
    successDark: '#2EBD7C',
    successDisabled: '#1E3A31',
    successLight: '#0C2A1E',
    warning: '#FFAD79',
    warningDark: '#FFB789',
    warningDisabled: '#432818',
    warningLight: '#1E120B',
    error: '#FFA9B7',
    errorDark: '#FFB3C0',
    errorDisabled: '#3F141B',
    errorLight: '#1D090C',
    info: '#B5C4F7',
    infoDark: '#BECBF8',
    infoDisabled: '#1D243E',
    infoLight: '#0D111C',
    white: '#ffffff',
    black: '#000000',
    text: '#FFFFFF',
    textSecondary: '#D6D8E8',
    textMuted: '#9CA0B8',
    textLight: '#6B6E82',
    border: '#2E3040',
    divider: '#282A37',
    mask: 'rgba(0, 0, 0, 0.66)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    background: '#111111',
    surface: '#1B1D24',
    surfaceMuted: '#22242E',
    notice: '#FFAD79',
    noticeBackground: '#1E120B'
};

const fixedDarkValues: Partial<Record<ColorKey, string>> = {
    white: '#ffffff',
    black: '#000000',
    text: '#FFFFFF',
    textSecondary: '#D6D8E8',
    textMuted: '#9CA0B8',
    textLight: '#6B6E82',
    border: '#2E3040',
    divider: '#282A37',
    mask: 'rgba(0, 0, 0, 0.66)',
    shadow: 'rgba(0, 0, 0, 0.4)',
    background: '#111111',
    surface: '#1B1D24',
    surfaceMuted: '#22242E',
    primaryInk: '#26273A'
};

function smartDarkValue(key: ColorKey, lightValue: string, lightPalette: Record<ColorKey, string>): string {
    const fixed = fixedDarkValues[key];
    if (fixed) return fixed;
    if (key === 'notice') return smartDarkValue('warning', lightPalette.warning, lightPalette);
    if (key === 'noticeBackground') return smartDarkValue('warningLight', lightPalette.warningLight, lightPalette);
    if (key.endsWith('Deeper')) return buildDarkFamily(lightValue, 0.14, 0.6, 5);
    if (key.endsWith('Deep')) return buildDarkFamily(lightValue, 0.2, 0.5, 8);
    if (key.endsWith('Disabled')) return buildDarkFamily(lightValue, 0.42, 0.3, 8);
    if (key.endsWith('Light')) return buildDarkFamily(lightValue, 0.16, 0.45, 6);
    if (key.endsWith('Dark')) return adjustLightness(lightValue, 16);
    return adjustLightness(lightValue, 14);
}
const tokenLabels: Record<ColorKey, string> = {
    primary: '主题色',
    primaryDark: '主题色(深)',
    primaryDeep: '主题色(深锚点)',
    primaryDeeper: '主题色(渐变深)',
    primaryDisabled: '主题色(禁用)',
    primaryLight: '主题色(淡)',
    primaryInk: '实心按钮文字',
    success: '成功色',
    successDark: '成功色(深)',
    successDisabled: '成功(禁用)',
    successLight: '成功(淡)',
    warning: '警告色',
    warningDark: '警告色(深)',
    warningDisabled: '警告(禁用)',
    warningLight: '警告(淡)',
    error: '错误色',
    errorDark: '错误色(深)',
    errorDisabled: '错误(禁用)',
    errorLight: '错误(淡)',
    info: '信息色',
    infoDark: '信息色(深)',
    infoDisabled: '信息(禁用)',
    infoLight: '信息(淡)',
    white: '纯白色值',
    black: '纯黑色值',
    text: '主要文字',
    textSecondary: '常规文字',
    textMuted: '提示文字',
    textLight: '占位/弱色',
    border: '边框颜色',
    divider: '分割线',
    mask: '遮罩颜色',
    shadow: '阴影颜色',
    background: '页面背景',
    surface: '卡片表面',
    surfaceMuted: '浅灰表面',
    notice: '通知色',
    noticeBackground: '通知底色'
};

const colorSections: ColorSectionDef[] = [
    {
        id: 'brand',
        label: '品牌与状态',
        desc: '主题主色与成功/警告/错误/信息色阶梯',
        groups: [
            {
                id: 'theme',
                label: '主题色',
                random: true,
                smart: true,
                keys: [
                    'primary',
                    'primaryDark',
                    'primaryDeep',
                    'primaryDeeper',
                    'primaryDisabled',
                    'primaryLight',
                    'primaryInk'
                ]
            },
            { id: 'error', label: '错误色', smart: true, keys: ['error', 'errorDark', 'errorDisabled', 'errorLight'] },
            {
                id: 'warning',
                label: '警告色',
                smart: true,
                keys: ['warning', 'warningDark', 'warningDisabled', 'warningLight']
            },
            { id: 'info', label: '信息色', smart: true, keys: ['info', 'infoDark', 'infoDisabled', 'infoLight'] },
            {
                id: 'success',
                label: '成功色',
                smart: true,
                keys: ['success', 'successDark', 'successDisabled', 'successLight']
            }
        ]
    },
    {
        id: 'content',
        label: '文本与描边',
        desc: '文字、提示与描边需要清晰的层级关系',
        groups: [
            {
                id: 'text',
                label: '文字阶梯',
                keys: ['white', 'text', 'textSecondary', 'textMuted', 'textLight', 'black']
            },
            { id: 'border', label: '描边与分割', keys: ['border', 'divider'] }
        ]
    },
    {
        id: 'surface',
        label: '背景与表面',
        desc: '背景、卡片、表面根据明暗形成阶梯',
        groups: [{ id: 'surface', label: '表面阶梯', keys: ['background', 'surface', 'surfaceMuted'] }]
    },
    {
        id: 'notice',
        label: '通知与浮层',
        desc: '通知色与遮罩阴影',
        groups: [
            { id: 'notice', label: '通知色', keys: ['notice', 'noticeBackground'] },
            { id: 'overlay', label: '遮罩/阴影', keys: ['mask', 'shadow'] }
        ]
    }
];

const paletteKeys = Object.keys(snakeLightPalette) as ColorKey[];
const brandKeys: ColorKey[] = [
    'primary',
    'primaryDark',
    'primaryDeep',
    'primaryDeeper',
    'primaryDisabled',
    'primaryLight',
    'primaryInk',
    'success',
    'successDark',
    'successDisabled',
    'successLight',
    'warning',
    'warningDark',
    'warningDisabled',
    'warningLight',
    'error',
    'errorDark',
    'errorDisabled',
    'errorLight',
    'info',
    'infoDark',
    'infoDisabled',
    'infoLight',
    'notice',
    'noticeBackground'
];
const HEX_RE = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB_RE = /^rgba?\(\s*\d{1,3}\s*(,\s*\d{1,3}\s*){2}(,\s*[\d.]+\s*)?\)$/i;

function normalizeHex(value: string): string {
    if (/^#([0-9a-f]{3})$/i.test(value)) {
        return value.replace(/^#(.)(.)(.)$/, '#$1$1$2$2$3$3');
    }
    return value;
}

const light = reactive<Record<ColorKey, string>>({ ...snakeLightPalette });
const dark = reactive<Record<ColorKey, string>>({ ...snakeDarkPalette });
const darkEnabled = ref(false);
const manualDarkKeys = ref<Set<ColorKey>>(new Set());
const collapsed = reactive<Record<string, boolean>>({});
const draftName = ref('');
const draftLabel = ref('');
const draftDescription = ref('');
const queued = ref<QueuedTheme[]>([]);
const restoredHint = ref('');
const toast = ref<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
let toastTimer: ReturnType<typeof setTimeout> | undefined;

function notify(text: string, type: 'success' | 'error' | 'info' = 'info'): void {
    toast.value = { text, type };
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.value = null), 2400);
}

function randomHsl(): Hsl {
    return {
        h: Math.floor(Math.random() * 360),
        s: Math.floor(60 + Math.random() * 25),
        l: Math.floor(45 + Math.random() * 14)
    };
}

function themeFamilyFromBase(hex: string): Partial<Record<ColorKey, string>> {
    const base = hexToHsl(hex);
    if (!base) return { primary: hex };
    return {
        primary: hex,
        primaryDark: hslToHex({ ...base, l: clamp(base.l - 6, 4, 100) }),
        primaryDeep: hslToHex({ ...base, s: base.s * 0.9, l: 20 }),
        primaryDeeper: hslToHex({ ...base, s: base.s, l: 13 }),
        primaryDisabled: hslToHex({ ...base, s: base.s * 0.35, l: 82 }),
        primaryLight: hslToHex({ ...base, s: base.s * 0.5, l: 96 }),
        primaryInk: base.l < 58 ? '#FFFFFF' : '#26273A'
    };
}

function statusFamilyFromBase(hex: string, family: FamilyName): Partial<Record<ColorKey, string>> {
    const base = hexToHsl(hex);
    if (!base) return { [family]: hex } as Partial<Record<ColorKey, string>>;
    const darkKey = `${family}Dark` as ColorKey;
    const disabledKey = `${family}Disabled` as ColorKey;
    const lightKey = `${family}Light` as ColorKey;
    return {
        [family]: hex,
        [darkKey]: hslToHex({ ...base, l: clamp(base.l - 5, 4, 100) }),
        [disabledKey]: hslToHex({ ...base, s: clamp(base.s * 0.35, 0, 100), l: 84 }),
        [lightKey]: hslToHex({ ...base, s: clamp(base.s * 0.45, 0, 100), l: 96 })
    } as Partial<Record<ColorKey, string>>;
}

function syncDarkFor(keys: ColorKey[]): void {
    if (!darkEnabled.value) return;
    keys.forEach(key => {
        if (!manualDarkKeys.value.has(key)) dark[key] = smartDarkValue(key, light[key], light);
    });
}

function regenerateDark(): void {
    paletteKeys.forEach(key => {
        dark[key] = smartDarkValue(key, light[key], light);
    });
    manualDarkKeys.value = new Set();
    notify('已根据当前亮色重新生成暗黑色值', 'success');
}

function toggleDark(): void {
    darkEnabled.value = !darkEnabled.value;
    if (darkEnabled.value) regenerateDark();
}

function refreshDark(): void {
    if (!darkEnabled.value) return;
    regenerateDark();
}

function randomizeTheme(): void {
    Object.assign(light, themeFamilyFromBase(hslToHex(randomHsl())));
    (['success', 'warning', 'error', 'info'] as FamilyName[]).forEach(family => {
        Object.assign(light, statusFamilyFromBase(hslToHex(randomHsl()), family));
    });
    syncDarkFor(brandKeys);
    notify('已随机生成一套主题色', 'success');
}

function smartGenerateGroup(group: ColorGroupDef): void {
    if (group.id === 'theme') {
        Object.assign(light, themeFamilyFromBase(light.primary));
    } else if (group.id === 'success' || group.id === 'warning' || group.id === 'error' || group.id === 'info') {
        Object.assign(light, statusFamilyFromBase(light[group.id], group.id));
    } else {
        return;
    }
    syncDarkFor(group.keys);
    notify(`${group.label}已生成梯度`, 'success');
}

function commitToken(mode: PaletteMode, key: ColorKey, raw: string): void {
    const value = raw.trim();
    const target = mode === 'light' ? light : dark;
    if (HEX_RE.test(value)) {
        target[key] = normalizeHex(value);
        if (mode === 'dark') manualDarkKeys.value.add(key);
        if (mode === 'light' && darkEnabled.value && !manualDarkKeys.value.has(key)) {
            dark[key] = smartDarkValue(key, target[key], light);
        }
    } else if (RGB_RE.test(value)) {
        target[key] = value;
        if (mode === 'dark') manualDarkKeys.value.add(key);
    }
}

function toggleGroup(id: string): void {
    collapsed[id] = !collapsed[id];
}

function expandAll(): void {
    colorSections.forEach(section => section.groups.forEach(group => (collapsed[group.id] = false)));
}

function collapseAll(): void {
    colorSections.forEach(section => section.groups.forEach(group => (collapsed[group.id] = true)));
}

const previewStyle = computed<Record<string, string>>(() => {
    const palette = darkEnabled.value ? dark : light;
    return {
        background: palette.background,
        color: palette.text,
        '--pv-primary': palette.primary,
        '--pv-primary-ink': contrastColor(palette.primary),
        '--pv-success': palette.success,
        '--pv-warning': palette.warning,
        '--pv-info': palette.info,
        '--pv-error': palette.error,
        '--pv-card-bg': palette.surface,
        '--pv-card-text': palette.text,
        '--pv-muted-text': palette.textMuted,
        '--pv-border-color': palette.border
    };
});

const previewSwatches = computed(() =>
    (['primary', 'success', 'warning', 'error', 'info'] as const).map(key => ({
        key,
        label: tokenLabels[key],
        value: darkEnabled.value ? dark[key] : light[key]
    }))
);

function hexOf(value: string): string {
    const trimmed = value.trim();
    const hexMatch = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(trimmed);
    if (hexMatch) return normalizeHex(trimmed);
    const rgbMatch = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*[\d.]+\s*)?\)$/i.exec(trimmed);
    if (rgbMatch) return rgbToHex({ r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) });
    return '#ffffff';
}

function contrastColor(value: string): string {
    return luminance(hexOf(value)) > 0.5 ? '#26273A' : '#ffffff';
}

function swatchStyle(mode: PaletteMode, key: ColorKey): Record<string, string> {
    const value = mode === 'light' ? light[key] : dark[key];
    return { background: value, color: contrastColor(value) };
}
interface PickerState {
    visible: boolean;
    mode: PaletteMode;
    key: ColorKey;
    draft: string;
    hue: number;
    alpha: number | null;
}

const picker = reactive<PickerState>({
    visible: false,
    mode: 'light',
    key: 'primary',
    draft: '#06D290',
    hue: 160,
    alpha: null
});
let panelDragging = false;
let hueDragging = false;

function parseAlpha(value: string): number | null {
    const match = /^rgba\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)$/i.exec(value);
    return match ? clamp(Number(match[1]), 0, 1) : null;
}

function openPicker(mode: PaletteMode, key: ColorKey): void {
    const value = mode === 'light' ? light[key] : dark[key];
    picker.mode = mode;
    picker.key = key;
    picker.alpha = parseAlpha(value);
    picker.draft = hexOf(value);
    const hsl = hexToHsl(picker.draft);
    picker.hue = hsl ? Math.round(hsl.h) : 0;
    picker.visible = true;
}

function cancelPicker(): void {
    picker.visible = false;
}

function confirmPicker(): void {
    const raw = picker.draft.trim();
    if (HEX_RE.test(raw)) {
        const hex = normalizeHex(raw);
        const value = picker.alpha != null && picker.alpha < 1 ? rgbaFromHex(hex, picker.alpha) : hex;
        commitToken(picker.mode, picker.key, value);
        picker.visible = false;
    } else if (RGB_RE.test(raw)) {
        commitToken(picker.mode, picker.key, raw);
        picker.visible = false;
    } else {
        notify('颜色格式无效，请输入 #RRGGBB 或 rgba()', 'error');
    }
}

function rgbaFromHex(hex: string, alpha: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

function applyPreset(preset: string): void {
    picker.draft = hexOf(preset);
    const hsl = hexToHsl(picker.draft);
    if (hsl) picker.hue = Math.round(hsl.h);
}

const presetColors = computed<string[]>(() => {
    const brands = (['primary', 'success', 'warning', 'error', 'info'] as const).map(key => light[key]);
    const base = [
        '#06D290',
        '#2979FF',
        '#2D57E7',
        '#7C3AED',
        '#FF6A0C',
        '#FA3534',
        '#19BE6B',
        '#FF9900',
        '#909399',
        '#E74C3C',
        '#0F1113',
        '#F6F6F6',
        '#FFFFFF',
        '#000000'
    ];
    return Array.from(new Set([...brands, ...base]));
});

const svPanelStyle = computed(() => ({
    background: `linear-gradient(to top, #000 0%, rgba(0,0,0,0) 100%), linear-gradient(to right, #fff 0%, hsl(${picker.hue}, 100%, 50%) 100%)`
}));

const hueBarStyle = computed(() => ({
    background: 'linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)'
}));

const svHandleStyle = computed(() => {
    const hsl = hexToHsl(hexOf(picker.draft));
    const s = hsl ? hsl.s : 100;
    const l = hsl ? hsl.l : 50;
    return { left: `${s}%`, top: `${100 - l}%` };
});

const hueHandleStyle = computed(() => ({ left: `${(picker.hue / 360) * 100}%` }));

function pointerPosition(event: PointerEvent): { x: number; y: number } | null {
    const el = event.currentTarget as HTMLElement | null;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    return {
        x: clamp(event.clientX - rect.left, 0, rect.width),
        y: clamp(event.clientY - rect.top, 0, rect.height)
    };
}

function onPanelDown(event: PointerEvent): void {
    panelDragging = true;
    (event.currentTarget as HTMLElement)?.setPointerCapture?.(event.pointerId);
    applyPanel(event);
}

function onPanelMove(event: PointerEvent): void {
    if (panelDragging) applyPanel(event);
}

function onPanelUp(): void {
    panelDragging = false;
}

function applyPanel(event: PointerEvent): void {
    const pos = pointerPosition(event);
    if (!pos) return;
    const s = (pos.x / (event.currentTarget as HTMLElement).getBoundingClientRect().width) * 100;
    const l = 100 - (pos.y / (event.currentTarget as HTMLElement).getBoundingClientRect().height) * 100;
    picker.draft = hslToHex({ h: picker.hue, s: clamp(s, 0, 100), l: clamp(l, 0, 100) });
}

function onHueDown(event: PointerEvent): void {
    hueDragging = true;
    (event.currentTarget as HTMLElement)?.setPointerCapture?.(event.pointerId);
    applyHue(event);
}

function onHueMove(event: PointerEvent): void {
    if (hueDragging) applyHue(event);
}

function onHueUp(): void {
    hueDragging = false;
}

function applyHue(event: PointerEvent): void {
    const pos = pointerPosition(event);
    if (!pos) return;
    const el = event.currentTarget as HTMLElement;
    picker.hue = Math.round((pos.x / el.getBoundingClientRect().width) * 360);
    const current = hexToHsl(hexOf(picker.draft)) || { h: 0, s: 100, l: 50 };
    picker.draft = hslToHex({ h: picker.hue, s: current.s, l: current.l });
}

watch(
    () => picker.draft,
    value => {
        if (!picker.visible) return;
        const trimmed = value.trim();
        if (HEX_RE.test(trimmed)) {
            const hsl = hexToHsl(normalizeHex(trimmed));
            if (hsl) picker.hue = Math.round(hsl.h);
        }
    }
);

function formatTime(date: Date): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const STORAGE_KEY = 'snake-ui.theme-generate';

function saveDraft(): void {
    if (typeof window === 'undefined') return;
    try {
        const data: StoredDraft = {
            savedAt: formatTime(new Date()),
            light: { ...light },
            dark: { ...dark },
            darkEnabled: darkEnabled.value,
            manualDarkKeys: Array.from(manualDarkKeys.value),
            name: draftName.value,
            label: draftLabel.value,
            description: draftDescription.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        /* 忽略存储异常 */
    }
}

function restoreDraft(): void {
    if (typeof window === 'undefined') return;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw) as StoredDraft;
        if (!data || typeof data !== 'object' || !data.light) return;
        Object.assign(light, data.light);
        Object.assign(dark, data.dark);
        darkEnabled.value = Boolean(data.darkEnabled);
        manualDarkKeys.value = new Set(data.manualDarkKeys || []);
        draftName.value = data.name || '';
        draftLabel.value = data.label || '';
        draftDescription.value = data.description || '';
        if (data.savedAt) restoredHint.value = `您于 ${data.savedAt} 配置过一次主题，已为您读取上一次的配置。`;
    } catch {
        /* 忽略恢复异常 */
    }
}

function clearStoredDraft(): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch {
        /* 忽略清理异常 */
    }
}

onMounted(restoreDraft);

function currentDraft(): QueuedTheme | undefined {
    const name = draftName.value.trim();
    const label = draftLabel.value.trim();
    if (!name) {
        notify('请先填写主题名称（name）', 'error');
        return undefined;
    }
    if (!/^[a-z][a-z0-9-]*$/.test(name)) {
        notify('name 需小写字母开头，仅含字母/数字/中划线', 'error');
        return undefined;
    }
    if (name === 'snake' || queued.value.some(theme => theme.name === name)) {
        notify(`主题名 ${name} 已被占用`, 'error');
        return undefined;
    }
    return {
        name,
        label: label || name,
        description: draftDescription.value.trim(),
        color: { ...light },
        darkColor: { ...dark }
    };
}

function addToQueue(): void {
    const draft = currentDraft();
    if (!draft) return;
    queued.value.push(draft);
    saveDraft();
    notify(`已加入导出队列：${draft.label || draft.name}`, 'success');
    draftName.value = '';
    draftLabel.value = '';
    draftDescription.value = '';
}

function removeFromQueue(index: number): void {
    queued.value.splice(index, 1);
}

function clearQueue(): void {
    queued.value = [];
}

const escapeTs = (value: string) => value.replace(/\\/g, '\\\\').replace(/'/g, `\\'`);

function diffEntries(palette: Record<ColorKey, string>, base: Record<ColorKey, string>): string[] {
    return paletteKeys
        .filter(key => palette[key] !== base[key])
        .map(key => `            ${key}: '${escapeTs(palette[key])}'`);
}

function themeToTs(theme: QueuedTheme): string {
    const lines: string[] = ['    {'];
    lines.push(`        name: '${escapeTs(theme.name)}'`);
    lines.push(`        label: '${escapeTs(theme.label)}'`);
    if (theme.description) lines.push(`        description: '${escapeTs(theme.description)}'`);
    const colorEntries = diffEntries(theme.color, snakeLightPalette);
    const darkEntries = diffEntries(theme.darkColor, snakeDarkPalette);
    lines.push('        color: {');
    lines.push(colorEntries.length ? colorEntries.join('\n') : '            /* 与默认亮色一致 */');
    lines.push('        }');
    if (darkEntries.length) {
        lines.push('        darkColor: {');
        lines.push(darkEntries.join('\n'));
        lines.push('        }');
    }
    lines.push('    }');
    return lines.join('\n');
}

function buildExportContent(themes: QueuedTheme[]): string {
    const lines: string[] = [];
    lines.push(`import { defaultSnakeTheme, type SnakeTheme } from './uni_modules/snake-ui';`);
    lines.push('');
    lines.push('/**');
    lines.push(' * Snake UI 主题预设 —— 由主题生成器导出');
    lines.push(` * 生成时间: ${new Date().toLocaleString('zh-CN')}`);
    lines.push(' * 用法: 覆盖 demo 工程 src/snake-ui.theme.ts 后重新编译即可。');
    lines.push(' */');
    lines.push('export const snakeThemePresets: SnakeTheme[] = [');
    lines.push('    defaultSnakeTheme,');
    themes.forEach((theme, index) => {
        lines.push(themeToTs(theme));
        if (index < themes.length - 1) lines.push('');
    });
    lines.push('];');
    lines.push('');
    lines.push('export default snakeThemePresets;');
    return lines.join('\n');
}

function resolveExportThemes(): QueuedTheme[] | undefined {
    const name = draftName.value.trim();
    if (queued.value.length) {
        if (!name) return queued.value;
        const draft = currentDraft();
        if (!draft) return undefined;
        return [...queued.value, draft];
    }
    const draft = currentDraft();
    if (!draft) return undefined;
    return [draft];
}

function downloadTextFile(content: string, filename: string): void {
    const blob = new Blob([content], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
}

function exportThemes(): void {
    const themes = resolveExportThemes();
    if (!themes) return;
    const content = buildExportContent(themes);
    saveDraft();
    downloadTextFile(content, 'snake-ui.theme.ts');
    notify('已导出 snake-ui.theme.ts', 'success');
}

async function copyCode(): Promise<void> {
    const themes = resolveExportThemes();
    if (!themes) return;
    try {
        await navigator.clipboard.writeText(buildExportContent(themes));
        notify('主题代码已复制', 'success');
    } catch {
        notify('复制失败，请使用导出功能', 'error');
    }
}

function resetAll(): void {
    const confirmed = typeof window !== 'undefined' && window.confirm('确定要重置主题吗？当前配置将恢复为默认色板。');
    if (!confirmed) return;
    Object.assign(light, snakeLightPalette);
    Object.assign(dark, snakeDarkPalette);
    manualDarkKeys.value = new Set();
    darkEnabled.value = false;
    draftName.value = '';
    draftLabel.value = '';
    draftDescription.value = '';
    restoredHint.value = '';
    queued.value = [];
    clearStoredDraft();
    notify('已重置为默认色板', 'success');
}
</script>
<style scoped>
.tg {
    --tg-bg: var(--vp-c-bg);
    --tg-bg-alt: var(--vp-c-bg-alt);
    --tg-border: var(--vp-c-divider);
    --tg-text: var(--vp-c-text-1);
    --tg-text-2: var(--vp-c-text-2);
    --tg-text-3: var(--vp-c-text-3);
    --tg-brand: var(--vp-c-brand-1);
    --tg-brand-soft: var(--vp-c-brand-soft);
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 24px 0;
}

.tg-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.tg-toolbar__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--tg-text-2);
}

.tg-toolbar__actions {
    display: flex;
    align-items: center;
    gap: 4px;
}

.tg-toolbar__divider {
    width: 1px;
    height: 14px;
    margin: 0 4px;
    background: var(--tg-border);
}

.tg-restored {
    padding: 8px 12px;
    border: 1px solid var(--vp-c-green-soft, var(--tg-border));
    border-radius: 6px;
    background: var(--vp-c-green-soft, transparent);
    color: var(--vp-c-green-1, var(--tg-text-2));
    font-size: 12px;
    line-height: 1.5;
}

.tg-intro {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
    color: var(--tg-text-2);
}

.tg-section {
    padding: 14px;
    border: 1px solid var(--tg-border);
    border-radius: 10px;
    background: var(--tg-bg);
}

.tg-section--dark {
    background: var(--tg-bg-alt);
}

.tg-section__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
}

.tg-section__title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--tg-text);
}

.tg-section__desc {
    margin: 4px 0 0;
    font-size: 12px;
    color: var(--tg-text-3);
}

.tg-group {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid var(--tg-border);
    border-radius: 8px;
    background: var(--tg-bg-alt);
}

.tg-group:last-child {
    margin-bottom: 0;
}

.tg-group--compact {
    background: transparent;
}

.tg-group__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 8px;
}

.tg-group__label {
    font-size: 13px;
    font-weight: 600;
    color: var(--tg-text);
}

.tg-group__actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
}

.tg-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tg-card {
    box-sizing: border-box;
    width: calc(20% - 7px);
    cursor: pointer;
}

.tg-card__swatch {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    height: 64px;
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 6px;
    overflow: hidden;
}

.tg-card__name {
    font-size: 11px;
    font-weight: 600;
    line-height: 1.3;
}

.tg-card__value {
    font-size: 10px;
    line-height: 1.3;
    word-break: break-all;
}

@media (max-width: 480px) {
    .tg-card {
        width: calc(50% - 4px);
    }
}

.tg-preview__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.tg-preview__title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--tg-text);
}

.tg-preview-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--tg-border);
    border-radius: 8px;
}

.tg-preview-swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tg-preview-swatch {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.05);
}

.tg-preview-swatch__dot {
    width: 10px;
    height: 10px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 50%;
}

.tg-preview-swatch__label {
    font-size: 11px;
    color: var(--pv-muted-text);
}

.tg-preview-top {
    display: flex;
    gap: 10px;
}

.tg-preview-btn {
    padding: 8px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
}

.tg-preview-btn--primary {
    border: 1px solid var(--pv-primary);
    background: var(--pv-primary);
    color: var(--pv-primary-ink);
}

.tg-preview-btn--ghost {
    border: 1px solid var(--pv-border-color);
    background: transparent;
    color: var(--pv-primary);
}

.tg-preview-card {
    padding: 12px;
    border: 1px solid var(--pv-border-color);
    border-radius: 6px;
    background: var(--pv-card-bg);
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.05);
}

.tg-preview-card__title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--pv-card-text);
}

.tg-preview-card__text {
    margin: 4px 0 0;
    font-size: 12px;
    line-height: 1.6;
    color: var(--pv-muted-text);
}

.tg-preview-chips {
    display: flex;
    gap: 8px;
    margin-top: 10px;
}

.tg-preview-chip {
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    color: #fff;
}

.tg-preview-chip--success {
    background: var(--pv-success);
}

.tg-preview-chip--warning {
    background: var(--pv-warning);
}

.tg-preview-chip--info {
    background: var(--pv-info);
}

.tg-darkbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--tg-border);
    border-radius: 8px;
    background: var(--tg-bg);
}

.tg-switch {
    position: relative;
    width: 40px;
    height: 22px;
    padding: 0;
    border: 1px solid var(--tg-border);
    border-radius: 11px;
    background: var(--tg-bg-alt);
    cursor: pointer;
    transition: background 0.2s ease;
}

.tg-switch--on {
    border-color: var(--tg-brand);
    background: var(--tg-brand);
}

.tg-switch__knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease;
}

.tg-switch--on .tg-switch__knob {
    transform: translateX(18px);
}

.tg-darkbar__text {
    flex: 1;
    font-size: 13px;
    font-weight: 600;
    color: var(--tg-text);
}

.tg-darkbar__note {
    margin: 0;
    font-size: 12px;
    line-height: 1.6;
    color: var(--tg-text-3);
}

.tg-dark__hint {
    margin: 0 0 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--tg-text-2);
}

.tg-meta {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tg-meta__tip {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: var(--tg-text-2);
}

.tg-meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tg-input {
    box-sizing: border-box;
    flex: 1 1 200px;
    height: 36px;
    padding: 0 10px;
    border: 1px solid var(--tg-border);
    border-radius: 5px;
    background: var(--tg-bg);
    color: var(--tg-text);
    font-size: 12px;
}

.tg-input--wide {
    flex-basis: 100%;
}

.tg-meta-tip {
    margin: 0;
    padding: 8px 10px;
    border-radius: 6px;
    background: var(--tg-brand-soft);
    color: var(--tg-brand);
    font-size: 12px;
    line-height: 1.6;
}

.tg-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tg-queue {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
}

.tg-queue__title {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: var(--tg-text);
}

.tg-queue-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border: 1px solid var(--tg-border);
    border-radius: 6px;
    background: var(--tg-bg);
}

.tg-queue-item__swatch {
    width: 18px;
    height: 18px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 4px;
}

.tg-queue-item__info {
    flex: 1;
    font-size: 12px;
    color: var(--tg-text);
}

.tg-queue-item__remove {
    padding: 0;
    border: none;
    background: transparent;
    font-size: 11px;
    color: var(--vp-c-danger-1, #e5484d);
    cursor: pointer;
}

.tg-export-hint {
    margin: 0;
    font-size: 11px;
    line-height: 1.6;
    color: var(--tg-text-3);
}

.tg-btn {
    margin: 0;
    padding: 0 14px;
    border: 1px solid var(--tg-border);
    border-radius: 5px;
    background: var(--tg-bg);
    color: var(--tg-text);
    font-size: 12px;
    font-weight: 600;
    line-height: 30px;
    cursor: pointer;
}

.tg-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.tg-btn--mini {
    padding: 0 10px;
    font-size: 11px;
    line-height: 26px;
}

.tg-btn--primary {
    border-color: transparent;
    background: var(--tg-brand);
    color: #fff;
}

.tg-btn--green {
    border-color: transparent;
    background: #06d290;
    color: #fff;
}

.tg-btn--info {
    border-color: transparent;
    background: #2d57e7;
    color: #fff;
}

.tg-btn--danger {
    border-color: transparent;
    background: #e5484d;
    color: #fff;
}

.tg-btn--ghost {
    border-color: var(--tg-brand);
    background: transparent;
    color: var(--tg-brand);
}

.tg-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.45);
}

.tg-dialog {
    box-sizing: border-box;
    width: 320px;
    max-width: 100%;
    padding: 16px;
    border: 1px solid var(--tg-border);
    border-radius: 10px;
    background: var(--tg-bg);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.tg-dialog__title {
    margin: 0 0 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--tg-text);
}

.tg-dialog__body {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tg-sv {
    position: relative;
    width: 100%;
    height: 160px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow: hidden;
    touch-action: none;
}

.tg-sv__handle {
    position: absolute;
    width: 14px;
    height: 14px;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
    transform: translate(-50%, -50%);
}

.tg-hue {
    position: relative;
    width: 100%;
    height: 14px;
    border-radius: 7px;
    touch-action: none;
}

.tg-hue__handle {
    position: absolute;
    top: 50%;
    width: 12px;
    height: 20px;
    margin-top: -10px;
    border: 2px solid #fff;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);
    transform: translateX(-50%);
}

.tg-field {
    display: flex;
    align-items: center;
    gap: 8px;
}

.tg-field__label {
    font-size: 12px;
    color: var(--tg-text-2);
}

.tg-field__input {
    box-sizing: border-box;
    flex: 1;
    height: 34px;
    padding: 0 10px;
    border: 1px solid var(--tg-border);
    border-radius: 5px;
    background: var(--tg-bg-alt);
    color: var(--tg-text);
    font-size: 12px;
}

.tg-presets {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.tg-preset {
    width: 22px;
    height: 22px;
    padding: 0;
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 50%;
    cursor: pointer;
}

.tg-dialog__footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 14px;
}

.tg-toast {
    position: fixed;
    left: 50%;
    bottom: 32px;
    z-index: 1100;
    transform: translateX(-50%);
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 12px;
    color: #fff;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.tg-toast--success {
    background: #06d290;
}

.tg-toast--error {
    background: #e5484d;
}

.tg-toast--info {
    background: #2d57e7;
}

.tg-toast-enter-active,
.tg-toast-leave-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
}

.tg-toast-enter-from,
.tg-toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(8px);
}
</style>
