<template>
    <button class="snake-sort" :style="[$snakeThemeStyle, sortStyle]" @click="toggle">
        <text class="snake-sort__label">{{ title }}</text>
        <view class="snake-sort__arrows" aria-hidden="true">
            <view class="snake-sort__arrow-up" :class="{ 'is-active': value === 'asc' }" />
            <view class="snake-sort__arrow-down" :class="{ 'is-active': value === 'desc' }" />
        </view>
    </button>
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

withDefaults(defineProps<SnakeButtonSortProps>(), { title: '' });
const emit = defineEmits<SnakeButtonSortEmits>();
const value = ref<SnakeButtonSortValue>('');

// 根节点是原生 <button>，小程序下无法可靠消费 scoped CSS 里的 var()，
// 按钮文字色走内联 style（参照 snake-button）；箭头是普通 <view>，仍留在 scoped。
const sortStyle = computed(() => ({ color: 'var(--snake-color-text, #26273a)' }));

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
    background: transparent;
    border: 0;
}
.snake-sort::after {
    display: none;
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
