<script setup lang="ts">
import { computed } from 'vue';
import {
    snakeColor,
    snakeDarkMode,
    snakeSystemDark,
    snakeThemeStyle
} from '../uni_modules/snake-ui';

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

/*
 * 外壳组合变量必须内联到页面根节点:uni-app H5 会把 `page` 选择器编译成
 * uni-page-body,自定义属性在定义处完成 var() 代换后按字面值继承,
 * 仅写在 :root / .snake-theme-dark 上的深色覆写无法穿透到页面内容。
 * 导航渐变使用 demo/theme.scss 中的纯字面值(绿色,不随主题切换),不受代换影响。
 */
const isDark = computed(() =>
    snakeDarkMode.value === 'auto' ? snakeSystemDark.value : snakeDarkMode.value === 'dark'
);
const shellThemeStyle = computed(() => ({
    ...snakeThemeStyle.value,
    '--snake-demo-accent-text': isDark.value ? snakeColor.primary : snakeColor.primaryDeep
}));

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
    <view :class="['demo-page', { 'demo-page--viewport': viewport }]" :style="shellThemeStyle">
        <template v-if="!viewport">
            <view class="demo-nav">
                <view class="demo-nav__side" :class="{ 'demo-nav__side--hidden': !navBack }">
                    <view
                        v-if="navBack"
                        class="demo-nav__hit"
                        hover-class="demo-nav__hit--hover"
                        @click="goBack()"
                    >
                        <text class="demo-nav__back">‹</text>
                    </view>
                </view>
                <text class="demo-nav__title">{{ title }}</text>
                <view class="demo-nav__side" :class="{ 'demo-nav__side--hidden': !navHome }">
                    <view
                        v-if="navHome"
                        class="demo-nav__hit"
                        hover-class="demo-nav__hit--hover"
                        @click="goHome()"
                    >
                        <text class="demo-nav__home">首页</text>
                    </view>
                </view>
            </view>

            <view v-if="eyebrow || desc" class="demo-page-header">
                <view v-if="eyebrow" class="demo-page-header__category">{{ eyebrow }}</view>
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
    background-color: var(--snake-color-background);
    background-image: $snake-page-tint;
    background-repeat: no-repeat;
    color: var(--snake-color-text);
    -webkit-font-smoothing: antialiased;
}

.demo-page--viewport {
    background: var(--snake-color-surface);
}

.demo-nav {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    height: $snake-nav-height;
    padding: 0 12rpx;
    background: $snake-nav-gradient;
    box-shadow: 0 4rpx 18rpx rgba(4, 168, 115, 0.24);
}

.demo-nav__side {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96rpx;
    height: 100%;

    &--hidden {
        visibility: hidden;
    }
}

.demo-nav__hit {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 72rpx;
    height: 64rpx;
    padding: 0 12rpx;
    border-radius: 12rpx;
    transition: background-color 0.2s ease;
}

.demo-nav__hit--hover {
    background: var(--snake-demo-nav-hover);
}

.demo-nav__back {
    padding-bottom: 6rpx;
    color: var(--snake-demo-nav-text);
    font-size: 56rpx;
    line-height: 1;
}

.demo-nav__title {
    flex: 1;
    overflow: hidden;
    color: var(--snake-demo-nav-text);
    font-size: 32rpx;
    font-weight: 600;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.demo-nav__home {
    color: var(--snake-demo-nav-text);
    font-size: 26rpx;
    font-weight: 500;
}

.demo-page-header {
    max-width: 760px;
    margin: 0 auto;
    padding: 28rpx 32rpx 8rpx;
}

.demo-page-header__category {
    display: inline-block;
    padding: 6rpx 20rpx;
    border-radius: 999rpx;
    color: var(--snake-demo-accent-text);
    background: var(--snake-color-primary-light);
    font-size: 24rpx;
    font-weight: 600;
}

.demo-page-header__desc {
    margin-top: 14rpx;
    color: var(--snake-color-text-muted);
    font-size: 26rpx;
    line-height: 1.7;
}

.demo-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 24rpx 24rpx 56rpx;
}
</style>
