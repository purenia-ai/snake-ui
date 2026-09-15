<script setup lang="ts">
/**
 * @component Swiper
 * @description 基于 uni-app swiper 封装，支持图片或对象数据、自定义指示器、标题和 3D 卡片效果。
 * @see /components/swiper
 */

import { computed, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { SwiperEmits, SwiperItem, SwiperProps } from './types';

defineOptions({ name: 'Swiper', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SwiperProps>(), {
    list: () => [],
    current: 0,
    height: 250,
    autoplay: true,
    interval: 3000,
    duration: 500,
    circular: true,
    indicator: () => ({}),
    mode: 'round',
    indicatorPos: 'bottomCenter',
    indicatorColor: 'rgba(0,0,0,.3)',
    indicatorActiveColor: 'rgba(255,255,255,.8)',
    name: 'image',
    radius: 8,
    previousMargin: '0px',
    nextMargin: '0px',
    effect3d: false,
    effect3dPreviousMargin: 50,
    imgMode: 'aspectFill',
    showTitle: false,
    bgColor: 'var(--snake-color-bg, #f7f8fa)',
    titleStyle: '',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SwiperEmits>();
const active = ref(Number(props.current) || 0);
const currentIndex = computed(() => Number(props.current) || 0);
watch(
    () => props.list.length,
    (length, previousLength) => {
        if (length !== previousLength) active.value = 0;
    }
);
watch(
    () => props.current,
    current => (active.value = Number(current) || 0)
);
const actualRadius = computed(() => props.borderRadius ?? props.radius);
const rootStyle = computed(() => [
    {
        height: addUnit(props.height, 'rpx'),
        borderRadius: addUnit(actualRadius.value, 'rpx'),
        backgroundColor: props.bgColor
    },
    props.customStyle
]);
const source = (item: SwiperItem) =>
    typeof item === 'string' ? item : String(item?.[props.name] ?? item?.image ?? item?.src ?? item?.url ?? '');
const itemTitle = (item: SwiperItem) => (typeof item === 'string' ? '' : String(item?.title ?? item?.text ?? ''));
const showIndicator = computed(() => props.indicator !== false);
const margin = computed(() => (props.effect3d ? addUnit(props.effect3dPreviousMargin, 'rpx') : props.previousMargin));
const indicatorClass = computed(() => `snake-swiper__indicator--${props.indicatorPos}`);
const titlePaddingBottom = computed(() => {
    if (props.mode === 'none') return '12rpx';
    return props.indicatorPos.startsWith('bottom') ? (props.mode === 'number' ? '60rpx' : '40rpx') : '12rpx';
});
function change(event: any) {
    active.value = Number(event.detail?.current) || 0;
    emit('change', active.value);
}
function finish(event: any) {
    emit('animationfinish', { current: Number(event.detail?.current) || 0, source: event.detail?.source });
}
</script>

<template>
    <view class="snake-swiper" :class="customClass" :style="rootStyle">
        <swiper
            class="snake-swiper__body"
            :current="currentIndex"
            :autoplay="autoplay"
            :interval="interval"
            :duration="duration"
            :circular="circular"
            :previous-margin="margin"
            :next-margin="effect3d ? margin : nextMargin"
            @change="change"
            @animationfinish="finish"
        >
            <swiper-item v-for="(item, index) in list" :key="index" class="snake-swiper__item">
                <view
                    class="snake-swiper__content"
                    :style="{
                        borderRadius: addUnit(actualRadius, 'rpx'),
                        transform: effect3d && index !== active ? 'scaleY(0.9)' : 'scaleY(1)',
                        margin: effect3d && index !== active ? '0 20rpx' : 0
                    }"
                    @click.stop.prevent="emit('click', index)"
                >
                    <image class="snake-swiper__image" :src="source(item)" :mode="imgMode as any" />
                    <text
                        v-if="(showTitle || title) && itemTitle(item)"
                        class="snake-swiper__title"
                        :style="[titleStyle, { paddingBottom: titlePaddingBottom }]"
                    >
                        {{ itemTitle(item) }}
                    </text>
                </view>
            </swiper-item>
        </swiper>
        <view v-if="showIndicator" class="snake-swiper__indicator" :class="indicatorClass">
            <slot name="indicator" :current="active" :total="list.length">
                <text v-if="mode === 'number'" class="snake-swiper__number">{{ active + 1 }}/{{ list.length }}</text>
                <view v-else-if="mode !== 'none'" class="snake-swiper__dots" :class="`is-${mode}`">
                    <view
                        v-for="(_, index) in list"
                        :key="index"
                        class="snake-swiper__dot"
                        :class="{ 'is-active': index === active }"
                        :style="{ backgroundColor: index === active ? indicatorActiveColor : indicatorColor }"
                    />
                </view>
            </slot>
        </view>
    </view>
</template>

<style scoped>
.snake-swiper,
.snake-swiper__body,
.snake-swiper__item {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.snake-swiper {
    transform: translateY(0);
}
.snake-swiper__content {
    position: relative;
    box-sizing: content-box;
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: all 0.5s;
}
.snake-swiper__image {
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
.snake-swiper__title {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    width: 100%;
    padding: 12rpx 24rpx;
    color: rgba(255, 255, 255, 0.9);
    font-size: 28rpx;
    background-color: rgba(0, 0, 0, 0.3);
}
.snake-swiper__indicator {
    position: absolute;
    z-index: 2;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 0 24rpx;
}
.snake-swiper__indicator--topLeft {
    top: 12rpx;
}
.snake-swiper__indicator--topCenter {
    top: 12rpx;
    justify-content: center;
}
.snake-swiper__indicator--topRight {
    top: 12rpx;
    justify-content: flex-end;
}
.snake-swiper__indicator--bottomLeft {
    bottom: 12rpx;
}
.snake-swiper__indicator--bottomCenter {
    bottom: 12rpx;
    justify-content: center;
}
.snake-swiper__indicator--bottomRight {
    bottom: 12rpx;
    justify-content: flex-end;
}
.snake-swiper__dots {
    display: flex;
    align-items: center;
    gap: 10rpx;
}
.snake-swiper__dot {
    width: 12rpx;
    height: 12rpx;
    border-radius: 999px;
    transition:
        width 0.2s ease,
        background-color 0.2s ease;
}
.snake-swiper__dots.is-round .snake-swiper__dot.is-active {
    width: 34rpx;
}
.snake-swiper__dots.is-rect .snake-swiper__dot,
.snake-swiper__dots.is-line .snake-swiper__dot {
    width: 26rpx;
    height: 8rpx;
    border-radius: 0;
}
.snake-swiper__number {
    padding: 6rpx 16rpx;
    border-radius: 999px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 26rpx;
    background: rgba(0, 0, 0, 0.3);
}
</style>
