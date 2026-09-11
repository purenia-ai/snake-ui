<script setup lang="ts">
import { computed, reactive } from 'vue';
import { localImage } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    { key: 'cubeRadius', label: '图片圆角', type: 'slider', defaultValue: 12, min: 0, max: 28, step: 4, unit: 'rpx' },
    { key: 'cubeMargin', label: '图片间距', type: 'slider', defaultValue: 8, min: 0, max: 24, step: 4, unit: 'rpx' }
];
const state = reactive<Record<string, DemoValue>>({ cubeRadius: 12, cubeMargin: 8 });
const data = computed(() => ({
    rubiksCubeType: 1,
    heights: 360,
    pageMargin: 20,
    imgMargin: Number(state.cubeMargin),
    borderRadius: Number(state.cubeRadius),
    bgColor: '#ffffff',
    imageTypeObj: { imageList: [{ src: localImage, url: '' }] }
}));
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('magic-cube', '魔方布局');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('通过可配置宫格组合营销图片和入口。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><snake-magic-cube class="demo-magic-cube-showcase" :datas="data" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
