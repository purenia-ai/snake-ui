<template>
    <view class="snake-sticky">
        <view
            class="snake-sticky__wrap"
            :class="[elClass, customClass]"
            :style="placeholderStyle"
        >
            <view class="snake-sticky__content" :style="contentStyle">
                <slot />
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component SnakeSticky
 * @description 通过 IntersectionObserver 相对视口观察占位层实现跨端吸顶，对齐 uView Pro 的三层结构（外层容器 / 占位层 / 内容层），并在不支持 Observer 的环境降级为页面 scrollTop 定位。
 * @see /components/sticky
 */

import { onPageScroll } from '@dcloudio/uni-app';
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';
import { getRect, guid } from '../../libs/function/platform';
import type { SnakeStickyEmits, SnakeStickyProps } from './types';

defineOptions({ name: 'SnakeSticky', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeStickyProps>(), {
    offsetTop: 0,
    customNavHeight: 0,
    zIndex: 10,
    disabled: false,
    bgColor: 'transparent',
    scrollTop: 0,
    index: 0,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeStickyEmits>();
const instance = getCurrentInstance();

const fixed = ref(false);
const height = ref(0);
const width = ref(0);
const left = ref(0);
// 页面绝对定位的原始位置，仅用于降级方案。
const originTop = ref(0);
const currentScrollTop = ref(props.scrollTop);

// 每个实例唯一类名，用于测量和观察占位层，避免 CMS 循环中多个实例互相串扰。
const elClass = guid('snake-sticky');
// 是否支持 IntersectionObserver（H5 / 微信小程序 / App 均支持）。
const supportsObserver = typeof uni !== 'undefined' && typeof uni.createIntersectionObserver === 'function';

let contentObserver: any = null;

function unitNumber(value: number | string | null | undefined) {
    const number = Number.parseFloat(String(value ?? 0));
    return Number.isFinite(number) ? number : 0;
}
function offsetTopPx(value: number | string | null | undefined) {
    const number = unitNumber(value);
    if (typeof value === 'string' && value.trim().endsWith('px')) return number;
    return typeof uni !== 'undefined' && typeof uni.upx2px === 'function' ? uni.upx2px(number) : number;
}
// 正规化 disabled，避免宿主把 "false" 字符串传进来后被当成 true。
const isDisabled = computed(() => {
    // CMS 数据可能传入字符串布尔值，公共类型保持 boolean，此处按 unknown 归一化。
    const value = props.disabled as unknown;
    return value === true || value === 1 || value === '1' || value === 'true';
});
const stickyTop = computed(() => offsetTopPx(props.offsetTop) + unitNumber(props.customNavHeight));
const placeholderStyle = computed(() => ({ height: fixed.value ? `${height.value}px` : 'auto' }));
const contentStyle = computed(() => [
    (fixed.value
        ? { position: 'fixed', top: `${stickyTop.value}px`, left: `${left.value}px`, width: `${width.value}px` }
        : { position: 'static' }) as CSSProperties,
    { zIndex: props.zIndex, backgroundColor: props.bgColor },
    props.customStyle
]);

async function setFixed(value: boolean) {
    if (fixed.value === value) return;
    // 吸顶瞬间补一次测量：内容（如 CMS 筛选数据）异步渲染时，挂载期重试可能仍测到 0。
    // 此刻 fixed 尚未应用、占位层仍在文档流中，测得的就是真实高宽。
    if (value) await measure();
    fixed.value = value;
    const detail = { isFixed: value, index: props.index };
    if (value) emit('fixed', detail);
    else emit('unfixed', detail);
    emit('change', detail);
}

function disconnectObserver() {
    if (contentObserver) {
        contentObserver.disconnect();
        contentObserver = null;
    }
}

function observeContent() {
    disconnectObserver();
    contentObserver = uni.createIntersectionObserver(instance?.proxy as any, { thresholds: [0.95, 0.98, 1] });
    contentObserver.relativeToViewport({ top: -stickyTop.value });
    contentObserver.observe(`.${elClass}`, (res: any) => {
        if (isDisabled.value) return;
        setFixed(res.boundingClientRect.top < stickyTop.value);
    });
}

// 降级方案：基于页面 scrollTop 手动计算是否吸顶。
function updatePosition(scrollTop = currentScrollTop.value) {
    currentScrollTop.value = scrollTop;
    setFixed(!isDisabled.value && scrollTop + stickyTop.value >= originTop.value);
}

async function measure() {
    const rect = await getRect(`.${elClass}`, instance);
    if (!rect || !rect.height) return false;
    height.value = Number(rect.height) || height.value;
    width.value = Number(rect.width) || width.value;
    left.value = Number(rect.left) || 0;
    originTop.value = Number(rect.top) + currentScrollTop.value;
    return true;
}

async function update() {
    await nextTick();
    if (isDisabled.value) return;
    if (typeof uni === 'undefined' || typeof uni.createSelectorQuery !== 'function') return;
    // 兼容 MP 首屏异步内容/布局未完成时测量为 0 的情况：最多重试 5 次，避免首次拿到 0 就直接放弃。
    for (let attempt = 0; attempt < 5; attempt++) {
        if (await measure()) break;
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    nextTick(() => {
        if (supportsObserver) observeContent();
        else updatePosition();
    });
}

watch(
    () => props.offsetTop,
    () => {
        if (!isDisabled.value) void update();
    }
);
watch(
    () => isDisabled.value,
    disabled => {
        if (disabled) {
            setFixed(false);
            disconnectObserver();
        } else {
            void update();
        }
    }
);
watch(
    () => props.scrollTop,
    value => {
        if (!supportsObserver) updatePosition(Number(value) || 0);
    }
);
onPageScroll(event => {
    if (!supportsObserver) updatePosition(Number(event.scrollTop) || 0);
});
onMounted(() => void update());
onBeforeUnmount(disconnectObserver);
defineExpose({ update });
</script>
