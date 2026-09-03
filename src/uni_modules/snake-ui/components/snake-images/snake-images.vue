<template>
  <view class="images" :style="$snakeThemeStyle">
    <view
      class="images-wrap"
      :style="{
        padding: addUnit(imgsData.paddingLR, 'rpx'),
      }"
      role="link"
      :tabindex="imgsData.url ? 0 : -1"
      :aria-label="imgsData.alt || '查看图片链接'"
      @click="open"
      @keydown.enter.prevent="open">
      <image
        class="image"
        :src="imgsData.src"
        :style="{ height: !imgsData.height ? '100%' : addUnit(imgsData.height, 'rpx') }"
        :aria-label="imgsData.alt || undefined"
        :mode="imgMode"></image>
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeImages
 * @description 根据当前运行平台选择图片配置，并支持点击跳转。
 * @see /components/images
 */

import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { navTo } from '../../libs/function/platform';
import type { SnakeImagesProps } from './types';

defineOptions({ name: 'SnakeImages', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeImagesProps>(), { datas: () => ({}) });
const platform = computed(() => {
      let value = 'h5';
      // #ifdef APP-PLUS
      value = 'app';
      // #endif

      // #ifdef MP-WEIXIN
      value = 'wxma';
      // #endif

      // #ifdef MP-ALIPAY
      value = 'alima';
      // #endif

      return value;
});
const imgsData = computed(() => {
  const options = Array.isArray(props.datas.platformOptions) ? props.datas.platformOptions : [];
  const selected = options.find(item => item.value === platform.value)?.imgs;
  return (selected?.src ? selected : options[0]?.imgs) || {};
});
const imgMode = computed(() => (!imgsData.value.height ? 'widthFix' : 'scaleToFill'));
function open() { if (imgsData.value.url) navTo(imgsData.value.url); }
</script>

<style lang="scss" scoped>
.images {
  width: 100%;
  height: 100%;
}
.images-warp {
  box-sizing: border-box;
  width: 100vw;
  height: auto;
}
.image {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
