<script setup lang="ts">
withDefaults(defineProps<{ title?: string; bare?: boolean }>(), { title: '', bare: false });
</script>

<template>
    <view v-if="!bare" class="demo-section">
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
    border-radius: 20rpx;
    background: var(--snake-color-surface);
    box-shadow: $snake-card-shadow;
}

.demo-section:last-child {
    margin-bottom: 0;
}

.demo-section__head {
    padding: 28rpx 32rpx 20rpx;
}

.demo-section__title {
    position: relative;
    padding-left: 20rpx;
    color: var(--snake-color-text);
    font-size: 30rpx;
    font-weight: 600;
}

.demo-section__title::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 8rpx;
    height: 28rpx;
    border-radius: 4rpx;
    background: var(--snake-color-primary);
    transform: translateY(-50%);
}

.demo-section__wrap {
    padding: 32rpx 28rpx;
    background: var(--snake-color-surface);
}
</style>
