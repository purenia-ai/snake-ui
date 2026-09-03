<template>
    <view class="snake-sort" @click="toggle">
        <text class="snake-sort__label" :style="labelStyle">{{ title }}</text>
        <view class="snake-sort__arrows" aria-hidden="true">
            <view class="snake-sort__arrow-up" :class="{ 'is-active': value === 'asc' }" />
            <view class="snake-sort__arrow-down" :class="{ 'is-active': value === 'desc' }" />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeButtonSort
 * @description 用于在默认、升序和降序状态之间循环切换。
 * @see /components/button-sort
 */

import { computed, ref } from 'vue';
import type { SnakeButtonSortEmits, SnakeButtonSortProps, SnakeButtonSortValue } from './types';

defineOptions({ name: 'snake-button-sort', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeButtonSortProps>(), { title: '', titleColor: '' });
const emit = defineEmits<SnakeButtonSortEmits>();
const value = ref<SnakeButtonSortValue>('');

// 标题颜色默认走 scoped 里的主题文字色，仅当传入 titleColor 时覆盖。
const labelStyle = computed(() => (props.titleColor ? { color: props.titleColor } : undefined));

function toggle() {
    value.value = value.value === '' ? 'asc' : value.value === 'asc' ? 'desc' : '';
    emit('change', { value: value.value });
}
</script>

<style scoped>
.snake-sort {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
    min-width: 0;
    padding: 0;
    font-size: 26rpx;
    line-height: 1;
    color: var(--snake-color-text, #26273a);
}
.snake-sort__arrows {
    transition: transform 0.3s;
}
.snake-sort__arrow-up,
.snake-sort__arrow-down {
    width: 0;
    height: 0;
    border: 10rpx solid transparent;
    border-radius: 2rpx;
}
.snake-sort__arrow-up {
    border-bottom-color: var(--snake-color-text-muted, #888891);
}
.snake-sort__arrow-down {
    margin-top: 4rpx;
    border-top-color: var(--snake-color-text-muted, #888891);
}
.snake-sort__arrow-up.is-active {
    border-bottom-color: var(--snake-color-primary, #06d290);
}
.snake-sort__arrow-down.is-active {
    border-top-color: var(--snake-color-primary, #06d290);
}
</style>
