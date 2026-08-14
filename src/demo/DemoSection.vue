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
    margin-bottom: 14px;
    border: 1px solid $snake-border;
    border-radius: $snake-radius-md;
    background: $snake-bg-card;
}

.demo-section:last-child {
    margin-bottom: 0;
}

.demo-section__head {
    padding: 14px 16px 12px;
    border-bottom: 1px solid $snake-border;
}

.demo-section__title {
    color: $snake-text-main;
    font-size: 15px;
    font-weight: 600;
}

.demo-section__wrap {
    padding: 18px 14px;
    background: $snake-bg-card;
}
</style>
