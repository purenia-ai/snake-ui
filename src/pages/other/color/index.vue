<template>
    <DemoPage :title="text('Color 色彩')" :desc="text('Snake UI 当前主题色板实时预览')">
        <view class="preview-actions">
            <snake-button size="small" plain @click="toggleDarkMode">{{ text('切换明暗') }}</snake-button>
        </view>
        <view v-for="group in colorGroups" :key="group.label" class="preview-card">
            <text class="preview-card__title">{{ text(group.label) }}</text>
            <view class="swatch-grid">
                <view
                    v-for="key in group.keys"
                    :key="key"
                    class="swatch"
                    :style="{ backgroundColor: color[key], color: readableText(color[key]) }"
                >
                    <text>{{ text(colorLabels[key]) }}</text>
                    <text>{{ color[key] }}</text>
                </view>
            </view>
        </view>

        <view v-for="group in neutralGroups" :key="group.label" class="preview-card">
            <text class="preview-card__title">{{ text(group.label) }}</text>
            <view v-for="key in group.keys" :key="key" class="token-row">
                <view class="token-row__swatch" :style="{ backgroundColor: color[key] }"></view>
                <text :style="{ color: color.text }">{{ text(colorLabels[key]) }}</text>
                <text class="token-row__value">{{ color[key] }}</text>
            </view>
        </view>

        <view class="preview-card">
            <text class="preview-card__title">{{ text('遮罩与阴影') }}</text>
            <view class="overlay-demo" :style="{ backgroundColor: color.mask }"><text>Mask</text></view>
            <view class="shadow-demo" :style="{ boxShadow: `0 8rpx 24rpx ${color.shadow}` }"><text>Shadow</text></view>
        </view>
    </DemoPage>
</template>

<script setup lang="ts">
import DemoPage from '../../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../../common/demo-i18n';
import { useTheme } from '../../../uni_modules/snake-ui';

const { color, toggleDarkMode } = useTheme();
const { text } = useDemoLocale();
function readableText(background: string): string {
    const hex = /^#([\da-f]{6})$/i.exec(background);
    if (!hex) return color.text;
    const channels = [0, 2, 4].map(offset => {
        const channel = Number.parseInt(hex[1].slice(offset, offset + 2), 16) / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    const luminance = channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    return luminance > 0.179 ? '#17221d' : '#ffffff';
}

const colorGroups = [
    { label: '主题颜色', keys: ['primary', 'primaryDark', 'primaryDisabled', 'primaryLight'] },
    { label: '辅助颜色', keys: ['success', 'warning', 'error', 'info'] }
] as const;

const neutralGroups = [
    { label: '文本', keys: ['text', 'textSecondary', 'textMuted', 'textLight'] },
    { label: '界面', keys: ['border', 'divider', 'background', 'surface', 'surfaceMuted'] }
] as const;

const colorLabels: Record<string, string> = {
    primary: '主色',
    primaryDark: '加深',
    primaryDisabled: '禁用',
    primaryLight: '浅色',
    success: '成功',
    warning: '警告',
    error: '错误',
    info: '信息',
    text: '主要文字',
    textSecondary: '常规文字',
    textMuted: '次要文字',
    textLight: '占位文字',
    border: '边框',
    divider: '分割线',
    background: '页面背景',
    surface: '内容表面',
    surfaceMuted: '弱表面'
};
</script>

<style scoped>
.preview-actions {
    margin: 8px 4px 16px;
}
.preview-card {
    margin: 8px 4px 14px;
    padding: 16px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 10px;
    background: var(--snake-color-surface);
}
.preview-card__title {
    color: var(--snake-color-text);
    font-size: 15px;
    font-weight: 650;
}
.swatch-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 14px;
}
.swatch {
    display: flex;
    min-height: 66px;
    padding: 10px;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 7px;
    font-size: 11px;
}
.token-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 0;
    border-bottom: 1px solid var(--snake-color-divider);
    font-size: 13px;
}
.token-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}
.token-row__swatch {
    width: 24px;
    height: 24px;
    border: 1px solid var(--snake-color-border);
    border-radius: 5px;
}
.token-row__value {
    margin-left: auto;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.overlay-demo,
.shadow-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 52px;
    margin-top: 12px;
    border-radius: 8px;
    color: #fff;
    font-size: 12px;
}
.shadow-demo {
    background: var(--snake-color-surface);
    color: var(--snake-color-text-secondary);
}
</style>
