<script setup lang="ts">
import { computed } from 'vue';
import { snakeTranslate } from '../../locale';
import type { SnakeLoadmoreProps } from './types';
const props = withDefaults(defineProps<SnakeLoadmoreProps>(), { status: 'loadmore', loadText: '', loadingText: '', nomoreText: '', bgColor: 'transparent', marginBottom: 0, customStyle: '' });
const label = computed(() => props.status === 'loading'
  ? props.loadingText || snakeTranslate('common.loading')
  : props.status === 'nomore'
    ? props.nomoreText || snakeTranslate('common.noMore')
    : props.loadText || snakeTranslate('common.loadMore'));
</script>
<template><view class="snake-loadmore" :style="[$snakeThemeStyle, { backgroundColor: bgColor, marginBottom: typeof marginBottom === 'number' ? `${marginBottom}px` : marginBottom }, customStyle]"><view v-if="status === 'loading'" class="snake-loadmore__spinner"/><text>{{ label }}</text></view></template>
<style scoped>.snake-loadmore{display:flex;align-items:center;justify-content:center;gap:12rpx;padding:24rpx;color:var(--snake-color-text-muted,#909399);font-size:24rpx}.snake-loadmore__spinner{width:24rpx;height:24rpx;border:2px solid var(--snake-color-border,#ddd);border-top-color:var(--snake-color-primary,#06d290);border-radius:50%;animation:snake-spin .8s linear infinite}@keyframes snake-spin{to{transform:rotate(360deg)}}</style>
