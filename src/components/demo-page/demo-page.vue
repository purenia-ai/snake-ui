<script setup lang="ts">
import { computed } from 'vue';
import { snakeColor, snakeDarkMode, snakeSystemDark, snakeThemeStyle } from '../../uni_modules/snake-ui';
import type { DemoTab } from '../../common/demo-types';
import { useDemoLocale } from '../../common/demo-i18n';
import DemoTabbar from '../demo-tabbar/demo-tabbar.vue';

withDefaults(
    defineProps<{
        title?: string;
        eyebrow?: string;
        desc?: string;
        viewport?: boolean;
        navBack?: boolean;
        navHome?: boolean;
        tabbar?: boolean;
        currentTab?: DemoTab;
    }>(),
    {
        title: '',
        eyebrow: '',
        desc: '',
        viewport: false,
        navBack: true,
        navHome: true,
        tabbar: false,
        currentTab: 'components'
    }
);

/*
 * 外壳组合变量必须内联到页面根节点:uni-app H5 会把 `page` 选择器编译成
 * uni-page-body,自定义属性在定义处完成 var() 代换后按字面值继承,
 * 仅写在 :root / .snake-theme-dark 上的深色覆写无法穿透到页面内容。
 * 导航纯色使用 common/demo.scss 中的私有变量,不受代换影响。
 */
const isDark = computed(() =>
    snakeDarkMode.value === 'auto' ? snakeSystemDark.value : snakeDarkMode.value === 'dark'
);
const shellThemeStyle = computed(() => ({
    ...snakeThemeStyle.value,
    '--snake-demo-accent-text': isDark.value ? snakeColor.primary : snakeColor.primaryDeep
}));
const { nextLocaleLabel, switchLocale, text } = useDemoLocale();

function goBack() {
    if (getCurrentPages().length > 1) {
        uni.navigateBack();
    } else {
        uni.reLaunch({ url: '/pages/example/components' });
    }
}

function goHome() {
    uni.reLaunch({ url: '/pages/example/components' });
}
</script>

<template>
    <view :class="['demo-page', { 'demo-page--viewport': viewport }]" :style="shellThemeStyle">
        <template v-if="!viewport">
            <snake-navbar
                :title="title"
                :is-back="navBack"
                :fixed="false"
                :custom-back="goBack"
                :background="'var(--snake-demo-nav-background)'"
                title-color="var(--snake-demo-nav-text)"
                back-icon-color="var(--snake-demo-nav-text)"
                :border-bottom="false"
                title-bold
            >
                <template #right>
                    <view class="demo-nav__actions">
                        <view
                            class="demo-nav__hit demo-nav__locale"
                            hover-class="demo-nav__hit--hover"
                            @click="switchLocale"
                        >
                            <text>{{ nextLocaleLabel }}</text>
                        </view>
                        <view v-if="navHome" class="demo-nav__hit" hover-class="demo-nav__hit--hover" @click="goHome()">
                            <text class="demo-nav__home">{{ text('首页') }}</text>
                        </view>
                    </view>
                </template>
            </snake-navbar>

            <view v-if="eyebrow || desc" class="demo-page-header">
                <text v-if="eyebrow" class="demo-page-header__category">{{ eyebrow }}</text>
                <text class="demo-page-header__title">{{ title }}</text>
                <view v-if="desc" class="demo-page-header__desc">{{ desc }}</view>
            </view>

            <view class="demo-body">
                <slot />
                <DemoTabbar v-if="tabbar" :current="currentTab" />
            </view>
        </template>
        <slot v-else />
    </view>
</template>

<style lang="scss" scoped>
@import '../../common/demo.scss';

.demo-page {
    box-sizing: border-box;
    min-height: 100vh;
    background-color: var(--snake-color-surface);
    color: var(--snake-color-text);
    -webkit-font-smoothing: antialiased;
}

.demo-page--viewport {
    background: var(--snake-color-surface);
}

.demo-nav__actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 96rpx;
    height: 100%;
}

.demo-nav__locale {
    min-width: 58rpx;
    color: var(--snake-demo-nav-text);
    font-size: 24rpx;
    font-weight: 650;
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

.demo-nav__home {
    color: var(--snake-demo-nav-text);
    font-size: 26rpx;
    font-weight: 500;
}

.demo-page-header {
    max-width: 760px;
    margin: 0 auto;
    padding: 32rpx 32rpx 10rpx;
}

.demo-page-header__category {
    display: block;
    margin-bottom: 10rpx;
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
    line-height: 1.4;
}

.demo-page-header__title {
    display: block;
    color: var(--snake-color-text);
    font-size: 38rpx;
    font-weight: 700;
    line-height: 1.35;
}

.demo-page-header__desc {
    margin-top: 10rpx;
    color: var(--snake-color-text-muted);
    font-size: 26rpx;
    line-height: 1.7;
}

.demo-body {
    max-width: 760px;
    margin: 0 auto;
    padding: 22rpx 24rpx 56rpx;
}
</style>
