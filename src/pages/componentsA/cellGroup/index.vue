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
    { key: 'cgTitle', label: '分组标题', type: 'input', defaultValue: '', placeholder: '请输入分组标题' },
    { key: 'cgBorder', label: '外边框', type: 'switch', defaultValue: true }
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
    return demoTitle('cell-group', '单元格分组');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage
        :title="title"
        :eyebrow="text('导航与布局')"
        :desc="text('将一组单元格组合为带标题和外边框的分组。')"
    >
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-cell-group-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-cell-group :title="String(state.cgTitle)" :border="Boolean(state.cgBorder)">
                    <view class="demo-cell-row">Content A</view>
                    <view class="demo-cell-row">Content B</view>
                    <view class="demo-cell-row">Content C</view>
                </snake-cell-group>
                <text class="demo-variant-title">{{ isEnglish ? 'With title' : '带标题分组' }}</text>
                <snake-cell-group :title="isEnglish ? 'Group title' : '分组示例'">
                    <view class="demo-cell-row">Content D</view>
                    <view class="demo-cell-row">Content E</view>
                </snake-cell-group>
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
.demo-cell-row {
    padding: 24rpx 32rpx;
    font-size: 28rpx;
    color: var(--snake-color-text);
    border-bottom: 1rpx solid var(--snake-color-border, #e4e7ed);
}
</style>
