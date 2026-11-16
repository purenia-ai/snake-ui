<template>
    <view
        class="snake-skeleton"
        :style="rootStyle"
        :aria-busy="loading ? 'true' : 'false'"
        :aria-label="loading ? label || undefined : undefined"
    >
        <template v-if="loading">
            <slot v-if="$slots.template" name="template" />
            <view v-else class="snake-skeleton__wrapper" aria-hidden="true">
                <view v-if="avatar" class="snake-skeleton__avatar">
                    <SkeletonItem variant="circle" :width="avatarSize" :height="avatarSize" :radius="avatarRadius" />
                </view>
                <view class="snake-skeleton__content">
                    <view v-if="title" class="snake-skeleton__title">
                        <SkeletonItem variant="text" :width="titleWidth" :height="titleHeight" />
                    </view>
                    <view
                        v-for="(item, index) in rowItems"
                        :key="index"
                        :class="['snake-skeleton__row', { 'snake-skeleton__row--flush': index === 0 }]"
                    >
                        <SkeletonItem variant="text" :width="item.width" :height="item.height" />
                    </view>
                </view>
            </view>
        </template>
        <slot v-else />
    </view>
</template>

<script setup lang="ts">
/**
 * @component Skeleton
 * @description 在首次加载数据时展示结构占位，支持快速段落模式和自定义骨架模板。
 * @see /components/skeleton
 */

import { computed, provide } from 'vue';
import SkeletonItem from '../snake-skeleton-item/snake-skeleton-item.vue';
import { SNAKE_SKELETON_CONTEXT } from '../snake-skeleton-item/types';
import type { SkeletonAnimation, SkeletonProps, SkeletonSize } from './types';

defineOptions({ name: 'Skeleton', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SkeletonProps>(), {
    loading: true,
    animated: true,
    animation: undefined,
    title: true,
    titleWidth: '40%',
    titleHeight: 16,
    rows: 3,
    rowsWidth: '100%',
    rowsHeight: 12,
    avatar: false,
    avatarSize: 32,
    avatarShape: 'circle',
    label: '',
    customStyle: ''
});

defineSlots<{
    template?: () => unknown;
    default?: () => unknown;
}>();

const rootStyle = computed(() => props.customStyle);
const avatarRadius = computed(() => (props.avatarShape === 'circle' ? '50%' : '4px'));

/** 折算后的动画类型：`animation` 优先，其次兼容旧的 `animated` 开关。 */
const resolvedAnimation = computed<SkeletonAnimation>(() => {
    if (props.animation) return props.animation;
    return props.animated === false ? 'none' : 'shimmer';
});

provide(SNAKE_SKELETON_CONTEXT, { animation: resolvedAnimation });

const rowItems = computed(() => {
    const count = Math.max(0, Math.floor(Number(props.rows) || 0));
    return Array.from({ length: count }, (_, index) => ({
        width: resolveRowValue(props.rowsWidth, index, count, '100%', true),
        height: resolveRowValue(props.rowsHeight, index, count, 8, false)
    }));
});

function resolveRowValue(
    value: SkeletonSize | SkeletonSize[],
    index: number,
    count: number,
    fallback: SkeletonSize,
    shortenLastRow: boolean
): SkeletonSize {
    if (Array.isArray(value)) {
        return value[index] ?? (shortenLastRow && index === count - 1 ? '70%' : fallback);
    }
    return shortenLastRow && index === count - 1 ? '70%' : value;
}
</script>

<style scoped>
.snake-skeleton {
    width: 100%;
}
.snake-skeleton__wrapper {
    display: flex;
    width: 100%;
}
.snake-skeleton__avatar {
    flex: none;
    margin-right: var(--snake-skeleton-avatar-gap, 15px);
}
.snake-skeleton__content {
    min-width: 0;
    flex: 1;
}
.snake-skeleton__title {
    margin-bottom: var(--snake-skeleton-title-gap, 20px);
}
.snake-skeleton__row {
    margin-top: var(--snake-skeleton-row-gap, 12px);
}
/* 首行不加上间距：与标题之间的留白由标题的下间距（--snake-skeleton-title-gap）承担 */
.snake-skeleton__row--flush {
    margin-top: 0;
}
</style>
