<script setup lang="ts">
/**
 * @component SnakeCellItem
 * @description 单元格条目，一般搭配 SnakeCellGroup 用于列表场景，支持图标、标题、描述、右侧内容与箭头。
 * @see /components/cell
 */

import { computed, useSlots } from 'vue';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import { snakeCellItemProps, type SnakeCellItemEmits } from './types';

defineOptions({ name: 'SnakeCellItem', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(snakeCellItemProps);
const emit = defineEmits<SnakeCellItemEmits>();
const slots = useSlots();

/** 箭头旋转样式。 */
const arrowStyle = computed(() => {
    if (props.arrowDirection === 'up') return { transform: 'rotate(-90deg)' };
    if (props.arrowDirection === 'down') return { transform: 'rotate(90deg)' };
    return { transform: 'rotate(0deg)' };
});

/** 点击事件，回调中返回 index 标识当前条目。 */
function onClick() {
    emit('click', props.index);
}
</script>

<template>
    <view
        class="snake-cell-item"
        :class="[
            {
                'snake-cell-item--border-bottom': borderBottom,
                'snake-cell-item--border-top': borderTop,
                'snake-cell-item--center': center,
                'snake-cell-item--required': required
            },
            customClass
        ]"
        hover-stay-time="150"
        :hover-class="hoverClass"
        :style="[{ backgroundColor: bgColor }, customStyle]"
        @click="onClick"
    >
        <view v-if="icon" class="snake-cell-item__left-icon-wrap">
            <snake-icon :size="iconSize" :name="icon" :custom-style="iconStyle" />
        </view>
        <view v-else class="snake-cell-item__icon-slot">
            <slot name="icon" />
        </view>
        <view class="snake-cell-item__title" :style="[{ width: titleWidth ? `${titleWidth}rpx` : 'auto' }, titleStyle]">
            <template v-if="title !== ''">{{ title }}</template>
            <slot v-else name="title" />
            <view v-if="label || slots.label" class="snake-cell-item__label" :style="[labelStyle]">
                <template v-if="label !== ''">{{ label }}</template>
                <slot v-else name="label" />
            </view>
        </view>
        <view class="snake-cell-item__value" :style="[valueStyle]">
            <template v-if="value !== ''">{{ value }}</template>
            <slot v-else />
        </view>
        <view v-if="slots['right-icon']" class="snake-cell-item__right">
            <slot name="right-icon" />
        </view>
        <view v-if="arrow" class="snake-cell-item__right-icon-wrap">
            <snake-icon name="arrow-right" :custom-style="arrowStyle" />
        </view>
    </view>
</template>

<style scoped>
.snake-cell-item {
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 26rpx 32rpx;
    font-size: 28rpx;
    line-height: 54rpx;
    color: var(--snake-color-text-secondary, #606266);
    text-align: left;
}
.snake-cell-item__title {
    font-size: 28rpx;
}
.snake-cell-item__left-icon-wrap,
.snake-cell-item__right-icon-wrap,
.snake-cell-item__icon-slot,
.snake-cell-item__right {
    display: flex;
    align-items: center;
    height: 48rpx;
}
.snake-cell-item__left-icon-wrap,
.snake-cell-item__icon-slot {
    margin-right: 10rpx;
    font-size: 32rpx;
}
.snake-cell-item__right-icon-wrap {
    margin-left: 10rpx;
    color: var(--snake-color-text-muted, #909399);
    font-size: 28rpx;
}
.snake-cell-item__right {
    line-height: 1;
}
.snake-cell-item--border-bottom::after,
.snake-cell-item--border-top::before {
    content: '';
    position: absolute;
    right: 0;
    left: 0;
    height: 1px;
    background-color: var(--snake-color-border, #e4e7ed);
    transform: scaleY(0.5);
}
.snake-cell-item--border-bottom::after {
    bottom: 0;
}
.snake-cell-item--border-top::before {
    top: 0;
}
.snake-cell-item__label {
    margin-top: 6rpx;
    font-size: 26rpx;
    line-height: 36rpx;
    color: var(--snake-color-text-muted, #909399);
    word-wrap: break-word;
}
.snake-cell-item__value {
    overflow: hidden;
    font-size: 26rpx;
    color: var(--snake-color-text-muted, #909399);
    text-align: right;
    vertical-align: middle;
}
.snake-cell-item__title,
.snake-cell-item__value {
    flex: 1;
}
.snake-cell-item--required {
    overflow: visible;
}
.snake-cell-item--required::before {
    content: '*';
    position: absolute;
    left: 8px;
    margin-top: 4rpx;
    font-size: 14px;
    color: var(--snake-color-error, #fa3534);
}
.snake-cell-item--hover {
    background-color: var(--snake-color-surface-muted, #f2f3f6);
}
</style>
