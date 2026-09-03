<template>
  <view :style="$snakeThemeStyle">
    <snake-notice-bar
      :volume-icon="datas.isLeftIcon ? true : false"
      :list="noticeList"
      :bg-color="datas.backColor"
      :mode="datas.direction === 'row' ? 'horizontal' : 'vertical'"
      :color="datas.textColor"
      :custom-style="{
        height: (datas.height || 72) + 'rpx',
        lineHeight: (datas.height || 72) + 'rpx',
        padding: `0 ${datas.pageMargin}rpx`,
      }"
      @click="handleNotice" />
  </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeNotice
 * @description 使用 Snake UI NoticeBar 展示单条横向公告或多条纵向轮播公告。
 * @see /components/notice
 */

import { computed } from 'vue';
import { navTo } from '../../libs/function/platform';
import type { SnakeNoticeProps } from './types';

defineOptions({ name: 'SnakeNotice', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeNoticeProps>(), { datas: () => ({}) });
const noticeList = computed(() => {
  if (props.datas.direction === 'row') {
    return Array.isArray(props.datas.noticeText) ? props.datas.noticeText : [props.datas.noticeText || ''];
  }
  return Array.isArray(props.datas.textList) ? props.datas.textList.map(item => item.text || '') : [];
});

function handleNotice(index: number) {
  const url = props.datas.direction === 'row' ? props.datas.url : props.datas.textList?.[index]?.url;
  if (url) navTo(url);
}
</script>

<style></style>
