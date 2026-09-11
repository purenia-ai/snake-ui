<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const value = ref('');
const controls: DemoControl[] = [
    { key: 'inputClearable', label: '允许清空', type: 'switch', defaultValue: true },
    { key: 'inputDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    { key: 'inputPlaceholder', label: '占位文字', type: 'input', defaultValue: '请输入用户名' }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('input', '输入框');
});
function updateValue(key: string, nextValue: DemoValue) {
    state[key] = nextValue;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('支持清空、密码、格式化和多种边框的单行输入。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-control-stack demo-input-showcase"
                ><text class="demo-variant-title">{{ isEnglish ? 'Text and password' : '文本与密码' }}</text
                ><snake-input
                    v-model="value"
                    border="surround"
                    prefix-icon="search"
                    :clearable="Boolean(state.inputClearable)"
                    :disabled="Boolean(state.inputDisabled)"
                    :placeholder="String(state.inputPlaceholder)"
                /><snake-input
                    v-model="value"
                    type="password"
                    border="surround"
                    show-password
                    :placeholder="isEnglish ? 'Password' : '密码输入'"
                /><text
                    >{{ isEnglish ? 'Current value: ' : '当前值：' }}{{ value || (isEnglish ? 'Empty' : '空') }}</text
                ></view
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
