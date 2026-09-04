<script setup lang="ts">
/**
 * @component SnakeButton
 * @description 正式操作按钮，支持多主题、尺寸、胶囊形态、加载、图标、水波纹、点击节流、表单行为和小程序开放能力。
 * @see /components/button
 */

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, ref } from 'vue';
import { colorToRgba } from '../../libs/function/color';
import { getRect } from '../../libs/function/getRect';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import SnakeLoadingIcon from '../snake-loading-icon/snake-loading-icon.vue';
import { snakeButtonProps } from './types';
import type { SnakeButtonEmits } from './types';

defineOptions({ name: 'SnakeButton', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(snakeButtonProps);
const emit = defineEmits<SnakeButtonEmits>();
const emitNative = emit as unknown as (name: Exclude<keyof SnakeButtonEmits, 'click'>, event: unknown) => void;
const instance = getCurrentInstance();
const rippleActive = ref(false);
const rippleStyle = ref({ top: '50%', left: '50%', width: '0px', height: '0px' });
let lastClick = 0;
let rippleTimer: ReturnType<typeof setTimeout> | undefined;

const palette = computed(() => {
    const name = props.type === 'default' ? 'primary' : props.type;
    if (props.color) {
        // plain 模式用自定义色 10% 透明度的浅底；非 hex 颜色解析不了，回退到类型浅色 token
        const tint = colorToRgba(props.color, 0.1);
        return {
            main: props.color,
            light: tint === props.color ? `var(--snake-color-${name}-light, #f4f4f5)` : tint,
            disabled: props.color
        };
    }
    return {
        main: `var(--snake-color-${name}, ${props.type === 'default' ? '#06D290' : '#707184'})`,
        light: `var(--snake-color-${name}-light, #f4f4f5)`,
        disabled: `var(--snake-color-${name}-disabled, #c8c9cc)`
    };
});
const buttonStyle = computed(() => [
    {
        color: props.plain
            ? palette.value.main
            : props.type === 'default' || props.type === 'primary'
              ? 'var(--snake-color-primary-ink, #FFFFFF)'
              : 'var(--snake-color-white, #fff)',
        backgroundColor: props.plain ? palette.value.light : palette.value.main,
        // 实心按钮不描边（uview 同款：彩色实心描同色边框会在四角产生毛刺），镂空按钮描主色边，禁用描灰色边
        borderColor: props.disabled ? palette.value.disabled : props.plain ? palette.value.main : 'transparent',
        borderWidth: props.plain ? undefined : 0,
        opacity: props.disabled ? 0.65 : 1,
        overflow: props.ripple ? 'hidden' : 'visible'
    },
    props.customStyle
]);
const effectiveHoverClass = computed(() => {
    if (props.disabled || props.loading || props.ripple) return 'none';
    return props.hoverClass || 'snake-button--hover';
});
const displayText = computed(() => (props.loading && props.loadingText ? props.loadingText : props.text));

type PointerEventLike = {
    clientX?: number;
    clientY?: number;
    pageX?: number;
    pageY?: number;
    x?: number;
    y?: number;
    touches?: PointerEventLike[];
    changedTouches?: PointerEventLike[];
    detail?: PointerEventLike;
};

function getPointer(event: unknown) {
    const source = event as PointerEventLike;
    const pointer = source.changedTouches?.[0] ?? source.touches?.[0] ?? source.detail ?? source;
    return {
        x: pointer.clientX ?? pointer.x ?? pointer.pageX,
        y: pointer.clientY ?? pointer.y ?? pointer.pageY
    };
}

/** 根据操作点与按钮边界生成足以覆盖四个角的水波纹。 */
function startRipple(event: unknown) {
    rippleActive.value = false;
    if (rippleTimer) clearTimeout(rippleTimer);

    nextTick(() => {
        getRect('.snake-button', instance).then(rect => {
            if (Array.isArray(rect) || !rect.width || !rect.height) return;
            const pointer = getPointer(event);
            const left = rect.left ?? 0;
            const top = rect.top ?? 0;
            const localX = Math.min(rect.width, Math.max(0, (pointer.x ?? left + rect.width / 2) - left));
            const localY = Math.min(rect.height, Math.max(0, (pointer.y ?? top + rect.height / 2) - top));
            const radius = Math.max(
                Math.hypot(localX, localY),
                Math.hypot(rect.width - localX, localY),
                Math.hypot(localX, rect.height - localY),
                Math.hypot(rect.width - localX, rect.height - localY)
            );
            const diameter = radius * 2;
            rippleStyle.value = {
                top: `${localY - radius}px`,
                left: `${localX - radius}px`,
                width: `${diameter}px`,
                height: `${diameter}px`
            };
            nextTick(() => {
                rippleActive.value = true;
                rippleTimer = setTimeout(() => (rippleActive.value = false), 600);
            });
        });
    });
}

function click(event: unknown) {
    if (props.disabled || props.loading) return;
    const now = Date.now();
    const wait = Math.max(0, Number(props.throttleTime) || 0);
    if (wait && now - lastClick < wait) return;
    lastClick = now;
    if (props.ripple) startRipple(event);
    emit('click', event);
}

onBeforeUnmount(() => {
    if (rippleTimer) clearTimeout(rippleTimer);
});

function forward(name: Exclude<keyof SnakeButtonEmits, 'click'>, event: unknown) {
    emitNative(name, event);
}

function authorize(event: unknown) {
    if (props.scope === 'phoneNumber') emit('getphonenumber', event);
    if (props.scope === 'userInfo') emit('getuserinfo', event);
}
</script>

<template>
    <button
        class="snake-button"
        :class="[
            `snake-button--${size}`,
            `snake-button--${shape}`,
            {
                'snake-button--plain': plain,
                'snake-button--hairline': hairLine,
                'snake-button--loading': loading,
                'snake-button--block': block
            },
            customClass
        ]"
        :style="buttonStyle"
        :disabled="disabled"
        :form-type="formType || undefined"
        :open-type="disabled || loading ? undefined : openType || undefined"
        :app-parameter="appParameter"
        :hover-stop-propagation="hoverStopPropagation"
        :hover-class="effectiveHoverClass"
        :hover-start-time="Number(hoverStartTime)"
        :hover-stay-time="Number(hoverStayTime)"
        :lang="lang"
        :session-from="sessionFrom"
        :send-message-title="sendMessageTitle"
        :send-message-path="sendMessagePath"
        :send-message-img="sendMessageImg"
        :show-message-card="showMessageCard"
        :data-name="dataName"
        @click="click"
        @getauthorize="authorize"
        @getuserinfo="forward('getuserinfo', $event)"
        @contact="forward('contact', $event)"
        @getphonenumber="forward('getphonenumber', $event)"
        @error="forward('error', $event)"
        @launchapp="forward('launchapp', $event)"
        @opensetting="forward('opensetting', $event)"
        @chooseavatar="forward('chooseavatar', $event)"
        @agreeprivacyauthorization="forward('agreeprivacyauthorization', $event)"
    >
        <view class="snake-button__content" :class="contentClass" :style="contentStyle">
            <snake-loading-icon
                v-if="loading"
                class="snake-button__leading"
                :mode="loadingMode"
                :size="loadingSize"
                :color="plain ? palette.main : 'currentColor'"
                inactive-color="rgba(255,255,255,.45)"
            />
            <snake-icon
                v-else-if="icon"
                class="snake-button__leading"
                :name="icon"
                :size="loadingSize"
                :color="iconColor || 'currentColor'"
            />
            <slot>{{ displayText }}</slot>
        </view>
        <view
            v-if="ripple"
            class="snake-button__ripple"
            :class="{ 'snake-button__ripple--active': rippleActive }"
            :style="{ ...rippleStyle, backgroundColor: rippleBgColor }"
        />
    </button>
</template>

<style scoped>
.snake-button {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0 40rpx;
    border-width: 1px;
    border-style: solid;
    border-radius: var(--snake-radius-small, 10rpx);
    font-weight: 500;
    line-height: 1;
    cursor: pointer;
    transition:
        color var(--snake-duration-fast, 180ms),
        background-color var(--snake-duration-fast, 180ms),
        border-color var(--snake-duration-fast, 180ms),
        opacity var(--snake-duration-fast, 180ms),
        filter var(--snake-duration-fast, 180ms),
        transform var(--snake-duration-fast, 180ms);
}
.snake-button::after {
    border: 0;
}
.snake-button--hover {
    filter: brightness(0.92);
    transform: translateY(1px);
}
.snake-button--block {
    width: 100%;
}
.snake-button--large {
    height: 100rpx;
    font-size: 36rpx;
}
.snake-button--default {
    height: 80rpx;
    font-size: 30rpx;
}
.snake-button--medium {
    width: auto;
    height: 70rpx;
    padding: 0 72rpx;
    font-size: 26rpx;
}
.snake-button--small {
    width: auto;
    height: 60rpx;
    padding: 0 30rpx;
    font-size: 24rpx;
}
.snake-button--mini {
    width: auto;
    height: 50rpx;
    padding: 0 20rpx;
    font-size: 22rpx;
}
.snake-button--circle {
    border-radius: 999px;
}
.snake-button--hairline {
    border-width: 0.5px;
}
.snake-button__content {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
}
.snake-button__leading {
    margin-right: 12rpx;
}
.snake-button__ripple {
    position: absolute;
    z-index: 0;
    border-radius: 50%;
    opacity: 0;
    transform: scale(0);
    transform-origin: center;
    pointer-events: none;
}
.snake-button__ripple--active {
    animation: snake-button-ripple 0.6s ease-out;
}
@keyframes snake-button-ripple {
    0% {
        opacity: 1;
        transform: scale(0);
    }
    100% {
        opacity: 0;
        transform: scale(1);
    }
}
</style>
