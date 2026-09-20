<template>
    <DefaultTheme.Layout :class="layoutClass">
        <template #doc-before><PreviewFrame /></template>
        <template #doc-after><DocActions /></template>
    </DefaultTheme.Layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import DocActions from './DocActions.vue';
import PreviewFrame from './PreviewFrame.vue';

const { frontmatter } = useData();
const layoutClass = computed(() => ({
    'snake-preview-layout': Boolean(frontmatter.value.preview)
}));
</script>
