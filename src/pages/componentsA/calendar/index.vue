<template>
    <DemoPage :title="title" :desc="text('单个或范围日期选择，支持农历与节日。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-calendar-showcase">
                <text class="demo-variant-title">{{ isEnglish ? 'Live preview' : '实时预览' }}</text>
                <snake-button type="primary" :custom-style="{ width: '240rpx' }" @click="calendarShow = true">
                    {{ text('打开日历') }}
                </snake-button>
                <text class="demo-variant-sub">{{ text('选择结果') }}：{{ lastResult }}</text>
                <snake-calendar
                    v-model="calendarShow"
                    :mode="String(state.cMode)"
                    :show-lunar="Boolean(state.cShowLunar)"
                    :show-festival="Boolean(state.cShowFestival)"
                    :festivals="Boolean(state.cShowFestival) ? demoFestivals : {}"
                    :min-date="String(state.cMinDate)"
                    :max-date="String(state.cMaxDate)"
                    :active-bg-color="String(state.cActiveColor)"
                    :range-color="String(state.cActiveColor)"
                    :readonly="Boolean(state.cReadonly)"
                    :closeable="Boolean(state.cCloseable)"
                    :mask-close-able="Boolean(state.cMaskClose)"
                    :default-select-today="Boolean(state.cDefaultToday)"
                    @change="onCalendarChange"
                    @close="calendarShow = false"
                />
                <view class="demo-calendar-inline-toggle">
                    <text class="demo-variant-title">{{ text('嵌入页面的日历') }}</text>
                    <snake-button size="small" plain @click="inlineVisible = !inlineVisible">
                        {{ inlineVisible ? text('收起日历') : text('展开日历') }}
                    </snake-button>
                </view>
                <snake-calendar
                    v-if="inlineVisible"
                    is-page
                    :show-lunar="true"
                    :show-festival="Boolean(state.cShowFestival)"
                    :festivals="Boolean(state.cShowFestival) ? demoFestivals : {}"
                    :mode="'range'"
                    :default-select-today="false"
                    :closeable="false"
                    @change="onCalendarChange"
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

const { localeName, text } = useDemoLocale();
const isEnglish = computed(() => localeName.value === 'en-US');
const calendarShow = ref(false);
const inlineVisible = ref(false);
const lastResult = ref('—');
const demoFestivals = computed(() => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return { [`${now.getFullYear()}-${month}-01`]: isEnglish.value ? 'Demo day' : '示例日' };
});
const controls: DemoControl[] = [
    {
        key: 'cMode',
        label: '选择模式',
        type: 'select',
        defaultValue: 'date',
        options: [
            { label: '单个日期', value: 'date' },
            { label: '日期范围', value: 'range' }
        ]
    },
    { key: 'cShowLunar', label: '显示农历', type: 'switch', defaultValue: true },
    { key: 'cShowFestival', label: '显示节日', type: 'switch', defaultValue: false },
    { key: 'cMinDate', label: '最小日期', type: 'input', defaultValue: '2026-01-01', placeholder: 'YYYY-MM-DD' },
    { key: 'cMaxDate', label: '最大日期', type: 'input', defaultValue: '2026-12-31', placeholder: 'YYYY-MM-DD' },
    {
        key: 'cActiveColor',
        label: '激活颜色',
        type: 'select',
        defaultValue: '#06D290',
        options: [
            { label: '品牌绿', value: '#06D290' },
            { label: '蓝色', value: '#2563eb' },
            { label: '橙色', value: '#FF6A0C' }
        ]
    },
    { key: 'cReadonly', label: '只读状态', type: 'switch', defaultValue: false },
    { key: 'cCloseable', label: '显示关闭图标', type: 'switch', defaultValue: true },
    { key: 'cMaskClose', label: '点击遮罩关闭', type: 'switch', defaultValue: true },
    { key: 'cDefaultToday', label: '默认选中今天', type: 'switch', defaultValue: true }
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
    return demoTitle('calendar', '日历');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
}
function onCalendarChange(value: { result?: string; startDate?: string; endDate?: string }) {
    lastResult.value = value.result || `${value.startDate || ''} ~ ${value.endDate || ''}`;
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
.demo-calendar-inline-toggle {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
