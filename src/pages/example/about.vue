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
                <text class="brand-card__version">Vue 3 · uni-app</text>
            </view>
        </view>

        <view class="about-stats">
            <view>
                <text class="about-stats__value">{{ componentCount }}</text>
                <text class="about-stats__label">{{ text('组件演示') }}</text>
            </view>
            <view>
                <text class="about-stats__value">Vue 3</text>
                <text class="about-stats__label">{{ text('技术栈') }}</text>
            </view>
            <view>
                <text class="about-stats__value">MIT</text>
                <text class="about-stats__label">{{ text('开源协议') }}</text>
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
            <!-- #ifdef H5 -->
            <snake-button class="link-button" type="primary" @click="openExternal(docsUrl)">
                {{ text('打开在线文档') }}
            </snake-button>
            <!-- #endif -->
            <snake-button class="link-button" plain @click="openExternal(repositoryUrl)">
                {{ text('访问代码仓库') }}
            </snake-button>
        </view>
    </DemoPage>
</template>

<script setup lang="ts">
import DemoPage from '../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../common/demo-i18n';
import componentGroups from './components.config';

defineOptions({ name: 'ExampleAbout' });

const { text } = useDemoLocale();
const componentCount = componentGroups.reduce((sum, group) => sum + group.list.length, 0);
const docsUrl = 'https://m.puresnake.com/snake-ui/';
const repositoryUrl = 'https://github.com/purenia-ai/snake-ui';
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

function openExternal(url: string) {
    // #ifdef H5
    window.open(url, '_blank');
    // #endif
    // #ifndef H5
    uni.setClipboardData({ data: url, success: () => uni.showToast({ title: text('链接已复制'), icon: 'none' }) });
    // #endif
}
</script>

<style lang="scss" scoped>
@import '../../common/demo.scss';

.brand-card,
.section,
.about-stats {
    margin: 4rpx 8rpx 24rpx;
    padding: 28rpx;
    border: 1px solid var(--snake-color-divider);
    border-radius: 16rpx;
    background: var(--snake-color-surface);
}
.about-stats {
    display: flex;
    justify-content: space-between;
    padding: 24rpx 12rpx;
    text-align: center;
}
.about-stats > view {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6rpx;
}
.about-stats__value {
    color: var(--snake-color-primary-deep);
    font-size: 34rpx;
    font-weight: 750;
}
.about-stats__label {
    color: var(--snake-color-text-muted);
    font-size: 22rpx;
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
.link-button {
    margin-top: 14rpx;
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
