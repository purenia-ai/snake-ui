<script setup lang="ts">
import { computed } from 'vue';
import type { SnakeOverlayEmits, SnakeOverlayProps } from './types';
const props = withDefaults(defineProps<SnakeOverlayProps>(), { modelValue: false, opacity: .5, zIndex: 10070, duration: 250, customStyle: '' });
const emit = defineEmits<SnakeOverlayEmits>();
const style = computed(() => [{ backgroundColor: `rgba(0,0,0,${props.opacity})`, zIndex: props.zIndex, transitionDuration: `${props.duration}ms` }, props.customStyle]);
function close(event: unknown){ emit('click', event); emit('update:modelValue', false); }
</script>
<template><view v-if="modelValue" class="snake-overlay" :style="[$snakeThemeStyle, style]" @click="close"><slot /></view></template>
<style scoped>.snake-overlay{position:fixed;inset:0;transition-property:opacity}</style>
