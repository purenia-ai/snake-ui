<template>
    <DemoPage :title="title" :desc="text('用于列表底部，反馈可加载、加载中和没有更多三种状态。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-loadmore-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-loadmore
                    :status="String(state.loadStatus)"
                    :icon-type="String(state.loadIcon)"
                    :is-dot="Boolean(state.loadDot)"
                    :nomore-text="String(state.loadText)"
                    :color="String(state.loadColor)"
                    :font-size="Number(state.loadFontSize)"
                    :bg-color="String(state.loadBgColor)"
                />
                <text class="demo-variant-title">{{ isEnglish ? 'All states' : '全部状态' }}</text>
                <snake-loadmore status="loadmore" />
                <snake-loadmore status="loading" />
                <snake-loadmore status="nomore" is-dot />
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
    {
        key: 'loadStatus',
        label: '加载状态',
        type: 'select',
        defaultValue: 'loadmore',
        options: [
            { label: '加载更多', value: 'loadmore' },
            { label: '加载中', value: 'loading' },
            { label: '没有更多', value: 'nomore' }
        ]
    },
    {
        key: 'loadIcon',
        label: '加载动画',
        type: 'select',
        defaultValue: 'circle',
        options: [
            { label: '圆环', value: 'circle' },
            { label: '花朵', value: 'flower' }
        ]
    },
    { key: 'loadDot', label: '点状结束线', type: 'switch', defaultValue: false },
    { key: 'loadText', label: '没有更多文案', type: 'input', defaultValue: '没有更多了' },
    {
        key: 'loadColor',
        label: '文字颜色',
        type: 'select',
        defaultValue: '#606266',
        options: [
            { label: '常规灰', value: '#606266' },
            { label: '品牌绿', value: '#06D290' },
            { label: '橙色', value: '#FF6A0C' }
        ]
    },
    {
        key: 'loadFontSize',
        label: '文字尺寸',
        type: 'slider',
        defaultValue: 24,
        min: 20,
        max: 32,
        step: 2,
        unit: 'rpx'
    },
    {
        key: 'loadBgColor',
        label: '背景颜色',
        type: 'select',
        defaultValue: 'transparent',
        options: [
            { label: '透明', value: 'transparent' },
            { label: '白色', value: '#ffffff' },
            { label: '薄荷', value: '#eafff6' }
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
    return demoTitle('loadmore', '加载更多');
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
</style>
