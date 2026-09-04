<script setup lang="ts">
/**
 * @component SnakeLine
 * @description 分隔线条，支持横向与竖向两种方向、半像素细线以及虚线样式，常用于分隔内容块。
 * @see /components/line
 */

import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { snakeLineProps } from './types';

defineOptions({ name: 'SnakeLine', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(snakeLineProps);

/** 线条样式，以 1px 边框加缩放实现跨端一致的半像素细线。 */
const lineStyle = computed(() => {
  const style: Record<string, string> = { margin: props.margin };
  if (props.direction === 'row') {
    style.borderBottomWidth = '1px';
    style.borderBottomStyle = props.borderStyle;
    style.width = addUnit(props.length);
    if (props.hairLine) style.transform = 'scaleY(0.5)';
  } else {
    style.borderLeftWidth = '1px';
    style.borderLeftStyle = props.borderStyle;
    style.height = addUnit(props.length);
    if (props.hairLine) style.transform = 'scaleX(0.5)';
  }
  style.borderColor = props.color;
  return style;
});
</script>

<template>
  <view class="snake-line" :class="customClass" :style="[lineStyle, customStyle]" />
</template>

<style scoped>
.snake-line {
  vertical-align: middle;
}
</style>
