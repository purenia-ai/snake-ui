<template><view :id="anchorId" class="snake-index-anchor" :style="[$snakeThemeStyle, customStyle]"><text>{{ text }}</text></view></template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { snakeIndexListKey } from '../../libs/internal/index-list';
import type { SnakeIndexAnchorProps } from './types';

defineOptions({ name: 'snake-index-anchor' });
const props = withDefaults(defineProps<SnakeIndexAnchorProps>(), { text: '', customStyle: '' });
const list = inject(snakeIndexListKey);
const anchorId = computed(() => list?.anchorId(props.index) ?? `snake-index-anchor-${props.index}`);
</script>

<style scoped>.snake-index-anchor{display:flex;align-items:center;color:var(--snake-color-text,#26273a);font-size:24rpx;font-weight:600;background:var(--snake-color-background,#f4f6f8)}</style>
