<template><view class="cms-v2-custom"><slot /></view></template>
<script setup lang="ts">
/** @component CmsV2Custom @description CMS v2 自定义插槽内部渲染器。 @see /cms/components */
defineProps<{ data: Record<string, any> }>();
</script>
<style scoped>.cms-v2-custom { width: 100%; }</style>
