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
                    :list="currentList"
                    :mode="String(state.slMode)"
                    :mask-close-able="Boolean(state.slMaskClose)"
                    :safe-area-inset-bottom="Boolean(state.slSafeArea)"
                    :title="String(state.slTitle) || text('请选择')"
                    :cancel-text="String(state.slCancelText) || undefined"
                    :confirm-text="String(state.slConfirmText) || undefined"
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

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { demoText, demoTitle, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type { SelectItem } from '../../../uni_modules/snake-ui/components/snake-select/types';

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
const englishLabels: Record<string, string> = {
    选项一: 'Option one',
    选项二: 'Option two',
    选项三: 'Option three',
    选项四: 'Option four',
    上午: 'Morning',
    下午: 'Afternoon',
    华东: 'East China',
    华南: 'South China',
    华北: 'North China',
    上海: 'Shanghai',
    杭州: 'Hangzhou',
    广州: 'Guangzhou',
    深圳: 'Shenzhen',
    北京: 'Beijing',
    天津: 'Tianjin'
};
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
    { key: 'slSafeArea', label: '底部安全区适配', type: 'switch', defaultValue: false },
    { key: 'slTitle', label: '选择器标题', type: 'input', defaultValue: '', placeholder: '请选择' },
    { key: 'slCancelText', label: '取消按钮文字', type: 'input', defaultValue: '', placeholder: '取消' },
    { key: 'slConfirmText', label: '确认按钮文字', type: 'input', defaultValue: '', placeholder: '确认' }
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
const currentList = computed<SelectItem[] | SelectItem[][]>(() => {
    const mode = String(state.slMode);
    if (mode === 'mutil-column') return mutilList.map(column => localizeOptions(column));
    if (mode === 'mutil-column-auto') return localizeOptions(cascadeList);
    return localizeOptions(singleList);
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function localizeOptions(items: SelectItem[]): SelectItem[] {
    return items.map(item => ({
        ...item,
        label: isEnglish.value ? englishLabels[String(item.label)] || item.label : item.label,
        ...(Array.isArray(item.children) ? { children: localizeOptions(item.children as SelectItem[]) } : {})
    }));
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
