<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'; import { addUnit } from '../../libs';
import type { SnakeStickyProps } from './types';
const props = withDefaults(defineProps<SnakeStickyProps>(), { offsetTop: 0, zIndex: 10, disabled: false, bgColor: 'transparent', customStyle: '' });
const style = computed(() => [{ position: props.disabled ? 'relative' : 'sticky', top: props.disabled ? 'auto' : addUnit(props.offsetTop), zIndex: props.zIndex, backgroundColor: props.bgColor } as CSSProperties, props.customStyle]);
</script>
<template><view class="snake-sticky" :style="[$snakeThemeStyle, style]"><slot /></view></template>
