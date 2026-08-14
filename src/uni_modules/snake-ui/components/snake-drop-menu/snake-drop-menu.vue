<template>
  <view class="snake-drop-menu" :style="[$snakeThemeStyle, customStyle]"><slot /></view>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import { snakeDropMenuKey } from '../../libs/internal/drop-menu';
import type { SnakeDropMenuExpose, SnakeDropMenuProps } from './types';

defineOptions({ name: 'snake-drop-menu' });
withDefaults(defineProps<SnakeDropMenuProps>(), { customStyle: '' });

const activeItem = ref<symbol | null>(null);
function open(item: symbol) { activeItem.value = item; }
function close() { activeItem.value = null; }
function updateDropMenuRect() { /* normal flow recalculates the panel position */ }
function colseAll() { close(); }

provide(snakeDropMenuKey, { activeItem, open, close });
defineExpose<SnakeDropMenuExpose>({ updateDropMenuRect, colseAll });
</script>

<style scoped>.snake-drop-menu{position:relative}</style>
