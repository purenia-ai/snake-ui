<script setup lang="ts">
/**
 * @component SnakeTransition
 * @description 跨端内容进出场动画，Overlay 和 Popup 均使用该组件。离场完成前节点会继续保留，因此不会出现弹层瞬间消失的问题。
 * @see /components/transition
 */

import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import type { SnakeTransitionDuration, SnakeTransitionEmits, SnakeTransitionProps } from './types';

defineOptions({ name: 'SnakeTransition', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeTransitionProps>(), {
    show: true,
    name: 'fade',
    duration: 300,
    timingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    delay: 0,
    appear: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeTransitionEmits>();

type Phase = 'enter' | 'leave' | '';
const rendered = ref(props.show);
const phase = ref<Phase>('');
const initialized = ref(false);
let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

const durations = computed(() => {
    if (typeof props.duration === 'number') return { enter: props.duration, leave: props.duration };
    const value = props.duration as SnakeTransitionDuration;
    return { enter: value.enter ?? 300, leave: value.leave ?? value.enter ?? 300 };
});
const currentDuration = computed(() => (phase.value === 'leave' ? durations.value.leave : durations.value.enter));
const rootStyle = computed(() => [
    {
        animationDuration: `${currentDuration.value}ms`,
        animationDelay: `${props.delay}ms`,
        animationTimingFunction: props.timingFunction
    },
    props.customStyle
]);
const phaseClass = computed(() => (phase.value ? `snake-transition--${props.name}-${phase.value}` : ''));

function clearFallback() {
    if (fallbackTimer) clearTimeout(fallbackTimer);
    fallbackTimer = undefined;
}

function complete(expected: Exclude<Phase, ''>) {
    if (phase.value !== expected) return;
    clearFallback();
    phase.value = '';
    if (expected === 'enter') emit('after-enter');
    else {
        rendered.value = false;
        emit('after-leave');
    }
}

function scheduleFallback(expected: Exclude<Phase, ''>) {
    clearFallback();
    fallbackTimer = setTimeout(() => complete(expected), currentDuration.value + props.delay + 50);
}

async function startEnter() {
    if (phase.value === 'leave') emit('leave-cancelled');
    else if (phase.value === 'enter') return;
    rendered.value = true;
    phase.value = '';
    emit('before-enter');
    await nextTick();
    phase.value = 'enter';
    emit('enter');
    scheduleFallback('enter');
}

function startLeave() {
    if (!rendered.value) return;
    if (phase.value === 'enter') emit('enter-cancelled');
    else if (phase.value === 'leave') return;
    emit('before-leave');
    phase.value = 'leave';
    emit('leave');
    scheduleFallback('leave');
}

function onAnimationEnd() {
    if (phase.value) complete(phase.value);
}

watch(
    () => props.show,
    show => {
        if (!initialized.value) {
            initialized.value = true;
            rendered.value = show;
            if (show && props.appear) void startEnter();
            return;
        }
        if (show) void startEnter();
        else startLeave();
    },
    { immediate: true }
);

onBeforeUnmount(clearFallback);
</script>

<template>
    <view
        v-if="rendered"
        class="snake-transition"
        :class="[customClass, phaseClass]"
        :style="rootStyle"
        @animationend="onAnimationEnd"
        @click="emit('click', $event)"
    >
        <slot />
    </view>
</template>

<style scoped lang="scss">
.snake-transition {
    animation-fill-mode: both;
}
.snake-transition--fade-enter {
    animation-name: snake-fade-in;
}
.snake-transition--fade-leave {
    animation-name: snake-fade-out;
}
.snake-transition--fade-up-enter,
.snake-transition--slide-up-enter {
    animation-name: snake-up-in;
}
.snake-transition--fade-up-leave,
.snake-transition--slide-up-leave {
    animation-name: snake-up-out;
}
.snake-transition--fade-down-enter,
.snake-transition--slide-down-enter {
    animation-name: snake-down-in;
}
.snake-transition--fade-down-leave,
.snake-transition--slide-down-leave {
    animation-name: snake-down-out;
}
.snake-transition--fade-left-enter,
.snake-transition--slide-left-enter {
    animation-name: snake-left-in;
}
.snake-transition--fade-left-leave,
.snake-transition--slide-left-leave {
    animation-name: snake-left-out;
}
.snake-transition--fade-right-enter,
.snake-transition--slide-right-enter {
    animation-name: snake-right-in;
}
.snake-transition--fade-right-leave,
.snake-transition--slide-right-leave {
    animation-name: snake-right-out;
}
.snake-transition--zoom-in-enter {
    animation-name: snake-zoom-in;
}
.snake-transition--zoom-in-leave {
    animation-name: snake-zoom-in-out;
}
.snake-transition--zoom-out-enter {
    animation-name: snake-zoom-out;
}
.snake-transition--zoom-out-leave {
    animation-name: snake-zoom-out-out;
}
@keyframes snake-fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
@keyframes snake-fade-out {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
@keyframes snake-up-in {
    from {
        opacity: 0;
        transform: translate3d(0, 40rpx, 0);
    }
    to {
        opacity: 1;
        transform: none;
    }
}
@keyframes snake-up-out {
    from {
        opacity: 1;
        transform: none;
    }
    to {
        opacity: 0;
        transform: translate3d(0, 40rpx, 0);
    }
}
@keyframes snake-down-in {
    from {
        opacity: 0;
        transform: translate3d(0, -40rpx, 0);
    }
    to {
        opacity: 1;
        transform: none;
    }
}
@keyframes snake-down-out {
    from {
        opacity: 1;
        transform: none;
    }
    to {
        opacity: 0;
        transform: translate3d(0, -40rpx, 0);
    }
}
@keyframes snake-left-in {
    from {
        opacity: 0;
        transform: translate3d(40rpx, 0, 0);
    }
    to {
        opacity: 1;
        transform: none;
    }
}
@keyframes snake-left-out {
    from {
        opacity: 1;
        transform: none;
    }
    to {
        opacity: 0;
        transform: translate3d(40rpx, 0, 0);
    }
}
@keyframes snake-right-in {
    from {
        opacity: 0;
        transform: translate3d(-40rpx, 0, 0);
    }
    to {
        opacity: 1;
        transform: none;
    }
}
@keyframes snake-right-out {
    from {
        opacity: 1;
        transform: none;
    }
    to {
        opacity: 0;
        transform: translate3d(-40rpx, 0, 0);
    }
}
@keyframes snake-zoom-in {
    from {
        opacity: 0;
        transform: scale(0.85);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
@keyframes snake-zoom-in-out {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(0.85);
    }
}
@keyframes snake-zoom-out {
    from {
        opacity: 0;
        transform: scale(1.1);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
@keyframes snake-zoom-out-out {
    from {
        opacity: 1;
        transform: scale(1);
    }
    to {
        opacity: 0;
        transform: scale(1.1);
    }
}
</style>
