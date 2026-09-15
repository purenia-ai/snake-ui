<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'nnTips', label: '提示文字', type: 'input', defaultValue: '', placeholder: '请输入提示文字' },
    {
        key: 'nnImage',
        label: '提示图片',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '内置图片', value: '' },
            { label: '示例图片', value: '/static/logo.png' }
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
    return demoTitle('no-network', '无网络提示');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}

function handleRetry() {
    uni.showToast({ title: text('已触发重试事件'), icon: 'none', position: 'top' });
}
</script>

<template>
    <DemoPage :title="title" :desc="text('自动监听网络状态，断网时全屏提示并支持重试。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-no-network-showcase">
                <text class="demo-variant-title">{{ text('如何查看真实效果') }}</text>
                <text class="demo-variant-sub">{{ text('关闭手机的 Wi-Fi 和移动数据后，可查看全屏断网提示。') }}</text>
                <text class="demo-variant-sub">{{ text('组件在线时自动隐藏；断网后点击重试会触发事件反馈。') }}</text>
                <snake-no-network :tips="String(state.nnTips)" :image="String(state.nnImage)" @retry="handleRetry" />
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
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
