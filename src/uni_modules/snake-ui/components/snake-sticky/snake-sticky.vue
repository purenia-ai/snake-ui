<template>
    <view class="snake-sticky">
        <view class="snake-sticky__wrap" :class="[elClass, customClass]" :style="placeholderStyle">
            <view class="snake-sticky__content" :class="contentClass" :style="contentStyle">
                <slot />
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Sticky
 * @description 三层结构吸顶（外层容器 / 占位层 / 内容层）：测得高度后占位层常驻定高、内容层常驻绝对定位，fixed 切换不改变文档流，高度塌陷在结构上不存在；未测到高度前内容暂留文档流。不支持 Observer 的环境降级为宿主推送滚动位置。
 * @see /components/sticky
 */

import {
    computed,
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
    type CSSProperties
} from 'vue';
import { getRect } from '../../libs/function/getRect';
import { guid } from '../../libs/function/guid';
import type { StickyEmits, StickyProps } from './types';

defineOptions({ name: 'Sticky', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<StickyProps>(), {
    offsetTop: 0,
    zIndex: 10,
    disabled: false,
    bgColor: 'transparent',
    scrollTop: 0,
    index: 0,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<StickyEmits>();
const instance = getCurrentInstance();

const fixed = ref(false);
const height = ref(0);
const width = ref(0);
const left = ref(0);

// 每个实例唯一类名，避免 CMS 循环中多个实例互相串扰：
// elClass 观察/取位占位层（吸顶判定依据它在文档流中的位置），contentClass 测量内容层（占位层高度被常驻样式钉死后，只有内容层能反映真实高度）。
const elClass = guid('snake-sticky');
const contentClass = guid('snake-sticky-content');
// 是否支持 IntersectionObserver（H5 / 微信小程序 / App 均支持）。
const supportsObserver = typeof uni !== 'undefined' && typeof uni.createIntersectionObserver === 'function';

let contentObserver: any = null;
// 高度校正会在下一个事件循环重建观察器，卸载后不能再建。
let destroyed = false;
// #ifdef H5
// H5 端用浏览器原生 ResizeObserver 监听内容尺寸（小程序端无对应 API，靠越线时机补测兜底），
// 不引入 wot 式双 scroll-view 探测，CMS 多实例场景零额外节点。
let contentResizeObserver: ResizeObserver | null = null;
// #endif

function unitNumber(value: number | string | null | undefined) {
    const number = Number.parseFloat(String(value ?? 0));
    return Number.isFinite(number) ? number : 0;
}
function offsetTopPx(value: number | string | null | undefined) {
    const number = unitNumber(value);
    return number;
}
// 正规化 disabled，避免宿主把 "false" 字符串传进来后被当成 true。
const isDisabled = computed(() => {
    // CMS 数据可能传入字符串布尔值，公共类型保持 boolean，此处按 unknown 归一化。
    const value = props.disabled as unknown;
    return value === true || value === 1 || value === '1' || value === 'true';
});
// H5 端 uni-app 内置导航栏是 44px 的 fixed 元素（z-index 998），页面视口仍从窗口顶部开始；
// 未显式传入 customNavHeight 时自动让出这 44px，避免吸顶内容钻到内置导航栏底下。
// 其余端原生导航栏在视口之外，无需补偿；显式传入（含 0，表示页面无导航栏）时按传入值计算。
const stickyTop = computed(() => {
    // #ifdef H5
    if (props.customNavHeight === undefined || props.customNavHeight === null || props.customNavHeight === '') {
        return offsetTopPx(props.offsetTop) + 44;
    }
    // #endif
    return offsetTopPx(props.offsetTop) + unitNumber(props.customNavHeight);
});
// 测得高度后进入「常驻占位」模式（wot-design-uni 的结构）：占位层定高并成为内容层的包含块，
// 内容层常驻 absolute、吸顶时才换成 fixed —— 两种定位都不参与文档流，切换瞬间零布局变化。
// 未测到高度（首帧/降级）前内容保持 static 参与流，避免首屏高度为 0 的空窗。
const measured = computed(() => height.value > 0);
const placeholderStyle = computed<CSSProperties>(() =>
    measured.value ? { height: `${height.value}px`, position: 'relative' } : {}
);
const contentStyle = computed(() => [
    (fixed.value
        ? { position: 'fixed', top: `${stickyTop.value}px`, left: `${left.value}px`, width: `${width.value}px` }
        : measured.value
          ? { position: 'absolute', top: '0px', left: '0px', width: '100%' }
          : { position: 'static' }) as CSSProperties,
    { zIndex: props.zIndex, backgroundColor: props.bgColor },
    props.customStyle
]);

async function setFixed(value: boolean) {
    if (fixed.value === value) return;
    // 吸顶瞬间补一次测量：内容（如 CMS 筛选数据）异步渲染时，挂载期重试可能仍测到 0。
    // 内容层常驻 absolute、按内容自然高度撑开，此刻测得的就是真实高宽与吸顶坐标。
    if (value) {
        await measure();
        // 未测到高度（降级/查询失败）时宁可不吸顶，也不让 fixed 内容脱离空占位造成塌陷。
        if (height.value <= 0) return;
    }
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

// 高度校正后会重建观察器，放到下一轮事件循环里做，避免在回调栈内断开正在派发的 observer。
function scheduleReobserve() {
    setTimeout(observeContent, 0);
}

function observeContent() {
    disconnectObserver();
    if (destroyed || !supportsObserver) return;
    // 观察根的顶边取「吸顶线 + 自身高度」：占位层的可见比例随位置连续变化（比例 = (top - 吸顶线) / 高度），
    // 越过吸顶线时比例恰好归零。只用阈值 0，吸顶与解除都发生在同一条线上；根顶边若只取吸顶线，
    // 高于可视区的吸顶块比例永远到不了 1，初始回调之后会彻底静默。
    const offset = stickyTop.value + height.value;
    contentObserver = uni.createIntersectionObserver(instance?.proxy as any, { thresholds: [0] });
    contentObserver.relativeToViewport({ top: -offset });
    contentObserver.observe(`.${elClass}`, (res: any) => {
        if (isDisabled.value) return;
        const rect = res.boundingClientRect || {};
        // 占位层高度是常驻定值，回调里检测不到内容变化；在越线时机补测内容层，漂移超过 1px 才重建观察。
        const before = height.value;
        void measure().then(() => {
            if (Math.abs(height.value - before) > 1) scheduleReobserve();
        });
        setFixed(Number(rect.top) <= stickyTop.value);
    });
    // 观察建立时页面可能已经滚过吸顶线（返回页恢复滚动、锚点跳转、首屏带锚点），补一次实时判定。
    getRect(`.${elClass}`, instance).then(rect => {
        if (!rect.height || isDisabled.value) return;
        setFixed(Number(rect.top) <= stickyTop.value);
    });
}

// 降级方案：环境不支持 IntersectionObserver 时，由宿主推送的 scrollTop 触发实时几何判定。
function syncByScrollTop() {
    if (isDisabled.value) return;
    getRect(`.${elClass}`, instance).then(rect => {
        if (!rect.height) return;
        setFixed(Number(rect.top) <= stickyTop.value);
    });
}

async function measure() {
    // 测内容层而非占位层：占位层高度已被常驻样式钉死，内容层在任何定位状态下都按内容自然高度撑开。
    const rect = await getRect(`.${contentClass}`, instance);
    if (!rect || !rect.height) return false;
    height.value = Number(rect.height) || height.value;
    width.value = Number(rect.width) || width.value;
    left.value = Number(rect.left) || 0;
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
        else syncByScrollTop();
    });
}

watch(
    () => [props.offsetTop, props.customNavHeight],
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
// scrollTop 仅作为降级方案的触发源；支持 Observer 时吸顶由观察回调驱动，不参与计算。
watch(
    () => props.scrollTop,
    () => {
        if (!supportsObserver) syncByScrollTop();
    }
);
onMounted(() => {
    void update();
    // #ifdef H5
    // 内容尺寸变化（异步数据、图片加载）→ 重测并重建观察，H5 端无需等待越线时机。
    if (typeof document !== 'undefined' && typeof ResizeObserver === 'function') {
        const contentEl = document.querySelector(`.${contentClass}`);
        if (contentEl) {
            contentResizeObserver = new ResizeObserver(() => void update());
            contentResizeObserver.observe(contentEl);
        }
    }
    // #endif
});
onBeforeUnmount(() => {
    destroyed = true;
    disconnectObserver();
    // #ifdef H5
    contentResizeObserver?.disconnect();
    contentResizeObserver = null;
    // #endif
});
defineExpose({ update });
</script>
