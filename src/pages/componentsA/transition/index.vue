<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const visible = ref(true);
const controls: DemoControl[] = [
    {
        key: 'transitionName',
        label: '动画类型',
        type: 'select',
        defaultValue: 'fade-up',
        options: [
            { label: '淡入上移', value: 'fade-up' },
            { label: '放大', value: 'zoom-in' },
            { label: '左侧滑入', value: 'slide-left' }
        ]
    },
    {
        key: 'transitionDuration',
        label: '动画时长',
        type: 'slider',
        defaultValue: 300,
        min: 100,
        max: 800,
        step: 50,
        unit: 'ms'
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
    return demoTitle('transition', '过渡动画');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('为浮层和内容切换提供一致的跨端进出场动画。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-transition-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Interactive transition' : '交互动画' }}</text>
                <snake-button size="small" @click="visible = !visible">
                    {{ isEnglish ? 'Toggle' : '切换显示' }}
                </snake-button>
                <snake-transition
                    :show="visible"
                    :name="state.transitionName as any"
                    :duration="Number(state.transitionDuration)"
                >
                    <view class="demo-transition-card">Snake Transition</view>
                </snake-transition>
                <text class="demo-variant-title">{{ isEnglish ? 'Preset: fade and zoom' : '预设：淡入与缩放' }}</text>
                <view class="demo-feedback-row">
                    <snake-transition show name="fade"><view class="demo-transition-chip">Fade</view></snake-transition>
                    <snake-transition show name="zoom-in">
                        <view class="demo-transition-chip">Zoom</view>
                    </snake-transition>
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
.demo-transition-chip {
    padding: 20rpx 28rpx;
    border-radius: 12rpx;
    background: var(--snake-color-primary-light);
    color: var(--snake-demo-accent-text);
}
.demo-transition-card {
    display: flex;
    min-height: 220rpx;
    align-items: center;
    justify-content: center;
    border-radius: 20rpx;
    color: #fff;
    background: linear-gradient(135deg, var(--snake-color-primary-deep), var(--snake-color-primary-deeper));
}
</style>
