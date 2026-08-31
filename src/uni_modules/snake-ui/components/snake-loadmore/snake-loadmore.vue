<script setup lang="ts">
/**
 * @component SnakeLoadmore
 * @description 用于列表底部反馈分页状态。组件不直接请求数据，点击可加载状态时会派发 `loadmore`，由业务更新 `status`。
 * @see /components/loadmore
 */

import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { snakeTranslate } from '../../locale';
import SnakeLoadingIcon from '../snake-loading-icon/snake-loading-icon.vue';
import type { SnakeLoadmoreEmits, SnakeLoadmoreProps } from './types';

defineOptions({ name: 'SnakeLoadmore', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeLoadmoreProps>(), {
  status: 'loadmore', loadText: '', loadingText: '', nomoreText: '', bgColor: 'transparent', icon: true,
  iconType: 'circle', iconColor: 'var(--snake-color-text-light, #c0c4cc)', isDot: false,
  color: 'var(--snake-color-text-secondary, #606266)', fontSize: 28, marginTop: 0, marginBottom: 0,
  customClass: '', customStyle: '',
});
const emit = defineEmits<SnakeLoadmoreEmits>();
const labels = computed(() => typeof props.loadText === 'object' ? props.loadText : {});
const label = computed(() => {
  if (props.status === 'loading') return props.loadingText || labels.value.loading || snakeTranslate('common.loading');
  if (props.status === 'nomore') return props.isDot ? '●' : props.nomoreText || labels.value.nomore || snakeTranslate('common.noMore');
  return (typeof props.loadText === 'string' ? props.loadText : labels.value.loadmore) || snakeTranslate('common.loadMore');
});
const rootStyle = computed(() => [{ backgroundColor: props.bgColor, color: props.color, fontSize: addUnit(props.fontSize, 'rpx'), marginTop: addUnit(props.marginTop, 'rpx'), marginBottom: addUnit(props.marginBottom, 'rpx') }, props.customStyle]);
function click() { emit('click', props.status); if (props.status === 'loadmore') emit('loadmore'); }
</script>

<template>
  <view class="snake-loadmore" :class="customClass" :style="[$snakeThemeStyle, rootStyle]" @click="click">
    <snake-loading-icon v-if="status === 'loading' && icon" :mode="iconType === 'flower' ? 'spinner' : iconType" :color="iconColor" size="16" />
    <text class="snake-loadmore__text">{{ label }}</text>
  </view>
</template>

<style scoped>.snake-loadmore { display: flex; align-items: center; justify-content: center; min-height: 80rpx; gap: 12rpx; padding: 12rpx 24rpx; line-height: 1.5; }.snake-loadmore__text { color: inherit; font-size: inherit; }</style>
