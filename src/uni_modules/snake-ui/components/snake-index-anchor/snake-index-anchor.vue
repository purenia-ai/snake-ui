<script setup lang="ts">
/**
 * @component SnakeIndexAnchor
 * @description 定义 `IndexList` 中的分组位置，并根据父组件配置提供吸顶效果。
 * @see /components/index-anchor
 */

import { computed, inject, type CSSProperties } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { snakeIndexListKey } from '../../libs/internal/index-list';
import type { SnakeIndexAnchorProps } from './types';
defineOptions({ name: 'SnakeIndexAnchor', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeIndexAnchorProps>(), { text: '', useSlot: false, customClass: '', customStyle: '' });
const list = inject(snakeIndexListKey); const anchorId = computed(() => list?.anchorId(props.index) ?? `snake-index-anchor-${props.index}`);
const style = computed(() => [{ position: list?.sticky.value ? 'sticky' : 'relative', top: list?.sticky.value ? addUnit(list.offsetTop.value, 'rpx') : 'auto', zIndex: list?.zIndex.value } as CSSProperties, props.customStyle]);
</script>
<template><view :id="anchorId" class="snake-index-anchor" :class="customClass" :style="[$snakeThemeStyle, style]"><slot v-if="useSlot" /><text v-else>{{ text || index }}</text></view></template>
<style scoped>.snake-index-anchor { display: flex; box-sizing: border-box; min-height: 64rpx; align-items: center; padding: 0 20rpx; color: var(--snake-color-text, #303133); font-size: 24rpx; font-weight: 600; background: var(--snake-color-background, #f5f6f8); }</style>
