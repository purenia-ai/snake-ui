<template><ShowcasePage kind="cms-content" :scroll-top="scrollTop" /></template>
<script setup lang="ts">
import { ref } from 'vue';
import { onPageScroll } from '@dcloudio/uni-app';
import ShowcasePage from '../../../components/showcase-page/showcase-page.vue';

const scrollTop = ref(0);
onPageScroll(event => {
    scrollTop.value = event.scrollTop;
});
</script>
