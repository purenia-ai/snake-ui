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
    {
        key: 'videoScene',
        label: '视频状态',
        type: 'select',
        defaultValue: 'empty',
        options: [
            { label: '占位演示', value: 'empty' },
            { label: '本地场景', value: 'local' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ videoScene: 'empty' });
const data = computed(() => ({ src: state.videoScene === 'local' ? localImage : '' }));
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
    return demoTitle('videos', '视频');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :eyebrow="text('CMS 内容')" :desc="text('在装修页面中承载视频播放内容。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><snake-videos class="demo-videos-showcase" :datas="data" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
