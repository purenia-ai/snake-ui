<template>
    <DemoPage :title="title" :desc="text('长内容先收起一部分，点击展开全文。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-read-more-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-read-more
                    :toggle="Boolean(state.rmToggle)"
                    :show-height="Number(state.rmShowHeight)"
                    :color="String(state.rmColor)"
                    :text-indent="'0'"
                    :open-text="String(state.rmOpenText) || (isEnglish ? 'Collapse' : '收起')"
                    :close-text="String(state.rmCloseText) || text('展开全文')"
                    @open="lastAction = 'open'"
                    @close="lastAction = 'close'"
                >
                    <text>{{ longContent }}</text>
                </snake-read-more>
                <text v-if="lastAction" class="demo-variant-sub">
                    {{
                        lastAction === 'open' ? (isEnglish ? 'Expanded' : '已展开') : isEnglish ? 'Collapsed' : '已收起'
                    }}
                </text>
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
const lastAction = ref<'open' | 'close' | ''>('');
const longContent = computed(() =>
    isEnglish.value
        ? (
              'Snake UI provides components for uni-app commerce and CMS pages, including forms, feedback, overlays, and navigation. ' +
              'ReadMore initially shows part of a long article and lets readers expand the rest. ' +
              'Enable the toggle option to let readers collapse it again. '
          ).repeat(4)
        : (
              'Snake UI 是一套面向 uni-app 商城与 CMS 场景的组件库，提供按钮、表单、反馈、浮层、导航与布局等组件。' +
              '阅读更多组件会先显示长内容的一部分，点击后展开全文。开启“显示收起”后，还可以再次折叠。'
          ).repeat(4)
);
const controls: DemoControl[] = [
    { key: 'rmToggle', label: '显示收起', type: 'switch', defaultValue: false },
    { key: 'rmCloseText', label: '展开文案', type: 'input', defaultValue: '', placeholder: '展开全文' },
    { key: 'rmOpenText', label: '收起文案', type: 'input', defaultValue: '', placeholder: '收起' },
    {
        key: 'rmShowHeight',
        label: '占位高度',
        type: 'slider',
        defaultValue: 400,
        min: 200,
        max: 800,
        step: 50,
        unit: 'rpx'
    },
    {
        key: 'rmColor',
        label: '提示文字颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '警示色', value: '#fa3534' }
        ]
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
    return demoTitle('read-more', '阅读更多');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
    if (key === 'rmToggle' || key === 'rmShowHeight') lastAction.value = '';
}
</script>

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
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
