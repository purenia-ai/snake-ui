<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { filters } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const scrollTop = ref(0);
const controls: DemoControl[] = [
    { key: 'filterTabs', label: '显示筛选标签', type: 'switch', defaultValue: true },
    {
        key: 'filterBg',
        label: '背景颜色',
        type: 'select',
        defaultValue: '#ffffff',
        options: [
            { label: '白色', value: '#ffffff' },
            { label: '浅绿', value: '#eef6f1' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ filterTabs: true, filterBg: '#ffffff' });
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
    return demoTitle('filter-sorts', '筛选排序');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('提供商品排序和多条件筛选入口。')" viewport
        ><DemoSection bare variant="preview" :title="text('演示效果')"
            ><snake-filter-sorts
                class="demo-filter-sorts-showcase"
                :filters="filters"
                sort="auto"
                :bg-color="String(state.filterBg)"
                :show-tabs="Boolean(state.filterTabs)"
                :scroll-top="scrollTop" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
