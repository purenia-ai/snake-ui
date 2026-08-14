<script setup lang="ts">
import SnakeImage from '../snake-image/snake-image.vue';
import { snakeTranslate } from '../../locale';
import type { SnakeLazyImageEmits, SnakeLazyImageProps } from './types';
withDefaults(defineProps<SnakeLazyImageProps>(),{src:'',loadingImg:'',errorImg:'',threshold:100,index:0,mode:'widthFix'});
const emit=defineEmits<SnakeLazyImageEmits>();
</script>
<template><snake-image :src="src" :mode="mode" width="100%" height="100%" lazy-load :error-icon="errorImg || snakeTranslate('image.error')" @click="emit('click',$event)" @load="emit('load',$event)" @error="emit('error',$event)"/></template>
