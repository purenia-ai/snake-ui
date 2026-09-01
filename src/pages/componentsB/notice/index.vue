<script setup lang="ts">
import { computed, reactive } from 'vue';
import { noticeData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'noticeDirection',
        label: '滚动方向',
        type: 'select',
        defaultValue: 'column',
        options: [
            { label: '纵向', value: 'column' },
            { label: '横向', value: 'row' }
        ]
    },
    { key: 'noticeCmsIcon', label: '显示图标', type: 'switch', defaultValue: true }
];
const state = reactive<Record<string, DemoValue>>({ noticeDirection: 'column', noticeCmsIcon: true });
const data = computed(() => ({
    ...noticeData,
    direction: String(state.noticeDirection),
    isLeftIcon: Boolean(state.noticeCmsIcon)
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
    return demoTitle('notice', '公告');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :eyebrow="text('CMS 内容')" :desc="text('在装修页面中滚动展示多条业务公告。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><snake-notice class="demo-notice-showcase" :datas="data" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
