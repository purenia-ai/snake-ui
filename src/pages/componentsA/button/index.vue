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
    {
        key: 'type',
        label: '按钮主题',
        type: 'select',
        defaultValue: 'primary',
        options: [
            { label: '主要', value: 'primary' },
            { label: '默认', value: 'default' },
            { label: '成功', value: 'success' },
            { label: '信息', value: 'info' },
            { label: '警告', value: 'warning' },
            { label: '错误', value: 'error' }
        ]
    },
    {
        key: 'buttonSize',
        label: '按钮尺寸',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: '大', value: 'large' },
            { label: '默认', value: 'default' },
            { label: '中', value: 'medium' },
            { label: '小', value: 'small' },
            { label: '迷你', value: 'mini' }
        ]
    },
    {
        key: 'buttonShape',
        label: '按钮形状',
        type: 'select',
        defaultValue: 'square',
        options: [
            { label: '圆角', value: 'square' },
            { label: '胶囊', value: 'circle' }
        ]
    },
    { key: 'plain', label: '朴素样式', type: 'switch', defaultValue: false },
    { key: 'loading', label: '加载状态', type: 'switch', defaultValue: false },
    { key: 'disabled', label: '禁用状态', type: 'switch', defaultValue: false },
    { key: 'ripple', label: '水波纹', type: 'switch', defaultValue: true }
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
    return demoTitle('button', '按钮');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage
        :title="title"
        :eyebrow="text('基础组件')"
        :desc="text('按钮用于触发即时操作，支持主题、朴素、禁用和加载状态。')"
    >
        <DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-button-showcase">
                <view class="demo-button-section">
                    <text class="demo-button-section__title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                    <snake-button
                        :type="String(state.type)"
                        :size="state.buttonSize as any"
                        :shape="state.buttonShape as any"
                        :plain="Boolean(state.plain)"
                        :disabled="Boolean(state.disabled)"
                        :loading="Boolean(state.loading)"
                        :ripple="Boolean(state.ripple)"
                    >
                        Snake Button
                    </snake-button>
                </view>
            </view></DemoSection
        >
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-button-showcase {
    display: flex;
    flex-direction: column;
    gap: 36rpx;
}

.demo-button-section {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.demo-button-section__title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}

</style>
