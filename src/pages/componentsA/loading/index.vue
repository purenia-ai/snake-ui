<template>
    <DemoPage :title="title" :desc="text('展示不同形态、尺寸、颜色与方向的加载指示器。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <view class="demo-feedback-row">
                    <snake-loading
                        :show="Boolean(state.loadingShow)"
                        :type="state.loadingType as any"
                        :size="Number(state.loadingSize)"
                        :direction="state.loadingDirection as any"
                        :color="String(state.loadingColor)"
                        :text="String(state.loadingText) || (isEnglish ? 'Loading' : '加载中')"
                        :text-size="Number(state.loadingTextSize)"
                    />
                </view>
                <text class="demo-variant-title">{{ isEnglish ? 'Types' : '加载形态' }}</text>
                <view class="demo-feedback-row">
                    <snake-loading type="circular" :text="text('圆环')" />
                    <snake-loading type="spinner" :text="text('旋转条')" />
                    <snake-loading type="dots" :text="text('跳动点')" />
                    <snake-loading type="wave" :text="text('波浪')" />
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
const controls: DemoControl[] = [
    { key: 'loadingShow', label: '是否显示', type: 'switch', defaultValue: true },
    { key: 'loadingText', label: '提示文字', type: 'input', defaultValue: '', placeholder: '加载中' },
    {
        key: 'loadingTextSize',
        label: '文字尺寸',
        type: 'slider',
        defaultValue: 28,
        min: 20,
        max: 36,
        step: 2,
        unit: 'rpx'
    },
    {
        key: 'loadingType',
        label: '加载形态',
        type: 'select',
        defaultValue: 'circular',
        options: [
            { label: '圆环', value: 'circular' },
            { label: '旋转条', value: 'spinner' },
            { label: '跳动点', value: 'dots' },
            { label: '波浪', value: 'wave' }
        ]
    },
    { key: 'loadingSize', label: '图标尺寸', type: 'slider', defaultValue: 34, min: 16, max: 48, step: 2, unit: 'rpx' },
    {
        key: 'loadingColor',
        label: '图标颜色',
        type: 'select',
        defaultValue: 'var(--snake-color-primary)',
        options: [
            { label: '主要', value: 'var(--snake-color-primary)' },
            { label: '成功', value: 'var(--snake-color-success)' },
            { label: '警告', value: 'var(--snake-color-warning)' },
            { label: '错误', value: 'var(--snake-color-error)' }
        ]
    },
    {
        key: 'loadingDirection',
        label: '排列方向',
        type: 'select',
        defaultValue: 'vertical',
        options: [
            { label: '垂直', value: 'vertical' },
            { label: '水平', value: 'horizontal' }
        ]
    }
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
    return demoTitle('loading', '加载');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
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
