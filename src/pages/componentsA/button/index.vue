<template>
    <DemoPage :title="title" :desc="text('按钮用于触发即时操作，支持主题、朴素、禁用和加载状态。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-button-showcase">
                <view class="demo-button-section">
                    <text class="demo-button-section__title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                    <snake-button
                        :type="String(state.type)"
                        :size="state.buttonSize"
                        :shape="state.buttonShape"
                        :icon="String(state.icon)"
                        :block="Boolean(state.block)"
                        :plain="Boolean(state.plain)"
                        :disabled="Boolean(state.disabled)"
                        :loading="Boolean(state.loading)"
                        :ripple="Boolean(state.ripple)"
                        @click="handlePreviewClick"
                    >
                        Snake Button
                    </snake-button>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
        <DemoSection :title="isEnglish ? 'Current code' : '当前代码'">
            <view class="demo-button-code">
                <text selectable>{{ currentCode }}</text>
            </view>
            <view class="demo-button-actions">
                <button type="button" class="demo-button-action demo-button-action--primary" @tap="copyCode">
                    {{
                        copyState === 'success'
                            ? isEnglish
                                ? 'Copied'
                                : '已复制'
                            : isEnglish
                              ? 'Copy code'
                              : '复制代码'
                    }}
                </button>
                <button type="button" class="demo-button-action" @tap="resetState">
                    {{ isEnglish ? 'Reset' : '恢复默认' }}
                </button>
            </view>
            <text v-if="copyState === 'error'" class="demo-button-feedback" aria-live="polite">
                {{ isEnglish ? 'Copy failed. Select the code manually.' : '复制失败，请手动选择代码。' }}
            </text>
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
    {
        key: 'icon',
        label: '内置图标',
        type: 'select',
        defaultValue: '',
        options: [
            { label: '无图标', value: '' },
            { label: '搜索', value: 'search' },
            { label: '对勾', value: 'checkmark' },
            { label: '右箭头', value: 'right' }
        ]
    },
    { key: 'block', label: '块级按钮', type: 'switch', defaultValue: false },
    { key: 'plain', label: '朴素样式', type: 'switch', defaultValue: false },
    { key: 'loading', label: '加载状态', type: 'switch', defaultValue: false },
    { key: 'disabled', label: '禁用状态', type: 'switch', defaultValue: false },
    { key: 'ripple', label: '水波纹', type: 'switch', defaultValue: true }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const copyState = ref<'idle' | 'success' | 'error'>('idle');
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
const currentCode = computed(() => {
    const attributes: string[] = [];
    if (state.type !== 'default') attributes.push(`type="${String(state.type)}"`);
    if (state.buttonSize !== 'default') attributes.push(`size="${String(state.buttonSize)}"`);
    if (state.buttonShape !== 'square') attributes.push(`shape="${String(state.buttonShape)}"`);
    if (state.icon) attributes.push(`icon="${String(state.icon)}"`);
    if (state.block) attributes.push('block');
    for (const key of ['plain', 'loading', 'disabled', 'ripple']) {
        if (state[key]) attributes.push(key);
    }
    const attributeText = attributes.length ? ` ${attributes.join(' ')}` : '';
    return `<snake-button${attributeText}>Snake Button</snake-button>`;
});

function updateValue(key: string, value: DemoValue) {
    state[key] = value;
    copyState.value = 'idle';
}

function resetState() {
    for (const control of controls) state[control.key] = control.defaultValue;
    copyState.value = 'idle';
}
function handlePreviewClick() {
    uni.showToast({ title: text('按钮被点击'), icon: 'none' });
}

function copyCode() {
    copyState.value = 'idle';
    uni.setClipboardData({
        data: currentCode.value,
        success: () => (copyState.value = 'success'),
        fail: () => (copyState.value = 'error')
    });
}
</script>

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

.demo-button-code {
    padding: 24rpx;
    overflow-x: auto;
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 10rpx;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface-muted);
    font-family: monospace;
    font-size: 24rpx;
    line-height: 1.7;
    white-space: nowrap;
}

.demo-button-actions {
    display: flex;
    gap: 16rpx;
    margin-top: 20rpx;
}

.demo-button-action {
    min-height: 68rpx;
    margin: 0;
    padding: 0 24rpx;
    border: 1rpx solid var(--snake-color-border);
    border-radius: 10rpx;
    color: var(--snake-color-text-secondary);
    background: var(--snake-color-surface);
    font-size: 24rpx;
    line-height: 68rpx;
}

.demo-button-action::after {
    border: 0;
}

.demo-button-action--primary {
    border-color: var(--snake-color-primary);
    color: var(--snake-color-primary);
}

.demo-button-feedback {
    display: block;
    margin-top: 14rpx;
    color: var(--snake-color-error);
    font-size: 22rpx;
    line-height: 1.5;
}
</style>
