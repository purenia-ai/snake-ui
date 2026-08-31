<template>
  <view class="richtext" :style="$snakeThemeStyle">
    <mp-html :content="datas.myValue"></mp-html>
  </view>
</template>

<script setup lang="ts">
import type { SnakeRichTextProps } from './types';

defineOptions({ name: 'SnakeRichText' });
withDefaults(defineProps<SnakeRichTextProps>(), { datas: () => ({}) });
</script>

<style lang="scss" scoped>
.richtext {
  padding: 0 20rpx;
  white-space: break-word !important;
}
</style>
