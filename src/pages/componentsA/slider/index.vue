<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const value = ref(35);
const controls: DemoControl[] = [
    { key: 'sliderStep', label: '步长', type: 'slider', defaultValue: 5, min: 1, max: 20, step: 1 },
    { key: 'sliderShowValue', label: '显示数值', type: 'switch', defaultValue: true },
    { key: 'sliderDisabled', label: '禁用状态', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('slider', '滑动选择器');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('通过点击或触摸拖动选择范围内的数值。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-control-stack demo-slider-showcase"
                ><text class="demo-variant-title">{{ isEnglish ? 'Touch and keyboard' : '触摸与键盘操作' }}</text
                ><snake-slider
                    v-model="value"
                    :step="Number(state.sliderStep)"
                    :show-value="Boolean(state.sliderShowValue)"
                    :disabled="Boolean(state.sliderDisabled)"
                    show-edge-value
                /><text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ value }}</text></view
            ></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
<style scoped>
.demo-control-stack {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
    padding: 24rpx;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
}
.demo-control-stack > text {
    color: var(--snake-color-text-secondary);
    font-size: 26rpx;
}
</style>
