<template>
    <DemoPage :title="title" :desc="text('支持清空、密码、格式化和多种边框的单行输入。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-control-stack demo-input-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Text and password' : '文本与密码' }}</text>
                <snake-input
                    v-model="username"
                    border="surround"
                    :type="String(state.inputType)"
                    :shape="String(state.inputShape)"
                    :size="String(state.inputSize)"
                    :maxlength="Number(state.inputMaxlength)"
                    prefix-icon="search"
                    :clearable="Boolean(state.inputClearable)"
                    :disabled="Boolean(state.inputDisabled)"
                    :placeholder="String(state.inputPlaceholder || text('请输入用户名'))"
                />
                <snake-input
                    v-model="password"
                    type="password"
                    border="surround"
                    show-password
                    :placeholder="isEnglish ? 'Password' : '密码输入'"
                />
                <text class="demo-variant-title">{{ isEnglish ? 'Formatted input' : '格式化输入' }}</text>
                <snake-input
                    v-model="code"
                    border="bottom"
                    :maxlength="6"
                    :formatter="digitsOnly"
                    :placeholder="isEnglish ? 'Six digits only' : '仅保留 6 位数字'"
                />
                <text>
                    {{ isEnglish ? 'Username' : '用户名' }}：{{ username || '—' }} ·
                    {{ isEnglish ? 'Code' : '数字' }}：{{ code || '—' }}
                </text>
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
const username = ref('');
const password = ref('');
const code = ref('');
const controls: DemoControl[] = [
    {
        key: 'inputType',
        label: '输入类型',
        type: 'select',
        defaultValue: 'text',
        options: [
            { label: '文本', value: 'text' },
            { label: '数字', value: 'number' },
            { label: '小数键盘', value: 'digit' },
            { label: '身份证', value: 'idcard' }
        ]
    },
    {
        key: 'inputShape',
        label: '圆角风格',
        type: 'select',
        defaultValue: 'square',
        options: [
            { label: '方角', value: 'square' },
            { label: '胶囊', value: 'circle' }
        ]
    },
    {
        key: 'inputSize',
        label: '组件尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: 'small', value: 'small' },
            { label: 'default', value: 'default' },
            { label: 'large', value: 'large' }
        ]
    },
    {
        key: 'inputMaxlength',
        label: '最大字数',
        type: 'slider',
        defaultValue: 20,
        min: 6,
        max: 40,
        step: 2,
        unit: '字'
    },
    { key: 'inputClearable', label: '允许清空', type: 'switch', defaultValue: true },
    { key: 'inputDisabled', label: '禁用状态', type: 'switch', defaultValue: false },
    { key: 'inputPlaceholder', label: '占位文字', type: 'input', defaultValue: '' }
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
function digitsOnly(value: string) {
    return value.replace(/\D/g, '');
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
