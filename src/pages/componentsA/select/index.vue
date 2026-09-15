<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const selectShow = ref(false);
const lastResult = ref('—');
const singleList = [
    { label: '选项一', value: 'a' },
    { label: '选项二', value: 'b' },
    { label: '选项三', value: 'c' },
    { label: '选项四', value: 'd' }
];
const mutilList = [
    [
        { label: '上午', value: 'am' },
        { label: '下午', value: 'pm' }
    ],
    [
        { label: '8:00', value: '8' },
        { label: '9:00', value: '9' },
        { label: '10:00', value: '10' }
    ]
];
const cascadeList = [
    {
        label: '华东',
        value: 'east',
        children: [
            { label: '上海', value: 'sh' },
            { label: '杭州', value: 'hz' }
        ]
    },
    {
        label: '华南',
        value: 'south',
        children: [
            { label: '广州', value: 'gz' },
            { label: '深圳', value: 'sz' }
        ]
    },
    {
        label: '华北',
        value: 'north',
        children: [
            { label: '北京', value: 'bj' },
            { label: '天津', value: 'tj' }
        ]
    }
];
const controls: DemoControl[] = [
    {
        key: 'slMode',
        label: '选择模式',
        type: 'select',
        defaultValue: 'single-column',
        options: [
            { label: '单列', value: 'single-column' },
            { label: '多列', value: 'mutil-column' },
            { label: '多列联动', value: 'mutil-column-auto' }
        ]
    },
    { key: 'slMaskClose', label: '点击遮罩关闭', type: 'switch', defaultValue: true },
    { key: 'slSafeArea', label: '底部安全区适配', type: 'switch', defaultValue: false }
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
    return demoTitle('select', '列选择器');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function currentList() {
    if (String(state.slMode) === 'mutil-column') return mutilList;
    if (String(state.slMode) === 'mutil-column-auto') return cascadeList;
    return singleList;
}
function onConfirm(result: { label: unknown; value: unknown }[]) {
    lastResult.value = result.map(item => String(item.label)).join(' / ');
}
function onCancel() {
    lastResult.value = text('已取消');
}
function onClose() {
    lastResult.value = text('已关闭');
}
</script>

<template>
    <DemoPage :title="title" :desc="text('单列、多列与多列联动的底部选择器。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-select-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-button type="primary" :custom-style="{ width: '240rpx' }" @click="selectShow = true">
                    {{ text('打开选择器') }}
                </snake-button>
                <text class="demo-variant-sub">{{ text('选择结果') }}：{{ lastResult }}</text>
                <snake-select
                    v-model="selectShow"
                    :list="currentList()"
                    :mode="String(state.slMode)"
                    :mask-close-able="Boolean(state.slMaskClose)"
                    :safe-area-inset-bottom="Boolean(state.slSafeArea)"
                    title="请选择"
                    @confirm="onConfirm"
                    @cancel="onCancel"
                    @close="onClose"
                />
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
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 24rpx;
}
</style>
