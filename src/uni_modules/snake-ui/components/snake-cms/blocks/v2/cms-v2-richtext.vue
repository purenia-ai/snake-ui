<template><view class="cms-v2-richtext" :style="rootStyle"><rich-text :nodes="data.content || ''" /></view></template>
<script setup lang="ts">
/** @component CmsV2Richtext @description CMS v2 富文本内部渲染器。 @see /cms/components */
import { computed } from 'vue';
import type { V2Record } from './shared';
const props = defineProps<{ data: V2Record }>();
const rootStyle = computed(() => ({ backgroundColor: props.data.style?.backgroundColor || '#fff' }));
</script>
<style scoped>.cms-v2-richtext { box-sizing: border-box; width: 100%; overflow: hidden; }</style>
