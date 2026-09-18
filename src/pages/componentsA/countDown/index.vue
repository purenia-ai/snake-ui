<template>
    <DemoPage :title="title" :desc="text('用于活动截止等场景的倒计时，通过数字变化给用户明确的时间感受。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-countdown-showcase">
                <snake-count-down
                    :key="countdownKey"
                    :timestamp="durationSeconds"
                    :separator="String(state.cSeparator)"
                    :show-days="Boolean(state.cShowDays)"
                    :show-hours="Boolean(state.cShowHours)"
                    :show-minutes="Boolean(state.cShowMinutes)"
                    :show-seconds="Boolean(state.cShowSeconds)"
                    :hide-zero-day="Boolean(state.cHideZeroDay)"
                    :show-border="Boolean(state.cShowBorder)"
                    border-color="#06D290"
                    separator-color="#8a8b99"
                    color="#06D290"
                    bg-color="rgba(6, 210, 144, 0.08)"
                    height="56"
                    @end="onEnd"
                    @change="onChange"
                />
                <view class="demo-countdown-showcase__meta">
                    <text>{{ finished ? text('已结束') : `${text('当前剩余')}: ${restSeconds}s` }}</text>
                    <snake-button size="mini" custom-style="width: auto" @click="restart">
                        {{ text('重新开始') }}
                    </snake-button>
                </view>
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
const restSeconds = ref(86461);
const finished = ref(false);
const countdownKey = ref(0);
const controls: DemoControl[] = [
    { key: 'cTimestamp', label: '剩余秒数', type: 'input', defaultValue: '86461', placeholder: 'seconds' },
    {
        key: 'cSeparator',
        label: '分隔符',
        type: 'select',
        defaultValue: 'colon',
        options: [
            { label: '冒号', value: 'colon' },
            { label: '中文单位', value: 'zh' }
        ]
    },
    { key: 'cShowDays', label: '显示天', type: 'switch', defaultValue: true },
    { key: 'cShowHours', label: '显示小时', type: 'switch', defaultValue: true },
    { key: 'cShowMinutes', label: '显示分钟', type: 'switch', defaultValue: true },
    { key: 'cShowSeconds', label: '显示秒', type: 'switch', defaultValue: true },
    { key: 'cHideZeroDay', label: '天为零隐藏', type: 'switch', defaultValue: false },
    { key: 'cShowBorder', label: '数字边框', type: 'switch', defaultValue: false }
];
const state = reactive<Record<string, DemoValue>>(
    Object.fromEntries(controls.map(control => [control.key, control.defaultValue]))
);
const durationSeconds = computed(() => {
    const seconds = Number(state.cTimestamp);
    return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
});
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
    return demoTitle('count-down', '倒计时');
});
function updateValue(key: string, value: DemoValue) {
    state[key] = value;
    if (key === 'cTimestamp') {
        restSeconds.value = durationSeconds.value;
        finished.value = durationSeconds.value === 0;
    }
}
function restart() {
    restSeconds.value = durationSeconds.value;
    finished.value = durationSeconds.value === 0;
    countdownKey.value += 1;
}
function onEnd() {
    finished.value = true;
    restSeconds.value = 0;
}
function onChange(seconds: number) {
    restSeconds.value = seconds;
}
</script>

<style scoped lang="scss">
.demo-countdown-showcase {
    gap: 24rpx;

    &__meta {
        display: flex;
        align-items: center;
        gap: 24rpx;
        font-size: 24rpx;
        color: var(--snake-color-text-muted, #8a8b99);
    }
}
</style>
