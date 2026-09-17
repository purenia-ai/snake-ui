<template>
    <DemoPage :title="title" :desc="text('展示优惠券状态并提供领取入口。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <snake-coupon
                :key="`${state.couponMode}-${couponKey}`"
                class="demo-coupon-showcase"
                :datas="data"
                :coupon-service="couponDemo.service"
                @received="feedback = text('优惠券已领取')"
                @error="feedback = text('领取失败，请重试')"
            />
            <text v-if="feedback" class="demo-feedback" aria-live="polite">{{ feedback }}</text>
            <snake-button v-if="feedback" plain size="small" @click="resetCoupon">{{ text('再次体验') }}</snake-button>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { couponData, createDemoCouponService } from '../../../common/fixtures';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
const { localeName, text } = useDemoLocale();
const feedback = ref('');
const couponKey = ref(0);
const couponDemo = createDemoCouponService();
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
    feedback.value = '';
}
function resetCoupon() {
    couponDemo.reset();
    couponKey.value += 1;
    feedback.value = '';
}
</script>
<style scoped>
.demo-feedback {
    display: block;
    margin: 16rpx;
    color: var(--snake-color-primary-deep);
    font-size: 24rpx;
}
</style>
