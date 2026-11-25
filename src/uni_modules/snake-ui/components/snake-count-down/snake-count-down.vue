<template>
    <view class="snake-countdown" :class="customClass" :style="customStyle">
        <view class="snake-countdown__item" :style="itemStyle" v-if="showDays && (!hideZeroDay || d !== '00')">
            <view class="snake-countdown__time" :style="letterStyle">
                {{ d }}
            </view>
        </view>
        <view
            class="snake-countdown__colon"
            :class="{ 'snake-countdown__colon--offset': separator === 'colon' }"
            :style="separatorStyle"
            v-if="showDays && (!hideZeroDay || d !== '00')"
        >
            {{ separator === 'colon' && showHours ? ':' : t('day') }}
        </view>
        <view class="snake-countdown__item" :style="itemStyle" v-if="showHours">
            <view class="snake-countdown__time" :style="letterStyle">
                {{ h }}
            </view>
        </view>
        <view
            class="snake-countdown__colon"
            :class="{ 'snake-countdown__colon--offset': separator === 'colon' }"
            :style="separatorStyle"
            v-if="showHours"
        >
            {{ separator === 'colon' && showMinutes ? ':' : t('hour') }}
        </view>
        <view class="snake-countdown__item" :style="itemStyle" v-if="showMinutes">
            <view class="snake-countdown__time" :style="letterStyle">
                {{ i }}
            </view>
        </view>
        <view
            class="snake-countdown__colon"
            :class="{ 'snake-countdown__colon--offset': separator === 'colon' }"
            :style="separatorStyle"
            v-if="showMinutes"
        >
            {{ separator === 'colon' && showSeconds ? ':' : t('minute') }}
        </view>
        <view class="snake-countdown__item" :style="itemStyle" v-if="showSeconds">
            <view class="snake-countdown__time" :style="letterStyle">
                {{ s }}
            </view>
        </view>
        <view class="snake-countdown__colon" :style="separatorStyle" v-if="showSeconds && separator === 'zh'">
            {{ t('second') }}
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component CountDown
 * @description 倒计时组件，用于活动截止等场景，通过数字变化给用户明确的时间感受；支持时分秒显示开关、分隔符形态与样式定制。
 * @see /components/count-down
 */

import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useLocale } from '../../libs/hooks/useLocale';
import { countDownProps } from './types';
import type { CountDownEmits, CountDownExpose } from './types';

defineOptions({ name: 'CountDown', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(countDownProps);
const emit = defineEmits<CountDownEmits>();
const { t } = useLocale('countDown');

const d = ref('00'); // 天
const h = ref('00'); // 小时
const i = ref('00'); // 分钟
const s = ref('00'); // 秒
/** 展示中的剩余整秒，用于判断定时器本轮是否真的跨过了一秒。 */
const seconds = ref(0);

/** 定时器句柄，不需要响应式。 */
let timer: ReturnType<typeof setInterval> | null = null;
/** 运行中的结束时刻（毫秒时间戳）。 */
let endAt = 0;
/** 暂停时保留的剩余毫秒，再次开始时从这里续上。 */
let remainMs = 0;
/** 当前是否正在计时。 */
let running = false;

/** 数字块（时分秒部分）的样式。 */
const itemStyle = computed(() => {
    const style: Record<string, string> = {};
    if (props.height) {
        style.height = uni.$snake.addUnit(props.height);
        // 用 min-width 而不是 width：小时/分钟进位到三位（如 26:03:04）时数字块能撑开，不会被压扁
        style.minWidth = uni.$snake.addUnit(props.height);
    }
    if (props.showBorder) {
        style.borderStyle = 'solid';
        style.borderColor = props.borderColor;
        style.borderWidth = '1px';
    }
    if (props.bgColor) {
        style.backgroundColor = props.bgColor;
    }
    return style;
});

/** 数字文字的样式。 */
const letterStyle = computed(() => {
    const style: Record<string, string> = {};
    if (props.fontSize) style.fontSize = uni.$snake.addUnit(props.fontSize);
    if (props.color) style.color = props.color;
    return style;
});

/** 分隔符的样式；冒号的视觉基线靠 snake-countdown__colon--offset 下移，中文单位不用。 */
const separatorStyle = computed(() => ({
    fontSize: uni.$snake.addUnit(props.separatorSize),
    color: props.separatorColor
}));

// timestamp 变化：运行中的倒计时按新时长重来，未开始的只更新展示，不替调用方启动
watch(
    () => props.timestamp,
    () => {
        const wasRunning = running;
        running = false;
        remainMs = 0;
        clearTimer();
        if (wasRunning || props.autoplay) start();
        else apply(Math.ceil(totalMs() / 1000));
    }
);

// 显示单位切换后立即按新组合重排，不用等下一秒
watch(
    () => [props.showDays, props.showHours, props.showMinutes, props.showSeconds],
    () => formatTime(seconds.value)
);

onMounted(() => {
    if (props.autoplay) start();
});
onBeforeUnmount(clearTimer);

/**
 * 开始倒计时；暂停后再次调用会从剩余时间继续。
 */
function start() {
    if (running) return;
    // 起表前先清一遍：万一 running 与定时器不同步，重复 setInterval 只会有一个被清掉，等于漏一个定时器
    clearTimer();
    const remaining = remainMs > 0 ? remainMs : totalMs();
    remainMs = 0;
    if (remaining <= 0) {
        apply(0);
        return;
    }
    // 记目标时刻而不是每次减一：页面被挂起或定时器被节流后，下一轮会自动追平，不会越走越慢
    endAt = Date.now() + remaining;
    running = true;
    apply(Math.ceil(remaining / 1000));
    timer = setInterval(tick, 1000);
}

/**
 * 暂停倒计时，保留剩余时间，不触发 end 事件。
 */
function pause() {
    if (!running) return;
    remainMs = Math.max(0, endAt - Date.now());
    running = false;
    clearTimer();
    apply(Math.ceil(remainMs / 1000));
}

/**
 * 重设到 timestamp 指定的时长；autoplay 为真时立即重新开始。
 */
function reset() {
    running = false;
    remainMs = 0;
    clearTimer();
    apply(Math.ceil(totalMs() / 1000));
    if (props.autoplay) start();
}

/**
 * 提前结束倒计时，归零并触发 end 事件。
 */
function end() {
    running = false;
    remainMs = 0;
    clearTimer();
    apply(0);
    emit('end');
}

/**
 * 静默停止倒计时：清掉计时任务但不触发 end，适用于父组件切换场景或业务主动销毁。
 */
function destroy() {
    running = false;
    remainMs = 0;
    clearTimer();
}

/** 定时器每一轮：用结束时刻反推剩余时间。 */
function tick() {
    const remaining = endAt - Date.now();
    if (remaining <= 0) {
        end();
        return;
    }
    apply(Math.ceil(remaining / 1000));
}

/** timestamp 换算成毫秒，非法值按 0 处理。 */
function totalMs() {
    const total = Number(props.timestamp);
    return Number.isFinite(total) && total > 0 ? Math.ceil(total * 1000) : 0;
}

/**
 * 渲染剩余整秒；只有值真的变化时才派发 change。
 */
function apply(next: number) {
    const changed = next !== seconds.value;
    seconds.value = next;
    formatTime(next);
    if (changed) emit('change', next);
}

/**
 * 把剩余整秒拆成天/时/分/秒四个展示片段。
 *
 * 隐藏的单位会折算给下一级：关掉「天」小时累加，关掉「小时」分钟累加，
 * 所以只显示分秒时也不会把小时数丢掉。
 */
function formatTime(totalSeconds: number) {
    let rest = Math.max(0, Math.floor(totalSeconds));
    const dayNum = props.showDays ? Math.floor(rest / 86400) : 0;
    rest -= dayNum * 86400;
    const hourNum = props.showHours ? Math.floor(rest / 3600) : 0;
    rest -= hourNum * 3600;
    const minuteNum = props.showMinutes ? Math.floor(rest / 60) : 0;
    rest -= minuteNum * 60;
    const secondNum = props.showSeconds ? rest : 0;
    d.value = padZero(dayNum);
    h.value = padZero(hourNum);
    i.value = padZero(minuteNum);
    s.value = padZero(secondNum);
}

/** 补零到两位。 */
function padZero(value: number) {
    return value < 10 ? `0${value}` : String(value);
}

/** 清除定时器；用 !== null 判断，避免某些运行时把句柄返回成 0 时漏清。 */
function clearTimer() {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }
}

defineExpose<CountDownExpose>({
    start,
    pause,
    reset,
    end,
    destroy
});
</script>

<style scoped>
.snake-countdown {
    display: inline-flex;
    align-items: center;
}
.snake-countdown__item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px;
    border-radius: 3px;
    white-space: nowrap;
    transform: translateZ(0);
}
.snake-countdown__time {
    margin: 0;
    padding: 0;
    line-height: 1;
    /* 等宽数字：每秒变化时数字块宽度不抖动 */
    font-variant-numeric: tabular-nums;
    font-feature-settings: 'tnum';
}
.snake-countdown__colon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 2.5px;
    line-height: 1;
}
/* 冒号字形重心偏下，下移 2px 才和数字块视觉居中；中文单位不需要 */
.snake-countdown__colon--offset {
    padding-bottom: 2px;
}
</style>
