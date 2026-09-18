<template>
    <DemoPage :title="title" :desc="text('用于焦点广告轮播，支持间距、圆角和播放间隔。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-picture-ads class="demo-picture-ads-showcase" :datas="data" />
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive } from 'vue';
import { pictureAdsData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [
    { key: 'adRadius', label: '广告圆角', type: 'slider', defaultValue: 16, min: 0, max: 32, step: 4, unit: 'rpx' },
    {
        key: 'adInterval',
        label: '播放间隔',
        type: 'slider',
        defaultValue: 3000,
        min: 1500,
        max: 5000,
        step: 500,
        unit: 'ms'
    }
];
const state = reactive<Record<string, DemoValue>>({ adRadius: 16, adInterval: 3000 });
const data = computed(() => ({
    ...pictureAdsData,
    imageList: pictureAdsData.imageList.map((item, index) => ({
        ...item,
        text: isEnglish.value ? ['New arrivals', 'Featured picks'][index] : ['新品推荐', '精选好物'][index]
    })),
    borderRadius: Number(state.adRadius),
    interval: Number(state.adInterval)
}));
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('picture-ads', '轮播广告');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
