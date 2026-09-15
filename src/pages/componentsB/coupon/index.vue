<script setup lang="ts">
import { computed, reactive } from 'vue';
import { couponData } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const controls: DemoControl[] = [
    {
        key: 'couponMode',
        label: '展示模式',
        type: 'select',
        defaultValue: 'page',
        options: [
            { label: '页面', value: 'page' },
            { label: '弹窗', value: 'popup' }
        ]
    }
];
const state = reactive<Record<string, DemoValue>>({ couponMode: 'page' });
const data = computed(() => ({ ...couponData, modeType: String(state.couponMode), popupMode: 'bottom' }));
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
    return demoTitle('coupon', '优惠券');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>
<template>
    <DemoPage :title="title" :desc="text('展示优惠券状态并提供领取入口。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-coupon class="demo-coupon-showcase" :datas="data" />
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
