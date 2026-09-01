<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { suspensionData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const scrollTop = ref(0);
const controls: DemoControl[] = [
    {
        key: 'suspensionSize',
        label: '入口尺寸',
        type: 'slider',
        defaultValue: 96,
        min: 64,
        max: 128,
        step: 8,
        unit: 'rpx'
    }
];
const state = reactive<Record<string, DemoValue>>({ suspensionSize: 96 });
const data = computed(() => ({
    ...suspensionData,
    width: Number(state.suspensionSize),
    height: Number(state.suspensionSize)
}));
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('suspension', '悬浮入口');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage
        :title="title"
        :eyebrow="text('CMS 营销')"
        :desc="text('在页面边缘提供始终可见的营销或客服入口。')"
        viewport
        ><DemoSection bare variant="preview" :title="text('演示效果')"
            ><snake-suspension class="demo-suspension-showcase" :datas="data" :scroll-top="scrollTop" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
