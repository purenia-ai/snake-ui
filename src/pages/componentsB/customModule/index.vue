<template>
    <DemoPage :title="title" :desc="text('通过命名插槽接入业务自定义内容。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-cms class="demo-custom-module-showcase" :page-components="modules">
                <template #campaign>
                    <view class="custom-card">{{ state.moduleText }}</view>
                </template>
            </snake-cms>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const modules = [{ component: 'custommodule', setStyle: { slotName: 'campaign' } }];
const defaultTextZh = '业务插槽可以在这里承载任意内容';
const defaultTextEn = 'Add any business content to this slot';
const controls: DemoControl[] = [{ key: 'moduleText', label: '插槽内容', type: 'input', defaultValue: defaultTextZh }];
const state = reactive<Record<string, DemoValue>>({ moduleText: defaultTextZh });
watch(
    localeName,
    locale => {
        if (state.moduleText === defaultTextZh || state.moduleText === defaultTextEn) {
            state.moduleText = locale === 'en-US' ? defaultTextEn : defaultTextZh;
        }
    },
    { immediate: true }
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('custom-module', '自定义模块');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<style scoped>
.custom-card {
    margin: 0 24rpx;
    padding: 48rpx 28rpx;
    border-radius: 20rpx;
    color: #eafff4;
    background: linear-gradient(135deg, var(--snake-color-primary-deeper), var(--snake-color-primary-deep));
    font-weight: 700;
}
</style>
