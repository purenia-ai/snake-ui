<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import { iconNames } from '../../../uni_modules/snake-ui/components/snake-icon/icon-names';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [
    {
        key: 'iconColor',
        label: '图标颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '深色', value: '#173b2c' },
            { label: '中性灰', value: '#7b8d84' }
        ]
    },
    { key: 'iconSize', label: '图标尺寸', type: 'slider', defaultValue: 36, min: 24, max: 64, step: 2, unit: 'rpx' },
    { key: 'iconBold', label: '图标加粗', type: 'switch', defaultValue: false },
    { key: 'iconLabel', label: '标签文字', type: 'input', defaultValue: '搜索', placeholder: '留空则隐藏标签' },
    {
        key: 'iconLabelPos',
        label: '标签位置',
        type: 'select',
        defaultValue: 'right',
        options: [
            { label: '右侧', value: 'right' },
            { label: '左侧', value: 'left' },
            { label: '下方', value: 'bottom' },
            { label: '上方', value: 'top' }
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
    return demoTitle('icon', '图标');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}

const selectedIcon = ref('search');
</script>

<template>
    <DemoPage :title="title" :desc="text('浏览 Snake UI 自有字体图标，并实时调整尺寸、颜色和标签。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-icon-showcase demo-icon-showcase--grouped">
                <view class="demo-icon-preview">
                    <snake-icon
                        :name="selectedIcon"
                        :color="String(state.iconColor)"
                        :size="Number(state.iconSize)"
                        :bold="Boolean(state.iconBold)"
                        :label="String(state.iconLabel)"
                        :label-pos="state.iconLabelPos as any"
                        label-size="14px"
                        space="8px"
                    />
                    <text class="demo-icon-preview__name">{{ selectedIcon }}</text>
                </view>
                <view class="demo-icon-heading">
                    <text>{{ isEnglish ? 'Built-in icons' : '内置图标' }}</text>
                    <text class="demo-icon-heading__count">{{ iconNames.length }}</text>
                </view>
                <view class="demo-icons">
                    <view
                        v-for="name in iconNames"
                        :key="name"
                        :class="['demo-icon-item', { 'demo-icon-item--active': selectedIcon === name }]"
                        hover-class="demo-icon-item--pressed"
                        @click="selectedIcon = name"
                    >
                        <snake-icon
                            :name="name"
                            :color="selectedIcon === name ? String(state.iconColor) : 'currentColor'"
                            :size="Number(state.iconSize)"
                            :bold="Boolean(state.iconBold)"
                        />
                        <text class="demo-icon-item__name">{{ name }}</text>
                    </view>
                </view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-icons {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 12rpx;
    background: var(--snake-color-divider);
    gap: 1rpx;
}
.demo-icon-showcase {
    display: flex;
    flex-direction: column;
    gap: 28rpx;
}
.demo-icon-preview {
    display: flex;
    min-height: 176rpx;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20rpx;
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 12rpx;
    background: var(--snake-color-surface);
}
.demo-icon-preview__name {
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
    line-height: 1.4;
}
.demo-icon-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
}
.demo-icon-heading__count {
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
    font-weight: 400;
}
.demo-icon-item {
    display: flex;
    min-width: 0;
    min-height: 144rpx;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18rpx;
    padding: 20rpx 10rpx;
    background: var(--snake-color-surface);
    color: var(--snake-color-text-secondary);
    transition:
        color 160ms ease,
        background-color 160ms ease;
}
.demo-icon-item--active {
    color: var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
.demo-icon-item--pressed {
    background: var(--snake-color-surface-muted);
}
.demo-icon-item__name {
    display: block;
    width: 100%;
    color: inherit;
    font-size: 20rpx;
    line-height: 1.3;
    text-align: center;
    overflow-wrap: anywhere;
    white-space: normal;
}
</style>
