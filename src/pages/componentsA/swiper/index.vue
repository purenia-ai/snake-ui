<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const slides = [
    { url: '/static/logo.png', title: 'Snake UI 基础组件' },
    { url: '/static/logo.png', title: '跨端实时预览' }
];
const controls: DemoControl[] = [
    { key: 'swiperIndicator', label: '显示指示器', type: 'switch', defaultValue: true },
    { key: 'swiperTitle', label: '显示标题', type: 'switch', defaultValue: true },
    { key: 'swiperAutoplay', label: '自动播放', type: 'switch', defaultValue: true },
    {
        key: 'swiperMode',
        label: '指示器样式',
        type: 'select',
        defaultValue: 'round',
        options: [
            { label: '圆角', value: 'round' },
            { label: '圆点', value: 'dot' },
            { label: '线条', value: 'line' },
            { label: '数字', value: 'number' }
        ]
    },
    { key: 'swiperEffect3d', label: '3D 卡片', type: 'switch', defaultValue: false },
    {
        key: 'swiperHeight',
        label: '轮播高度',
        type: 'slider',
        defaultValue: 360,
        min: 220,
        max: 480,
        step: 20,
        unit: 'rpx'
    },
    { key: 'radius', label: '圆角', type: 'slider', defaultValue: 16, min: 0, max: 32, step: 4, unit: 'rpx' }
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
    return demoTitle('swiper', '轮播图');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('用于图片或内容轮播，支持自动播放、标题和指示器。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-swiper-showcase">
                <snake-swiper
                    :list="slides"
                    :height="Number(state.swiperHeight)"
                    :radius="Number(state.radius)"
                    :indicator="Boolean(state.swiperIndicator)"
                    :indicator-mode="String(state.swiperMode)"
                    :effect3d="Boolean(state.swiperEffect3d)"
                    :show-title="Boolean(state.swiperTitle)"
                    :autoplay="Boolean(state.swiperAutoplay)"
                />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
