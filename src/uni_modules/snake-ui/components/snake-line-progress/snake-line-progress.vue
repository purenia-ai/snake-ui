<template>
    <view
        class="snake-line-progress"
        :style="{ borderRadius: round ? '50px' : '0', height: $snake.addUnit(height), backgroundColor: inactiveColor }"
    >
        <view
            :class="[
                type ? `snake-line-progress__active--${type}` : '',
                striped ? 'snake-line-progress__active--striped' : '',
                striped && stripedActive ? 'snake-line-progress__active--striped-active' : ''
            ]"
            class="snake-line-progress__active"
            :style="progressStyle"
        >
            <slot v-if="slots.default" />
            <text class="snake-line-progress__percent" v-else-if="showPercent">{{ Math.round(safePercent) }}%</text>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component LineProgress
 * @description 线形进度条，用于展示操作或任务的当前进度，支持主题色预设、条纹与百分比展示。
 * @see /components/line-progress
 */

import { computed, useSlots } from 'vue';
import { lineProgressProps } from './types';

defineOptions({ name: 'LineProgress', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(lineProgressProps);
const slots = useSlots();

/** 百分比钳制在 0-100，非法输入回退 0（宽度与文字共用同一口径）。 */
const safePercent = computed(() => {
    const value = Number(props.percent);
    if (!Number.isFinite(value)) return 0;
    return Math.min(100, Math.max(0, value));
});

/** 激活部分的宽度与颜色，主题预设优先于 activeColor。 */
const progressStyle = computed(() => {
    const style: Record<string, string> = {};
    style.width = `${safePercent.value}%`;
    if (!props.type && props.activeColor) style.backgroundColor = props.activeColor;
    return style;
});
</script>

<style scoped>
.snake-line-progress {
    display: inline-flex;
    overflow: hidden;
    align-items: center;
    width: 100%;
    border-radius: 50px;
}
.snake-line-progress__active {
    display: flex;
    width: 0;
    height: 100%;
    align-items: center;
    justify-content: space-around;
    font-size: 10px;
    color: var(--snake-color-white, #fff);
    transition:
        width 0.4s ease,
        background-color 0.4s ease;
}
.snake-line-progress__active--primary {
    background-color: var(--snake-color-primary, #06d290);
}
.snake-line-progress__active--success {
    background-color: var(--snake-color-success, #19be6b);
}
.snake-line-progress__active--warning {
    background-color: var(--snake-color-warning, #ff9900);
}
.snake-line-progress__active--error {
    background-color: var(--snake-color-error, #fa3534);
}
.snake-line-progress__active--info {
    background-color: var(--snake-color-info, #909399);
}
.snake-line-progress__active--striped {
    background-image: linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.15) 25%,
        transparent 25%,
        transparent 50%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.15) 75%,
        transparent 75%,
        transparent
    );
    background-size: 39px 39px;
}
.snake-line-progress__active--striped-active {
    animation: snake-line-progress-stripes 2s linear infinite;
}
.snake-line-progress__percent {
    padding: 0 5px;
    color: var(--snake-color-text-light, #c0c4cc);
}
@keyframes snake-line-progress-stripes {
    0% {
        background-position: 0 0;
    }
    100% {
        background-position: 39px 0;
    }
}
</style>
