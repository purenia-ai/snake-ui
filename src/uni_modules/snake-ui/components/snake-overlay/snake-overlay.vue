<script setup lang="ts">
/**
 * @component SnakeOverlay
 * @description 带完整淡入淡出动画的全屏遮罩，可锁定遮罩区域滚动并承载自定义内容。
 * @see /components/overlay
 */

import { computed, getCurrentInstance } from 'vue';
import zIndex from '../../libs/config/zIndex';
import SnakeTransition from '../snake-transition/snake-transition.vue';
import type { SnakeOverlayEmits, SnakeOverlayProps } from './types';

defineOptions({ name: 'SnakeOverlay', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeOverlayProps>(), {
    modelValue: false,
    opacity: 0.5,
    zIndex: zIndex.mask,
    duration: 300,
    lockScroll: true,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeOverlayEmits>();
// 与 snake-popup 同理：未绑定 show 时 Boolean casting 会让 `??` 失效，需检测实际绑定来源。
const showBound = 'show' in (getCurrentInstance()?.vnode?.props ?? {});
const visible = computed(() => (showBound ? props.show : props.modelValue));
const overlayStyle = computed(() => [
    {
        backgroundColor: `rgba(0, 0, 0, ${Math.min(1, Math.max(0, props.opacity))})`,
        zIndex: props.zIndex
    },
    props.customStyle
]);

function click(event: unknown) {
    emit('click', event);
    emit('update:modelValue', false);
    emit('update:show', false);
}

function stopTouchMove() {
    // uni-app 通过空处理器阻止遮罩上的 touchmove 冒泡。
}
</script>

<template>
    <snake-transition
        :show="visible"
        name="fade"
        :duration="duration"
        :custom-class="['snake-overlay', customClass].filter(Boolean).join(' ')"
        :custom-style="overlayStyle"
        @click="click"
        @after-enter="emit('opened')"
        @after-leave="emit('closed')"
        @touchmove.stop.prevent="lockScroll ? stopTouchMove() : undefined"
    >
        <slot />
    </snake-transition>
</template>

<style>
.snake-overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}
</style>
