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
    {
        key: 'noticeMode',
        label: '展示模式',
        type: 'select',
        defaultValue: 'horizontal',
        options: [
            { label: '横向', value: 'horizontal' },
            { label: '纵向', value: 'vertical' }
        ]
    },
    { key: 'noticeIcon', label: '显示图标', type: 'switch', defaultValue: true },
    { key: 'noticeMore', label: '显示更多', type: 'switch', defaultValue: true },
    {
        key: 'noticeDuration',
        label: '切换间隔',
        type: 'slider',
        defaultValue: 1800,
        min: 1000,
        max: 4000,
        step: 200,
        unit: 'ms'
    }
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
    return demoTitle('notice-bar', '通知栏');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
</script>

<template>
    <DemoPage :title="title" :eyebrow="text('展示组件')" :desc="text('承载重要通知，支持横向展示和纵向轮播。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-notice-bar-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-notice-bar
                    :volume-icon="Boolean(state.noticeIcon)"
                    :more-icon="Boolean(state.noticeMore)"
                    :mode="state.noticeMode === 'vertical' ? 'vertical' : 'horizontal'"
                    :direction="state.noticeMode === 'vertical' ? 'column' : 'row'"
                    :text="
                        state.noticeMode === 'vertical' ? '' : isEnglish ? 'Welcome to Snake UI' : '欢迎使用 Snake UI'
                    "
                    :list="
                        isEnglish
                            ? ['Foundation components are ready', 'Supports H5, mini programs and apps']
                            : ['基础组件已就绪', '支持 H5、小程序和 App']
                    "
                    :duration="Number(state.noticeDuration)"
                />
                <text class="demo-variant-title">{{ isEnglish ? 'Themes and actions' : '主题与操作' }}</text>
                <snake-notice-bar
                    type="info"
                    volume-icon
                    more-icon
                    :text="isEnglish ? 'View the latest component updates' : '查看最新组件更新'"
                />
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')"
            ><DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue"
        /></DemoSection>
    </DemoPage>
</template>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 24rpx;
}
.demo-variant-title {
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.4;
}
</style>
