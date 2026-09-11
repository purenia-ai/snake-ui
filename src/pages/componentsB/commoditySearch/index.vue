<script setup lang="ts">
import { computed, reactive } from 'vue';
import { searchData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'searchPlaceholder', label: '占位文字', type: 'input', defaultValue: '搜索 Snake UI 组件' },
    {
        key: 'searchRadius',
        label: '输入框圆角',
        type: 'slider',
        defaultValue: 36,
        min: 0,
        max: 40,
        step: 4,
        unit: 'rpx'
    }
];
const state = reactive<Record<string, DemoValue>>({ searchPlaceholder: '搜索 Snake UI 组件', searchRadius: 36 });
const data = computed(() => ({
    ...searchData,
    searchText: String(state.searchPlaceholder),
    borderRadius: Number(state.searchRadius)
}));
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('commodity-search', '商品搜索');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('在商城装修页面中提供商品搜索入口。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><snake-commodity-search class="demo-commodity-search-showcase" :datas="data" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
