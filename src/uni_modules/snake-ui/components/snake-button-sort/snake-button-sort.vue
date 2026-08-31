<template>
  <button class="snake-sort" type="button" :style="$snakeThemeStyle" @click="toggle">
    <text class="snake-sort__label">{{ title }}</text>
    <view class="snake-sort__arrows" aria-hidden="true">
      <text :class="['snake-sort__arrow', { 'is-active': value === 'asc' }]">▲</text>
      <text :class="['snake-sort__arrow', { 'is-active': value === 'desc' }]">▼</text>
    </view>
  </button>
</template>

<script setup lang="ts">
/**
 * @component SnakeButtonSort
 * @description 用于在默认、升序和降序状态之间循环切换。
 * @see /components/button-sort
 */

import { ref } from 'vue';
import type { SnakeButtonSortEmits, SnakeButtonSortProps, SnakeButtonSortValue } from './types';

defineOptions({ name: 'snake-button-sort' });

withDefaults(defineProps<SnakeButtonSortProps>(), { title: '' });
const emit = defineEmits<SnakeButtonSortEmits>();
const value = ref<SnakeButtonSortValue>('');

function toggle() {
  value.value = value.value === '' ? 'asc' : value.value === 'asc' ? 'desc' : '';
  emit('change', { value: value.value });
}
</script>

<style scoped>
.snake-sort{display:flex;flex:1;align-items:center;justify-content:center;gap:8rpx;min-width:0;padding:0;color:var(--snake-color-text,#26273a);font-size:26rpx;line-height:1;background:transparent;border:0}.snake-sort::after{display:none}.snake-sort__arrows{display:flex;flex-direction:column;gap:1rpx;color:var(--snake-color-text-light,#c7c9d1);font-size:12rpx}.snake-sort__arrow.is-active{color:var(--snake-color-primary,#00b77a)}
</style>
