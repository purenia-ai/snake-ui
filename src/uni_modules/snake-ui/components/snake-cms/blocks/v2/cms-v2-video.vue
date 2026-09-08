<template><view class="cms-v2-video" :style="rootStyle"><video class="cms-v2-video__media" :src="data.src || ''" :poster="data.coverUrl || ''" :autoplay="!!data.autoplay" /></view></template>
<script setup lang="ts">
/** @component CmsV2Video @description CMS v2 视频内部渲染器。 @see /cms/components */
import { computed } from 'vue';
import { blockStyle, type V2Record } from './shared';
const props = defineProps<{ data: V2Record }>();
const rootStyle = computed(() => blockStyle(props.data.style));
</script>
<style scoped>.cms-v2-video__media { display: block; width: 100%; height: 100%; min-height: 360rpx; }</style>
