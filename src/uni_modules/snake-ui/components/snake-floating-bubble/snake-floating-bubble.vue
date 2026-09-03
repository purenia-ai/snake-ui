<template>
    <view
        class="floating-bubble"
        :class="{ 'floating-bubble--slot': hasSlot }"
        :animation="animationData"
        :style="rootStyle"
        v-if="visible"
    >
        <view class="floating-bubble__wrap" :style="wrapStyle" @click="handleNavigate">
            <view v-if="!hasSlot" class="floating-bubble__close" @click.stop.prevent="close">
                <snake-icon name="close-circle-fill" size="28" color="rgba(7, 7, 7, 0.2)" />
            </view>
            <image v-if="!hasSlot" class="floating-bubble__logo" :src="datas.src" />
            <slot v-else />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeFloatingBubble
 * @description 页面右侧的悬浮气泡。图片模式支持点击跳转与关闭（持久化），插槽模式承载自定义内容；滚动时向屏幕外收起，停止后恢复。
 * @see /components/floating-bubble
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import type { SnakeFloatingBubbleProps } from './types';

defineOptions({ name: 'SnakeFloatingBubble', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeFloatingBubbleProps>(), {
    datas: () => ({}),
    scrollTop: 0,
    bottom: '80rpx',
    background: 'transparent',
    zIndex: 6
});

const slots = useSlots();
const hasSlot = computed(() => !!slots.default);

const instance = getCurrentInstance();
const closeList = ref<Array<string | number>>([]);
const animationData = ref<Record<string, unknown>>({});
const animation = ref<ReturnType<typeof uni.createAnimation>>();
const size = ref({ width: 0, right: 0 });
const off = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

const isShow = computed(() => !closeList.value.includes(props.datas?.uid ?? ''));
const visible = computed(() => (hasSlot.value || Boolean(props.datas?.src)) && isShow.value);

const rootStyle = computed(() => {
    const style: Record<string, any> = { zIndex: props.zIndex };
    if (hasSlot.value) {
        style.bottom = props.bottom;
        style.background = props.background;
    } else {
        style.right = `${props.datas?.right ?? 0}%`;
        style.bottom = `${props.datas?.bottom ?? 20}%`;
    }
    return style;
});

const wrapStyle = computed(() =>
    hasSlot.value ? {} : { width: `${props.datas?.width ?? 96}rpx`, height: `${props.datas?.height ?? 96}rpx` }
);

watch(() => props.scrollTop, declick);

onMounted(async () => {
    closeList.value = uni.getStorageSync('suspensionList') || [];
    animation.value = uni.createAnimation({ duration: 1000, timingFunction: 'ease' });
    const rect = await uni.$snake.getRect('.floating-bubble', instance);
    if (rect) size.value = { width: rect.width, right: rect.right ?? 0 };
});

onBeforeUnmount(() => clearTimeout(timer));

function declick() {
    if (!off.value) {
        rotateAndScale();
        off.value = true;
    }
}

function rotateAndScale() {
    if (!animation.value) return;
    const screenWidth = uni.$snake.sys().screenWidth;
    const x = size.value.width / 2 + screenWidth - size.value.right;
    animation.value.translateX(x).step();
    animationData.value = animation.value.export();
    timer = setTimeout(() => {
        off.value = false;
        norotateAndScale();
    }, 2000);
}

function norotateAndScale() {
    if (!animation.value) return;
    animation.value.translateX(0).step();
    animationData.value = animation.value.export();
}

function close() {
    const uid = props.datas?.uid;
    if (uid !== undefined && !closeList.value.includes(uid)) closeList.value.push(uid);
    uni.setStorageSync('suspensionList', closeList.value);
}

function handleNavigate() {
    if (hasSlot.value || !props.datas?.url) return;
    uni.$snake.navTo(props.datas.url);
}
</script>

<style lang="scss" scoped>
.floating-bubble {
    position: fixed;
    right: 0;
    bottom: 20%;
    z-index: 6;
    padding-bottom: 0rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);

    &--slot {
        right: 28rpx;
    }

    &__wrap {
        position: relative;
    }

    &__close {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 12;
        color: rgba(7, 7, 7, 0.2);
    }

    &__logo {
        width: 100%;
        height: 100%;
    }
}
</style>
