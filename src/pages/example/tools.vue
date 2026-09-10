<script setup lang="ts">
import { computed, ref } from 'vue';
import DemoPage from '../../components/demo-page/demo-page.vue';
import { useDemoLocale } from '../../common/demo-i18n';
import tools from './tools.config';

defineOptions({ name: 'ExampleTools' });

const { text } = useDemoLocale();
const openTool = (url: string) => uni.navigateTo({ url });
const searchText = ref('');
const groups = computed(() => {
    const keyword = searchText.value.trim().toLowerCase();
    const map = new Map<string, { title: string; titleEn: string; items: typeof tools }>();
    tools.forEach(tool => {
        const source = `${tool.title} ${tool.desc} ${tool.category} ${tool.categoryEn}`.toLowerCase();
        if (keyword && !source.includes(keyword)) return;
        const group = map.get(tool.category) || { title: tool.category, titleEn: tool.categoryEn, items: [] };
        group.items.push(tool);
        map.set(tool.category, group);
    });
    return [...map.values()];
});
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
        <view class="tools-hero">
            <text class="tools-hero__eyebrow">SNAKE / TOOLKIT</text>
            <text class="tools-hero__title">让常用能力触手可及</text>
            <text class="tools-hero__desc">网络、运行时和基础 Hooks 的跨端示例。</text>
        </view>
        <view class="tool-search"
            ><snake-icon name="search" :size="19" /><input
                v-model="searchText"
                :placeholder="text('搜索工具')"
                confirm-type="search"
        /></view>
        <view v-if="!groups.length" class="tool-empty"
            ><snake-icon name="search" :size="30" /><text>{{ text('没有找到相关工具') }}</text></view
        >
        <view v-for="group in groups" :key="group.title" class="tool-group">
            <view class="tool-group__header"
                ><text class="tool-group__title">{{ text(group.title) }}</text
                ><text class="tool-group__en">{{ group.titleEn }}</text
                ><text class="tool-group__count">{{ group.items.length }}</text></view
            >
            <view class="tool-list">
                <view
                    v-for="tool in group.items"
                    :key="tool.url"
                    class="tool-card"
                    hover-class="tool-card--hover"
                    @click="openTool(tool.url)"
                >
                    <view class="tool-card__icon"><snake-icon :name="tool.icon" :size="24" /></view>
                    <view class="tool-card__body"
                        ><text class="tool-card__title">{{ text(tool.title) }}</text
                        ><text class="tool-card__desc">{{ text(tool.desc) }}</text></view
                    >
                    <snake-icon name="arrow-right" :size="18" />
                </view>
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
.tools-hero {
    margin: 0 0 24rpx;
    padding: 36rpx 30rpx;
    border-radius: 22rpx;
    color: #effff8;
    background: linear-gradient(135deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
}
.tools-hero__eyebrow,
.tools-hero__title,
.tools-hero__desc {
    display: block;
}
.tools-hero__eyebrow {
    color: rgba(239, 255, 248, 0.7);
    font-size: 20rpx;
    letter-spacing: 4rpx;
}
.tools-hero__title {
    margin-top: 12rpx;
    font-size: 40rpx;
    font-weight: 750;
}
.tools-hero__desc {
    margin-top: 10rpx;
    color: rgba(239, 255, 248, 0.78);
    font-size: 24rpx;
}
.tool-search {
    display: flex;
    height: 76rpx;
    margin-bottom: 24rpx;
    padding: 0 22rpx;
    align-items: center;
    gap: 12rpx;
    border: 1px solid var(--snake-color-divider);
    border-radius: 16rpx;
    background: var(--snake-color-surface);
    color: var(--snake-color-text-muted);
}
.tool-search input {
    min-width: 0;
    flex: 1;
    height: 100%;
    color: var(--snake-color-text);
    font-size: 26rpx;
}
.tool-group {
    margin-bottom: 28rpx;
}
.tool-group__header {
    display: flex;
    margin-bottom: 12rpx;
    align-items: baseline;
}
.tool-group__title {
    color: var(--snake-color-text);
    font-size: 30rpx;
    font-weight: 700;
}
.tool-group__en {
    margin-left: 10rpx;
    color: var(--snake-color-text-muted);
    font-size: 20rpx;
    text-transform: uppercase;
}
.tool-group__count {
    margin-left: auto;
    color: var(--snake-color-text-muted);
    font-size: 22rpx;
}
.tool-empty {
    display: flex;
    min-height: 300rpx;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14rpx;
    color: var(--snake-color-text-muted);
    font-size: 25rpx;
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
