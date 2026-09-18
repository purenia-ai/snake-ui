<template>
    <DemoPage :title="title" :desc="text('在装修区块之间提供留白或分隔线。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="segment-context">{{ isEnglish ? 'Section A' : '内容区 A' }}</view>
            <snake-auxiliary-segmentation class="demo-auxiliary-segmentation-showcase" :datas="data" />
            <view class="segment-context">{{ isEnglish ? 'Section B' : '内容区 B' }}</view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue';
import { auxiliaryData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [
    { key: 'segmentHeight', label: '分隔高度', type: 'slider', defaultValue: 32, min: 8, max: 80, step: 8, unit: 'px' },
    { key: 'segmentLine', label: '显示分隔线', type: 'switch', defaultValue: true }
];
const state = reactive<Record<string, DemoValue>>({ segmentHeight: 32, segmentLine: true });
const data = computed(() => ({
    ...auxiliaryData,
    blankHeight: Number(state.segmentHeight),
    segmentationtype: state.segmentLine ? 1 : 0
}));
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('auxiliary-segmentation', '辅助分割线');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<style scoped>
.segment-context {
    padding: 20rpx 24rpx;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-bg);
    font-size: 26rpx;
}
</style>
