<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { activities } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const current = ref('001');
const controls: DemoControl[] = [
    {
        key: 'activityScene',
        label: '活动数据',
        type: 'select',
        defaultValue: 'all',
        options: [
            { label: '全部场次', value: 'all' },
            { label: '单个场次', value: 'single' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ activityScene: 'all' });
const list = computed(() => (state.activityScene === 'single' ? activities.slice(0, 1) : activities));
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
    return demoTitle('activity-list', '活动列表');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function selectActivity(item: { id: string }) {
    current.value = item.id;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('展示活动或拍卖场次，并支持选择当前场次。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><snake-activity-list
                class="demo-activity-list-showcase"
                :list="list"
                :current="current"
                @change="selectActivity" /></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
