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
        key: 'subsectionMode',
        label: '显示模式',
        type: 'select',
        defaultValue: 'button',
        options: [
            { label: '按钮', value: 'button' },
            { label: '分段', value: 'subsection' }
        ]
    },
    {
        key: 'subsectionCurrent',
        label: '当前选项',
        type: 'select',
        defaultValue: 0,
        options: [
            { label: '待付款', value: 0 },
            { label: '待发货', value: 1 },
            { label: '待收货', value: 2 }
        ]
    },
    { key: 'subsectionBold', label: '激活项加粗', type: 'switch', defaultValue: true },
    { key: 'subsectionAnimation', label: '滑块动画', type: 'switch', defaultValue: true }
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
    return demoTitle('subsection', '分段选择器');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage
        :title="title"
        :eyebrow="text('导航与布局')"
        :desc="text('在少量互斥选项之间快速切换，支持按钮和描边分段模式。')"
    >
        <DemoSection variant="preview" :title="text('演示效果')"
            ><view class="demo-subsection-showcase"
                ><snake-subsection
                    :list="isEnglish ? ['Pending payment', 'To ship', 'To receive'] : ['待付款', '待发货', '待收货']"
                    :current="Number(state.subsectionCurrent)"
                    :mode="state.subsectionMode as any"
                    :bold="Boolean(state.subsectionBold)"
                    :animation="Boolean(state.subsectionAnimation)"
                    @change="state.subsectionCurrent = $event" /></view
        ></DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue"
        /></DemoSection>
    </DemoPage>
</template>
