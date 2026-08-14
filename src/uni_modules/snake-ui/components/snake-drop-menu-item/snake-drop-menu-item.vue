<template>
  <view class="snake-drop-item" :style="$snakeThemeStyle">
    <button class="snake-drop-item__trigger" type="button" @click="toggle">
      <text>{{ title }}</text>
      <text :class="['snake-drop-item__chevron', { 'is-open': isOpen }]">⌄</text>
    </button>
    <view v-if="isOpen" class="snake-drop-item__panel"><slot /></view>
  </view>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, watch } from 'vue';
import { snakeDropMenuKey } from '../../libs/internal/drop-menu';
import type { SnakeDropMenuItemEmits, SnakeDropMenuItemProps } from './types';

defineOptions({ name: 'snake-drop-menu-item' });
const props = withDefaults(defineProps<SnakeDropMenuItemProps>(), { title: '', beforeToggle: undefined });
const emit = defineEmits<SnakeDropMenuItemEmits>();
const menu = inject(snakeDropMenuKey);
const itemId = Symbol('snake-drop-menu-item');
const isOpen = computed(() => menu?.activeItem.value === itemId);

watch(isOpen, (current, previous) => { if (!current && previous) emit('close'); });
function requestOpen(): Promise<boolean> {
  if (!props.beforeToggle) return Promise.resolve(true);
  return new Promise((resolve) => props.beforeToggle?.({ resolve }));
}
async function toggle() {
  if (!menu) return;
  if (isOpen.value) return menu.close();
  if (await requestOpen()) menu.open(itemId);
}
onBeforeUnmount(() => { if (isOpen.value) menu?.close(); });
</script>

<style scoped>
.snake-drop-item__trigger{display:flex;align-items:center;justify-content:center;gap:8rpx;width:100%;padding:0;color:var(--snake-color-text,#26273a);font-size:26rpx;line-height:1;background:transparent;border:0}.snake-drop-item__trigger::after{display:none}.snake-drop-item__chevron{color:var(--snake-color-text-muted,#8d909c);transition:transform 180ms ease}.snake-drop-item__chevron.is-open{color:var(--snake-color-primary,#00b77a);transform:rotate(180deg)}.snake-drop-item__panel{position:fixed;right:0;bottom:0;left:0;z-index:40;height:min(72vh,1100rpx);overflow:hidden;background:var(--snake-color-surface,#fff);border-top:1px solid var(--snake-color-divider,rgba(38,39,58,.08));box-shadow:0 -18rpx 48rpx var(--snake-color-shadow,rgba(38,39,58,.12))}
</style>
