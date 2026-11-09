<template>
    <DemoPage :title="title" :desc="text('在内容右上角挂载数字或圆点徽标，角点居中定位。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-badge-showcase">
                <view class="demo-badge-grid">
                    <view class="demo-badge-cell">
                        <snake-badge :value="badgeValue" :max="99" :bg-color="String(state.badgeBgColor)">
                            <text class="demo-badge-anchor">{{ text('消息') }}</text>
                        </snake-badge>
                        <text class="demo-badge-caption">{{ text('数字徽标') }}</text>
                    </view>
                    <view class="demo-badge-cell">
                        <snake-badge
                            :value="badgeValue"
                            :max="99"
                            :is-dot="Boolean(state.badgeDot)"
                            :bg-color="String(state.badgeBgColor)"
                        >
                            <view class="demo-badge-box">{{ text('待办') }}</view>
                        </snake-badge>
                        <text class="demo-badge-caption">{{ text('圆点徽标') }}</text>
                    </view>
                    <view class="demo-badge-cell">
                        <snake-badge
                            :value="0"
                            :show-zero="Boolean(state.badgeShowZero)"
                            :bg-color="String(state.badgeBgColor)"
                        >
                            <view class="demo-badge-box demo-badge-box--primary">{{ text('待办') }}</view>
                        </snake-badge>
                        <text class="demo-badge-caption">{{ text('零值显示') }}</text>
                    </view>
                    <view class="demo-badge-cell">
                        <snake-badge
                            :value="badgeValue"
                            :max="99"
                            :bg-color="String(state.badgeBgColor)"
                            custom-class="demo-badge-standalone"
                        />
                        <text class="demo-badge-caption">{{ text('独立徽标') }}</text>
                    </view>
                </view>
                <text class="demo-badge-hint">{{ text('超出上限显示 99+') }}</text>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'badgeValue', label: '徽标数值', type: 'slider', defaultValue: 12, min: 0, max: 120, step: 1, unit: '' },
    { key: 'badgeDot', label: '圆点模式', type: 'switch', defaultValue: false },
    { key: 'badgeShowZero', label: '零值仍显示', type: 'switch', defaultValue: false },
    {
        key: 'badgeBgColor',
        label: '背景颜色',
        type: 'select',
        defaultValue: '#fa3534',
        options: [
            { label: '红色', value: '#fa3534' },
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const badgeValue = computed(() => Number(state.badgeValue));
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
    return demoTitle('badge', '徽标');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-badge-showcase {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.demo-badge-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
}

.demo-badge-cell {
    display: flex;
    min-height: 96px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 14px 8px;
    border-radius: 8px;
    background: var(--snake-color-surface-muted);
}

.demo-badge-caption {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
}

.demo-badge-hint {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}

.demo-badge-anchor {
    padding: 4px 12px;
    border-radius: 6px;
    background: var(--snake-color-surface);
    color: var(--snake-demo-accent-text);
}

.demo-badge-box {
    padding: 8px 16px;
    border-radius: 6px;
    background: var(--snake-color-surface);
    color: var(--snake-demo-accent-text);
}

.demo-badge-box--primary {
    background: var(--snake-color-primary, #06d290);
    color: #fff;
}

:deep(.demo-badge-standalone) {
    margin-left: 8px;
}
</style>
