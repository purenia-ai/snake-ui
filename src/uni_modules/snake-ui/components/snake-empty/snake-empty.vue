<script setup lang="ts">
import { computed } from 'vue';
import { snakeTranslate } from '../../locale';
import type { SnakeEmptyProps } from './types';

const props = withDefaults(defineProps<SnakeEmptyProps>(), {
  icon: '',
  text: '',
  textColor: 'var(--snake-color-text-muted, #909399)',
  customStyle: '',
});
const displayText = computed(() => props.text || snakeTranslate('common.empty'));
</script>
<template><view class="snake-empty" :style="[$snakeThemeStyle, customStyle]"><image v-if="icon" class="snake-empty__image" :src="icon" mode="aspectFit"/><slot><text :style="{color:textColor}">{{displayText}}</text></slot></view></template>
<style scoped>.snake-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20rpx}.snake-empty__image{width:200rpx;height:200rpx}</style>
