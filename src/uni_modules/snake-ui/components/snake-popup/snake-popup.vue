<script setup lang="ts">
/**
 * @component Popup
 * @description 基于 Overlay 与 Transition 的正式弹层，支持中心和四边弹出、圆角、关闭图标、安全区以及完整生命周期。
 * @see /components/popup
 */

import { computed, getCurrentInstance, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import Icon from '../snake-icon/snake-icon.vue';
import Overlay from '../snake-overlay/snake-overlay.vue';
import Transition from '../snake-transition/snake-transition.vue';
import type { PopupEmits, PopupProps } from './types';

defineOptions({ name: 'Popup', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<PopupProps>(), {
    modelValue: false,
    mode: 'center',
    bgColor: 'var(--snake-color-surface, #fff)',
    zIndex: zIndex.popup,
    duration: 300,
    round: false,
    zoom: true,
    closeable: false,
    closeIcon: 'close',
    closeIconColor: 'var(--snake-color-text-muted, #909399)',
    closeIconSize: 20,
    closeIconPos: 'top-right',
    closeOnClickOverlay: true,
    overlay: true,
    overlayOpacity: 0.5,
    lockScroll: true,
    overlayStyle: '',
    safeAreaInsetBottom: false,
    safeAreaInsetTop: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<PopupEmits>();
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
    const value = props.round === true ? 'var(--snake-radius-large, 20rpx)' : addUnit(props.round, 'rpx');
    // 四边弹层只圆远离屏幕边缘的一侧，否则贴着屏幕边的角会被圆掉露出页面背景
    switch (props.mode) {
        case 'top':
            return `0 0 ${value} ${value}`;
        case 'bottom':
            return `${value} ${value} 0 0`;
        case 'left':
            return `0 ${value} ${value} 0`;
        case 'right':
            return `${value} 0 0 ${value}`;
        default:
            return value;
    }
});
// 计算整理后的 z-index 值：缺失/非法时退回 popup 档
const uZIndex = computed(() => Number(props.zIndex) || zIndex.popup);
// 根节点持有整棵弹层的页面层级：遮罩与面板被锁进同一个专属
// 层叠上下文，页面元素无法插进遮罩与面板之间，任何一级行内层级在运行时丢失，
// 面板也不会被自家遮罩盖住（根为 fixed，即使行内 z 丢失也仍是独立层叠上下文）
const rootStyle = computed<CSSProperties>(() => ({
    zIndex: uZIndex.value - 1,
    // 采用 v-if 语义：弹层隐藏时整棵弹层不渲染，空壳不存在；
    // 我们的根常驻（离场动画需要），隐藏时置 none 不拦截页面点击，显示时恢复 auto——
    // 遮罩/面板自身零 pointer-events 声明，交互完全由根决定
    pointerEvents: localShow.value ? 'auto' : 'none'
}));
const panelStyle = computed(() => [
    {
        backgroundColor: props.bgColor,
        // 面板行内层级（uZ）：排序范围是根节点的专属上下文，只需压过遮罩（uZ-2）
        zIndex: uZIndex.value,
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
    <view class="snake-popup" :style="rootStyle">
        <!-- 三层结构：根 / 遮罩 / 面板，全部收在根的层叠上下文内 -->
        <snake-overlay
            v-if="overlay"
            :show="localShow"
            :z-index="uZIndex - 2"
            :duration="duration"
            :opacity="overlayOpacity"
            :lock-scroll="lockScroll"
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
/* 全屏定位根：为遮罩与面板提供专属层叠上下文；隐藏时空根不拦截
   页面点击（pointer-events 由 rootStyle 动态切换），无遮罩弹层仍可点击面板以外的页面区域 */
.snake-popup {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
.snake-popup__panel {
    /* 挂在 fixed 根内，定位基准仍是视口；行内 z-index 丢失时的基线层级（popup 档） */
    position: absolute;
    pointer-events: auto;
    z-index: var(--snake-z-index-popup, 10075);
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
/* 四边弹层整块滑入滑出：transition 通用滑入只有 40rpx 位移 + 淡入，这里覆盖为 100% 平移 */
.snake-popup__panel--bottom.snake-transition--slide-up-enter {
    animation-name: snake-popup-slide-up-in;
}
.snake-popup__panel--bottom.snake-transition--slide-up-leave {
    animation-name: snake-popup-slide-up-out;
}
.snake-popup__panel--top.snake-transition--slide-down-enter {
    animation-name: snake-popup-slide-down-in;
}
.snake-popup__panel--top.snake-transition--slide-down-leave {
    animation-name: snake-popup-slide-down-out;
}
.snake-popup__panel--left.snake-transition--slide-right-enter {
    animation-name: snake-popup-slide-right-in;
}
.snake-popup__panel--left.snake-transition--slide-right-leave {
    animation-name: snake-popup-slide-right-out;
}
.snake-popup__panel--right.snake-transition--slide-left-enter {
    animation-name: snake-popup-slide-left-in;
}
.snake-popup__panel--right.snake-transition--slide-left-leave {
    animation-name: snake-popup-slide-left-out;
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
@keyframes snake-popup-slide-up-in {
    from {
        transform: translate3d(0, 100%, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}
@keyframes snake-popup-slide-up-out {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(0, 100%, 0);
    }
}
@keyframes snake-popup-slide-down-in {
    from {
        transform: translate3d(0, -100%, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}
@keyframes snake-popup-slide-down-out {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(0, -100%, 0);
    }
}
@keyframes snake-popup-slide-right-in {
    from {
        transform: translate3d(-100%, 0, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}
@keyframes snake-popup-slide-right-out {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(-100%, 0, 0);
    }
}
@keyframes snake-popup-slide-left-in {
    from {
        transform: translate3d(100%, 0, 0);
    }
    to {
        transform: translate3d(0, 0, 0);
    }
}
@keyframes snake-popup-slide-left-out {
    from {
        transform: translate3d(0, 0, 0);
    }
    to {
        transform: translate3d(100%, 0, 0);
    }
}
</style>
