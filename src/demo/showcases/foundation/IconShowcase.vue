<script setup lang="ts">
import { ref } from 'vue';
import type { DemoValue } from '../../demo-config';

defineProps<{ kind?: string; state: Record<string, DemoValue>; isEnglish: boolean }>();

const selectedIcon = ref('search');
const iconNames = [
    'search',
    'checkbox-mark',
    'success',
    'warning',
    'info',
    'close',
    'plus',
    'minus',
    'edit',
    'trash',
    'eye',
    'eye-off',
    'eye-outline',
    'eye-off-outline',
    'arrow-left',
    'arrow-right',
    'arrow-up',
    'arrow-down'
] as const;
</script>

<template>
    <view class="demo-icon-showcase demo-icon-showcase--grouped">
        <view class="demo-icon-preview">
            <snake-icon
                :name="selectedIcon"
                :color="String(state.iconColor)"
                :size="Number(state.iconSize)"
                :bold="Boolean(state.iconBold)"
                :label="String(state.iconLabel)"
                :label-pos="state.iconLabelPos as any"
                label-size="14px"
                space="8px"
            />
            <text class="demo-icon-preview__name">{{ selectedIcon }}</text>
        </view>
        <view class="demo-icon-heading">
            <text>{{ isEnglish ? 'Built-in icons' : '内置图标' }}</text>
            <text class="demo-icon-heading__count">{{ iconNames.length }}</text>
        </view>
        <view class="demo-icons">
            <view
                v-for="name in iconNames"
                :key="name"
                :class="['demo-icon-item', { 'demo-icon-item--active': selectedIcon === name }]"
                hover-class="demo-icon-item--pressed"
                @click="selectedIcon = name"
            >
                <snake-icon
                    :name="name"
                    :color="selectedIcon === name ? String(state.iconColor) : 'currentColor'"
                    :size="Number(state.iconSize)"
                    :bold="Boolean(state.iconBold)"
                />
                <text class="demo-icon-item__name">{{ name }}</text>
            </view>
        </view>
    </view>
</template>

<style scoped>
.demo-icons {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 12rpx;
    background: var(--snake-color-divider);
    gap: 1rpx;
}
.demo-icon-showcase {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
}
.demo-icon-preview {
    display: flex;
    min-height: 176rpx;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 12rpx;
    background: var(--snake-color-surface);
}
.demo-icon-preview__name {
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
    line-height: 1.4;
}
.demo-icon-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
}
.demo-icon-heading__count {
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
    font-weight: 400;
}
.demo-icon-item {
    display: flex;
    min-width: 0;
    min-height: 144rpx;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18rpx;
    padding: 20rpx 10rpx;
    background: var(--snake-color-surface);
    color: var(--snake-color-text-secondary);
    transition:
        color 160ms ease,
        background-color 160ms ease;
}
.demo-icon-item--active {
    color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
.demo-icon-item--pressed {
    background: var(--snake-color-surface-muted);
}
.demo-icon-item__name {
    display: block;
    width: 100%;
    color: inherit;
    font-size: 20rpx;
    line-height: 1.3;
    text-align: center;
    white-space: nowrap;
}
</style>
