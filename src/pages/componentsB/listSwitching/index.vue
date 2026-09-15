<template>
    <DemoPage :title="title" :desc="text('在列表和宫格商品布局之间切换。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-list-switching class="demo-list-switching-showcase" :datas="data" />
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue';
import { listSwitchingData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'listLayout',
        label: '默认布局',
        type: 'select',
        defaultValue: 0,
        options: [
            { label: '宫格', value: 0 },
            { label: '列表', value: 1 }
        ]
    },
    { key: 'listRadius', label: '卡片圆角', type: 'slider', defaultValue: 12, min: 0, max: 28, step: 4, unit: 'rpx' }
];
const state = reactive<Record<string, DemoValue>>({ listLayout: 0, listRadius: 12 });
const data = computed(() => ({
    ...listSwitchingData,
    commoditylisttype: Number(state.listLayout),
    borderRadius: Number(state.listRadius)
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
    return demoTitle('list-switching', '列表切换');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
