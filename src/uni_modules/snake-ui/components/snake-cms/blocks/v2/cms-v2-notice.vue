<template>
    <view class="cms-v2-notice" :style="rootStyle" @click="handleClick">
        <text v-if="data.isLeftIcon !== false" class="cms-v2-notice__icon">📢</text>
        <swiper v-if="data.direction === 'column'" class="cms-v2-notice__swiper" vertical autoplay circular><swiper-item v-for="(item, index) in items" :key="index" @click.stop="openV2Link(item.link, linkService, pageInfo)"><text class="cms-v2-notice__text">{{ item.text }}</text></swiper-item></swiper>
        <view v-else class="cms-v2-notice__row"><text class="cms-v2-notice__text">{{ data.noticeText }}</text></view>
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2Notice @description CMS v2 公告内部渲染器。 @see /cms/overview */
import { computed } from 'vue';
import { openV2Link, rpx, type V2BlockProps } from './shared';
const props = defineProps<V2BlockProps>();
const items = computed(() => Array.isArray(props.data.textList) ? props.data.textList : []);
const rootStyle = computed(() => ({ height: rpx(props.data.style?.height, 72), margin: `0 ${rpx(props.data.style?.pageMargin, 10)}`, color: props.data.style?.textColor || '#2d57e7', backgroundColor: props.data.style?.backgroundColor || '#eaf1ff' }));
const handleClick = () => props.data.direction === 'column' ? undefined : openV2Link(props.data.link, props.linkService, props.pageInfo);
</script>
<style scoped>.cms-v2-notice { display: flex; box-sizing: border-box; align-items: center; overflow: hidden; padding: 0 20rpx; } .cms-v2-notice__icon { margin-right: 12rpx; } .cms-v2-notice__swiper,.cms-v2-notice__row { flex: 1; height: 100%; overflow: hidden; } .cms-v2-notice__text { line-height: 72rpx; white-space: nowrap; }</style>
