<template>
    <view class="snake-countdown" :class="customClass" :style="customStyle">
        <view class="snake-countdown__item" :style="itemStyle" v-if="showDays && (!hideZeroDay || d !== '00')">
            <view class="snake-countdown__time" :style="letterStyle">
                {{ d }}
            </view>
        </view>
        <view
            class="snake-countdown__colon"
            :style="{
                fontSize: separatorSize + 'rpx',
                color: separatorColor,
                paddingBottom: separator === 'colon' ? '4rpx' : 0
            }"
            v-if="showDays && (!hideZeroDay || d !== '00')"
        >
            {{ separator === 'colon' && showHours ? ':' : t('day') }}
        </view>
        <view class="snake-countdown__item" :style="itemStyle" v-if="showHours">
            <view class="snake-countdown__time" :style="{ fontSize: fontSize + 'rpx', color: color }">
                {{ h }}
            </view>
        </view>
        <view
            class="snake-countdown__colon"
            :style="{
                fontSize: separatorSize + 'rpx',
                color: separatorColor,
                paddingBottom: separator === 'colon' ? '4rpx' : 0
            }"
            v-if="showHours"
        >
            {{ separator === 'colon' && showMinutes ? ':' : t('hour') }}
        </view>
        <view class="snake-countdown__item" :style="itemStyle" v-if="showMinutes">
            <view class="snake-countdown__time" :style="{ fontSize: fontSize + 'rpx', color: color }">
                {{ i }}
            </view>
        </view>
        <view
            class="snake-countdown__colon"
            :style="{
                fontSize: separatorSize + 'rpx',
                color: separatorColor,
                paddingBottom: separator === 'colon' ? '4rpx' : 0
            }"
            v-if="showMinutes"
        >
            {{ separator === 'colon' && showSeconds ? ':' : t('minute') }}
        </view>
        <view class="snake-countdown__item" :style="itemStyle" v-if="showSeconds">
            <view class="snake-countdown__time" :style="{ fontSize: fontSize + 'rpx', color: color }">
                {{ s }}
            </view>
        </view>
        <view
            class="snake-countdown__colon"
            :style="{ fontSize: separatorSize + 'rpx', color: separatorColor, paddingBottom: 0 }"
            v-if="showSeconds && separator === 'zh'"
        >
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
const timer = ref<ReturnType<typeof setInterval> | null>(null); // 定时器
const seconds = ref(0);

/** 数字块（时分秒部分）的样式。 */
const itemStyle = computed(() => {
    const style: Record<string, string> = {};
    if (props.height) {
        style.height = props.height + 'rpx';
        style.width = props.height + 'rpx';
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
    if (props.fontSize) style.fontSize = props.fontSize + 'rpx';
    if (props.color) style.color = props.color;
    return style;
});

// 时间戳变化时重新开始倒计时
watch(
    () => props.timestamp,
    () => {
        clearTimer();
        start();
    }
);

onMounted(() => {
    if (props.autoplay && props.timestamp) {
        start();
    }
});
onBeforeUnmount(clearTimer);

/** 开始倒计时。 */
function start() {
    // 避免可能出现的倒计时重叠
    clearTimer();
    if (Number(props.timestamp) <= 0) return;
    seconds.value = Number(props.timestamp);
    formatTime(seconds.value);
    timer.value = setInterval(() => {
        seconds.value--;
        emit('change', seconds.value);
        if (seconds.value < 0) {
            end();
            return;
        }
        formatTime(seconds.value);
    }, 1000);
}

/** 将剩余秒数格式化到 d/h/i/s。 */
function formatTime(sec: number) {
    if (sec <= 0) end();
    const dayNum = Math.floor(sec / (60 * 60 * 24));
    const hourNum = Math.floor(sec / (60 * 60)) - dayNum * 24;
    // 不显示天时，把天的部分折算进小时
    let showHour: string;
    if (props.showDays) {
        showHour = hourNum < 10 ? `0${hourNum}` : String(hourNum);
    } else {
        const hourTotal = Math.floor(sec / (60 * 60));
        showHour = hourTotal < 10 ? `0${hourTotal}` : String(hourTotal);
    }
    const minuteNum = Math.floor(sec / 60) - hourNum * 60 - dayNum * 24 * 60;
    const secondNum = Math.floor(sec) - dayNum * 24 * 60 * 60 - hourNum * 60 * 60 - minuteNum * 60;
    const minute = minuteNum < 10 ? `0${minuteNum}` : String(minuteNum);
    const second = secondNum < 10 ? `0${secondNum}` : String(secondNum);
    const day = dayNum < 10 ? `0${dayNum}` : String(dayNum);
    d.value = day;
    h.value = showHour;
    i.value = minute;
    s.value = second;
}

/** 结束倒计时。 */
function end() {
    clearTimer();
    emit('end');
}

/**
 * 主动停止倒计时，不触发 end 事件。
 * 适用于父组件切换场景或业务主动销毁计时任务。
 */
function destroy() {
    clearTimer();
}

/** 清除定时器。 */
function clearTimer() {
    if (timer.value) {
        clearInterval(timer.value);
        timer.value = null;
    }
}

defineExpose<CountDownExpose>({
    start,
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
    padding: 2rpx;
    border-radius: 6rpx;
    white-space: nowrap;
    transform: translateZ(0);
}
.snake-countdown__time {
    margin: 0;
    padding: 0;
    line-height: 1;
}
.snake-countdown__colon {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 5rpx;
    padding-bottom: 4rpx;
    line-height: 1;
}
</style>
