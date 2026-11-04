<template>
    <view
        v-if="visible"
        class="floating-bubble"
        :class="{ 'floating-bubble--slot': hasSlot }"
        :style="[rootStyle, awayStyle]"
    >
        <view class="floating-bubble__wrap" :style="wrapStyle" @click="handleNavigate">
            <view v-if="!hasSlot" class="floating-bubble__close" @click.stop.prevent="close">
                <snake-icon name="close-circle-fill" size="14" color="rgba(7, 7, 7, 0.2)" />
            </view>
            <image v-if="!hasSlot" class="floating-bubble__logo" :src="datas.src" />
            <slot v-else />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component FloatingBubble
 * @description 页面右侧的悬浮气泡。图片模式支持点击跳转与关闭（持久化），插槽模式承载自定义内容；滚动时向屏幕外收起，停止后恢复。
 */

import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import type { FloatingBubbleProps } from './types';

defineOptions({ name: 'FloatingBubble', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<FloatingBubbleProps>(), {
    datas: () => ({}),
    scrollTop: 0,
    bottom: '40px',
    background: 'transparent',
    zIndex: 6,
    unit: '750',
    hideOnScroll: true
});
const emit = defineEmits<{ click: [] }>();

const slots = useSlots();
const hasSlot = computed(() => !!slots.default);

const closeList = ref<Array<string | number>>([]);
const away = ref(false);
let restoreTimer: ReturnType<typeof setTimeout> | undefined;

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

const wrapStyle = computed(() => {
    if (hasSlot.value) return {};
    const width = Number(props.datas?.width ?? 96);
    const height = Number(props.datas?.height ?? 96);
    // v1 装修数据是 750 稿数字；v2 契约是 375 稿 px，由调用方声明口径。
    if (props.unit === 'px') return { width: `${width}px`, height: `${height}px` };
    return { width: uni.$snake.from750(width), height: uni.$snake.from750(height) };
});

// 半藏补偿距右间距：位移 = 自身一半 + 距右间距，露出的恒为半个身位。
// 间距用 vw 直出（right 百分比即 vw），不引入屏宽测量。
const awayStyle = computed(() => {
    if (!away.value) return {};
    const gap = hasSlot.value ? '14px' : `${Number(props.datas?.right ?? 0) || 0}vw`;
    return { transform: `translateX(calc(50% + ${gap}))` };
});

// 收起位移为自身宽度的一半（translateX(50%)），滚动时向右半藏、露出一半，
// 方向恒为右侧。旧实现按一次 getRect 测量 + 屏宽计算位移，测量落在动画中
// 或失败时会得到负位移或整屏位移，气泡因此偶发飞向屏幕左侧或整只消失。
watch(
    () => props.scrollTop,
    () => {
        if (!props.hideOnScroll || !visible.value) return;
        away.value = true;
        clearTimeout(restoreTimer);
        restoreTimer = setTimeout(() => (away.value = false), 2000);
    }
);

onMounted(() => {
    closeList.value = uni.getStorageSync('suspensionList') || [];
});

onBeforeUnmount(() => clearTimeout(restoreTimer));

function close() {
    const uid = props.datas?.uid;
    if (uid !== undefined && !closeList.value.includes(uid)) closeList.value.push(uid);
    uni.setStorageSync('suspensionList', closeList.value);
}

function reopen() {
    const uid = props.datas?.uid;
    if (uid === undefined) return;
    closeList.value = closeList.value.filter(item => item !== uid);
    uni.setStorageSync('suspensionList', closeList.value);
}

function handleNavigate() {
    emit('click');
    if (!hasSlot.value && props.datas?.url) uni.$snake.navTo(props.datas.url);
}

defineExpose({ reopen });
</script>

<style lang="scss" scoped>
.floating-bubble {
    position: fixed;
    right: 0;
    bottom: 20%;
    z-index: 6;
    padding-bottom: 0px;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    transition: transform 0.45s ease;

    &--slot {
        right: 14px; // 与 awayStyle 的插槽间距补偿保持一致
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
