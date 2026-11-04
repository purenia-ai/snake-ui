<template>
    <view class="snake-badge" :class="customClass" :style="customStyle">
        <slot />
        <view
            v-if="showBadge"
            class="snake-badge__content"
            :class="{ 'snake-badge__content--dot': isDot }"
            :style="contentStyle"
        >
            {{ contentText }}
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Badge
 * @description 徽标组件：包裹任意内容并在其右上角挂载徽标（圆心对准角点），
 * 无插槽内容时可作独立徽标使用。支持数字溢出（max+）、圆点模式与角点偏移。
 * @see /components/badge
 */

import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { BadgeProps } from './types';

defineOptions({
    name: 'Badge',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<BadgeProps>(), {
    customStyle: '',
    customClass: '',
    isDot: false,
    showZero: false,
    hidden: false,
    top: 0,
    right: 0,
    bgColor: 'var(--snake-color-error, #fa3534)',
    color: '#fff'
});

/** 徽标展示内容：圆点为空；数字超过 max 显示 max+；其余原样。 */
const contentText = computed(() => {
    if (props.isDot) return '';
    const { value, max } = props;
    const numericValue = Number(value);
    if (max !== undefined && numericValue > max) return `${max}+`;
    return value;
});

/** 是否展示徽标：圆点恒展示；空值与 0（未开启 showZero）隐藏。 */
const showBadge = computed(() => {
    if (props.hidden) return false;
    if (props.isDot) return true;
    const { value } = props;
    if (value === null || value === undefined || value === '') return false;
    if (Number(value) === 0) return props.showZero;
    return true;
});

const contentStyle = computed(() => [
    {
        top: addUnit(props.top),
        right: addUnit(props.right),
        backgroundColor: props.bgColor,
        color: props.color
    }
]);
</script>

<style lang="scss">
.snake-badge {
    position: relative;
    display: inline-block;
}
.snake-badge__content {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 14px;
    height: 14px;
    padding: 0 3px;
    border-radius: 50px;
    color: #fff;
    background: var(--snake-color-error, #fa3534);
    font-size: 9px;
    line-height: 1;
    white-space: nowrap;
    // 圆心对准包裹内容的右上角点（wot 同款变换），top/right 在此基础上偏移
    transform: translateY(-50%) translateX(50%);
    transform-origin: center;
}
.snake-badge__content--dot {
    width: 8px;
    min-width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
}
</style>
