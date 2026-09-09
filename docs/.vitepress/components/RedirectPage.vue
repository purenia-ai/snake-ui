<script setup lang="ts">
import { withBase } from 'vitepress';
import { onMounted } from 'vue';

const props = defineProps<{ to: string }>();
const target = withBase(props.to);

onMounted(() => window.location.replace(target));
</script>

<template>
    <p>文档地址已更新，正在跳转。若未自动跳转，请<a :href="target">打开新页面</a>。</p>
</template>
