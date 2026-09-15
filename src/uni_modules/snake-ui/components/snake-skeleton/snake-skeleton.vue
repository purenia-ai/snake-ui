<script setup lang="ts">
/**
 * @component Skeleton
 * @description 在首次加载数据时展示结构占位，支持快速段落模式和自定义骨架模板。
 * @see /components/skeleton
 */

import { computed, provide } from 'vue';
import SkeletonItem from '../snake-skeleton-item/snake-skeleton-item.vue';
import { SNAKE_SKELETON_CONTEXT } from '../snake-skeleton-item/types';
import type { SkeletonProps, SkeletonSize } from './types';

defineOptions({ name: 'Skeleton', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SkeletonProps>(), {
    loading: true,
    animated: true,
    title: true,
    titleWidth: '40%',
    titleHeight: 18,
    rows: 3,
    rowsWidth: '100%',
    rowsHeight: 16,
    avatar: false,
    avatarSize: 32,
    avatarShape: 'circle',
    customStyle: ''
});

defineSlots<{
    template?: () => unknown;
    default?: () => unknown;
}>();

provide(SNAKE_SKELETON_CONTEXT, { animated: computed(() => props.animated) });

const rootStyle = computed(() => props.customStyle);
const avatarRadius = computed(() => (props.avatarShape === 'circle' ? '50%' : '4px'));
const rowItems = computed(() => {
    const count = Math.max(0, Math.floor(Number(props.rows) || 0));
    return Array.from({ length: count }, (_, index) => ({
        width: resolveRowValue(props.rowsWidth, index, count, '100%', true),
        height: resolveRowValue(props.rowsHeight, index, count, 16, false),
        marginTop: props.title || index > 0 ? (index === 0 ? '20px' : '12px') : '0px'
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

<template>
    <view class="snake-skeleton" :style="rootStyle">
        <template v-if="loading">
            <slot v-if="$slots.template" name="template" />
            <view v-else class="snake-skeleton__wrapper">
                <SkeletonItem
                    v-if="avatar"
                    variant="circle"
                    :width="avatarSize"
                    :height="avatarSize"
                    :radius="avatarRadius"
                    custom-style="flex: none; margin-right: 15px"
                />
                <view class="snake-skeleton__content">
                    <SkeletonItem v-if="title" variant="text" :width="titleWidth" :height="titleHeight" />
                    <SkeletonItem
                        v-for="(item, index) in rowItems"
                        :key="index"
                        variant="text"
                        :width="item.width"
                        :height="item.height"
                        :custom-style="{ marginTop: item.marginTop }"
                    />
                </view>
            </view>
        </template>
        <slot v-else />
    </view>
</template>

<style scoped>
.snake-skeleton {
    width: 100%;
}
.snake-skeleton__wrapper {
    display: flex;
    width: 100%;
}
.snake-skeleton__content {
    min-width: 0;
    flex: 1;
}
</style>
