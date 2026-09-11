<script setup lang="ts">
import { computed, reactive } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const controls: DemoControl[] = [
    { key: 'navbarTitle', label: '导航标题', type: 'input', defaultValue: '订单详情' },
    { key: 'navbarBack', label: '显示返回', type: 'switch', defaultValue: true },
    { key: 'navbarBorder', label: '底部分隔线', type: 'switch', defaultValue: true },
    { key: 'navbarBold', label: '标题加粗', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const localizedControls = computed(() => {
    const _locale = localeName.value;
    return controls.map(control => ({ ...control, label: demoText(control.label) }));
});
const title = computed(() => {
    const _locale = localeName.value;
    return demoTitle('navbar', '导航栏');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :desc="text('用于页面顶部导航，支持返回操作、安全区、标题和左右插槽。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-navbar-preview demo-navbar-showcase">
                <snake-navbar
                    :title="String(state.navbarTitle)"
                    :is-back="Boolean(state.navbarBack)"
                    :border-bottom="Boolean(state.navbarBorder)"
                    :title-bold="Boolean(state.navbarBold)"
                    :fixed="false"
                    :safe-area-inset-top="false"
                >
                    <template #right
                        ><text class="demo-navbar-preview__action">{{ isEnglish ? 'More' : '更多' }}</text></template
                    >
                </snake-navbar>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue"
        /></DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-navbar-preview {
    border: 1rpx solid var(--snake-color-divider);
    border-radius: 10rpx;
}
.demo-navbar-preview__action {
    padding: 0 24rpx;
    color: var(--snake-demo-accent-text);
    font-size: 26rpx;
}
</style>
