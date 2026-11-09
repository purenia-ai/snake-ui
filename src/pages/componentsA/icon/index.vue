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
                    <text>{{ text('内置图标') }}</text>
                    <text class="demo-icon-heading__count">{{ filteredIcons.length }} / {{ iconNames.length }}</text>
                </view>
                <snake-input v-model="keyword" clearable :placeholder="text('搜索图标')" />
                <view class="demo-icons">
                    <view
                        v-for="name in filteredIcons"
                        :key="name"
                        :class="['demo-icon-item', { 'demo-icon-item--active': selectedIcon === name }]"
                        hover-class="demo-icon-item--pressed"
                        role="button"
                        tabindex="0"
                        :aria-pressed="selectedIcon === name"
                        @click="selectedIcon = name"
                        @keydown.enter="selectedIcon = name"
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

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import { iconNames } from '../../../uni_modules/snake-ui/components/snake-icon/icon-names';

const { localeName, text } = useDemoLocale();
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
    { key: 'iconSize', label: '图标尺寸', type: 'slider', defaultValue: 18, min: 12, max: 32, step: 1, unit: 'px' },
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
const keyword = ref('');
const filteredIcons = computed(() => {
    const query = keyword.value.trim().toLowerCase();
    return query ? iconNames.filter(name => name.toLowerCase().includes(query)) : iconNames;
});
</script>

<style scoped>
.demo-icons {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1px solid var(--snake-color-divider);
    border-radius: 6px;
    background: var(--snake-color-divider);
    gap: 1px;
}
.demo-icon-showcase {
    display: flex;
    flex-direction: column;
    gap: 14px;
}
.demo-icon-preview {
    display: flex;
    min-height: 88px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 6px;
    background: var(--snake-color-surface);
}
.demo-icon-preview__name {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1.4;
}
.demo-icon-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 600;
}
.demo-icon-heading__count {
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    font-weight: 400;
}
.demo-icon-item {
    display: flex;
    min-width: 0;
    min-height: 72px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 9px;
    padding: 10px 5px;
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
.demo-icon-item:focus-visible {
    outline: 1px solid var(--snake-color-primary);
    outline-offset: -1px;
}
.demo-icon-item__name {
    display: block;
    width: 100%;
    color: inherit;
    font-size: 10px;
    line-height: 1.3;
    text-align: center;
    overflow-wrap: anywhere;
    white-space: normal;
}
</style>
