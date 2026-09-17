<template>
    <view class="cms-v2-notice" :style="rootStyle" @click="handleClick">
        <text v-if="data.isLeftIcon !== false" class="cms-v2-notice__icon">📢</text>
        <swiper v-if="data.direction === 'column'" class="cms-v2-notice__swiper" vertical autoplay circular>
            <swiper-item
                v-for="(item, index) in items"
                :key="index"
                @click.stop="openV2Link(item.link, linkService, pageInfo)"
            >
                <text class="cms-v2-notice__text" :style="textStyle">{{ item.text }}</text>
            </swiper-item>
        </swiper>
        <view v-else class="cms-v2-notice__row">
            <view class="cms-v2-notice__marquee" :style="marqueeStyle">
                <text class="cms-v2-notice__text">{{ data.noticeText }}</text>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
/** @component CmsV2Notice @description CMS v2 公告内部渲染器。 @see /cms/overview */
import { computed } from 'vue';
import { openV2Link, rpx, type V2BlockProps } from './shared';
const props = defineProps<V2BlockProps>();
const items = computed(() => (Array.isArray(props.data.textList) ? props.data.textList : []));
const rootStyle = computed(() => ({
    height: rpx(props.data.style?.height, 72),
    margin: `0 ${rpx(props.data.style?.pageMargin, 10)}`,
    color: props.data.style?.textColor || '#2d57e7',
    backgroundColor: props.data.style?.backgroundColor || '#eaf1ff'
}));
const marqueeStyle = computed(() => ({
    animationDuration: `${Math.max(8, String(props.data.noticeText || '').length * 0.35)}s`,
    lineHeight: rpx(props.data.style?.height, 72)
}));
const textStyle = computed(() => ({ lineHeight: rpx(props.data.style?.height, 72) }));
const handleClick = () =>
    props.data.direction === 'column' ? undefined : openV2Link(props.data.link, props.linkService, props.pageInfo);
</script>
<style scoped>
.cms-v2-notice {
    display: flex;
    box-sizing: border-box;
    align-items: center;
    overflow: hidden;
    padding: 0 20rpx;
}
.cms-v2-notice__icon {
    margin-right: 12rpx;
}
.cms-v2-notice__swiper,
.cms-v2-notice__row {
    flex: 1;
    height: 100%;
    overflow: hidden;
}
.cms-v2-notice__text {
    white-space: nowrap;
}
.cms-v2-notice__marquee {
    display: inline-block;
    min-width: 100%;
    padding-left: 100%;
    animation: cms-v2-notice-marquee 12s linear infinite;
}
@keyframes cms-v2-notice-marquee {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-100%);
    }
}
@media (prefers-reduced-motion: reduce) {
    .cms-v2-notice__marquee {
        padding-left: 0;
        animation: none;
    }
}
</style>
