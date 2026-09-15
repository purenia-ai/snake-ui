<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const readMoreRef = ref<{ init: () => void } | null>(null);
const longContent =
    'Snake UI 是一套面向 uni-app 商城与 CMS 场景的组件库。它提供了按钮、表单、反馈与浮层、导航与布局等一系列组件，' +
    '并内置主题、暗黑模式与国际化能力。阅读更多组件用于内容较长时预先收起一部分，点击展开全部内容的场景。' +
    '当真实内容高度超过占位高度时，会自动显示展开按钮；展开后如果开启 toggle，还会显示收起按钮。' +
    '也可以通过组件的 init 方法在内容动态变化后重新测量高度。'.repeat(3);
const controls: DemoControl[] = [
    { key: 'rmToggle', label: '显示收起', type: 'switch', defaultValue: false },
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
}
function reMeasure() {
    readMoreRef.value?.init();
}
</script>

<template>
    <DemoPage :title="title" :desc="text('长内容先收起一部分，点击展开全文。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-read-more-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-read-more
                    ref="readMoreRef"
                    :toggle="Boolean(state.rmToggle)"
                    :show-height="Number(state.rmShowHeight)"
                    :color="String(state.rmColor)"
                    :text-indent="'0'"
                    @open="() => {}"
                    @close="() => {}"
                >
                    <text>{{ longContent }}</text>
                </snake-read-more>
                <snake-button type="primary" plain :custom-style="{ width: '240rpx' }" @click="reMeasure">
                    {{ isEnglish ? 'Re-measure' : '重新测量' }}
                </snake-button>
            </view>
        </DemoSection>
        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
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
