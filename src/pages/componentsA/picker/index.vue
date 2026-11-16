<template>
    <DemoPage :title="title" :desc="text('单列、多列与多列联动的底部选择器。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-picker-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-button type="primary" :custom-style="{ width: '120px' }" @click="pickerShow = true">
                    {{ text('打开选择器') }}
                </snake-button>
                <text class="demo-variant-sub">{{ text('选择结果') }}：{{ lastResult }}</text>
                <text class="demo-variant-sub">{{ text('滚动中实时值') }}：{{ changeResult }}</text>
                <text v-if="state.slImmediateChange" class="demo-variant-sub">{{
                    text('仅微信小程序（基础库 2.21.1+）生效')
                }}</text>
                <snake-picker
                    v-model="pickerShow"
                    :list="currentList"
                    :mode="String(state.slMode)"
                    :item-height="Number(state.slItemHeight)"
                    :visible-item-count="Number(state.slVisibleCount)"
                    :immediate-change="Boolean(state.slImmediateChange)"
                    :border="Boolean(state.slBorder)"
                    :round="Boolean(state.slRound)"
                    :root-portal="Boolean(state.slRootPortal)"
                    :preserve-selection="Boolean(state.slPreserve)"
                    :mask-close-able="Boolean(state.slMaskClose)"
                    :safe-area-inset-bottom="Boolean(state.slSafeArea)"
                    :title="String(state.slTitle) || text('请选择')"
                    :cancel-text="String(state.slCancelText) || undefined"
                    :confirm-text="String(state.slConfirmText) || undefined"
                    @change="onChange"
                    @confirm="onConfirm"
                    @cancel="onCancel"
                    @close="onClose"
                />
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('方法与异步校验')">
            <view class="demo-stack demo-picker-showcase">
                <text class="demo-variant-title">{{ text('异步校验示例') }}</text>
                <snake-button :custom-style="{ width: '140px' }" @click="openGuardPicker">
                    {{ text('用 open() 打开') }}
                </snake-button>
                <text class="demo-variant-sub">{{ text('模拟 600ms 校验：选中第一项时拦截') }}</text>
                <text class="demo-variant-sub">{{ text('校验状态') }}：{{ guardStatus }}</text>
                <snake-picker
                    ref="guardPickerRef"
                    v-model="guardShow"
                    :list="localizeOptions(singleList)"
                    :before-confirm="beforeConfirm"
                    :title="text('异步校验')"
                    @confirm="onGuardConfirm"
                />
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('表单联动')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('选完即校验') }}</text>
                <snake-form ref="cityFormRef" :model="cityForm" :rules="cityRules" :error-type="['message']">
                    <snake-form-item :label="text('收件城市')" prop="city" required :label-width="72">
                        <view class="demo-field" @click="cityShow = true">
                            <text class="demo-field__text" :class="{ 'demo-field__text--placeholder': !cityLabel }">
                                {{ cityLabel || text('请选择') }}
                            </text>
                        </view>
                        <snake-picker
                            v-model="cityShow"
                            :list="localizeOptions(singleList)"
                            :title="text('选择城市')"
                            @confirm="onCityConfirm"
                        />
                    </snake-form-item>
                </snake-form>
                <snake-button :custom-style="{ width: '120px' }" @click="submitCityForm">{{
                    text('提交')
                }}</snake-button>
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
import type {
    PickerExpose,
    PickerItem,
    PickerResult
} from '../../../uni_modules/snake-ui/components/snake-picker/types';
import type { FormExpose, FormRules } from '../../../uni_modules/snake-ui/components/snake-form/types';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const pickerShow = ref(false);
const lastResult = ref('—');
const changeResult = ref('—');
const guardShow = ref(false);
const guardPickerRef = ref<PickerExpose | null>(null);
const guardStatus = ref('—');
const cityShow = ref(false);
const cityFormRef = ref<FormExpose | null>(null);
const cityForm = reactive<{ city: string }>({ city: '' });
const cityRules = computed<FormRules>(() => ({
    city: [{ required: true, message: text('请选择收件城市'), trigger: 'change' }]
}));
const cityLabel = computed(() => {
    const matched = localizeOptions(singleList).find(item => item.value === cityForm.city);
    return matched ? String(matched.label) : '';
});
const singleList = [
    { label: '选项一', value: 'a' },
    { label: '选项二', value: 'b' },
    { label: '选项三', value: 'c' },
    { label: '选项四', value: 'd' },
    { label: '超长的选项文本用来验证省略号展示效果', value: 'e' }
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
    超长的选项文本用来验证省略号展示效果: 'A very long option label used to verify the ellipsis',
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
    { key: 'slItemHeight', label: '行高', type: 'slider', defaultValue: 44, min: 32, max: 60, step: 4, unit: 'px' },
    {
        key: 'slVisibleCount',
        label: '可见行数',
        type: 'select',
        defaultValue: 6,
        options: [
            { label: '4 行', value: 4 },
            { label: '5 行', value: 5 },
            { label: '6 行', value: 6 },
            { label: '7 行', value: 7 }
        ]
    },
    { key: 'slBorder', label: '工具栏分隔线', type: 'switch', defaultValue: true },
    { key: 'slImmediateChange', label: '手指松开即触发 change', type: 'switch', defaultValue: false },
    { key: 'slRound', label: '面板圆角', type: 'switch', defaultValue: true },
    { key: 'slRootPortal', label: '传入根节点', type: 'switch', defaultValue: false },
    { key: 'slPreserve', label: '保留上次选择', type: 'switch', defaultValue: true },
    { key: 'slEmpty', label: '空数据', type: 'switch', defaultValue: false },
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
    return demoTitle('picker', '列选择器');
});
const currentList = computed<PickerItem[] | PickerItem[][]>(() => {
    if (state.slEmpty) return [];
    const mode = String(state.slMode);
    if (mode === 'mutil-column') return mutilList.map(column => localizeOptions(column));
    if (mode === 'mutil-column-auto') return localizeOptions(cascadeList);
    return localizeOptions(singleList);
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function localizeOptions(items: PickerItem[]): PickerItem[] {
    return items.map(item => ({
        ...item,
        label: isEnglish.value ? englishLabels[String(item.label)] || item.label : item.label,
        ...(Array.isArray(item.children) ? { children: localizeOptions(item.children as PickerItem[]) } : {})
    }));
}
function formatResult(result: PickerResult[]): string {
    return result.map(item => String(item.label)).join(' / ');
}
function onChange(result: PickerResult[]) {
    changeResult.value = formatResult(result);
}
function onConfirm(result: PickerResult[]) {
    lastResult.value = formatResult(result);
}
function onCancel() {
    lastResult.value = text('已取消');
}
function onClose() {
    lastResult.value = text('已关闭');
}
function openGuardPicker() {
    guardStatus.value = '—';
    guardPickerRef.value?.open();
}
/** 模拟异步校验：选中第一项时拦截，弹层保持打开。 */
async function beforeConfirm(result: PickerResult[]): Promise<boolean> {
    guardStatus.value = text('校验中…');
    await new Promise<void>(resolve => setTimeout(resolve, 600));
    if (result[0]?.value === 'a') {
        guardStatus.value = text('被拦截：请选择非第一项');
        return false;
    }
    guardStatus.value = text('校验通过');
    return true;
}
function onGuardConfirm(result: PickerResult[]) {
    guardStatus.value = `${text('已确认')}：${formatResult(result)}`;
}
function onCityConfirm(result: PickerResult[]) {
    cityForm.city = String(result[0]?.value ?? '');
}
async function submitCityForm() {
    await cityFormRef.value?.validate();
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-variant-sub {
    color: var(--snake-color-text-muted);
    font-size: 12px;
}
.demo-field {
    display: flex;
    flex: 1;
    min-width: 0;
    align-items: center;
}
.demo-field__text {
    font-size: 14px;
    color: var(--snake-color-text);
}
.demo-field__text--placeholder {
    color: var(--snake-color-text-muted);
}
</style>
