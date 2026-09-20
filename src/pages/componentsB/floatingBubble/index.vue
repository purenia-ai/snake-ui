<template>
    <DemoPage :title="title" :desc="text('在页面边缘提供始终可见的营销或客服入口。')">
        <DemoSection bare variant="preview" :title="text('演示效果')">
            <view class="bubble-actions">
                <snake-button size="small" @click="bubbleRef?.reopen()">
                    {{ isEnglish ? 'Show bubble again' : '重新显示气泡' }}
                </snake-button>
                <text v-if="bubbleClicked" aria-live="polite">
                    {{ isEnglish ? 'Bubble tapped' : '已点击气泡' }}
                </text>
            </view>
            <snake-floating-bubble
                ref="bubbleRef"
                class="demo-floating-bubble-showcase"
                :datas="data"
                :scroll-top="scrollTop"
                @click="bubbleClicked = true"
            />
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import { floatingBubbleData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const bubbleRef = ref<{ reopen(): void } | null>(null);
const bubbleClicked = ref(false);
const scrollTop = ref(0);
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});
const controls: DemoControl[] = [
    {
        key: 'floatingBubbleSize',
        label: '入口尺寸',
        type: 'slider',
        defaultValue: 96,
        min: 64,
        max: 128,
        step: 8,
        unit: 'rpx'
    }
];
const state = reactive<Record<string, DemoValue>>({ floatingBubbleSize: 96 });
const data = computed(() => ({
    ...floatingBubbleData,
    width: Number(state.floatingBubbleSize),
    height: Number(state.floatingBubbleSize)
}));
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('floating-bubble', '悬浮气泡');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<style scoped>
.bubble-actions {
    display: flex;
    align-items: center;
    gap: 20rpx;
    padding: 24rpx;
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
}
</style>
