<template>
    <view class="cms-v2-video" :style="rootStyle">
        <video
            class="cms-v2-video__media"
            :style="mediaStyle"
            :src="data.src || ''"
            :poster="data.coverUrl || ''"
            :autoplay="!!data.autoplay"
        />
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2Video @description CMS v2 视频内部渲染器。 @see /cms/overview */
import { computed } from 'vue';
import { blockStyle, mediaHeightStyle, type V2Record } from './shared';
const props = defineProps<{ data: V2Record }>();
const rootStyle = computed(() => blockStyle(props.data.style));
const mediaStyle = computed(() => mediaHeightStyle(props.data.style));
</script>
<style scoped>
.cms-v2-video__media {
    display: block;
    width: 100%;
}
</style>
