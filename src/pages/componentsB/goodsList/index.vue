<template>
    <DemoPage :title="title" :desc="text('展示商品网格或列表，并承载价格和状态信息。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-goods-list
                class="demo-goods-list-showcase"
                :goods-list="goods"
                :list-type="String(state.goodsMode)"
                :commodity-type="0"
                :page-margin="Number(state.goodsMargin)"
                :image-margin="10"
            />
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue';
import { goods } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'goodsMode',
        label: '列表类型',
        type: 'select',
        defaultValue: 'sale',
        options: [
            { label: '在售', value: 'sale' },
            { label: '默认', value: 'default' }
        ]
    },
    { key: 'goodsMargin', label: '页面边距', type: 'slider', defaultValue: 10, min: 0, max: 30, step: 5, unit: 'rpx' }
];
const state = reactive<Record<string, DemoValue>>({ goodsMode: 'sale', goodsMargin: 10 });
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
    return demoTitle('goods-list', '商品列表');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
