<template>
    <view
        class="snake-skeleton-item"
        :class="[`snake-skeleton-item--${variant}`, `snake-skeleton-item--animation-${resolvedAnimation}`]"
        :style="itemStyle"
        aria-hidden="true"
    />
</template>

<script setup lang="ts">
/**
 * @component SkeletonItem
 * @description 用于组合自定义骨架模板的基础占位单元。
 * @see /components/skeleton
 */

import { computed, inject, type CSSProperties } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { SNAKE_SKELETON_CONTEXT, type SkeletonItemProps } from './types';
import type { SkeletonAnimation } from '../snake-skeleton/types';

defineOptions({ name: 'SkeletonItem', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SkeletonItemProps>(), {
    variant: 'text',
    size: undefined,
    width: undefined,
    height: undefined,
    radius: undefined,
    animated: undefined,
    animation: undefined,
    customStyle: ''
});

const context = inject(SNAKE_SKELETON_CONTEXT, undefined);

/**
 * 动画优先级：`animation` > `animated` > 容器上下文 > 默认 `shimmer`。
 * 显式 `animated=true` 可以在容器关掉动画时单独开启一项。
 */
const resolvedAnimation = computed<SkeletonAnimation>(() => {
    if (props.animation) return props.animation;
    if (props.animated === false) return 'none';
    if (props.animated === true) return 'shimmer';
    return context?.animation.value ?? 'shimmer';
});

// 只给显式传入的尺寸写内联样式：未传时由形态类名读取主题变量，
// 这样业务不写 props 也能通过 --snake-skeleton-* 统一改占位块尺寸。
const itemStyle = computed(() => {
    const style: CSSProperties = {};
    if (props.size !== undefined) {
        style.width = addUnit(props.size);
        style.height = addUnit(props.size);
    }
    if (props.width !== undefined) style.width = addUnit(props.width);
    if (props.height !== undefined) style.height = addUnit(props.height);
    if (props.radius !== undefined) style.borderRadius = addUnit(props.radius);
    return [style, props.customStyle];
});
</script>

<style scoped>
/*
 * 占位色取主题的 muted 表面色（浅色 #F1F1F1 / 暗色 #1A1A1A），
 * 与主流移动端组件库的 #F1F2F4 / #E5E6EB 同一量级：实色随主题走，
 * 不再用半透明灰叠在任意底色上（深色下会偏亮、浅色页底上又会糊成一片）。
 * 业务仍可通过 --snake-skeleton-color / --snake-skeleton-highlight 覆盖。
 */
.snake-skeleton-item {
    box-sizing: border-box;
    flex: none;
    overflow: hidden;
    background-color: var(--snake-skeleton-color, var(--snake-color-surface-muted, #f1f1f1));
}
.snake-skeleton-item--text {
    width: 100%;
    height: var(--snake-skeleton-text-height, 16px);
    border-radius: var(--snake-skeleton-text-radius, 4px);
}
.snake-skeleton-item--rect,
.snake-skeleton-item--image {
    width: 100%;
    height: var(--snake-skeleton-rect-height, 100px);
    border-radius: var(--snake-skeleton-rect-radius, 8px);
}
.snake-skeleton-item--circle {
    width: var(--snake-skeleton-circle-size, 32px);
    height: var(--snake-skeleton-circle-size, 32px);
    border-radius: var(--snake-skeleton-circle-radius, 50%);
}
/*
 * 流光用「透明 → 高亮 → 透明」的叠加带，底色仍是 background-color：
 * 高亮取中灰的半透明，浅色底上扫出更深的带（对齐 uView 的 #E6E6E6），
 * 深色底上扫出更亮的带（对齐 wot-ui 的 #F7F8FA），一套值吃明暗两套主题。
 */
.snake-skeleton-item--animation-shimmer {
    background-image: linear-gradient(
        90deg,
        transparent 25%,
        var(--snake-skeleton-highlight, rgba(120, 120, 130, 0.12)) 37%,
        transparent 63%
    );
    background-size: 400% 100%;
    animation: snake-skeleton-shimmer var(--snake-skeleton-shimmer-duration, 1.8s) ease infinite;
}
.snake-skeleton-item--animation-pulse {
    animation: snake-skeleton-pulse var(--snake-skeleton-pulse-duration, 2s) ease-in-out infinite;
}
@keyframes snake-skeleton-shimmer {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
@keyframes snake-skeleton-pulse {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.45;
    }
}
/* 系统开启「减少动态效果」时既不播放动画，也不留一块静止的高亮带。 */
@media (prefers-reduced-motion: reduce) {
    .snake-skeleton-item--animation-shimmer,
    .snake-skeleton-item--animation-pulse {
        animation: none;
    }
    .snake-skeleton-item--animation-shimmer {
        background-image: none;
    }
}
</style>
