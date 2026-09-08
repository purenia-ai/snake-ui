<template><image v-if="data.src" class="cms-v2-floatbutton" :style="buttonStyle" :src="data.src" mode="aspectFit" @click="openV2Link(data.link, linkService, pageInfo)" /></template>
<script setup lang="ts">
/** @component CmsV2Floatbutton @description CMS v2 悬浮按钮内部渲染器。 @see /cms/components */
import { computed } from 'vue';
import { openV2Link, rpx, type V2BlockProps } from './shared';
const props = defineProps<V2BlockProps>();
const buttonStyle = computed(() => ({ width: rpx(props.data.style?.width, 76), height: rpx(props.data.style?.height, 76), right: `${Number(props.data.position?.right) || 0}%`, bottom: `${Number(props.data.position?.bottom) || 20}%` }));
</script>
<style scoped>.cms-v2-floatbutton { position: fixed; z-index: 20; }</style>
