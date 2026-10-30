<template>
    <DemoPage :title="title" :desc="text('支持加载、禁用和自定义值的开关。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-switch-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Switch states' : '开关状态' }}</text>
                <snake-switch
                    v-model="value"
                    :size="String(state.swSize)"
                    :active-color="String(state.swActiveColor)"
                    :loading="Boolean(state.switchLoading)"
                    :disabled="Boolean(state.switchDisabled)"
                    :vibrate-short="Boolean(state.swVibrate)"
                />
                <text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ value }}</text>
                <text class="demo-variant-title">{{
                    isEnglish ? 'Custom values (100 / 0)' : '自定义值（100 / 0）'
                }}</text>
                <snake-switch
                    v-model="customValue"
                    :active-value="100"
                    :inactive-value="0"
                    :size="String(state.swSize)"
                    :active-color="String(state.swActiveColor)"
                    :loading="Boolean(state.switchLoading)"
                    :disabled="Boolean(state.switchDisabled)"
                />
                <text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ customValue }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('状态总览')">
            <view class="demo-switch-gallery">
                <view class="demo-switch-item">
                    <snake-switch :model-value="true" />
                    <text>{{ text('开') }}</text>
                </view>
                <view class="demo-switch-item">
                    <snake-switch :model-value="false" />
                    <text>{{ text('关') }}</text>
                </view>
                <view class="demo-switch-item">
                    <snake-switch :model-value="true" loading />
                    <text>{{ text('加载中') }}</text>
                </view>
                <view class="demo-switch-item">
                    <snake-switch :model-value="true" disabled />
                    <text>{{ text('禁用·开') }}</text>
                </view>
                <view class="demo-switch-item">
                    <snake-switch :model-value="false" disabled />
                    <text>{{ text('禁用·关') }}</text>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const value = ref(true);
const customValue = ref(100);
const controls: DemoControl[] = [
    {
        key: 'swSize',
        label: '组件尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: 'small', value: 'small' },
            { label: 'default', value: 'default' },
            { label: 'large', value: 'large' }
        ]
    },
    {
        key: 'swActiveColor',
        label: '开启颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#FF6A0C' }
        ]
    },
    { key: 'swVibrate', label: '切换震动', type: 'switch', defaultValue: false },
    { key: 'switchLoading', label: '加载状态', type: 'switch', defaultValue: false },
    { key: 'switchDisabled', label: '禁用状态', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>({ switchLoading: false, switchDisabled: false });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('switch', '开关');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
</script>
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
.demo-switch-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 32rpx 40rpx;
    padding: 32rpx 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
.demo-switch-item {
    display: flex;
    flex-direction: column;
    gap: 14rpx;
    align-items: center;
}
.demo-switch-item > text {
    color: var(--snake-color-text-muted);
    font-size: 22rpx;
}
</style>
