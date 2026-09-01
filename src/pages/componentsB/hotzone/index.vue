<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import { hotzoneData } from '../../../common/fixtures';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'hotzoneLinkType',
        label: '链接类型',
        type: 'select',
        defaultValue: 10,
        options: [
            { label: '内部链接', value: 10 },
            { label: '外部链接', value: 11 }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ hotzoneLinkType: 10 });
const data = computed(() => ({
    ...hotzoneData,
    hotzoneList: hotzoneData.hotzoneList.map(zone => ({ ...zone, httpType: Number(state.hotzoneLinkType) }))
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
    return demoTitle('hotzone', '热区图');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage
        :title="title"
        :eyebrow="text('CMS 内容')"
        :desc="text('在背景图上按百分比热区点击跳转，热区与链接由装修编辑器配置。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><snake-hotzone class="demo-hotzone-showcase" :datas="data" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
