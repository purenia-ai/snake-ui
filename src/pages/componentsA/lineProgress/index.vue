<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [
    { key: 'lpPercent', label: '进度值', type: 'slider', defaultValue: 40, min: 0, max: 100, step: 5, unit: '%' },
    {
        key: 'lpType',
        label: '主题预设',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '无预设', value: '' },
            { label: '品牌绿', value: 'primary' },
            { label: '成功', value: 'success' },
            { label: '警示', value: 'warning' },
            { label: '错误', value: 'error' },
            { label: '信息', value: 'info' }
        ]
    },
    { key: 'lpShowPercent', label: '显示百分比', type: 'switch', defaultValue: true },
    { key: 'lpStriped', label: '条纹', type: 'switch', defaultValue: false },
    { key: 'lpStripedActive', label: '条纹动画', type: 'switch', defaultValue: false },
    { key: 'lpRound', label: '两端半圆', type: 'switch', defaultValue: true }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({
        ...control,
        label: demoText(control.label),
        options: control.options?.map(option => ({ ...option, label: demoText(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('line-progress', '线形进度条');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('以线形进度展示任务完成情况，支持条纹与百分比。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-line-progress-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-line-progress
                    :percent="Number(state.lpPercent)"
                    :type="String(state.lpType)"
                    :show-percent="Boolean(state.lpShowPercent)"
                    :striped="Boolean(state.lpStriped)"
                    :striped-active="Boolean(state.lpStripedActive)"
                    :round="Boolean(state.lpRound)"
                />
                <text class="demo-variant-title">{{ isEnglish ? 'Theme presets' : '主题预设' }}</text>
                <snake-line-progress :percent="30" type="primary" />
                <snake-line-progress :percent="50" type="success" />
                <snake-line-progress :percent="60" type="warning" />
                <snake-line-progress :percent="70" type="error" />
                <snake-line-progress :percent="80" type="info" />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue"
        /></DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}
</style>
