<template>
    <DemoPage :title="title" :desc="text('标签页用于在同层级内容之间快速切换。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-tabs-showcase">
                <snake-tabs
                    :list="tabs"
                    :current="current"
                    :is-scroll="Boolean(state.tabsScrollable)"
                    :active-color="String(state.tabsColor)"
                    :font-size="Number(state.tabsSize)"
                    :bar-width="Number(state.tabsBarWidth)"
                    :gutter="Number(state.tabsGutter)"
                    :bg-color="String(state.tabsBgColor)"
                    :show-bar="Boolean(state.tabsShowBar)"
                    :is-dot="Boolean(state.tabsDot)"
                    @change="current = $event"
                />
                <view class="demo-tab-content">{{ isEnglish ? 'Selected: ' : '当前选中：' }}{{ currentLabel }}</view>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const current = ref(0);
const tabs = [
    { name: '推荐', count: 12 },
    { name: '新品', count: 3 },
    { name: '热门' },
    { name: '限时活动', count: 8 },
    { name: '品牌馆' }
];
const currentLabel = computed(() => String(tabs[current.value]?.name ?? ''));
const controls: DemoControl[] = [
    { key: 'tabsScrollable', label: '允许横向滚动', type: 'switch', defaultValue: true },
    {
        key: 'tabsColor',
        label: '活动颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#FF6A0C' }
        ]
    },
    { key: 'tabsSize', label: '文字尺寸', type: 'slider', defaultValue: 30, min: 24, max: 36, step: 2, unit: 'rpx' },
    {
        key: 'tabsBarWidth',
        label: '滑块宽度',
        type: 'slider',
        defaultValue: 40,
        min: 20,
        max: 80,
        step: 4,
        unit: 'rpx'
    },
    { key: 'tabsGutter', label: '标签间距', type: 'slider', defaultValue: 40, min: 20, max: 80, step: 4, unit: 'rpx' },
    {
        key: 'tabsBgColor',
        label: '背景颜色',
        type: 'select',
        defaultValue: '#ffffff',
        options: [
            { label: '白色', value: '#ffffff' },
            { label: '浅灰', value: '#f1f1f1' },
            { label: '薄荷', value: '#06D2901A' }
        ]
    },
    { key: 'tabsShowBar', label: '显示滑块', type: 'switch', defaultValue: true },
    { key: 'tabsDot', label: '使用圆点徽标', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
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
    return demoTitle('tabs', '标签页');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<style scoped>
.demo-tab-content {
    padding: 64rpx 24rpx;
    border-radius: 16rpx;
    background: var(--snake-color-surface-muted);
    color: var(--snake-demo-accent-text);
    text-align: center;
}
</style>
