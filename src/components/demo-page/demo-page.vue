<template>
    <view :class="['demo-page', { 'demo-page--viewport': viewport }]" :style="shellThemeStyle">
        <template v-if="!viewport">
            <snake-navbar
                :title="title"
                :is-back="navBack"
                :custom-back="goBack"
                :background="background"
                title-color="#ffffff"
                back-icon-color="#ffffff"
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
                <snake-tabbar
                    v-if="tabbar"
                    :items="tabItems"
                    :current="currentTab"
                    :mid-button="true"
                    @change="switchTab"
                />
            </view>
        </template>
        <template v-else>
            <view class="demo-viewport-nav">
                <button class="demo-viewport-nav__back" :aria-label="text('返回')" @click="goBack">
                    ← {{ text('返回') }}
                </button>
                <text class="demo-viewport-nav__title">{{ title }}</text>
                <button class="demo-viewport-nav__locale" :aria-label="text('切换语言')" @click="switchLocale">
                    {{ nextLocaleLabel }}
                </button>
            </view>
            <slot />
        </template>
    </view>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, toRefs, watch } from 'vue';
import { color, currentTheme, darkMode, systemDark, themeStyle } from '../../uni_modules/snake-ui';
import type { DemoTab } from '../../common/demo-types';
import { useDemoLocale } from '../../common/demo-i18n';

const props = withDefaults(
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
const { title, eyebrow, desc, viewport, navBack, navHome, tabbar, currentTab } = toRefs(props);

/*
 * 外壳组合变量必须内联到页面根节点:uni-app H5 会把 `page` 选择器编译成
 * uni-page-body,自定义属性在定义处完成 var() 代换后按字面值继承,
 * 仅写在 :root / .snake-theme-dark 上的深色覆写无法穿透到页面内容。
 * 导航纯色使用 common/demo.scss 中的私有变量,不受代换影响。
 */
const isDark = computed(() => (darkMode.value === 'auto' ? systemDark.value : darkMode.value === 'dark'));
const shellThemeStyle = computed(() => ({
    ...themeStyle.value,
    '--snake-demo-accent-text': isDark.value ? color.primary : color.primaryDeep
}));
const navbarColor = computed(() =>
    currentTheme.value.name === 'snake' ? (isDark.value ? '#01513B' : '#007A55') : color.primaryDeep
);
const background = computed(() => ({ backgroundColor: navbarColor.value }));

function postPreviewNavbarTheme() {
    if (typeof window === 'undefined' || window.parent === window) return;
    window.parent.postMessage(
        {
            type: 'snake-ui:preview-navbar-theme',
            backgroundColor: navbarColor.value,
            color: '#ffffff'
        },
        '*'
    );
}

function handlePreviewThemeRequest(event: MessageEvent<{ type?: string }>) {
    if (event.data?.type === 'snake-ui:request-preview-navbar-theme') postPreviewNavbarTheme();
}

watch(navbarColor, postPreviewNavbarTheme, { immediate: true });
onMounted(() => {
    if (typeof window !== 'undefined') window.addEventListener('message', handlePreviewThemeRequest);
});
onBeforeUnmount(() => {
    if (typeof window !== 'undefined') window.removeEventListener('message', handlePreviewThemeRequest);
});

const { nextLocaleLabel, switchLocale, text } = useDemoLocale();
const tabItems = computed(() => [
    { key: 'components', text: text('组件'), iconPath: 'grid', selectedIconPath: 'grid-fill' },
    { key: 'tools', text: text('工具'), iconPath: 'setting', selectedIconPath: 'setting-fill' },
    {
        key: 'scenes',
        text: text('场景'),
        iconPath: 'moments',
        selectedIconPath: 'moments-circel-fill',
        midButton: true
    },
    { key: 'templates', text: text('模板'), iconPath: 'tags', selectedIconPath: 'tags-fill' },
    { key: 'about', text: text('关于'), iconPath: 'info-circle', selectedIconPath: 'info-circle-fill' }
]);
const tabRoutes: Record<DemoTab, string> = {
    components: '/pages/example/components',
    tools: '/pages/example/tools',
    scenes: '/pages/example/scenes',
    templates: '/pages/example/templates',
    about: '/pages/example/about'
};

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

function switchTab(key: string | number) {
    const route = tabRoutes[String(key) as DemoTab];
    if (route && key !== currentTab.value) uni.switchTab({ url: route });
}
</script>

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
.demo-viewport-nav {
    position: relative;
    z-index: 30;
    display: flex;
    min-height: 80rpx;
    padding: var(--status-bar-height, env(safe-area-inset-top, 0px)) 18rpx 0;
    align-items: center;
    justify-content: space-between;
    gap: 12rpx;
    border-bottom: 1px solid var(--snake-color-divider);
    background: var(--snake-color-surface);
    color: var(--snake-color-text);
}
.demo-viewport-nav__back,
.demo-viewport-nav__locale {
    flex: none;
    min-height: 64rpx;
    margin: 0;
    padding: 0 12rpx;
    border: 0;
    color: var(--snake-color-primary-deep);
    background: transparent;
    font-size: 24rpx;
    line-height: 64rpx;
}
.demo-viewport-nav__back::after,
.demo-viewport-nav__locale::after {
    border: 0;
}
.demo-viewport-nav__title {
    overflow: hidden;
    min-width: 0;
    color: var(--snake-color-text);
    font-size: 27rpx;
    font-weight: 650;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    color: #fff;
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
    background: rgba(255, 255, 255, 0.16);
}

.demo-nav__home {
    color: #fff;
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
