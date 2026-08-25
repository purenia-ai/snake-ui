<script setup lang="ts">
type DemoSectionVariant = 'default' | 'preview' | 'controls';

withDefaults(defineProps<{ title?: string; bare?: boolean; variant?: DemoSectionVariant }>(), {
    title: '',
    bare: false,
    variant: 'default'
});
</script>

<template>
    <view v-if="!bare" :class="['demo-section', `demo-section--${variant}`]">
        <view v-if="title" class="demo-section__head">
            <text class="demo-section__title">{{ title }}</text>
        </view>
        <view class="demo-section__wrap">
            <slot />
        </view>
    </view>
    <slot v-else />
</template>

<style lang="scss" scoped>
@import './theme.scss';

.demo-section {
    overflow: hidden;
    margin-bottom: 28rpx;
    background: var(--snake-color-surface);
}

.demo-section:last-child {
    margin-bottom: 0;
}

.demo-section__head {
    padding: 24rpx 24rpx 20rpx;
    text-align: center;
}

.demo-section__title {
    color: var(--snake-color-text);
    font-size: 30rpx;
    font-weight: 600;
}

.demo-section__wrap {
    padding: 32rpx 28rpx;
    background: var(--snake-color-surface);
}

.demo-section--default,
.demo-section--preview {
    border: 1rpx dashed var(--snake-color-divider);
    border-radius: 10rpx;
}

.demo-section--preview .demo-section__head {
    border-bottom: 1rpx dashed var(--snake-color-divider);
}

.demo-section--controls {
    background: transparent;
}

.demo-section--controls .demo-section__head {
    padding-top: 16rpx;
    border-bottom: 1rpx solid var(--snake-color-divider);
}

.demo-section--controls .demo-section__wrap {
    padding: 0 8rpx;
    background: transparent;
}
</style>
