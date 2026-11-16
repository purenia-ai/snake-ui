<template>
    <DemoPage :title="title" :desc="text('底部弹层内以列表勾选，支持单选、多选、搜索与数量限制。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-select-picker-showcase">
                <text class="demo-variant-title">{{ text('单选示例') }}</text>
                <view class="demo-field" @click="openSingle">
                    <text class="demo-field__text" :class="{ 'demo-field__text--placeholder': !singleLabel }">
                        {{ singleLabel || text('请选择') }}
                    </text>
                </view>
                <text class="demo-variant-sub">{{ text('已选') }}：{{ singleLabel || '—' }}</text>
                <snake-select-picker
                    ref="singleRef"
                    v-model="singleValue"
                    v-model:visible="singleVisible"
                    :list="localizedList"
                    :title="String(state.spTitle) || text('请选择')"
                    :confirm-text="String(state.spConfirmText) || undefined"
                    :show-confirm="Boolean(state.spShowConfirm)"
                    :filterable="Boolean(state.spFilterable)"
                    :loading="Boolean(state.spLoading)"
                    :round="Boolean(state.spRound)"
                    :root-portal="Boolean(state.spRootPortal)"
                    :safe-area-inset-bottom="Boolean(state.spSafeArea)"
                    :scroll-into-view="Boolean(state.spScrollIntoView)"
                    :close-on-click-overlay="Boolean(state.spMaskClose)"
                    :min="Number(state.spMin)"
                    :max="Number(state.spMax)"
                    :max-height="Number(state.spMaxHeight)"
                    :multiple="false"
                    @confirm="onSingleConfirm"
                    @change="onSingleChange"
                    @close="onClose"
                />
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('多选示例')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('至少 1 项，最多 3 项') }}</text>
                <snake-button type="primary" :custom-style="{ width: '160px' }" @click="multiVisible = true">
                    {{ text('打开多选列表') }}
                </snake-button>
                <text class="demo-variant-sub">{{ text('已选') }}：{{ multiLabels || '—' }}</text>
                <snake-select-picker
                    v-model="multiValue"
                    v-model:visible="multiVisible"
                    :list="localizedList"
                    :title="text('选择标签')"
                    multiple
                    :min="1"
                    :max="3"
                    filterable
                    @confirm="onMultiConfirm"
                />
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('异步确认')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('模拟 600ms 远程校验：选中上海时拦截') }}</text>
                <snake-button :custom-style="{ width: '160px' }" @click="openGuardPicker">
                    {{ text('用 open() 打开') }}
                </snake-button>
                <text class="demo-variant-sub">{{ text('校验状态') }}：{{ guardStatus }}</text>
                <snake-select-picker
                    ref="guardRef"
                    v-model="guardValue"
                    v-model:visible="guardVisible"
                    :list="localizedList"
                    :before-confirm="beforeConfirm"
                    :title="text('异步确认')"
                    @confirm="onGuardConfirm"
                />
            </view>
        </DemoSection>
        <DemoSection variant="preview" :title="text('表单联动')">
            <view class="demo-stack">
                <text class="demo-variant-title">{{ text('选完即校验') }}</text>
                <snake-form ref="cityFormRef" :model="cityForm" :rules="cityRules" :error-type="['message']">
                    <snake-form-item :label="text('收件城市')" prop="city" required :label-width="72">
                        <view class="demo-field" @click="cityVisible = true">
                            <text class="demo-field__text" :class="{ 'demo-field__text--placeholder': !cityLabel }">
                                {{ cityLabel || text('请选择') }}
                            </text>
                        </view>
                        <snake-select-picker
                            v-model="cityForm.city"
                            v-model:visible="cityVisible"
                            :list="localizedList"
                            :title="text('选择城市')"
                        />
                    </snake-form-item>
                </snake-form>
                <snake-button :custom-style="{ width: '120px' }" @click="submitCityForm">
                    {{ text('提交') }}
                </snake-button>
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
    SelectPickerExpose,
    SelectPickerItem,
    SelectPickerValue
} from '../../../uni_modules/snake-ui/components/snake-select-picker/types';
import type { FormExpose, FormRules } from '../../../uni_modules/snake-ui/components/snake-form/types';

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const localizedList = computed(() => localizeOptions(baseList));

const singleRef = ref<SelectPickerExpose | null>(null);
const guardRef = ref<SelectPickerExpose | null>(null);
const singleValue = ref<SelectPickerValue>('');
const singleVisible = ref(false);
const multiValue = ref<SelectPickerValue>([]);
const multiVisible = ref(false);
const guardValue = ref<SelectPickerValue>('');
const guardVisible = ref(false);
const guardStatus = ref('—');
const cityVisible = ref(false);
const cityFormRef = ref<FormExpose | null>(null);
const cityForm = reactive<{ city: string }>({ city: '' });
const cityRules = computed<FormRules>(() => ({
    city: [{ required: true, message: text('请选择收件城市'), trigger: 'change' }]
}));

const baseList: SelectPickerItem[] = [
    { value: 'sh', label: '上海' },
    { value: 'hz', label: '杭州' },
    { value: 'bj', label: '北京' },
    { value: 'gz', label: '广州' },
    { value: 'sz', label: '深圳' },
    { value: 'cd', label: '成都' },
    { value: 'wh', label: '武汉', disabled: true },
    { value: 'xa', label: '西安' },
    { value: 'nj', label: '南京' },
    { value: 'cq', label: '重庆' }
];
const englishLabels: Record<string, string> = {
    上海: 'Shanghai',
    杭州: 'Hangzhou',
    北京: 'Beijing',
    广州: 'Guangzhou',
    深圳: 'Shenzhen',
    成都: 'Chengdu',
    武汉: 'Wuhan',
    西安: "Xi'an",
    南京: 'Nanjing',
    重庆: 'Chongqing'
};

const singleLabel = computed(() => labelOf(singleValue.value));
const multiLabels = computed(() => {
    const value = Array.isArray(multiValue.value) ? multiValue.value : [];
    return value.map(item => labelOf(item)).join(' / ');
});
const cityLabel = computed(() => labelOf(cityForm.city));

const controls: DemoControl[] = [
    { key: 'spTitle', label: '标题文字', type: 'input', defaultValue: '', placeholder: '请选择' },
    { key: 'spConfirmText', label: '确认按钮文字', type: 'input', defaultValue: '', placeholder: '确认' },
    { key: 'spShowConfirm', label: '显示确认栏', type: 'switch', defaultValue: false },
    { key: 'spFilterable', label: '本地搜索', type: 'switch', defaultValue: false },
    { key: 'spLoading', label: '加载状态', type: 'switch', defaultValue: false },
    { key: 'spMin', label: '最少选择数', type: 'slider', defaultValue: 0, min: 0, max: 3, step: 1 },
    { key: 'spMax', label: '最多选择数', type: 'slider', defaultValue: 0, min: 0, max: 6, step: 1 },
    {
        key: 'spMaxHeight',
        label: '列表最大高度',
        type: 'slider',
        defaultValue: 264,
        min: 132,
        max: 396,
        step: 44,
        unit: 'px'
    },
    { key: 'spScrollIntoView', label: '定位已选项', type: 'switch', defaultValue: true },
    { key: 'spMaskClose', label: '点击遮罩关闭', type: 'switch', defaultValue: true },
    { key: 'spSafeArea', label: '底部安全区适配', type: 'switch', defaultValue: true },
    { key: 'spRootPortal', label: '传入根节点', type: 'switch', defaultValue: false },
    { key: 'spRound', label: '面板圆角', type: 'switch', defaultValue: true }
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
    return demoTitle('select-picker', '单复选选择器');
});

function localizeOptions(items: SelectPickerItem[]): SelectPickerItem[] {
    return items.map(item => ({
        ...item,
        label: isEnglish.value ? englishLabels[String(item.label)] || item.label : item.label
    }));
}
function labelOf(value: SelectPickerValue): string {
    const target = Array.isArray(value) ? value[0] : value;
    const matched = localizedList.value.find(item => item.value === target);
    return matched ? String(matched.label) : '';
}
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function openSingle() {
    singleRef.value?.open();
}
function openGuardPicker() {
    guardStatus.value = '—';
    guardRef.value?.open();
}
function onSingleConfirm(value: SelectPickerValue) {
    singleValue.value = value;
}
function onSingleChange(value: SelectPickerValue) {
    singleValue.value = value;
}
function onMultiConfirm(value: SelectPickerValue) {
    multiValue.value = value;
}
function onClose() {
    guardStatus.value = '—';
}
/** 模拟异步校验：选中上海时拦截，弹层保持打开。 */
async function beforeConfirm(value: SelectPickerValue): Promise<boolean> {
    guardStatus.value = text('校验中…');
    await new Promise<void>(resolve => setTimeout(resolve, 600));
    const target = Array.isArray(value) ? value[0] : value;
    if (target === 'sh') {
        guardStatus.value = text('被拦截：请选择其他城市');
        return false;
    }
    guardStatus.value = text('校验通过');
    return true;
}
function onGuardConfirm(value: SelectPickerValue) {
    guardValue.value = value;
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
