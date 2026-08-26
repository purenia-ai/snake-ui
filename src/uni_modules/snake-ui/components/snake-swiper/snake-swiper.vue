<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { SnakeSwiperEmits, SnakeSwiperItem, SnakeSwiperProps } from './types';

defineOptions({ name: 'SnakeSwiper', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeSwiperProps>(), {
  list: () => [], current: 0, height: 300, autoplay: true, interval: 3000, duration: 500, circular: true,
  indicator: false, mode: 'round', indicatorPos: 'bottomCenter', indicatorColor: 'rgba(255,255,255,.55)',
  indicatorActiveColor: '#fff', name: 'url', radius: 0, previousMargin: '0px', nextMargin: '0px',
  effect3d: false, effect3dPreviousMargin: 50, imgMode: 'aspectFill', showTitle: false, bgColor: 'transparent',
  titleStyle: '', customClass: '', customStyle: '',
});
const emit = defineEmits<SnakeSwiperEmits>();
const active = ref(Number(props.current) || 0);
watch(() => props.current, value => (active.value = Number(value) || 0));
const actualRadius = computed(() => props.borderRadius ?? props.radius);
const rootStyle = computed(() => [{ height: addUnit(props.height, 'rpx'), borderRadius: addUnit(actualRadius.value, 'rpx'), backgroundColor: props.bgColor }, props.customStyle]);
const source = (item: SnakeSwiperItem) => typeof item === 'string' ? item : String(item?.[props.name] ?? item?.image ?? item?.src ?? item?.url ?? '');
const itemTitle = (item: SnakeSwiperItem) => typeof item === 'string' ? '' : String(item?.title ?? item?.text ?? '');
const showIndicator = computed(() => typeof props.indicator === 'object' || props.indicator === true);
const margin = computed(() => props.effect3d ? addUnit(props.effect3dPreviousMargin, 'rpx') : props.previousMargin);
const indicatorClass = computed(() => `snake-swiper__indicator--${props.indicatorPos}`);
function detail(event: any) { return { current: Number(event.detail?.current) || 0, source: event.detail?.source }; }
function change(event: any) { const value = detail(event); active.value = value.current; emit('change', value); }
function finish(event: any) { emit('animationfinish', detail(event)); }
</script>

<template>
  <view class="snake-swiper" :class="customClass" :style="[$snakeThemeStyle, rootStyle]">
    <swiper class="snake-swiper__body" :current="Number(current)" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="circular" :previous-margin="margin" :next-margin="effect3d ? margin : nextMargin" @change="change" @animationfinish="finish">
      <swiper-item v-for="(item, index) in list" :key="index" class="snake-swiper__item" @click="emit('click', index, item)">
        <image class="snake-swiper__image" :class="{ 'is-effect3d': effect3d && index !== active }" :src="source(item)" :mode="imgMode as any" />
        <text v-if="(showTitle || title) && itemTitle(item)" class="snake-swiper__title" :style="titleStyle">{{ itemTitle(item) }}</text>
      </swiper-item>
    </swiper>
    <view v-if="showIndicator" class="snake-swiper__indicator" :class="indicatorClass">
      <slot name="indicator" :current="active" :total="list.length">
        <text v-if="mode === 'number'" class="snake-swiper__number">{{ active + 1 }}/{{ list.length }}</text>
        <view v-else class="snake-swiper__dots" :class="`is-${mode}`"><view v-for="(_, index) in list" :key="index" class="snake-swiper__dot" :class="{ 'is-active': index === active }" :style="{ backgroundColor: index === active ? indicatorActiveColor : indicatorColor }" /></view>
      </slot>
    </view>
  </view>
</template>

<style scoped>
.snake-swiper, .snake-swiper__body, .snake-swiper__item { position: relative; width: 100%; height: 100%; overflow: hidden; }.snake-swiper__image { display: block; width: 100%; height: 100%; transition: transform .35s ease; }.snake-swiper__image.is-effect3d { transform: scale(.92); }
.snake-swiper__title { position: absolute; right: 0; bottom: 0; left: 0; box-sizing: border-box; padding: 16rpx 20rpx 38rpx; color: #fff; background: linear-gradient(transparent, rgba(0,0,0,.62)); }
.snake-swiper__indicator { position: absolute; z-index: 2; display: flex; }.snake-swiper__indicator--topLeft { top: 16rpx; left: 20rpx; }.snake-swiper__indicator--topCenter { top: 16rpx; left: 50%; transform: translateX(-50%); }.snake-swiper__indicator--topRight { top: 16rpx; right: 20rpx; }.snake-swiper__indicator--bottomLeft { bottom: 16rpx; left: 20rpx; }.snake-swiper__indicator--bottomCenter { bottom: 16rpx; left: 50%; transform: translateX(-50%); }.snake-swiper__indicator--bottomRight { right: 20rpx; bottom: 16rpx; }
.snake-swiper__dots { display: flex; align-items: center; gap: 10rpx; }.snake-swiper__dot { width: 12rpx; height: 12rpx; border-radius: 999px; transition: width .2s ease, background-color .2s ease; }.snake-swiper__dots.is-round .snake-swiper__dot.is-active, .snake-swiper__dots.is-line .snake-swiper__dot.is-active { width: 28rpx; }.snake-swiper__dots.is-line .snake-swiper__dot { height: 5rpx; border-radius: 3rpx; }.snake-swiper__number { padding: 4rpx 12rpx; border-radius: 999px; color: #fff; font-size: 20rpx; background: rgba(0,0,0,.42); }
</style>
