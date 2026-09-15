<template>
    <view v-if="show" class="snake-loading" :class="[`snake-loading--${direction}`, customClass]" :style="rootStyle">
        <view class="snake-loading__spinner" :class="`snake-loading__spinner--${type}`" :style="spinnerStyle">
            <view v-if="type === 'circular'" class="snake-loading__spinner-wrapper" />
            <view v-else-if="type === 'spinner'" class="snake-loading__spinner-wrapper">
                <view v-for="index in spinnerDots" :key="index" class="snake-loading__spinner-dot" />
            </view>
            <view v-else-if="type === 'dots'" class="snake-loading__spinner-wrapper">
                <view v-for="index in 3" :key="index" class="snake-loading__spinner-dot" />
            </view>
            <view v-else class="snake-loading__spinner-wrapper">
                <view v-for="index in 4" :key="index" class="snake-loading__wave-bar"><view /></view>
            </view>
        </view>
        <view v-if="$slots.default || text" class="snake-loading__text" :style="textStyle">
            <slot>{{ text }}</slot>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Loading
 * @description Renders a reusable loading indicator for feedback states.
 * @see /components/loading
 */
import { computed, type CSSProperties } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { LoadingProps } from './types';

defineOptions({ name: 'SnakeLoading', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<LoadingProps>(), {
    show: true,
    type: 'circular',
    color: 'var(--snake-color-primary, #06D290)',
    size: 34,
    text: '',
    textColor: 'var(--snake-color-text-muted, #909399)',
    textSize: 14,
    direction: 'vertical',
    inheritColor: false,
    duration: 800,
    customClass: '',
    customStyle: ''
});

const spinnerDots = Array.from({ length: 12 }, (_, index) => index + 1);
const rootStyle = computed(() => [
    { color: props.inheritColor ? 'inherit' : props.color } as CSSProperties,
    props.customStyle
]);
const spinnerStyle = computed(() => ({
    width: addUnit(props.size),
    height: addUnit(props.size),
    '--snake-loading-duration': `${props.duration}ms`
}));
const textStyle = computed(() => ({ color: props.textColor, fontSize: addUnit(props.textSize) }));
</script>

<style scoped>
.snake-loading {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}
.snake-loading--horizontal {
    flex-direction: row;
}
.snake-loading--vertical {
    flex-direction: column;
}
.snake-loading__spinner {
    position: relative;
    box-sizing: border-box;
    flex: none;
    animation: snake-loading-rotate var(--snake-loading-duration) linear infinite;
}
.snake-loading__spinner-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
.snake-loading__spinner--circular .snake-loading__spinner-wrapper {
    border-radius: 50%;
    background: conic-gradient(transparent 0deg 90deg, currentColor 330deg 360deg);
    -webkit-mask: radial-gradient(closest-side, transparent calc(100% - 15%), #000 calc(100% - 15%));
    mask: radial-gradient(closest-side, transparent calc(100% - 15%), #000 calc(100% - 15%));
}
.snake-loading__spinner--spinner {
    animation-timing-function: steps(12);
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: rotate(calc((var(--index) - 1) * 30deg));
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot::before {
    display: block;
    width: 10%;
    height: 25%;
    margin: 0 auto;
    border-radius: 999px;
    background: currentColor;
    content: '';
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(1) {
    --index: 1;
    opacity: 1;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(2) {
    --index: 2;
    opacity: 0.94;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(3) {
    --index: 3;
    opacity: 0.88;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(4) {
    --index: 4;
    opacity: 0.81;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(5) {
    --index: 5;
    opacity: 0.75;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(6) {
    --index: 6;
    opacity: 0.69;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(7) {
    --index: 7;
    opacity: 0.63;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(8) {
    --index: 8;
    opacity: 0.56;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(9) {
    --index: 9;
    opacity: 0.5;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(10) {
    --index: 10;
    opacity: 0.44;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(11) {
    --index: 11;
    opacity: 0.38;
}
.snake-loading__spinner--spinner .snake-loading__spinner-dot:nth-child(12) {
    --index: 12;
    opacity: 0.31;
}
.snake-loading__spinner--dots {
    animation: none;
}
.snake-loading__spinner--dots .snake-loading__spinner-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.snake-loading__spinner--dots .snake-loading__spinner-dot {
    width: 20%;
    height: 20%;
    border-radius: 50%;
    background: currentColor;
    animation: snake-loading-dot var(--snake-loading-duration) linear infinite both;
}
.snake-loading__spinner--dots .snake-loading__spinner-dot:nth-child(2) {
    animation-delay: calc(var(--snake-loading-duration) / 3);
}
.snake-loading__spinner--dots .snake-loading__spinner-dot:nth-child(3) {
    animation-delay: calc(var(--snake-loading-duration) * 2 / 3);
}
.snake-loading__spinner--wave {
    animation: none;
}
.snake-loading__spinner--wave .snake-loading__spinner-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6.25%;
}
.snake-loading__wave-bar {
    display: flex;
    align-items: center;
    width: 12.5%;
    height: 83.33%;
}
.snake-loading__wave-bar > view {
    width: 100%;
    border-radius: 999px;
    background: currentColor;
    animation: snake-loading-wave var(--snake-loading-duration) ease-in-out infinite alternate;
}
.snake-loading__wave-bar:nth-child(2) > view {
    animation-delay: calc(var(--snake-loading-duration) / -4);
}
.snake-loading__wave-bar:nth-child(3) > view {
    animation-delay: calc(var(--snake-loading-duration) / -2);
}
.snake-loading__wave-bar:nth-child(4) > view {
    animation-delay: calc(var(--snake-loading-duration) * -3 / 4);
}
.snake-loading__text {
    line-height: 1.4;
}
.snake-loading--horizontal .snake-loading__text {
    margin-left: 12rpx;
}
.snake-loading--vertical .snake-loading__text {
    margin-top: 12rpx;
}
@keyframes snake-loading-rotate {
    to {
        transform: rotate(360deg);
    }
}
@keyframes snake-loading-dot {
    0%,
    100% {
        opacity: 0.15;
    }
    33% {
        opacity: 1;
    }
}
@keyframes snake-loading-wave {
    from {
        height: 20%;
    }
    to {
        height: 100%;
    }
}
</style>
