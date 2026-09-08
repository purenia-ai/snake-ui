<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'loading', label: '显示骨架', type: 'switch', defaultValue: true },
    { key: 'animated', label: '流光动画', type: 'switch', defaultValue: true }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: text(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('skeleton', '骨架屏');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :eyebrow="text('基础组件')" :desc="text('在首次加载时预显示接近真实内容的页面结构。')">
        <DemoSection variant="preview" :title="text('快速模式')">
            <view class="demo-skeleton-showcase">
                <snake-skeleton :loading="Boolean(state.loading)" :animated="Boolean(state.animated)" avatar :rows="3">
                    <view class="demo-skeleton-content">{{ text('数据加载完成，展示真实内容。') }}</view>
                </snake-skeleton>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('自定义模板')">
            <snake-skeleton :loading="Boolean(state.loading)" :animated="Boolean(state.animated)">
                <template #template>
                    <view class="demo-card-grid">
                        <view v-for="index in 2" :key="index" class="demo-card">
                            <snake-skeleton-item variant="image" height="180rpx" />
                            <snake-skeleton-item width="78%" custom-style="margin-top: 16rpx" />
                            <snake-skeleton-item width="48%" height="24rpx" custom-style="margin-top: 12rpx" />
                        </view>
                    </view>
                </template>
                <view class="demo-card-grid">
                    <view v-for="index in 2" :key="index" class="demo-card demo-card--loaded">
                        {{ text('真实卡片') }} {{ index }}
                    </view>
                </view>
            </snake-skeleton>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-skeleton-showcase,
.demo-card {
    padding: 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
.demo-skeleton-content,
.demo-card--loaded {
    color: var(--snake-color-text-secondary);
    font-size: 28rpx;
}
.demo-card-grid {
    display: flex;
    gap: 20rpx;
}
.demo-card {
    box-sizing: border-box;
    width: calc((100% - 20rpx) / 2);
}
.demo-card--loaded {
    display: flex;
    min-height: 240rpx;
    align-items: center;
    justify-content: center;
}
</style>
