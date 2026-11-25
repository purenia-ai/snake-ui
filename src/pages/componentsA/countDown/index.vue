<template>
    <DemoPage :title="title" :desc="text('用于活动截止等场景的倒计时，通过数字变化给用户明确的时间感受。')">
        <DemoSection variant="preview" :title="text('演示效果')">
            <view class="demo-stack demo-countdown-showcase">
                <snake-count-down
                    ref="heroRef"
                    :timestamp="durationSeconds"
                    :autoplay="Boolean(state.cAutoPlay)"
                    :separator="state.cSeparator"
                    :show-days="Boolean(state.cShowDays)"
                    :show-hours="Boolean(state.cShowHours)"
                    :show-minutes="Boolean(state.cShowMinutes)"
                    :show-seconds="Boolean(state.cShowSeconds)"
                    :hide-zero-day="Boolean(state.cHideZeroDay)"
                    :show-border="Boolean(state.cShowBorder)"
                    :font-size="state.cFontSize"
                    border-color="#06D290"
                    color="#06D290"
                    bg-color="#06D2901A"
                    height="56"
                    @change="onHeroChange"
                    @end="onHeroEnd"
                />
                <view class="demo-countdown-meta">
                    <text class="demo-countdown-meta__status">{{ statusText }}</text>
                    <text>{{ text('剩余') }} {{ restSeconds }}s</text>
                </view>
                <view class="demo-countdown-actions">
                    <snake-button size="mini" custom-style="width: auto" :disabled="running" @click="startHero">
                        {{ text('开始') }}
                    </snake-button>
                    <snake-button size="mini" custom-style="width: auto" :disabled="!running" @click="pauseHero">
                        {{ text('暂停') }}
                    </snake-button>
                    <snake-button size="mini" custom-style="width: auto" @click="resetHero">
                        {{ text('重设') }}
                    </snake-button>
                </view>
                <text class="demo-variant-sub">
                    {{
                        text('暂停后再点开始会接着剩余时间走；重设回到上面配置的剩余秒数，自动开始打开时重设即重新起表')
                    }}
                </text>
            </view>
        </DemoSection>

        <DemoSection variant="preview" :title="text('分隔符与单位')">
            <view class="demo-countdown-grid">
                <view class="demo-countdown-cell">
                    <text class="demo-countdown-cell__title">{{ text('冒号') }}</text>
                    <snake-count-down
                        :timestamp="durationSeconds"
                        font-size="17"
                        height="30"
                        show-border
                        border-color="#E4E7ED"
                        bg-color="#F6F6F6"
                        color="#303133"
                    />
                </view>
                <view class="demo-countdown-cell">
                    <text class="demo-countdown-cell__title">{{ text('中文单位') }}</text>
                    <snake-count-down
                        :timestamp="durationSeconds"
                        separator="zh"
                        font-size="17"
                        height="30"
                        show-border
                        border-color="#E4E7ED"
                        bg-color="#F6F6F6"
                        color="#303133"
                        separator-color="#909399"
                    />
                </view>
                <view class="demo-countdown-cell">
                    <text class="demo-countdown-cell__title">{{ text('隐藏天') }}</text>
                    <snake-count-down
                        :timestamp="durationSeconds"
                        :show-days="false"
                        font-size="17"
                        height="30"
                        show-border
                        border-color="#E4E7ED"
                        bg-color="#F6F6F6"
                        color="#303133"
                    />
                </view>
                <view class="demo-countdown-cell">
                    <text class="demo-countdown-cell__title">{{ text('只留分秒') }}</text>
                    <snake-count-down
                        :timestamp="durationSeconds"
                        :show-days="false"
                        :show-hours="false"
                        font-size="17"
                        height="30"
                        show-border
                        border-color="#E4E7ED"
                        bg-color="#F6F6F6"
                        color="#303133"
                    />
                </view>
            </view>
            <text class="demo-variant-sub demo-countdown-note">
                {{ text('隐藏的单位会折算进下一级：关掉天后小时累加，关掉小时后分钟累加') }}
            </text>
        </DemoSection>

        <DemoSection variant="preview" :title="text('数字块样式')">
            <view class="demo-countdown-rows">
                <view class="demo-countdown-row">
                    <text class="demo-countdown-row__title">{{ text('纯文字') }}</text>
                    <snake-count-down :timestamp="durationSeconds" bg-color="transparent" font-size="15" />
                </view>
                <view class="demo-countdown-row">
                    <text class="demo-countdown-row__title">{{ text('浅色块') }}</text>
                    <snake-count-down
                        :timestamp="durationSeconds"
                        height="32"
                        font-size="14"
                        bg-color="#F6F6F6"
                        color="#606266"
                        separator-color="#909399"
                    />
                </view>
                <view class="demo-countdown-row">
                    <text class="demo-countdown-row__title">{{ text('实心块') }}</text>
                    <snake-count-down
                        :timestamp="durationSeconds"
                        height="32"
                        font-size="14"
                        bg-color="#06D290"
                        color="#FFFFFF"
                        separator-color="#06D290"
                    />
                </view>
            </view>
        </DemoSection>

        <DemoSection variant="controls" :title="text('参数配置')">
            <DemoControlPanel :controls="localizedControls" :values="state" @change="updateValue" />
        </DemoSection>
    </DemoPage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { demoState, setDemoValue } from '../../../common/demo-state';
import { demoTitle, localizeDemoControls, useDemoLocale } from '../../../common/demo-i18n';
import type { DemoControl, DemoValue } from '../../../common/demo-types';
import DemoControlPanel from '../../../components/demo-control-panel/demo-control-panel.vue';
import DemoPage from '../../../components/demo-page/demo-page.vue';
import DemoSection from '../../../components/demo-section/demo-section.vue';
import type { CountDownExpose } from '../../../uni_modules/snake-ui/components/snake-count-down/types';

const { text } = useDemoLocale();

/** 预览区的初始时长：一天多一点，天、时、分、秒四位都能看到真实变化。 */
const DEFAULT_SECONDS = 93784;

const heroRef = ref<CountDownExpose | null>(null);
/** 页面上展示的运行状态，跟随组件的事件与按钮操作同步。 */
const running = ref(true);
const paused = ref(false);
const finished = ref(false);
const restSeconds = ref(DEFAULT_SECONDS);

const controls = [
    {
        key: 'cTimestamp',
        label: '剩余秒数',
        type: 'input',
        defaultValue: String(DEFAULT_SECONDS),
        placeholder: 'seconds'
    },
    { key: 'cAutoPlay', label: '自动开始', type: 'switch', defaultValue: true },
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
    { key: 'cShowBorder', label: '数字边框', type: 'switch', defaultValue: false },
    { key: 'cFontSize', label: '数字字号', type: 'slider', defaultValue: 20, min: 12, max: 28, step: 1, unit: 'px' }
] as const satisfies readonly DemoControl[];
const state = demoState(controls);

const durationSeconds = computed(() => {
    const seconds = Number(state.cTimestamp);
    return Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
});
const localizedControls = computed(() => localizeDemoControls(controls));
const title = computed(() => demoTitle('count-down', '倒计时'));
const statusText = computed(() => {
    if (running.value) return text('计时中');
    if (finished.value) return text('已结束');
    if (paused.value) return text('已暂停');
    return text('待开始');
});

function updateValue(key: string, value: DemoValue) {
    setDemoValue(state, key, value);
    if (key !== 'cTimestamp') return;
    // 组件在 timestamp 变化时按「正在计时或 autoplay 打开」决定是否重新起表，这里同步页面状态
    const next = durationSeconds.value;
    restSeconds.value = next;
    finished.value = next === 0;
    paused.value = false;
    running.value = next > 0 && (running.value || Boolean(state.cAutoPlay));
}
function startHero() {
    heroRef.value?.start();
    if (durationSeconds.value > 0) {
        running.value = true;
        paused.value = false;
        finished.value = false;
    }
}
function pauseHero() {
    heroRef.value?.pause();
    running.value = false;
    paused.value = true;
}
function resetHero() {
    heroRef.value?.reset();
    const next = durationSeconds.value;
    restSeconds.value = next;
    finished.value = next === 0;
    paused.value = false;
    // reset 只在 autoplay 为真时才重新起表
    running.value = next > 0 && Boolean(state.cAutoPlay);
}
function onHeroChange(seconds: number) {
    restSeconds.value = seconds;
    if (seconds > 0) finished.value = false;
}
function onHeroEnd() {
    running.value = false;
    paused.value = false;
    finished.value = true;
    restSeconds.value = 0;
}
</script>

<style scoped>
.demo-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-countdown-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: var(--snake-color-text-muted);
}
.demo-countdown-meta__status {
    padding: 2px 8px;
    border-radius: 10px;
    background-color: var(--snake-color-primary-light);
    color: var(--snake-color-primary);
    font-size: 12px;
    line-height: 1.5;
}
.demo-countdown-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.demo-countdown-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
}
.demo-countdown-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
}
.demo-countdown-cell__title {
    font-size: 12px;
    line-height: 1.4;
    color: var(--snake-color-text-secondary);
}
.demo-countdown-note {
    display: block;
    margin-top: 12px;
}
.demo-countdown-rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.demo-countdown-row {
    display: flex;
    align-items: center;
    gap: 12px;
}
.demo-countdown-row__title {
    flex: none;
    width: 56px;
    font-size: 12px;
    line-height: 1.4;
    color: var(--snake-color-text-secondary);
}
</style>
