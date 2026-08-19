<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from 'vue';
import { addUnit } from '../../libs';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import SnakeOverlay from '../snake-overlay/snake-overlay.vue';
import SnakeTransition from '../snake-transition/snake-transition.vue';
import type { SnakePopupEmits, SnakePopupProps } from './types';

defineOptions({ name: 'SnakePopup', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakePopupProps>(), {
    modelValue: false,
    mode: 'center',
    bgColor: 'var(--snake-color-surface, #fff)',
    zIndex: 10075,
    duration: 300,
    round: false,
    zoom: true,
    closeable: false,
    closeIcon: 'close',
    closeIconColor: 'var(--snake-color-text-muted, #707184)',
    closeIconSize: 20,
    closeIconPos: 'top-right',
    closeOnClickOverlay: true,
    overlay: true,
    overlayOpacity: 0.5,
    overlayStyle: '',
    safeAreaInsetBottom: false,
    safeAreaInsetTop: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakePopupEmits>();
// Vue 3 对未传递的 Boolean prop 做 boolean casting（值为 false 而非 undefined），
// 不能用空值合并把 show 兜底到 modelValue：未绑定 show 时 v-model 通道会被 false 短路。
// 这里在 setup 时检测父组件是否真的绑定了 show，绑定则 show 优先，否则走 v-model(modelValue)。
const showBound = 'show' in (getCurrentInstance()?.vnode?.props ?? {});
const externalShow = computed(() => (showBound ? props.show : props.modelValue));
const localShow = ref(externalShow.value);
watch(externalShow, value => {
    if (localShow.value === value) return;
    localShow.value = value;
    if (value) emit('open');
    else emit('close');
    emit('change', { show: value });
});

const transitionName = computed(() => {
    if (props.mode === 'center') return props.zoom ? 'zoom-in' : 'fade';
    return {
        top: 'slide-down',
        right: 'slide-left',
        bottom: 'slide-up',
        left: 'slide-right'
    }[props.mode] as 'slide-down' | 'slide-left' | 'slide-up' | 'slide-right';
});
const radius = computed(() => {
    if (props.round === false) return '0';
    if (props.round === true) return 'var(--snake-radius-large, 20rpx)';
    return addUnit(props.round, 'rpx');
});
const panelStyle = computed(() => [
    {
        backgroundColor: props.bgColor,
        zIndex: props.zIndex,
        borderRadius: radius.value,
        paddingBottom: props.safeAreaInsetBottom ? 'env(safe-area-inset-bottom)' : undefined,
        paddingTop: props.safeAreaInsetTop ? 'env(safe-area-inset-top)' : undefined
    },
    props.customStyle
]);

function setVisible(value: boolean) {
    if (localShow.value === value) return;
    localShow.value = value;
    emit('update:modelValue', value);
    emit('update:show', value);
    if (value) emit('open');
    else emit('close');
    emit('change', { show: value });
}

function open() {
    setVisible(true);
}
function close() {
    setVisible(false);
}
function overlayClick(event: unknown) {
    emit('click-overlay', event);
    if (props.closeOnClickOverlay) close();
}

defineExpose({ open, close });
</script>

<template>
    <view class="snake-popup" :style="{ pointerEvents: localShow ? 'auto' : 'none' }">
        <snake-overlay
            v-if="overlay"
            :show="localShow"
            :z-index="zIndex - 1"
            :duration="duration"
            :opacity="overlayOpacity"
            :custom-style="overlayStyle"
            @click="overlayClick"
        />
        <snake-transition
            :show="localShow"
            :name="transitionName"
            :duration="duration"
            :custom-class="['snake-popup__panel', `snake-popup__panel--${mode}`, customClass].filter(Boolean).join(' ')"
            :custom-style="panelStyle"
            @after-enter="emit('opened')"
            @after-leave="emit('closed')"
        >
            <slot />
            <view
                v-if="closeable"
                class="snake-popup__close"
                :class="`snake-popup__close--${closeIconPos}`"
                @click.stop="close"
            >
                <snake-icon :name="closeIcon" :color="closeIconColor" :size="closeIconSize" />
            </view>
        </snake-transition>
    </view>
</template>

<style>
.snake-popup__panel {
    position: fixed;
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
    overflow: auto;
}
.snake-popup__panel--center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.snake-popup__panel--center.snake-transition--zoom-in-enter {
    animation-name: snake-popup-center-zoom-in;
}
.snake-popup__panel--center.snake-transition--zoom-in-leave {
    animation-name: snake-popup-center-zoom-out;
}
.snake-popup__panel--top {
    top: 0;
    left: 0;
    width: 100%;
}
.snake-popup__panel--bottom {
    bottom: 0;
    left: 0;
    width: 100%;
}
.snake-popup__panel--left {
    top: 0;
    bottom: 0;
    left: 0;
}
.snake-popup__panel--right {
    top: 0;
    right: 0;
    bottom: 0;
}
.snake-popup__close {
    position: absolute;
    z-index: 1;
    display: flex;
    padding: 20rpx;
}
.snake-popup__close--top-left {
    top: 0;
    left: 0;
}
.snake-popup__close--top-right {
    top: 0;
    right: 0;
}
.snake-popup__close--bottom-left {
    bottom: 0;
    left: 0;
}
.snake-popup__close--bottom-right {
    right: 0;
    bottom: 0;
}
@keyframes snake-popup-center-zoom-in {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.85);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}
@keyframes snake-popup-center-zoom-out {
    from {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
    to {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.85);
    }
}
</style>
