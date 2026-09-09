<template>
  <view class="richtext">
    <mp-html :content="datas.myValue"></mp-html>
  </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeRichText
 * @description 使用 `mp-html` 渲染 CMS 提供的 HTML 内容。
 */

import type { SnakeRichTextProps } from './types';

defineOptions({ name: 'SnakeRichText', options: { virtualHost: true, styleIsolation: 'shared' } });
withDefaults(defineProps<SnakeRichTextProps>(), { datas: () => ({}) });
</script>

<style lang="scss" scoped>
.richtext {
  padding: 0 20rpx;
  white-space: break-word !important;
}
</style>
