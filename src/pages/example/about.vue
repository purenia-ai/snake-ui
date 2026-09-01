<script setup lang="ts">
import DemoPage from '../../demo/components/DemoPage.vue';
import { useDemoLocale } from '../../demo/demo-i18n';

defineOptions({ name: 'SnakeExampleAbout' });

const { text } = useDemoLocale();
const docsUrl = 'https://m.puresnake.com/snake-ui/';
const capabilities = [
    'Vue 3 与 uni-app 跨端',
    '商城与 CMS 组件',
    '多主题与暗黑模式',
    '中英文国际化',
    'HTTP、Hooks 与常用工具'
];

function copyDocsUrl() {
    uni.setClipboardData({
        data: docsUrl,
        success: () => uni.showToast({ title: text('文档地址已复制'), icon: 'success' })
    });
}
</script>

<template>
    <DemoPage
        tabbar
        current-tab="about"
        :title="text('关于SnakeUI')"
        :desc="text('面向 uni-app 商城与 CMS 场景的组件库')"
        :nav-back="false"
        :nav-home="false"
    >
        <view class="brand-card">
            <image class="brand-card__logo" src="/static/logo.png" mode="aspectFit" />
            <view class="brand-card__body">
                <text class="brand-card__name">Snake UI</text>
                <text class="brand-card__version">Demo v0.0.0</text>
            </view>
        </view>

        <view class="section">
            <text class="section__title">{{ text('主要能力') }}</text>
            <view v-for="capability in capabilities" :key="capability" class="capability">
                <snake-icon name="checkmark-circle" :size="18" />
                <text>{{ text(capability) }}</text>
            </view>
        </view>

        <view class="section">
            <text class="section__title">{{ text('在线文档') }}</text>
            <text class="docs-url">{{ docsUrl }}</text>
            <snake-button type="primary" plain @click="copyDocsUrl">{{ text('复制文档地址') }}</snake-button>
        </view>
    </DemoPage>
</template>

<style lang="scss" scoped>
@import '../../demo/theme.scss';

.brand-card,
.section {
    margin: 4rpx 8rpx 24rpx;
    padding: 28rpx;
    border: 1px solid var(--snake-color-divider);
    border-radius: 16rpx;
    background: var(--snake-color-surface);
}

.brand-card {
    display: flex;
    align-items: center;
    gap: 24rpx;
}

.brand-card__logo {
    width: 104rpx;
    height: 104rpx;
    flex: none;
}

.brand-card__name,
.brand-card__version,
.section__title,
.docs-url {
    display: block;
}

.brand-card__name {
    color: var(--snake-color-text);
    font-size: 38rpx;
    font-weight: 720;
}

.brand-card__version,
.docs-url {
    margin-top: 8rpx;
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}

.section__title {
    margin-bottom: 20rpx;
    color: var(--snake-color-text);
    font-size: 30rpx;
    font-weight: 650;
}

.capability {
    display: flex;
    margin: 16rpx 0;
    align-items: center;
    gap: 14rpx;
    color: var(--snake-color-text-secondary);
    font-size: 26rpx;
}

.capability snake-icon {
    color: var(--snake-color-primary);
}

.docs-url {
    margin-bottom: 22rpx;
    overflow-wrap: anywhere;
}
</style>
