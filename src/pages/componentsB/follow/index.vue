<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'followScene',
        label: '展示场景',
        type: 'select',
        defaultValue: 'default',
        options: [
            { label: '默认状态', value: 'default' },
            { label: '强调状态', value: 'strong' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ followScene: 'default' });
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
    return demoTitle('follow', '关注');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :eyebrow="text('CMS 营销')" :desc="text('用于引导用户关注公众号或品牌账号。')"
        ><DemoSection variant="preview" :title="text('演示效果')"
            ><view
                :class="[
                    'demo-follow',
                    'demo-follow-showcase',
                    { 'demo-follow--strong': state.followScene === 'strong' }
                ]"
                ><snake-follow /></view></DemoSection
        ><DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" /></DemoSection
    ></DemoPage>
</template>
<style scoped>
.demo-follow {
    padding: 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
}
.demo-follow--strong {
    border: 2rpx solid var(--snake-color-primary);
    background: var(--snake-color-primary-light);
}
</style>
