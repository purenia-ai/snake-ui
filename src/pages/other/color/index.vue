<template>
    <DemoPage :title="text('Color 色彩')" :desc="text('Snake UI 当前主题色板实时预览')">
        <view class="palette-meta">
            <view class="palette-meta__info">
                <view class="palette-meta__theme">
                    <view class="palette-meta__dot" :style="{ backgroundColor: color.primary }" />
                    <text class="palette-meta__name"
                        >{{ text('当前主题') }} · {{ text(currentTheme.label || currentTheme.name) }}</text
                    >
                </view>
                <text class="palette-meta__hint">{{ text('点按色块复制色值') }}</text>
            </view>
            <snake-button size="mini" plain @click="toggleDarkMode">{{ text('切换明暗') }}</snake-button>
        </view>

        <view class="palette-card">
            <text class="palette-card__title">{{ text('品牌主色') }}</text>
            <view class="brand-grid">
                <view
                    v-for="step in brandSteps"
                    :key="step.key"
                    class="brand-tile"
                    :style="{ backgroundColor: color[step.key], color: inkOn(color[step.key]) }"
                    @click="copyValue(color[step.key])"
                >
                    <text class="brand-tile__label">{{ text(step.label) }}</text>
                    <text class="brand-tile__value">{{ color[step.key] }}</text>
                </view>
            </view>
            <view
                class="ink-row"
                :style="{ backgroundColor: color.primary, color: color.primaryInk }"
                @click="copyValue(color.primaryInk)"
            >
                <text class="ink-row__label">{{ text('主色上的前景') }}</text>
                <text class="ink-row__value">{{ color.primaryInk }}</text>
            </view>
            <view class="palette-notes">
                <text class="palette-card__note"
                    >{{ text('对比度') }} {{ primaryContrast }} · {{ text('WCAG AA 需 4.5:1') }}</text
                >
                <text class="palette-card__note">{{
                    text('需要更高对比时把 primaryInk 换成墨绿 #073B2A（6.37:1）')
                }}</text>
            </view>
        </view>

        <view class="palette-card">
            <text class="palette-card__title">{{ text('状态色') }}</text>
            <view v-for="ramp in semanticRamps" :key="ramp.label" class="ramp">
                <text class="ramp__name">{{ text(ramp.label) }}</text>
                <view class="ramp__tiles">
                    <view
                        v-for="step in ramp.steps"
                        :key="step.key"
                        class="ramp__tile"
                        :style="{ backgroundColor: color[step.key], color: inkOn(color[step.key]) }"
                        @click="copyValue(color[step.key])"
                    >
                        <text class="ramp__tile-label">{{ text(step.label) }}</text>
                        <text class="ramp__tile-value">{{ color[step.key] }}</text>
                    </view>
                </view>
            </view>
        </view>

        <view class="palette-card">
            <text class="palette-card__title">{{ text('文本') }}</text>
            <view v-for="token in textTokens" :key="token.key" class="token-row" @click="copyValue(color[token.key])">
                <view class="token-row__swatch" :style="{ backgroundColor: color[token.key] }" />
                <view class="token-row__body">
                    <text class="token-row__label">{{ text(token.label) }}</text>
                    <text class="token-row__token">{{ tokenName(token.key) }}</text>
                </view>
                <text class="token-row__value">{{ color[token.key] }}</text>
            </view>
        </view>

        <view class="palette-card">
            <text class="palette-card__title">{{ text('界面') }}</text>
            <view
                v-for="token in surfaceTokens"
                :key="token.key"
                class="token-row"
                @click="copyValue(color[token.key])"
            >
                <view class="token-row__swatch" :style="{ backgroundColor: color[token.key] }" />
                <view class="token-row__body">
                    <text class="token-row__label">{{ text(token.label) }}</text>
                    <text class="token-row__token">{{ tokenName(token.key) }}</text>
                </view>
                <text class="token-row__value">{{ color[token.key] }}</text>
            </view>
        </view>

        <view class="palette-card">
            <text class="palette-card__title">{{ text('遮罩与阴影') }}</text>
            <view class="stage">
                <view class="stage__content">
                    <view class="stage__avatar" :style="{ backgroundColor: color.primary }" />
                    <view class="stage__lines">
                        <view class="stage__line stage__line--strong" :style="{ backgroundColor: color.text }" />
                        <view class="stage__line" :style="{ backgroundColor: color.textMuted }" />
                    </view>
                </view>
                <view class="stage__mask" :style="{ backgroundColor: color.mask }" />
                <text class="stage__mask-label">Mask</text>
            </view>
            <view class="stage stage--plain">
                <view
                    class="stage__panel"
                    :style="{ backgroundColor: color.surface, boxShadow: `0 6px 18px ${color.shadow}` }"
                >
                    <text class="stage__panel-label" :style="{ color: color.textSecondary }">Shadow</text>
                </view>
            </view>
            <view v-for="token in solidTokens" :key="token.key" class="token-row" @click="copyValue(color[token.key])">
                <view class="token-row__swatch" :style="{ backgroundColor: color[token.key] }" />
                <view class="token-row__body">
                    <text class="token-row__label">{{ text(token.label) }}</text>
                    <text class="token-row__token">{{ tokenName(token.key) }}</text>
                </view>
                <text class="token-row__value">{{ color[token.key] }}</text>
            </view>
            <view class="palette-notes">
                <text class="palette-card__note">{{ text('暗色下 white 与 black 都取基线暗色 #F5F6F7') }}</text>
            </view>
        </view>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../../common/demo-i18n';
import { useTheme } from '../../../uni_modules/snake-ui';

const { color, currentTheme, toggleDarkMode } = useTheme();
const { text } = useDemoLocale();

const brandSteps = [
    { key: 'primary', label: '主色' },
    { key: 'primaryDark', label: '加深' },
    { key: 'primaryDisabled', label: '禁用' },
    { key: 'primaryLight', label: '浅色' }
] as const;

const semanticRamps = [
    {
        label: '成功',
        steps: [
            { key: 'success', label: '基准' },
            { key: 'successDark', label: '加深' },
            { key: 'successDisabled', label: '禁用' },
            { key: 'successLight', label: '浅色' }
        ]
    },
    {
        label: '警告',
        steps: [
            { key: 'warning', label: '基准' },
            { key: 'warningDark', label: '加深' },
            { key: 'warningDisabled', label: '禁用' },
            { key: 'warningLight', label: '浅色' }
        ]
    },
    {
        label: '错误',
        steps: [
            { key: 'error', label: '基准' },
            { key: 'errorDark', label: '加深' },
            { key: 'errorDisabled', label: '禁用' },
            { key: 'errorLight', label: '浅色' }
        ]
    },
    {
        label: '信息',
        steps: [
            { key: 'info', label: '基准' },
            { key: 'infoDark', label: '加深' },
            { key: 'infoDisabled', label: '禁用' },
            { key: 'infoLight', label: '浅色' }
        ]
    }
] as const;

const textTokens = [
    { key: 'text', label: '主要文字' },
    { key: 'textSecondary', label: '常规文字' },
    { key: 'textMuted', label: '次要文字' },
    { key: 'textLight', label: '占位文字' }
] as const;

const surfaceTokens = [
    { key: 'border', label: '边框' },
    { key: 'divider', label: '分割线' },
    { key: 'background', label: '页面背景' },
    { key: 'surface', label: '内容表面' },
    { key: 'surfaceMuted', label: '弱表面' }
] as const;

const solidTokens = [
    { key: 'mask', label: '遮罩' },
    { key: 'shadow', label: '阴影' },
    { key: 'white', label: '白色' },
    { key: 'black', label: '黑色' }
] as const;

interface Rgb {
    r: number;
    g: number;
    b: number;
    alpha?: number;
}

function parseHex(value: string): Rgb | undefined {
    const match = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(value.trim());
    if (!match) return undefined;
    const hex = Number.parseInt(match[1], 16);
    return {
        r: (hex >> 16) & 255,
        g: (hex >> 8) & 255,
        b: hex & 255,
        alpha: match[2] ? Number.parseInt(match[2], 16) / 255 : undefined
    };
}

function luminance(value: string): number | undefined {
    const rgb = parseHex(value);
    if (!rgb) return undefined;
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(channel => {
        const ratio = channel / 255;
        return ratio <= 0.04045 ? ratio / 12.92 : ((ratio + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * 色块上的文字用自动黑/白，保证可读；带 alpha 的令牌（如 primaryLight）
 * 会按当前明暗叠到卡片上，交给主题文字色最稳。
 */
function inkOn(background: string): string {
    const rgb = parseHex(background);
    if (!rgb || rgb.alpha != null) return color.text;
    return (luminance(background) ?? 1) > 0.179 ? '#17221D' : '#FFFFFF';
}

/** 色值展示跨透明度没有意义，只比较实色通道。 */
function contrastRatio(background: string, foreground: string): number | undefined {
    const base = luminance(background);
    const ink = luminance(foreground);
    if (base === undefined || ink === undefined) return undefined;
    const [hi, lo] = base > ink ? [base, ink] : [ink, base];
    return (hi + 0.05) / (lo + 0.05);
}

const primaryContrast = computed(() => {
    const ratio = contrastRatio(color.primary, color.primaryInk);
    return ratio ? `${ratio.toFixed(2)}:1` : '—';
});

/** textSecondary → --snake-color-text-secondary，与 theme.ts 的令牌名保持一致。 */
function tokenName(key: string): string {
    return `--snake-color-${key.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`)}`;
}

function copyValue(value: string) {
    if (!value) return;
    uni.setClipboardData({
        data: value,
        fail: () => uni.showToast({ title: text('复制失败，请手动选择色值'), icon: 'none' })
    });
}
</script>

<style scoped>
.palette-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 8px 4px 14px;
}
.palette-meta__info {
    min-width: 0;
}
.palette-meta__theme {
    display: flex;
    align-items: center;
    gap: 6px;
}
.palette-meta__dot {
    width: 10px;
    height: 10px;
    flex: none;
    border-radius: 50%;
}
.palette-meta__name {
    overflow: hidden;
    color: var(--snake-color-text);
    font-size: 13px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.palette-meta__hint {
    display: block;
    margin-top: 3px;
    color: var(--snake-color-text-muted);
    font-size: 11px;
}
.palette-card {
    margin: 8px 4px 14px;
    padding: 16px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 10px;
    background: var(--snake-color-surface);
}
.palette-card__title {
    color: var(--snake-color-text);
    font-size: 15px;
    font-weight: 650;
}
.palette-notes {
    margin-top: 10px;
}
.palette-card__note {
    display: block;
    color: var(--snake-color-text-muted);
    font-size: 11px;
    line-height: 1.6;
}
.brand-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 14px;
}
.brand-tile {
    display: flex;
    min-height: 66px;
    padding: 10px;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 7px;
}
.brand-tile__label {
    font-size: 12px;
    font-weight: 600;
}
.brand-tile__value {
    font-size: 11px;
    letter-spacing: 0.2px;
}
.ink-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 8px;
    padding: 11px 12px;
    border-radius: 7px;
}
.ink-row__label {
    font-size: 12px;
    font-weight: 600;
}
.ink-row__value {
    font-size: 11px;
    letter-spacing: 0.2px;
}
.ramp {
    margin-top: 12px;
}
.ramp__name {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    font-weight: 600;
}
.ramp__tiles {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 6px;
    margin-top: 6px;
}
.ramp__tile {
    display: flex;
    min-height: 54px;
    padding: 7px 7px 6px;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 6px;
}
.ramp__tile-label {
    font-size: 10px;
    opacity: 0.85;
}
.ramp__tile-value {
    font-size: 10px;
    letter-spacing: 0.1px;
}
.token-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid var(--snake-color-divider);
}
.token-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}
.token-row__swatch {
    width: 26px;
    height: 26px;
    flex: none;
    border: 1px solid var(--snake-color-border);
    border-radius: 5px;
}
.token-row__body {
    min-width: 0;
    flex: 1;
}
.token-row__label {
    display: block;
    color: var(--snake-color-text);
    font-size: 13px;
}
.token-row__token {
    display: block;
    margin-top: 2px;
    color: var(--snake-color-text-muted);
    font-size: 10px;
    word-break: break-all;
}
.token-row__value {
    flex: none;
    color: var(--snake-color-text-muted);
    font-size: 11px;
}
.stage {
    position: relative;
    margin-top: 12px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 8px;
    background: var(--snake-color-background);
    overflow: hidden;
}
.stage__content {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 14px;
}
.stage__avatar {
    width: 34px;
    height: 34px;
    flex: none;
    border-radius: 50%;
}
.stage__lines {
    flex: 1;
    min-width: 0;
}
.stage__line {
    height: 7px;
    border-radius: 4px;
    opacity: 0.5;
}
.stage__line--strong {
    width: 62%;
    margin-bottom: 7px;
    opacity: 0.85;
}
.stage__mask {
    position: absolute;
    inset: 0;
}
.stage__mask-label {
    position: absolute;
    right: 9px;
    bottom: 7px;
    color: #ffffff;
    font-size: 11px;
    font-weight: 650;
    letter-spacing: 0.3px;
}
.stage--plain {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 92px;
    border-style: dashed;
}
.stage__panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 148px;
    height: 52px;
    border-radius: 8px;
}
.stage__panel-label {
    font-size: 11px;
}
</style>
