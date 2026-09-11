<script setup lang="ts">
import { computed, reactive } from 'vue';
import { popupData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'pagePopupMode',
        label: '弹窗位置',
        type: 'select',
        defaultValue: 'center',
        options: [
            { label: '居中', value: 'center' },
            { label: '底部', value: 'bottom' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ pagePopupMode: 'center' });
const data = computed(() => ({ ...popupData, popupMode: String(state.pagePopupMode) }));
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
    return demoTitle('page-popup', '页面弹窗');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('根据业务场景展示居中或底部营销弹窗。')" viewport
        ><DemoSection bare variant="preview" :title="text('演示效果')"
            ><snake-page-popup class="demo-page-popup-showcase" :datas="data" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
