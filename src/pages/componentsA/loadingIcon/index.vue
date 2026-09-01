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
    {
        key: 'loadingMode',
        label: '加载形态',
        type: 'select',
        defaultValue: 'circle',
        options: [
            { label: '圆环', value: 'circle' },
            { label: '花朵', value: 'spinner' }
        ]
    },
    { key: 'loadingSize', label: '图标尺寸', type: 'slider', defaultValue: 28, min: 16, max: 48, step: 2, unit: 'px' },
    { key: 'loadingVertical', label: '垂直排列', type: 'switch', defaultValue: false }
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
    return demoTitle('loading-icon', '加载图标');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :eyebrow="text('基础组件')" :desc="text('统一展示按钮、图片和列表中的加载状态。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-loading-icon-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <view class="demo-feedback-row">
                    <snake-loading-icon
                        :mode="state.loadingMode as any"
                        :size="Number(state.loadingSize)"
                        :vertical="Boolean(state.loadingVertical)"
                        :text="isEnglish ? 'Loading' : '加载中'"
                    />
                </view>
                <text class="demo-variant-title">{{ isEnglish ? 'Modes' : '加载形态' }}</text>
                <view class="demo-feedback-row"
                    ><snake-loading-icon mode="circle" text="Circle" /><snake-loading-icon
                        mode="spinner"
                        text="Spinner"
                /></view>
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
.demo-feedback-row {
    display: flex;
    min-height: 120rpx;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 48rpx;
    padding: 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
</style>
