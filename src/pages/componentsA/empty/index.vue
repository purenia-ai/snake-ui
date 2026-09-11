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
        key: 'emptyMode',
        label: '空状态类型',
        type: 'select',
        defaultValue: 'data',
        options: [
            { label: '暂无数据', value: 'data' },
            { label: '暂无内容', value: 'list' },
            { label: '网络异常', value: 'wifi' },
            { label: '搜索为空', value: 'search' }
        ]
    },
    { key: 'text', label: '提示文字', type: 'input', defaultValue: '暂无相关内容', placeholder: '输入空状态文案' },
    { key: 'showIcon', label: '显示图标', type: 'switch', defaultValue: true },
    {
        key: 'emptyIconSize',
        label: '图标大小',
        type: 'slider',
        defaultValue: 120,
        min: 72,
        max: 180,
        step: 12,
        unit: 'rpx'
    },
    {
        key: 'textColor',
        label: '文字颜色',
        type: 'select',
        defaultValue: '#7b8d84',
        options: [
            { label: '灰色', value: '#7b8d84' },
            { label: '品牌绿', value: '#06D290' }
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
        placeholder: control.placeholder ? demoText(control.placeholder) : undefined,
        options: control.options?.map(option => ({ ...option, label: demoText(option.label) }))
    }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('empty', '空状态');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('在没有数据时提供清晰的占位和下一步提示。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-empty-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-empty
                    :mode="String(state.emptyMode)"
                    :icon="state.showIcon ? '/static/logo.png' : ''"
                    :icon-size="Number(state.emptyIconSize)"
                    :text="String(state.text)"
                    :text-color="String(state.textColor)"
                />
                <text class="demo-variant-title">{{ isEnglish ? 'Semantic states' : '语义状态' }}</text>
                <view class="demo-empty-grid"
                    ><snake-empty
                        mode="search"
                        :text="isEnglish ? 'No results' : '没有搜索结果'"
                        icon-size="72" /><snake-empty
                        mode="wifi"
                        :text="isEnglish ? 'Network error' : '网络连接异常'"
                        icon-size="72"
                /></view>
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
.demo-empty-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
</style>
