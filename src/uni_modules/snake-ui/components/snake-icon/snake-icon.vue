<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from '../../libs';
import type { SnakeIconEmits, SnakeIconProps } from './types';

const props = withDefaults(defineProps<SnakeIconProps>(), {
  name: '', color: 'currentColor', size: 16, bold: false, customStyle: '',
});
const emit = defineEmits<SnakeIconEmits>();
const icons: Record<string, string> = { search: '⌕', close: '×', close2: '×', 'close-circle-fill': '⊗', 'play-right-fill': '▶' };
const glyph = computed(() => icons[props.name] || props.name);
const style = computed(() => [{ color: props.color, fontSize: addUnit(props.size), fontWeight: props.bold ? '700' : '400' }, props.customStyle]);
</script>
<template><text class="snake-icon" :style="[$snakeThemeStyle, style]" @click="emit('click', $event)">{{ glyph }}</text></template>
<style scoped>.snake-icon{display:inline-flex;align-items:center;justify-content:center;line-height:1;vertical-align:middle}</style>
