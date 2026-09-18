<template>
    <DemoPage :title="title" :desc="text('展示活动或拍卖场次，并支持选择当前场次。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-activity-list
                class="demo-activity-list-showcase"
                :list="list"
                :current="current"
                @change="selectActivity"
            />
            <text class="demo-selection" aria-live="polite">{{ text('当前场次') }}: {{ selectedActivityName }}</text>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
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
const list = computed(() =>
    (state.activityScene === 'single' ? activities.slice(0, 1) : activities).map(item => ({
        ...item,
        name: text(item.name),
        subtitle: text(item.subtitle)
    }))
);
const selectedActivityName = computed(() => list.value.find(item => item.id === current.value)?.name || '');
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
    if (key === 'activityScene' && value === 'single') current.value = activities[0].id;
}
function selectActivity(item: { id: string }) {
    current.value = item.id;
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
