<template>
    <button
        id="snake-wave-btn"
        class="snake-button snake-line-1 snake-fix-ios-appearance"
        data-eventsync="true"
        :class="[
            `snake-size-${size}`,
            plain ? `snake-button--${type}--plain` : '',
            loading ? 'snake-loading' : '',
            shape === 'circle' ? 'snake-round-circle' : '',
            hairLine ? hairLineClass : 'snake-button--bold-border',
            `snake-button--${type}`,
            disabled ? `snake-button--${type}--disabled` : '',
            customClass
        ]"
        :hover-start-time="Number(hoverStartTime)"
        :hover-stay-time="Number(hoverStayTime)"
        :disabled="disabled"
        :form-type="formType || undefined"
        :open-type="disabled || loading ? undefined : openType || undefined"
        :app-parameter="appParameter"
        :hover-stop-propagation="hoverStopPropagation"
        :send-message-title="sendMessageTitle"
        :send-message-path="sendMessagePath"
        :lang="lang"
        :data-name="dataName"
        :session-from="sessionFrom"
        :send-message-img="sendMessageImg"
        :show-message-card="showMessageCard"
        :style="rootStyle"
        :hover-class="hoverClassName"
        :loading="loading"
        @tap.stop="click"
        @getauthorize="getAuthorize"
        @getuserinfo="forward('getuserinfo', $event)"
        @contact="forward('contact', $event)"
        @getphonenumber="forward('getphonenumber', $event)"
        @error="forward('error', $event)"
        @launchapp="forward('launchapp', $event)"
        @opensetting="forward('opensetting', $event)"
        @chooseavatar="forward('chooseavatar', $event)"
        @agreeprivacyauthorization="forward('agreeprivacyauthorization', $event)"
    >
        <slot>{{ text }}</slot>
        <view
            v-if="ripple"
            class="snake-wave-ripple"
            :class="{ 'snake-wave-active': waveActive }"
            :style="{
                top: `${rippleTop}px`,
                left: `${rippleLeft}px`,
                width: `${targetWidth}px`,
                height: `${targetWidth}px`,
                backgroundColor: rippleBgColor || 'rgba(0, 0, 0, 0.15)'
            }"
        />
    </button>
</template>

<script setup lang="ts">
/**
 * @component Button
 * @description 跨端按钮。
 * @see /components/button
 */
import { computed, getCurrentInstance, nextTick, ref } from 'vue';
import { toStyle } from '../../libs/function/style';
import { buttonProps } from './types';
import type { ButtonEmits } from './types';

defineOptions({ name: 'SnakeButton', options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(buttonProps);
const emit = defineEmits<ButtonEmits>();
const emitNative = emit as unknown as (name: Exclude<keyof ButtonEmits, 'click'>, event: unknown) => void;
const instance = getCurrentInstance();
const rippleTop = ref(0);
const rippleLeft = ref(0);
const targetWidth = ref(0);
const waveActive = ref(false);
let lastClickTime = 0;

const hoverClassName = computed(() => {
    if (props.loading || props.disabled || props.ripple) return '';
    if (props.hoverClass) return props.hoverClass;
    return props.plain ? `snake-${props.type}-plain-hover` : `snake-${props.type}-hover`;
});
const hairLineClass = computed(() =>
    ['primary', 'success', 'error', 'warning'].includes(props.type) && !props.plain ? '' : 'snake-hairline-border'
);
const rootStyle = computed(() => toStyle({ overflow: props.ripple ? 'hidden' : 'visible' }, props.customStyle));

function click(event: unknown) {
    const wait = Number(props.throttleTime);
    if (wait) {
        const now = Date.now();
        if (now - lastClickTime < wait) return;
        lastClickTime = now;
    }
    if (props.loading || props.disabled) return;
    if (props.ripple) {
        waveActive.value = false;
        nextTick(() => getWaveQuery(event));
    }
    emit('click', event);
}

type TouchPoint = { clientX?: number; clientY?: number };
type TouchEventLike = { touches?: TouchPoint[]; changedTouches?: TouchPoint[]; detail?: TouchPoint };

function getWaveQuery(event: unknown) {
    uni.createSelectorQuery()
        .in(instance?.proxy ?? null)
        .select('.snake-button')
        .boundingClientRect(rect => {
            if (!rect || Array.isArray(rect) || !rect.width || !rect.height) return;
            const source = event as TouchEventLike;
            const touch = source.changedTouches?.[0] ?? source.touches?.[0] ?? source.detail;
            if (!touch) return;
            targetWidth.value = Math.max(rect.height, rect.width);
            rippleTop.value = Number(touch.clientY) - (rect.top ?? 0) - targetWidth.value / 2;
            rippleLeft.value = Number(touch.clientX) - (rect.left ?? 0) - targetWidth.value / 2;
            nextTick(() => (waveActive.value = true));
        })
        .exec();
}

function forward(name: Exclude<keyof ButtonEmits, 'click'>, event: unknown) {
    emitNative(name, event);
}
function getAuthorize(event: unknown) {
    if (props.scope === 'phoneNumber') emit('getphonenumber', event);
    else if (props.scope === 'userInfo') emit('getuserinfo', event);
}
</script>

<style scoped>
.snake-button::after {
    border: none;
}
.snake-button {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    padding: 0 40rpx;
    border: 0;
    line-height: 1;
    cursor: pointer;
    transition: all 0.15s;
}
.snake-button--bold-border {
    border: 1px solid var(--snake-color-white, #fff);
}
.snake-button--default {
    color: var(--snake-color-text, #606266);
    border-color: var(--snake-color-border-light, #c8c9cc);
    background-color: var(--snake-color-surface, #fff);
}
.snake-button--primary {
    color: var(--snake-color-white, #fff);
    border-color: var(--snake-color-primary, #06d290);
    background-color: var(--snake-color-primary, #06d290);
}
.snake-button--success {
    color: var(--snake-color-white, #fff);
    border-color: var(--snake-color-success, #19be6b);
    background-color: var(--snake-color-success, #19be6b);
}
.snake-button--error {
    color: var(--snake-color-white, #fff);
    border-color: var(--snake-color-error, #fa3534);
    background-color: var(--snake-color-error, #fa3534);
}
.snake-button--warning {
    color: var(--snake-color-white, #fff);
    border-color: var(--snake-color-warning, #ff9900);
    background-color: var(--snake-color-warning, #ff9900);
}
.snake-button--default--disabled {
    color: var(--snake-color-white, #fff);
    border-color: var(--snake-color-border, #e4e7ed);
    background-color: var(--snake-color-surface, #fff);
}
.snake-button--primary--disabled {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-primary-disabled, #71d5a1) !important;
    background-color: var(--snake-color-primary-disabled, #71d5a1) !important;
}
.snake-button--success--disabled {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-success-disabled, #71d5a1) !important;
    background-color: var(--snake-color-success-disabled, #71d5a1) !important;
}
.snake-button--error--disabled {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-error-disabled, #fab6b6) !important;
    background-color: var(--snake-color-error-disabled, #fab6b6) !important;
}
.snake-button--warning--disabled {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-warning-disabled, #fcbd71) !important;
    background-color: var(--snake-color-warning-disabled, #fcbd71) !important;
}
.snake-button--primary--plain {
    color: var(--snake-color-primary, #06d290) !important;
    border-color: var(--snake-color-primary-disabled, #71d5a1) !important;
    background-color: var(--snake-color-primary-light, #06d2901a) !important;
}
.snake-button--success--plain {
    color: var(--snake-color-success, #19be6b) !important;
    border-color: var(--snake-color-success-disabled, #71d5a1) !important;
    background-color: var(--snake-color-success-light, #dbf1e1) !important;
}
.snake-button--error--plain {
    color: var(--snake-color-error, #fa3534) !important;
    border-color: var(--snake-color-error-disabled, #fab6b6) !important;
    background-color: var(--snake-color-error-light, #fef0f0) !important;
}
.snake-button--warning--plain {
    color: var(--snake-color-warning, #ff9900) !important;
    border-color: var(--snake-color-warning-disabled, #fcbd71) !important;
    background-color: var(--snake-color-warning-light, #fdf6ec) !important;
}
.snake-hairline-border::after {
    content: ' ';
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 199.8%;
    height: 199.7%;
    border: 1px solid currentColor;
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
}
.snake-wave-ripple {
    position: absolute;
    z-index: 0;
    border-radius: 100%;
    opacity: 1;
    background-clip: padding-box;
    transform: scale(0);
    transform-origin: center;
    pointer-events: none;
    user-select: none;
}
.snake-wave-ripple.snake-wave-active {
    opacity: 0;
    transform: scale(2);
    transition:
        opacity 1s linear,
        transform 0.4s linear;
}
.snake-round-circle,
.snake-round-circle::after {
    border-radius: 100rpx;
}
.snake-loading::after {
    background-color: hsla(0, 0%, 100%, 0.35);
}
.snake-size-large {
    height: 100rpx;
    font-size: 36rpx;
    line-height: 100rpx;
}
.snake-size-default {
    height: 80rpx;
    font-size: 30rpx;
    line-height: 80rpx;
}
.snake-size-medium {
    display: inline-flex;
    width: auto;
    height: 70rpx;
    padding: 0 80rpx;
    font-size: 26rpx;
    line-height: 70rpx;
}
.snake-size-small {
    display: inline-flex;
    width: auto;
    height: 60rpx;
    padding: 0 30rpx;
    font-size: 24rpx;
    line-height: 60rpx;
}
.snake-size-mini {
    display: inline-flex;
    width: auto;
    height: 50rpx;
    padding: 0 20rpx;
    padding-top: 1px;
    font-size: 22rpx;
    line-height: 50rpx;
}
.snake-primary-plain-hover {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-primary-dark, #18b566) !important;
    background-color: var(--snake-color-primary-dark, #18b566) !important;
}
.snake-default-plain-hover {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-primary-dark, #18b566) !important;
    background-color: var(--snake-color-primary-dark, #18b566) !important;
}
.snake-success-plain-hover {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-success-dark, #18b566) !important;
    background-color: var(--snake-color-success-dark, #18b566) !important;
}
.snake-warning-plain-hover {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-warning-dark, #f29100) !important;
    background-color: var(--snake-color-warning-dark, #f29100) !important;
}
.snake-error-plain-hover {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-error-dark, #dd6161) !important;
    background-color: var(--snake-color-error-dark, #dd6161) !important;
}
.snake-info-plain-hover {
    color: var(--snake-color-white, #fff) !important;
    border-color: var(--snake-color-info-dark, #767a82) !important;
    background-color: var(--snake-color-info-dark, #767a82) !important;
}
.snake-default-hover {
    color: var(--snake-color-primary-dark, #18b566) !important;
    border-color: var(--snake-color-primary-dark, #18b566) !important;
    background-color: var(--snake-color-primary-light, #06d2901a) !important;
}
.snake-primary-hover {
    color: var(--snake-color-white, #fff);
    background: var(--snake-color-primary-dark, #18b566) !important;
}
.snake-success-hover {
    color: var(--snake-color-white, #fff);
    background: var(--snake-color-success-dark, #18b566) !important;
}
.snake-info-hover {
    color: var(--snake-color-white, #fff);
    background: var(--snake-color-info-dark, #767a82) !important;
}
.snake-warning-hover {
    color: var(--snake-color-white, #fff);
    background: var(--snake-color-warning-dark, #f29100) !important;
}
.snake-error-hover {
    color: var(--snake-color-white, #fff);
    background: var(--snake-color-error-dark, #dd6161) !important;
}
</style>
