<template>
  <view class="auxiliarysegmentation" :style="$snakeThemeStyle">
    <view
      class="contan"
      :style="{
        height: addUnit(datas.blankHeight),
        padding: datas.paddType === 0 ? '0px' : '0px 15px',
        backgroundColor: datas.bgColor,
      }">
      <view
        v-show="datas.segmentationtype === 1"
        style="width: 100%; height: 1px; border-top-width: 1px"
        :style="{
          'border-top-style': datas.bordertp,
          'border-top-color': datas.auxliarColor,
        }" />
    </view>
  </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeAuxiliarySegmentation
 * @description 在装修页面中插入留白，或在留白区域中央绘制一条可配置分割线。
 * @see /components/auxiliary-segmentation
 */

import { addUnit } from '../../libs/function/unit';
import type { SnakeAuxiliarySegmentationProps } from './types';

defineOptions({ name: 'SnakeAuxiliarySegmentation', options: { virtualHost: true, styleIsolation: 'shared' } });
withDefaults(defineProps<SnakeAuxiliarySegmentationProps>(), { datas: () => ({}) });
</script>

<style scoped lang="scss">
.auxiliarysegmentation {
  .contan {
    display: flex;
    align-items: center;
    width: 100%;
  }
}
</style>
