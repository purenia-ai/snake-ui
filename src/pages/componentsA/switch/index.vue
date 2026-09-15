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
const controls: DemoControl[] = [
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
<template>
    <DemoPage :title="title" :desc="text('支持加载、禁用和自定义值的开关。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-switch-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Switch states' : '开关状态' }}</text>
                <snake-switch
                    v-model="value"
                    :loading="Boolean(state.switchLoading)"
                    :disabled="Boolean(state.switchDisabled)"
                />
                <text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ value }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
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
</style>
