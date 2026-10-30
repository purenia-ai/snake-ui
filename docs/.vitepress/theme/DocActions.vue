<template>
    <nav v-if="showActions" class="doc-actions" aria-label="文档反馈与源码">
        <a v-if="sourceUrl" :href="sourceUrl" target="_blank" rel="noreferrer">查看组件源码 ↗</a>
        <a :href="issueUrl" target="_blank" rel="noreferrer">报告文档问题 ↗</a>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import { componentItems } from '../component-groups';

const repositoryUrl = 'https://github.com/purenia-ai/snake-ui';
const { frontmatter, page, title } = useData();

const showActions = computed(() => frontmatter.value.search !== false);
const component = computed(() => {
    const relativePath = page.value.relativePath.replace(/\.md$/, '');
    return componentItems.find(item => item.link === `/${relativePath}`);
});
const sourceUrl = computed(() => (component.value ? `${repositoryUrl}/blob/main/${component.value.source}` : ''));
const issueUrl = computed(() => {
    const issueTitle = encodeURIComponent(`[文档] ${title.value}`);
    const body = encodeURIComponent(`文档路径：${page.value.relativePath}\n\n请描述问题或建议：\n`);
    return `${repositoryUrl}/issues/new?title=${issueTitle}&body=${body}`;
});
</script>
