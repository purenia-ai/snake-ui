<script setup lang="ts">
import { computed, ref } from 'vue'; import { addUnit } from '../../libs';
import type { SnakeImageEmits, SnakeImageProps } from './types';
const props=withDefaults(defineProps<SnakeImageProps>(),{src:'',mode:'scaleToFill',width:'100%',height:'auto',radius:0,lazyLoad:false,showError:true,errorIcon:'图片加载失败',customStyle:''});
const emit=defineEmits<SnakeImageEmits>(); const failed=ref(false);
const style=computed(()=>[{width:addUnit(props.width),height:props.height==='auto'?'auto':addUnit(props.height),borderRadius:addUnit(props.radius),overflow:'hidden'},props.customStyle]);
function onError(e:unknown){failed.value=true;emit('error',e)}
</script>
<template><view class="snake-image" :style="[$snakeThemeStyle, style]" @click="emit('click',$event)"><image v-if="!failed" class="snake-image__image" :src="src" :mode="mode as any" :lazy-load="lazyLoad" @load="emit('load',$event)" @error="onError"/><view v-else-if="showError" class="snake-image__error">{{errorIcon}}</view></view></template>
<style scoped>.snake-image{display:block}.snake-image__image{display:block;width:100%;height:100%}.snake-image__error{display:flex;align-items:center;justify-content:center;width:100%;min-height:120rpx;height:100%;color:var(--snake-color-text-muted,#999);background:var(--snake-color-background,#f5f5f5);font-size:24rpx}</style>
