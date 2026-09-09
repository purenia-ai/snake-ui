<template>
    <view class="cms-v2-carousel" :style="rootStyle">
        <swiper class="cms-v2-carousel__swiper" :autoplay="!!data.play?.autoplay" :interval="interval" :circular="data.play?.loop !== false" :indicator-dots="data.indicator?.type === 'bullets'" :indicator-color="data.indicator?.color || '#c8c9cc'" :indicator-active-color="data.indicator?.color || '#1989fa'" @change="current = $event.detail.current">
            <swiper-item v-for="(item, index) in items" :key="item.id ?? index"><image class="cms-v2-carousel__image" :src="item.src || ''" mode="aspectFill" @click="openV2Link(item.link, linkService, pageInfo)" /></swiper-item>
        </swiper>
        <view v-if="data.indicator?.type === 'fraction' && items.length" class="cms-v2-carousel__fraction">{{ current + 1 }}/{{ items.length }}</view>
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2Carousel @description CMS v2 图片轮播内部渲染器。 @see /cms/overview */
import { computed, ref } from 'vue';
import { blockStyle, openV2Link, type V2BlockProps } from './shared';
const props = defineProps<V2BlockProps>();
const current = ref(0);
const items = computed(() => Array.isArray(props.data.items) ? props.data.items : []);
const interval = computed(() => Math.max(1000, Number(props.data.play?.interval || 3) * 1000));
const rootStyle = computed(() => blockStyle(props.data.style));
</script>
<style scoped>.cms-v2-carousel { position: relative; } .cms-v2-carousel__swiper { width: 100%; min-height: 360rpx; } .cms-v2-carousel__image { width: 100%; height: 100%; } .cms-v2-carousel__fraction { position: absolute; right: 20rpx; bottom: 16rpx; padding: 4rpx 12rpx; color: #fff; font-size: 22rpx; background: rgba(0,0,0,.45); border-radius: 20rpx; }</style>
