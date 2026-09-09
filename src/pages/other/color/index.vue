<script setup lang="ts">
import DemoPage from '../../../components/demo-page/demo-page.vue';
import { useTheme } from '../../../uni_modules/snake-ui';

const { color } = useTheme();

const semanticColors = [
    { label: '成功', key: 'success' },
    { label: '警告', key: 'warning' },
    { label: '错误', key: 'error' },
    { label: '信息', key: 'info' }
] as const;

const textColors = [
    { label: '主要文字', key: 'text' },
    { label: '常规文字', key: 'textSecondary' },
    { label: '次要文字', key: 'textMuted' },
    { label: '占位文字', key: 'textLight' }
] as const;
</script>

<template>
    <DemoPage title="色彩" desc="Snake UI 主题色板实时预览">
        <view class="preview-card preview-card--brand">
            <view class="preview-card__head">
                <text class="preview-card__title">Snake 绿</text>
                <text class="preview-card__value">{{ color.primary }}</text>
            </view>
            <view class="brand-row">
                <view class="brand-chip brand-chip--primary" :style="{ backgroundColor: color.primary }">Primary</view>
                <view class="brand-chip" :style="{ backgroundColor: color.primaryDark }">Dark</view>
                <view
                    class="brand-chip brand-chip--light"
                    :style="{ backgroundColor: color.primaryLight, color: color.primaryDeep }"
                    >Light</view
                >
            </view>
        </view>

        <view class="preview-card">
            <text class="preview-card__title">辅助色</text>
            <view class="semantic-row">
                <view
                    v-for="item in semanticColors"
                    :key="item.key"
                    class="semantic-chip"
                    :style="{ color: color[item.key], backgroundColor: color[`${item.key}Light`] }"
                >
                    {{ item.label }}
                </view>
            </view>
        </view>

        <view class="preview-card">
            <text class="preview-card__title">文字层级</text>
            <view v-for="item in textColors" :key="item.key" class="text-row" :style="{ color: color[item.key] }">
                <text>{{ item.label }}</text>
                <text class="text-row__value">{{ color[item.key] }}</text>
            </view>
        </view>

        <view class="surface-demo">
            <text class="surface-demo__title">页面背景 · #F6F6F6</text>
            <text class="surface-demo__desc">卡片使用白色表面，分割线使用 divider。</text>
        </view>
    </DemoPage>
</template>

<style scoped>
.preview-card,
.surface-demo {
    margin: 8px 4px 14px;
    padding: 16px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 10px;
    background: var(--snake-color-surface);
}

.preview-card__head,
.text-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.preview-card__title,
.surface-demo__title {
    color: var(--snake-color-text);
    font-size: 15px;
    font-weight: 650;
}

.preview-card__value,
.text-row__value {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}

.brand-row,
.semantic-row {
    display: flex;
    gap: 8px;
    margin-top: 14px;
}

.brand-chip,
.semantic-chip {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    flex: 1;
    height: 34px;
    border-radius: 7px;
    font-size: 11px;
}

.brand-chip {
    color: #fff;
}

.brand-chip--light {
    color: var(--snake-color-primary-deep);
}

.semantic-chip {
    font-weight: 600;
}

.text-row {
    padding: 10px 0;
    border-bottom: 1px solid var(--snake-color-divider);
    font-size: 13px;
}

.text-row:last-child {
    border-bottom: 0;
    padding-bottom: 0;
}

.surface-demo {
    background: var(--snake-color-background);
}

.surface-demo__desc {
    display: block;
    margin-top: 8px;
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
</style>
