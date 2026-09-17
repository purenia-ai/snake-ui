<template>
    <view class="cms-v2-richtext" :style="rootStyle"><rich-text :nodes="safeContent" /></view>
</template>
<script setup lang="ts">
/** @component CmsV2Richtext @description CMS v2 富文本内部渲染器。 @see /cms/overview */
import { computed } from 'vue';
import { sanitizeRichText, type V2Record } from './shared';
const props = defineProps<{ data: V2Record }>();
const rootStyle = computed(() => ({ backgroundColor: props.data.style?.backgroundColor || '#fff' }));
const safeContent = computed(() => sanitizeRichText(props.data.content));
</script>
<style scoped>
.cms-v2-richtext {
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
}
</style>
