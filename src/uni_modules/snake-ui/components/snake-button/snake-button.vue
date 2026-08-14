<script setup lang="ts">
import { computed, ref } from 'vue';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import SnakeLoadingIcon from '../snake-loading-icon/snake-loading-icon.vue';
import type { SnakeButtonEmits, SnakeButtonProps } from './types';

defineOptions({ name: 'SnakeButton', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeButtonProps>(), {
    text: '',
    type: 'default',
    size: 'default',
    shape: 'square',
    plain: false,
    hairLine: true,
    disabled: false,
    loading: false,
    loadingText: '',
    loadingMode: 'circle',
    loadingSize: 18,
    icon: '',
    iconColor: '',
    color: '',
    customClass: '',
    customStyle: '',
    ripple: false,
    rippleBgColor: 'rgba(255, 255, 255, .28)',
    hoverClass: '',
    hoverStartTime: 20,
    hoverStayTime: 150,
    throttleTime: 0,
    formType: '',
    openType: '',
    scope: '',
    appParameter: '',
    hoverStopPropagation: false,
    lang: 'en',
    sessionFrom: '',
    sendMessageTitle: '',
    sendMessagePath: '',
    sendMessageImg: '',
    showMessageCard: false,
    dataName: ''
});
const emit = defineEmits<SnakeButtonEmits>();
const emitNative = emit as unknown as (name: Exclude<keyof SnakeButtonEmits, 'click'>, event: unknown) => void;
const rippleActive = ref(false);
let lastClick = 0;
let rippleTimer: ReturnType<typeof setTimeout> | undefined;

const palette = computed(() => {
    if (props.color) return { main: props.color, light: props.color, disabled: props.color };
    const name = props.type === 'default' ? 'primary' : props.type;
    return {
        main: `var(--snake-color-${name}, ${props.type === 'default' ? '#00a86f' : '#909399'})`,
        light: `var(--snake-color-${name}-light, #f4f4f5)`,
        disabled: `var(--snake-color-${name}-disabled, #c8c9cc)`
    };
});
const buttonStyle = computed(() => [
    {
        color: props.plain ? palette.value.main : 'var(--snake-color-white, #fff)',
        backgroundColor: props.plain ? palette.value.light : palette.value.main,
        borderColor: props.disabled ? palette.value.disabled : palette.value.main,
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

function click(event: unknown) {
    if (props.disabled || props.loading) return;
    const now = Date.now();
    const wait = Math.max(0, Number(props.throttleTime) || 0);
    if (wait && now - lastClick < wait) return;
    lastClick = now;
    if (props.ripple) {
        rippleActive.value = false;
        if (rippleTimer) clearTimeout(rippleTimer);
        setTimeout(() => {
            rippleActive.value = true;
            rippleTimer = setTimeout(() => (rippleActive.value = false), 600);
        }, 0);
    }
    emit('click', event);
}

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
            { 'snake-button--plain': plain, 'snake-button--hairline': hairLine, 'snake-button--loading': loading },
            customClass
        ]"
        :style="[$snakeThemeStyle, buttonStyle]"
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
        <view class="snake-button__content">
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
            :style="{ backgroundColor: rippleBgColor }"
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
    width: 100%;
    margin: 0;
    padding: 0 40rpx;
    border-width: 1px;
    border-style: solid;
    border-radius: var(--snake-radius-small, 8rpx);
    font-weight: 400;
    line-height: 1;
    cursor: pointer;
    transition:
        color var(--snake-duration-fast, 180ms),
        background-color var(--snake-duration-fast, 180ms),
        border-color var(--snake-duration-fast, 180ms),
        opacity var(--snake-duration-fast, 180ms);
}
.snake-button::after {
    border: 0;
}
.snake-button--hover {
    filter: brightness(0.92);
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
    padding: 0 64rpx;
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
}
.snake-button__leading {
    margin-right: 12rpx;
}
.snake-button__ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 0;
    width: 100%;
    padding-bottom: 100%;
    border-radius: 50%;
    opacity: 0;
    transform: translate(-50%, -50%) scale(0);
    pointer-events: none;
}
.snake-button__ripple--active {
    animation: snake-button-ripple 0.6s ease-out;
}
@keyframes snake-button-ripple {
    0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(2);
    }
}
</style>
