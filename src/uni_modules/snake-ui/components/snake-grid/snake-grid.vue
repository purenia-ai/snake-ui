<template>
    <view class="snake-grid" :class="[{ 'snake-grid--bordered': border }, customClass]" :style="customStyle">
        <slot />
    </view>
</template>

<script setup lang="ts">
/**
 * @component Grid
 * @description 宫格容器：按列数等分宽度，用于首页金刚区与 CMS 快捷入口，支持格线、间距与等高。
 * @see /components/grid
 */
import { toRef, type ComponentPublicInstance } from 'vue';
import { useChildren } from '../../libs/hooks';
import { gridContextKey, gridProps, type GridContext } from './types';

defineOptions({ name: 'SnakeGrid', options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(gridProps);

const { linkChildren } = useChildren<ComponentPublicInstance, GridContext>(gridContextKey);

linkChildren({
    column: toRef(props, 'column'),
    border: toRef(props, 'border'),
    gutter: toRef(props, 'gutter'),
    square: toRef(props, 'square'),
    clickable: toRef(props, 'clickable')
});
</script>

<style scoped>
.snake-grid {
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    width: 100%;
    background-color: var(--snake-grid-bg, var(--snake-color-surface, #ffffff));
}

/* 外框由容器绘制，内部格线由子项绘制，避免用 gap 模拟导致格线断裂 */
.snake-grid--bordered {
    border-top: 1px solid var(--snake-grid-border-color, var(--snake-color-divider, #e4e7ed));
    border-left: 1px solid var(--snake-grid-border-color, var(--snake-color-divider, #e4e7ed));
}
</style>
