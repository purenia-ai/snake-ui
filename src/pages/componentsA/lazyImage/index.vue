<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'lazySource',
        label: '图片状态',
        type: 'select',
        defaultValue: 'normal',
        options: [
            { label: '正常图片', value: 'normal' },
            { label: '加载失败', value: 'error' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ lazySource: 'normal' });
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
    return demoTitle('lazy-image', '懒加载图片');
});

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :eyebrow="text('展示组件')" :desc="text('图片进入视口后加载，并展示加载中或失败反馈。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{
                    localeName === 'en-US' ? 'Viewport loading' : '进入视口后加载'
                }}</text>
                <view class="demo-image-box"
                    ><snake-lazy-image
                        :src="state.lazySource === 'error' ? '/static/not-found.png' : '/static/logo.png'"
                /></view>
                <text class="demo-variant-title">{{ localeName === 'en-US' ? 'Custom fallback' : '自定义占位' }}</text>
                <view class="demo-image-box">
                    <snake-lazy-image src="/static/logo.png">
                        <template #loading
                            ><view class="demo-lazy-placeholder">{{
                                localeName === 'en-US' ? 'Waiting…' : '等待加载…'
                            }}</view></template
                        >
                    </snake-lazy-image>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
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
.demo-image-box {
    width: 100%;
    height: 300rpx;
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
.demo-lazy-placeholder {
    display: flex;
    width: 100%;
    min-height: 180rpx;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
