<script setup lang="ts">
/**
 * @component SnakeCellGroup
 * @description 单元格分组容器，一般搭配 SnakeCellItem 用于列表场景，支持分组标题与上下外边框。
 * @see /components/cell-group
 */

import { snakeCellGroupProps } from './types';

defineOptions({ name: 'SnakeCellGroup', options: { virtualHost: true, styleIsolation: 'shared' } });
defineProps(snakeCellGroupProps);
</script>

<template>
  <view class="snake-cell-group" :class="customClass" :style="customStyle">
    <view v-if="title" class="snake-cell-group__title" :style="titleStyle">{{ title }}</view>
    <view class="snake-cell-group__body" :class="{ 'snake-cell-group__body--border': border }">
      <slot />
    </view>
  </view>
</template>

<style scoped>
.snake-cell-group {
  width: 100%;
}
.snake-cell-group__title {
  padding: 30rpx 32rpx 10rpx 32rpx;
  font-size: 30rpx;
  text-align: left;
  color: var(--snake-color-text-muted, #909399);
}
.snake-cell-group__body {
  background-color: var(--snake-color-surface, #fff);
}
.snake-cell-group__body--border {
  position: relative;
}
.snake-cell-group__body--border::before,
.snake-cell-group__body--border::after {
  content: '';
  position: absolute;
  right: 0;
  left: 0;
  height: 1px;
  background-color: var(--snake-color-border, #e4e7ed);
  transform: scaleY(0.5);
}
.snake-cell-group__body--border::before {
  top: 0;
}
.snake-cell-group__body--border::after {
  bottom: 0;
}
</style>
