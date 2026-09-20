<template>
    <view class="snake-tooltip" :class="customClass" :style="customStyle">
        <view class="snake-tooltip__target" @click.stop="toggle"><slot /></view>

        <snake-overlay v-if="visible" :show="visible" :opacity="0" :z-index="layerZIndex" @click="clickOverlay" />

        <view
            v-if="visible"
            class="snake-tooltip__panel"
            :class="[`snake-tooltip__panel--${placement}`, customPop]"
            :style="panelStyle"
            @click.stop
        >
            <view v-if="visibleArrow" class="snake-tooltip__arrow" :class="customArrow" />
            <view
                class="snake-tooltip__content"
                :class="[contentClass, { 'snake-tooltip__content--closeable': showCloseButton }]"
                :style="contentStyle"
            >
                <slot name="content">{{ content }}</slot>
            </view>
            <button v-if="showCloseButton" class="snake-tooltip__close" aria-label="关闭提示" @click.stop="close">
                ×
            </button>
        </view>
    </view>
</template>

<script lang="ts">
// 同页 Tooltip 共用关闭注册表，避免多个独立组件实例同时展开。
const tooltipClosers = new Set<() => void>();
</script>

<script setup lang="ts">
/**
 * @component Tooltip
 * @description 依附于触发元素展示的轻量提示浮层，适合说明文字和非操作性富内容。
 * @see /components/tooltip
 */

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import zIndexes from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { getRect } from '../../libs/function/getRect';
import type { TooltipEmits, TooltipExpose, TooltipProps } from './types';
import { getTooltipArrowPosition } from './position';

defineOptions({ name: 'Tooltip', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<TooltipProps>(), {
    modelValue: false,
    content: '',
    placement: 'bottom',
    offset: 8,
    visibleArrow: true,
    disabled: false,
    closeable: false,
    showClose: false,
    closeOnClickOverlay: true,
    zIndex: zIndexes.mask,
    customClass: '',
    customStyle: '',
    customArrow: '',
    customPop: '',
    contentClass: '',
    contentStyle: ''
});
const emit = defineEmits<TooltipEmits>();

// 每个 Tooltip 自己保存状态，避免列表中的某个说明打开时所有说明一起渲染。
const visible = ref(props.modelValue);
const instance = getCurrentInstance();
const arrowPosition = ref<{ x?: number; y?: number }>({});
const showCloseButton = computed(() => props.closeable || props.showClose);
const layerZIndex = computed(() => Number(props.zIndex) || zIndexes.mask);
const panelStyle = computed(() => ({
    '--snake-tooltip-offset': addUnit(props.offset),
    '--snake-tooltip-arrow-x': arrowPosition.value.x === undefined ? undefined : `${arrowPosition.value.x}px`,
    '--snake-tooltip-arrow-y': arrowPosition.value.y === undefined ? undefined : `${arrowPosition.value.y}px`,
    '--snake-tooltip-arrow-right': arrowPosition.value.x === undefined ? undefined : 'auto',
    '--snake-tooltip-arrow-bottom': arrowPosition.value.y === undefined ? undefined : 'auto',
    zIndex: layerZIndex.value + 1
}));

let positionRequest = 0;
async function updatePosition() {
    const request = ++positionRequest;
    if (!visible.value || !props.visibleArrow) return;
    await nextTick();
    const [target, panel] = await Promise.all([
        getRect('.snake-tooltip__target', instance),
        getRect('.snake-tooltip__panel', instance)
    ]);
    if (request !== positionRequest || !visible.value || !target.width || !panel.width || !panel.height) return;
    const arrowSize = typeof uni.upx2px === 'function' ? uni.upx2px(16) : 8;
    arrowPosition.value = getTooltipArrowPosition(props.placement, target, panel, arrowSize);
}

function setVisible(value: boolean) {
    if (visible.value === value) return;
    visible.value = value;
    emit('update:modelValue', value);
}

function open() {
    if (!props.disabled) setVisible(true);
}

function close() {
    setVisible(false);
}

function toggle() {
    if (props.disabled) return;
    setVisible(!visible.value);
}

function clickOverlay(event: unknown) {
    emit('click-overlay', event);
    if (props.closeOnClickOverlay) close();
}

watch(
    () => props.modelValue,
    value => {
        visible.value = value;
    }
);

watch(visible, value => {
    if (value) {
        for (const closeOther of tooltipClosers) {
            if (closeOther !== close) closeOther();
        }
        emit('open');
        void updatePosition();
    } else {
        positionRequest++;
        arrowPosition.value = {};
        emit('close');
    }
    emit('change', { show: value });
});

watch(
    () => [props.placement, props.content, props.offset, props.visibleArrow, showCloseButton.value],
    () => {
        arrowPosition.value = {};
        if (visible.value) void updatePosition();
    }
);

onMounted(() => {
    tooltipClosers.add(close);
    if (visible.value) {
        for (const closeOther of tooltipClosers) {
            if (closeOther !== close) closeOther();
        }
        void updatePosition();
    }
});
onBeforeUnmount(() => tooltipClosers.delete(close));

defineExpose<TooltipExpose>({ open, close, toggle, updatePosition });
</script>

<style scoped lang="scss">
.snake-tooltip {
    position: relative;
    display: inline-flex;
}

.snake-tooltip__target {
    display: inline-flex;
}

.snake-tooltip__panel {
    position: absolute;
    box-sizing: border-box;
    max-width: calc(100vw - 48rpx);
    color: var(--snake-tooltip-color, var(--snake-color-text, #26273a));
    background: var(--snake-tooltip-background, var(--snake-color-surface, #fff));
    border-radius: var(--snake-tooltip-radius, 8rpx);
    box-shadow: var(--snake-tooltip-shadow, 0 8rpx 24rpx rgba(0, 0, 0, 0.12));
}

.snake-tooltip__content {
    box-sizing: border-box;
    padding: var(--snake-tooltip-padding, 16rpx 20rpx);
    font-size: var(--snake-tooltip-font-size, 24rpx);
    line-height: 1.5;
}

.snake-tooltip__content--closeable {
    padding-right: 52rpx;
}

.snake-tooltip__arrow {
    position: absolute;
    width: 16rpx;
    height: 16rpx;
    background: inherit;
    transform: rotate(45deg);
}

.snake-tooltip__close {
    position: absolute;
    top: 4rpx;
    right: 8rpx;
    display: flex;
    width: 40rpx;
    height: 40rpx;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    font-size: 30rpx;
    line-height: 1;
    color: inherit;
    background: transparent;
    border: 0;
}

.snake-tooltip__close::after {
    border: 0;
}

.snake-tooltip__panel--top,
.snake-tooltip__panel--top-start,
.snake-tooltip__panel--top-end {
    bottom: calc(100% + var(--snake-tooltip-offset));
}

.snake-tooltip__panel--bottom,
.snake-tooltip__panel--bottom-start,
.snake-tooltip__panel--bottom-end {
    top: calc(100% + var(--snake-tooltip-offset));
}

.snake-tooltip__panel--left,
.snake-tooltip__panel--left-start,
.snake-tooltip__panel--left-end {
    right: calc(100% + var(--snake-tooltip-offset));
}

.snake-tooltip__panel--right,
.snake-tooltip__panel--right-start,
.snake-tooltip__panel--right-end {
    left: calc(100% + var(--snake-tooltip-offset));
}

.snake-tooltip__panel--top,
.snake-tooltip__panel--bottom {
    left: 50%;
    transform: translateX(-50%);
}

.snake-tooltip__panel--left,
.snake-tooltip__panel--right {
    top: 50%;
    transform: translateY(-50%);
}

.snake-tooltip__panel--top-start,
.snake-tooltip__panel--bottom-start {
    left: 0;
}

.snake-tooltip__panel--top-end,
.snake-tooltip__panel--bottom-end {
    right: 0;
}

.snake-tooltip__panel--left-start,
.snake-tooltip__panel--right-start {
    top: 0;
}

.snake-tooltip__panel--left-end,
.snake-tooltip__panel--right-end {
    bottom: 0;
}

.snake-tooltip__panel--top .snake-tooltip__arrow,
.snake-tooltip__panel--top-start .snake-tooltip__arrow,
.snake-tooltip__panel--top-end .snake-tooltip__arrow {
    bottom: -8rpx;
}

.snake-tooltip__panel--bottom .snake-tooltip__arrow,
.snake-tooltip__panel--bottom-start .snake-tooltip__arrow,
.snake-tooltip__panel--bottom-end .snake-tooltip__arrow {
    top: -8rpx;
}

.snake-tooltip__panel--left .snake-tooltip__arrow,
.snake-tooltip__panel--left-start .snake-tooltip__arrow,
.snake-tooltip__panel--left-end .snake-tooltip__arrow {
    right: -8rpx;
}

.snake-tooltip__panel--right .snake-tooltip__arrow,
.snake-tooltip__panel--right-start .snake-tooltip__arrow,
.snake-tooltip__panel--right-end .snake-tooltip__arrow {
    left: -8rpx;
}

.snake-tooltip__panel--top .snake-tooltip__arrow,
.snake-tooltip__panel--bottom .snake-tooltip__arrow {
    left: var(--snake-tooltip-arrow-x, calc(50% - 8rpx));
}

.snake-tooltip__panel--left .snake-tooltip__arrow,
.snake-tooltip__panel--right .snake-tooltip__arrow {
    top: var(--snake-tooltip-arrow-y, calc(50% - 8rpx));
}

.snake-tooltip__panel--top-start .snake-tooltip__arrow,
.snake-tooltip__panel--bottom-start .snake-tooltip__arrow {
    left: var(--snake-tooltip-arrow-x, 20rpx);
}

.snake-tooltip__panel--top-end .snake-tooltip__arrow,
.snake-tooltip__panel--bottom-end .snake-tooltip__arrow {
    left: var(--snake-tooltip-arrow-x, auto);
    right: var(--snake-tooltip-arrow-right, 20rpx);
}

.snake-tooltip__panel--left-start .snake-tooltip__arrow,
.snake-tooltip__panel--right-start .snake-tooltip__arrow {
    top: var(--snake-tooltip-arrow-y, 16rpx);
}

.snake-tooltip__panel--left-end .snake-tooltip__arrow,
.snake-tooltip__panel--right-end .snake-tooltip__arrow {
    top: var(--snake-tooltip-arrow-y, auto);
    bottom: var(--snake-tooltip-arrow-bottom, 16rpx);
}
</style>
