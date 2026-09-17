<template>
    <DemoPage :title="title" :desc="text('通过按钮触发目标小程序跳转。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-jump-applet class="demo-jump-applet-showcase" :datas="data" />
            <text class="demo-hint">{{ text('请配置真实小程序 ID 后测试跳转；当前仅展示按钮样式。') }}</text>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue';
import { jumpAppletData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'appletTitle', label: '按钮文字', type: 'input', defaultValue: '打开小程序' },
    {
        key: 'appletColor',
        label: '按钮颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '深色', value: '#173b2c' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ appletTitle: '打开小程序', appletColor: '#06D290' });
const data = computed(() => ({
    ...jumpAppletData,
    title: String(state.appletTitle),
    btnColor: String(state.appletColor)
}));
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
    return demoTitle('jump-applet', '小程序跳转');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<style scoped>
.demo-hint {
    display: block;
    margin: 16rpx;
    color: var(--snake-color-text-muted);
    font-size: 22rpx;
    line-height: 1.5;
}
</style>
