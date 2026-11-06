<template>
    <DemoPage :title="title" :desc="text('canvas 环形进度，中心透明，可放任意背景。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-circle-progress-showcase">
                <view class="demo-circle-progress-stage">
                    <snake-circle-progress
                        :percent="Number(state.cpPercent)"
                        :width="Number(state.cpWidth)"
                        :border-width="Number(state.cpBorderWidth)"
                        :active-color="String(state.cpActiveColor)"
                        :line-cap="lineCap"
                        :clockwise="Boolean(state.cpClockwise)"
                    >
                        <view class="demo-circle-progress-center">
                            <text class="demo-circle-progress-value">{{ Math.round(Number(state.cpPercent)) }}%</text>
                        </view>
                    </snake-circle-progress>
                </view>
                <text class="demo-variant-title">{{ isEnglish ? 'Presets' : '预设组合' }}</text>
                <view class="demo-circle-progress-row">
                    <snake-circle-progress :percent="25" :width="64" :border-width="6" />
                    <snake-circle-progress :percent="50" :width="64" :border-width="6" active-color="#ff9900" />
                    <snake-circle-progress :percent="75" :width="64" :border-width="6" active-color="#fa3534" />
                    <snake-circle-progress :percent="100" :width="64" :border-width="6" :clockwise="false" />
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const lineCap = computed(() => {
    const value = String(state.cpLineCap);
    return value === 'butt' || value === 'square' ? value : 'round';
});
const controls: DemoControl[] = [
    { key: 'cpPercent', label: '进度值', type: 'slider', defaultValue: 68, min: 0, max: 100, step: 1, unit: '%' },
    { key: 'cpWidth', label: '圆环直径', type: 'slider', defaultValue: 120, min: 64, max: 200, step: 4, unit: 'px' },
    { key: 'cpBorderWidth', label: '线条宽度', type: 'slider', defaultValue: 8, min: 2, max: 20, step: 1, unit: 'px' },
    {
        key: 'cpActiveColor',
        label: '激活色',
        type: 'select',
        defaultValue: 'var(--snake-color-primary)',
        options: [
            { label: '品牌绿', value: 'var(--snake-color-primary)' },
            { label: '警示橙', value: '#ff9900' },
            { label: '错误红', value: '#fa3534' }
        ]
    },
    {
        key: 'cpLineCap',
        label: '弧端形状',
        type: 'select',
        defaultValue: 'round',
        options: [
            { label: '圆头', value: 'round' },
            { label: '平头', value: 'butt' },
            { label: '方头', value: 'square' }
        ]
    },
    { key: 'cpClockwise', label: '顺时针', type: 'switch', defaultValue: true }
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
    return demoTitle('circle-progress', '环形进度条');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.demo-circle-progress-stage {
    display: flex;
    justify-content: center;
    padding: 12px 0;
}
.demo-circle-progress-center {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.demo-circle-progress-value {
    color: var(--snake-color-text);
    font-size: 18px;
    font-weight: 600;
}
.demo-circle-progress-row {
    display: flex;
    gap: 12px;
    justify-content: space-between;
}
</style>
