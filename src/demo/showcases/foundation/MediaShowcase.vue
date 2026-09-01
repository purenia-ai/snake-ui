<script setup lang="ts">
import type { DemoValue } from '../../demo-config';
import { localImage } from '../../fixtures';

defineProps<{
    kind: 'image' | 'lazy-image';
    state: Record<string, DemoValue>;
    isEnglish: boolean;
}>();
</script>

<template>
    <view v-if="kind === 'image'" class="demo-stack demo-image-showcase">
        <text class="demo-variant-title">{{ isEnglish ? 'Loaded image' : '正常图片' }}</text>
        <snake-image
            :src="localImage"
            width="100%"
            height="320rpx"
            :radius="Number(state.radius)"
            :mode="String(state.imageMode)"
        />
        <text class="demo-variant-title">{{ isEnglish ? 'Error fallback' : '加载失败' }}</text>
        <snake-image src="/static/not-found.png" width="100%" height="180rpx" :radius="Number(state.radius)" />
    </view>
    <view v-else class="demo-stack demo-lazy-image-showcase">
        <text class="demo-variant-title">{{ isEnglish ? 'Viewport loading' : '进入视口后加载' }}</text>
        <view class="demo-image-box">
            <snake-lazy-image :src="state.lazySource === 'error' ? '/static/not-found.png' : localImage" />
        </view>
        <text class="demo-variant-title">{{ isEnglish ? 'Custom fallback' : '自定义占位' }}</text>
        <view class="demo-image-box">
            <snake-lazy-image :src="localImage">
                <template #loading>
                    <view class="demo-lazy-placeholder">{{ isEnglish ? 'Waiting…' : '等待加载…' }}</view>
                </template>
            </snake-lazy-image>
        </view>
    </view>
</template>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}
.demo-variant-title {
    display: block;
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}
.demo-image-box {
    width: 100%;
    height: 300rpx;
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
.demo-lazy-placeholder {
    display: flex;
    width: 100%;
    min-height: 180rpx;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
