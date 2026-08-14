<script setup lang="ts">
withDefaults(
    defineProps<{
        title?: string;
        eyebrow?: string;
        desc?: string;
        viewport?: boolean;
        navBack?: boolean;
        navHome?: boolean;
    }>(),
    { title: '', eyebrow: '', desc: '', viewport: false, navBack: true, navHome: true }
);

function goBack() {
    if (getCurrentPages().length > 1) {
        uni.navigateBack();
    } else {
        uni.reLaunch({ url: '/pages/index/index' });
    }
}

function goHome() {
    uni.reLaunch({ url: '/pages/index/index' });
}
</script>

<template>
    <view :class="['demo-page', { 'demo-page--viewport': viewport }]">
        <template v-if="!viewport">
            <view class="demo-nav">
                <view
                    class="demo-nav__side demo-nav__side--left"
                    hover-class="demo-nav__side--hover"
                    @click="navBack && goBack()"
                >
                    <text v-if="navBack" class="demo-nav__back">‹</text>
                </view>
                <text class="demo-nav__title">{{ title }}</text>
                <view
                    class="demo-nav__side demo-nav__side--right"
                    hover-class="demo-nav__side--hover"
                    @click="navHome && goHome()"
                >
                    <text v-if="navHome" class="demo-nav__home">首页</text>
                </view>
            </view>

            <view class="demo-page-header">
                <view class="demo-page-header__title-row">
                    <view class="demo-page-header__title">{{ title }}</view>
                    <view v-if="eyebrow" class="demo-page-header__category">{{ eyebrow }}</view>
                </view>
                <view v-if="desc" class="demo-page-header__desc">{{ desc }}</view>
            </view>

            <view class="demo-body">
                <slot />
            </view>
        </template>
        <slot v-else />
    </view>
</template>

<style lang="scss" scoped>
@import './theme.scss';

.demo-page {
    box-sizing: border-box;
    min-height: 100vh;
    background: $snake-bg-page;
    color: $snake-text-main;
    -webkit-font-smoothing: antialiased;
}

.demo-page--viewport {
    background: #ffffff;
}

.demo-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    height: $snake-nav-height;
    padding: 0 6px;
    border-bottom: 1px solid $snake-border;
    background: $snake-bg-card;
}

.demo-nav__side {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 56px;
    height: 100%;
    border-radius: 5px;
    color: $snake-primary;
    transition: background-color 0.2s ease;
}

.demo-nav__side--hover {
    background: $snake-primary-soft;
}

.demo-nav__back {
    padding-bottom: 3px;
    font-size: 30px;
    line-height: 1;
}

.demo-nav__title {
    flex: 1;
    overflow: hidden;
    color: $snake-text-main;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.demo-nav__home {
    font-size: 13px;
    color: $snake-primary;
    font-weight: 500;
}

.demo-page-header {
    max-width: 760px;
    margin: 0 auto;
    padding: 22px 16px 14px;
    border-bottom: 1px solid $snake-border;
    background: $snake-bg-card;
}

.demo-page-header__title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.demo-page-header__title {
    color: $snake-text-main;
    font-size: 21px;
    font-weight: 600;
    line-height: 1.3;
}

.demo-page-header__category {
    flex: none;
    color: $snake-primary;
    font-size: 11px;
}

.demo-page-header__desc {
    margin-top: 8px;
    color: $snake-text-sub;
    font-size: 13px;
    line-height: 1.6;
}

.demo-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 16px 12px 40px;
}
</style>
