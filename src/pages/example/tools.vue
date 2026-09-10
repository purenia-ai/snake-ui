<script setup lang="ts">
import DemoPage from '../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../common/demo-i18n';
import tools from './tools.config';

defineOptions({ name: 'ExampleTools' });

const { text } = useDemoLocale();
const openTool = (url: string) => uni.navigateTo({ url });
</script>

<template>
    <DemoPage
        tabbar
        current-tab="tools"
        :title="text('工具总览')"
        :desc="text('集中体验 Snake UI 的运行时工具与 Hooks')"
        :nav-back="false"
        :nav-home="false"
    >
        <view class="tool-list">
            <view
                v-for="tool in tools"
                :key="tool.url"
                class="tool-card"
                hover-class="tool-card--hover"
                @click="openTool(tool.url)"
            >
                <view class="tool-card__icon"><snake-icon :name="tool.icon" :size="24" /></view>
                <view class="tool-card__body">
                    <text class="tool-card__title">{{ text(tool.title) }}</text>
                    <text class="tool-card__desc">{{ text(tool.desc) }}</text>
                </view>
                <snake-icon name="arrow-right" :size="18" />
            </view>
        </view>
    </DemoPage>
</template>

<style lang="scss" scoped>
@import '../../common/demo.scss';

.tool-list {
    display: grid;
    gap: 14rpx;
    padding: 4rpx 8rpx 24rpx;
}

.tool-card {
    display: flex;
    min-height: 112rpx;
    padding: 24rpx;
    align-items: center;
    gap: 22rpx;
    border: 1px solid var(--snake-color-divider);
    border-radius: 14rpx;
    background: var(--snake-color-surface);
}

.tool-card--hover {
    border-color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}

.tool-card__icon {
    display: flex;
    width: 72rpx;
    height: 72rpx;
    flex: none;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx;
    color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}

.tool-card__body {
    min-width: 0;
    flex: 1;
}

.tool-card__title,
.tool-card__desc {
    display: block;
}

.tool-card__title {
    color: var(--snake-color-text);
    font-size: 30rpx;
    font-weight: 650;
}

.tool-card__desc {
    margin-top: 8rpx;
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
