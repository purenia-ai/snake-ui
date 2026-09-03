<script setup lang="ts">
/**
 * @component SnakeLoadingIcon
 * @description 统一的加载状态组件，供 Button、Image 以及业务页面复用，支持圆环和花朵两种形态。
 * @see /components/loading-icon
 */

import { computed, type CSSProperties } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { SnakeLoadingIconProps } from './types';

defineOptions({ name: 'SnakeLoadingIcon', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeLoadingIconProps>(), {
    show: true,
    mode: 'circle',
    color: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-border, #dcdfe6)',
    size: 20,
    text: '',
    textColor: 'var(--snake-color-text-muted, #707184)',
    textSize: 14,
    vertical: false,
    timingFunction: 'linear',
    duration: 1000,
    customStyle: ''
});

const rootStyle = computed(() => [
    { flexDirection: props.vertical ? 'column' : 'row' } as CSSProperties,
    props.customStyle
]);
const iconStyle = computed(() => ({
    width: addUnit(props.size),
    height: addUnit(props.size),
    color: props.color,
    borderColor: props.inactiveColor,
    borderTopColor: props.color,
    animationDuration: `${props.duration}ms`,
    animationTimingFunction: props.timingFunction
}));
const textStyle = computed(() => ({
    color: props.textColor,
    fontSize: addUnit(props.textSize),
    marginLeft: props.vertical ? 0 : '12rpx',
    marginTop: props.vertical ? '12rpx' : 0
}));
</script>

<template>
    <view v-if="show" class="snake-loading-icon" :style="rootStyle">
        <view v-if="mode === 'circle'" class="snake-loading-icon__circle" :style="iconStyle" />
        <view v-else class="snake-loading-icon__spinner" :style="iconStyle">
            <view
                v-for="index in 12"
                :key="index"
                class="snake-loading-icon__dot"
                :style="{ transform: `rotate(${index * 30}deg)`, opacity: index / 12 }"
            />
        </view>
        <text v-if="text" class="snake-loading-icon__text" :style="textStyle">{{ text }}</text>
    </view>
</template>

<style scoped>
.snake-loading-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
}
.snake-loading-icon__circle {
    box-sizing: border-box;
    flex: none;
    border-width: 2px;
    border-style: solid;
    border-radius: 50%;
    animation: snake-loading-rotate 1s linear infinite;
}
.snake-loading-icon__spinner {
    position: relative;
    box-sizing: border-box;
    flex: none;
    animation: snake-loading-rotate 1s linear infinite;
}
.snake-loading-icon__dot {
    position: absolute;
    top: 0;
    left: 50%;
    width: 2px;
    height: 32%;
    margin-left: -1px;
    border-radius: 2px;
    background: currentColor;
    transform-origin: 50% 156%;
}
.snake-loading-icon__text {
    line-height: 1.4;
}
@keyframes snake-loading-rotate {
    to {
        transform: rotate(360deg);
    }
}
</style>
