<template>
    <DemoPage :title="title" :desc="text('支持字数统计和自适应高度的多行文本输入。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-textarea-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Multiline input' : '多行输入' }}</text>
                <snake-textarea
                    v-model="value"
                    :count="Boolean(state.textareaCount)"
                    :auto-height="Boolean(state.textareaAuto)"
                    :maxlength="80"
                />
                <text>{{ isEnglish ? `${value.length} characters` : `已输入 ${value.length} 个字` }}</text>
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
const value = ref('Snake UI 表单组件');
const controls: DemoControl[] = [
    { key: 'textareaCount', label: '显示字数', type: 'switch', defaultValue: true },
    { key: 'textareaAuto', label: '高度自适应', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>({ textareaCount: true, textareaAuto: false });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('textarea', '文本域');
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
</style>
