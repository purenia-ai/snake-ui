<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import { imageData } from '../../../common/fixtures';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'contentMargin', label: '页面边距', type: 'slider', defaultValue: 20, min: 0, max: 40, step: 4, unit: 'rpx' }
];
const state = reactive<Record<string, DemoValue>>({ contentMargin: 20 });
const data = computed(() => ({
    ...imageData,
    platformOptions: imageData.platformOptions.map(item => ({
        ...item,
        imgs: { ...item.imgs, paddingLR: Number(state.contentMargin) }
    }))
}));
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('images', '图片展示');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('按照装修数据展示单图或多图内容。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><snake-images class="demo-images-showcase" :datas="data" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
