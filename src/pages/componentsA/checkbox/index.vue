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
const controls: DemoControl[] = [{ key: 'choiceDisabled', label: '禁用状态', type: 'switch', defaultValue: false }];
const state = reactive<Record<string, DemoValue>>({ choiceDisabled: false });
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('checkbox', '复选框');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
</script>
<template>
    <DemoPage :title="title" :eyebrow="text('表单组件')" :desc="text('可独立使用的复选框，也可放入 CheckboxGroup。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-control-stack demo-checkbox-showcase"
                ><text class="demo-variant-title">{{ isEnglish ? 'Standalone checkbox' : '独立复选框' }}</text
                ><snake-checkbox v-model="value" :disabled="Boolean(state.choiceDisabled)">{{
                    isEnglish ? 'Accept the user agreement' : '同意用户协议'
                }}</snake-checkbox
                ><text>{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ value }}</text></view
            ></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
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
