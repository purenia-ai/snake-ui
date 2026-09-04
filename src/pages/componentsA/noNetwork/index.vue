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
    { key: 'nnTips', label: '提示文字', type: 'input', defaultValue: '', placeholder: '请输入提示文字' },
    { key: 'nnZIndex', label: '层级值', type: 'slider', defaultValue: 10080, min: 1000, max: 10090, step: 10 }
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
    return demoTitle('no-network', '无网络提示');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage
        :title="title"
        :eyebrow="text('反馈与浮层')"
        :desc="text('自动监听网络状态，断网时全屏提示并支持重试。')"
    >
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-no-network-showcase">
                <text class="demo-variant-title">{{ text('触发条件') }}</text>
                <text class="demo-variant-sub">{{ text('断网时自动全屏展示') }}，{{ isEnglish ? 'the preview below shows the layout' : '以下为组件离线时的静态效果示意' }}</text>
                <!-- 组件在线时自动隐藏，此处同时渲染一份静态示意便于预览 -->
                <snake-no-network :tips="String(state.nnTips)" :z-index="Number(state.nnZIndex)" @retry="() => {}" />
                <view class="demo-nn-mock">
                    <image
                        class="demo-nn-mock__icon"
                        src="https://cdn.puresnake.com/joker/recycle/like.png"
                        mode="widthFix" />
                    <text class="demo-nn-mock__tips">{{ String(state.nnTips) || (isEnglish ? 'Ooops, network disconnected' : '哎呀，网络信号丢失') }}</text>
                    <view class="demo-nn-mock__retry">{{ text('重试') }}</view>
                </view>
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
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
.demo-nn-mock {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60rpx 0;
}
.demo-nn-mock__icon {
    width: 200rpx;
}
.demo-nn-mock__tips {
    padding: 24rpx 0;
    font-size: 28rpx;
    color: var(--snake-color-text-muted);
}
.demo-nn-mock__retry {
    padding: 6rpx 30rpx;
    font-size: 28rpx;
    color: var(--snake-color-text-muted);
    border: 1px solid var(--snake-color-text-muted);
    border-radius: 3px;
}
</style>
