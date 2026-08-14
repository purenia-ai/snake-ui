<script setup lang="ts">
import { computed } from 'vue';
import type { SnakeButtonEmits, SnakeButtonProps } from './types';

const props = withDefaults(defineProps<SnakeButtonProps>(), {
  type: 'default',
  plain: false,
  disabled: false,
  loading: false,
  customStyle: '',
});
const emit = defineEmits<SnakeButtonEmits>();
const style = computed(() => [{
  color: props.plain ? 'var(--snake-color-primary, #06d290)' : 'var(--snake-color-white, #fff)',
  background: props.plain ? 'transparent' : 'var(--snake-color-primary, #06d290)',
  borderColor: 'var(--snake-color-primary, #06d290)',
}, props.customStyle]);
</script>
<template><button class="snake-button" :class="[`snake-button--${type}`,{ 'snake-button--plain':plain }]" :style="[$snakeThemeStyle, style]" :disabled="disabled" :loading="loading" @click="emit('click',$event)"><slot /></button></template>
<style scoped>.snake-button{box-sizing:border-box;display:flex;align-items:center;justify-content:center;margin:0;padding:0 28rpx;border:1px solid;border-radius:var(--snake-radius-small,8rpx);font-size:28rpx;line-height:1}.snake-button::after{border:0}.snake-button[disabled]{opacity:.5}</style>
