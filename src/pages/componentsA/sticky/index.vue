<template>
    <DemoPage :title="title" :desc="text('页面滚动时将重要内容固定在指定顶部位置。')" viewport>
        <DemoSection bare variant="preview" :title="text('演示效果')">
            <view class="demo-scroll demo-sticky-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Page scroll sticky' : '页面滚动吸顶' }}</text>
                <view class="demo-scroll-hero">
                    {{ isEnglish ? 'Scroll down to see the sticky behavior' : '向下滚动查看吸顶效果' }}
                </view>
                <snake-sticky
                    bg-color="#06D290"
                    :disabled="Boolean(state.stickyDisabled)"
                    :offset-top="Number(state.stickyOffset)"
                >
                    <view class="demo-sticky">
                        {{ isEnglish ? 'I stay at the top of the preview' : '我会固定在手机预览顶部' }}
                    </view>
                </snake-sticky>
                <view v-for="item in 12" :key="item" class="demo-row">
                    {{ isEnglish ? 'Scroll item' : '滚动内容' }} {{ item }}
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
    { key: 'stickyDisabled', label: '关闭吸顶', type: 'switch', defaultValue: false },
    { key: 'stickyOffset', label: '顶部距离', type: 'slider', defaultValue: 0, min: 0, max: 80, step: 10, unit: 'rpx' }
];
const state = reactive<Record<string, DemoValue>>({ stickyDisabled: false, stickyOffset: 0 });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('sticky', '吸顶');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-scroll {
    min-height: 150vh;
    background: var(--snake-color-surface-muted);
}
.demo-variant-title {
    display: block;
    padding: 24rpx 24rpx 0;
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
}
.demo-scroll-hero {
    display: flex;
    height: 360rpx;
    align-items: center;
    justify-content: center;
    color: var(--snake-color-text-secondary);
}
.demo-sticky {
    padding: 24rpx;
    color: #fff;
    text-align: center;
}
.demo-row {
    margin: 20rpx 24rpx;
    padding: 32rpx;
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 14rpx;
    background: var(--snake-color-surface);
    box-shadow: 0 6rpx 18rpx rgba(16, 84, 56, 0.04);
}
</style>
