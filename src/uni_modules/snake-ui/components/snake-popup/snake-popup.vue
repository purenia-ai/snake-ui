<script setup lang="ts">
import { computed } from 'vue';
import SnakeOverlay from '../snake-overlay/snake-overlay.vue';
import type { SnakePopupEmits, SnakePopupProps } from './types';
const props = withDefaults(defineProps<SnakePopupProps>(), { modelValue:false, mode:'center', bgColor:'var(--snake-color-surface, #fff)', zIndex:10075, closeOnClickOverlay:true, safeAreaInsetBottom:false });
const emit = defineEmits<SnakePopupEmits>();
const panelClass = computed(() => `snake-popup__panel--${props.mode}`);
function requestClose(){ if(!props.modelValue)return; emit('update:modelValue',false); emit('close'); emit('change',{show:false}); }
function overlayClick(){ if(props.closeOnClickOverlay)requestClose(); }
</script>
<template><snake-overlay :model-value="modelValue" :z-index="zIndex" @click="overlayClick"><view class="snake-popup__panel" :class="panelClass" :style="{backgroundColor:bgColor,zIndex,paddingBottom:safeAreaInsetBottom?'env(safe-area-inset-bottom)':''}" @click.stop><slot /></view></snake-overlay></template>
<style scoped>
.snake-popup__panel{position:fixed;box-sizing:border-box;max-width:100%;max-height:100%;overflow:auto}.snake-popup__panel--center{top:50%;left:50%;transform:translate(-50%,-50%)}.snake-popup__panel--top{top:0;left:0;width:100%}.snake-popup__panel--bottom{bottom:0;left:0;width:100%}.snake-popup__panel--left{top:0;bottom:0;left:0}.snake-popup__panel--right{top:0;right:0;bottom:0}
</style>
