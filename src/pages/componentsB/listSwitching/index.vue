<template>
    <DemoPage :title="title" :desc="text('在列表和宫格商品布局之间切换。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-list-switching class="demo-list-switching-showcase" :datas="data" @item-click="onItemClick" />
            <text v-if="selectedGoods" class="demo-selection" aria-live="polite"
                >{{ text('已点击商品') }}: {{ text(selectedGoods) }}</text
            >
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { listSwitchingData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const selectedGoods = ref('');
const controls: DemoControl[] = [
    {
        key: 'listLayout',
        label: '默认布局',
        type: 'select',
        defaultValue: 1,
        options: [
            { label: '宫格', value: 1 },
            { label: '列表', value: 3 }
        ]
    },
    { key: 'listRadius', label: '卡片圆角', type: 'slider', defaultValue: 12, min: 0, max: 28, step: 4, unit: 'px' }
];
const state = reactive<Record<string, DemoValue>>({ listLayout: 1, listRadius: 12 });
const data = computed(() => ({
    ...listSwitchingData,
    commoditylisttype: 0,
    commodityType: Number(state.listLayout),
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
function onItemClick(item: { name?: string; goodsName?: string }) {
    selectedGoods.value = item.goodsName || item.name || '';
}
</script>
<style scoped>
.demo-selection {
    display: block;
    padding: 12rpx 20rpx;
    color: var(--snake-color-text-secondary);
    font-size: 22rpx;
}
</style>
