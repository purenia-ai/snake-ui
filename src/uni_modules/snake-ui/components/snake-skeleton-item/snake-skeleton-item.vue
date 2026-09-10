<script setup lang="ts">
/**
 * @component SkeletonItem
 * @description 用于组合自定义骨架模板的基础占位单元。
 * @see /components/skeleton
 */

import { computed, inject, type CSSProperties } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { SNAKE_SKELETON_CONTEXT, type SkeletonItemProps } from './types';

defineOptions({ name: 'SkeletonItem', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SkeletonItemProps>(), {
    variant: 'text',
    width: undefined,
    height: undefined,
    radius: undefined,
    animated: undefined,
    customStyle: ''
});

const context = inject(SNAKE_SKELETON_CONTEXT, undefined);
const isAnimated = computed(() => props.animated ?? context?.animated.value ?? true);

interface VariantDefaults {
    width: number | string;
    height: number | string;
    radius: number | string;
}

const itemStyle = computed(() => {
    const defaults = variantDefaults[props.variant];
    return [
        {
            width: addUnit(props.width ?? defaults.width),
            height: addUnit(props.height ?? defaults.height),
            borderRadius: props.radius === undefined ? defaults.radius : addUnit(props.radius)
        } as CSSProperties,
        props.customStyle
    ];
});

const variantDefaults: Record<NonNullable<SkeletonItemProps['variant']>, VariantDefaults> = {
    text: { width: '100%', height: '16px', radius: '4px' },
    rect: { width: '100%', height: '100px', radius: '8px' },
    circle: { width: '32px', height: '32px', radius: '50%' },
    image: { width: '100%', height: '100px', radius: '8px' }
};
</script>

<template>
    <view
        class="snake-skeleton-item"
        :class="[`snake-skeleton-item--${variant}`, { 'snake-skeleton-item--animated': isAnimated }]"
        :style="itemStyle"
    />
</template>

<style scoped>
.snake-skeleton-item {
    box-sizing: border-box;
    flex: none;
    overflow: hidden;
    background-color: var(--snake-skeleton-color, #f1f2f4);
}
.snake-skeleton-item--animated {
    background-image: linear-gradient(
        90deg,
        var(--snake-skeleton-color, #f1f2f4) 25%,
        var(--snake-skeleton-highlight, #e5e7eb) 37%,
        var(--snake-skeleton-color, #f1f2f4) 63%
    );
    background-size: 400% 100%;
    animation: snake-skeleton-shimmer 1.8s ease infinite;
}
@keyframes snake-skeleton-shimmer {
    0% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
}
@media (prefers-reduced-motion: reduce) {
    .snake-skeleton-item--animated {
        animation: none;
    }
}
</style>
