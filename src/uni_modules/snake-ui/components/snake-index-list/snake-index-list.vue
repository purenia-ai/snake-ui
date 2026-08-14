<template>
  <view class="snake-index-list" :style="$snakeThemeStyle">
    <scroll-view class="snake-index-list__content" scroll-y :scroll-into-view="scrollIntoView" scroll-with-animation><slot /></scroll-view>
    <view class="snake-index-list__rail" aria-label="索引导航">
      <button v-for="(item,index) in indexList" :key="`${item}-${index}`" class="snake-index-list__key" type="button" :style="{color:activeIndex===index?activeColor:inactiveColor}" @click="selectIndex(index)">{{ item }}</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { snakeIndexListKey } from '../../libs/internal/index-list';
import type { SnakeIndexListProps } from './types';

defineOptions({ name: 'snake-index-list' });
const props = withDefaults(defineProps<SnakeIndexListProps>(), { indexList: () => [], activeColor: 'var(--snake-color-primary, #00a86f)', inactiveColor: 'var(--snake-color-text-muted, #acacb7)' });
const activeIndex = ref(0);
const anchorId = (index: number) => `snake-index-anchor-${index}`;
const scrollIntoView = computed(() => anchorId(activeIndex.value));
function selectIndex(index: number) { activeIndex.value = index; }
provide(snakeIndexListKey, { activeIndex, anchorId });
</script>

<style scoped>
.snake-index-list{position:relative;height:100%;min-height:400rpx}.snake-index-list__content{box-sizing:border-box;height:100%;padding-right:72rpx}.snake-index-list__rail{position:absolute;top:50%;right:12rpx;display:flex;flex-direction:column;transform:translateY(-50%)}.snake-index-list__key{min-width:48rpx;min-height:32rpx;padding:0;font-size:20rpx;line-height:32rpx;background:transparent;border:0}.snake-index-list__key::after{display:none}
</style>
