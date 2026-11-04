<template>
    <view class="snake-circle-progress" :style="rootStyle">
        <!-- #ifdef MP-WEIXIN -->
        <canvas
            :id="canvasId"
            :canvas-id="canvasId"
            type="2d"
            class="snake-circle-progress__canvas"
            :style="canvasStyle"
        />
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <canvas :id="canvasId" :canvas-id="canvasId" class="snake-circle-progress__canvas" :style="canvasStyle" />
        <!-- #endif -->
        <view class="snake-circle-progress__content">
            <slot />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component CircleProgress
 * @description 环形进度条，canvas 绘制：中心天然透明、弧端默认圆头，可放置在任意背景上。微信小程序使用 canvas 2d 并按像素比缩放保证清晰，其余端使用旧版 canvas 接口。
 * @see /components/circle-progress
 */

import { computed, getCurrentInstance, nextTick, onMounted, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { circleProgressProps } from './types';

defineOptions({ name: 'CircleProgress', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(circleProgressProps);

const instance = getCurrentInstance();
const canvasId = `snake-circle-${Math.random().toString(36).slice(2, 9)}`;

/** 百分比钳制在 0-100，字符串数值与非法输入均回退安全值。 */
const safePercent = computed(() => {
    const value = Number(props.percent);
    if (!Number.isFinite(value)) return 0;
    return Math.min(100, Math.max(0, value));
});
const sizePx = computed(() => addUnit(props.width, 'px'));
const rootStyle = computed(() => ({ width: sizePx.value, height: sizePx.value }));
const canvasStyle = computed(() => ({ width: sizePx.value, height: sizePx.value }));

/** 两套 canvas 上下文的公共绘制面：属性赋值式 API 在新旧接口上都可用。 */
interface RingContext {
    strokeStyle: string;
    lineWidth: number;
    lineCap: 'butt' | 'round' | 'square';
    beginPath(): void;
    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, counterclockwise?: boolean): void;
    stroke(): void;
    clearRect?(x: number, y: number, width: number, height: number): void;
    /** 仅旧版接口存在：显式提交绘制。 */
    draw?(): void;
}

let ctx: RingContext | null = null;

/**
 * canvas 不支持 CSS 变量：var() 表达式取其中的回退色值；
 * 无回退值或非 var() 写法分别落到品牌兜底色与原值。
 */
function resolveColor(value: string, fallback: string): string {
    if (!value.startsWith('var(')) return value;
    const match = value.match(/^var\(\s*--[\w-]+\s*,\s*([^)]+)\s*\)$/);
    return match ? match[1] : fallback;
}

function drawRing(): void {
    const context = ctx;
    if (!context) return;
    const size = Number(props.width) || 100;
    const stroke = Math.max(0, Number(props.borderWidth) || 8);
    const radius = Math.max(0, (size - stroke) / 2);
    const center = size / 2;
    const start = -Math.PI / 2; // 12 点方向起笔
    const sweep = (Math.PI * 2 * safePercent.value) / 100;
    const end = props.clockwise ? start + sweep : start - sweep;
    const activeColor = resolveColor(props.activeColor, '#06D290');
    const inactiveColor = resolveColor(props.inactiveColor, '#e4e7ed');

    context.clearRect?.(0, 0, size, size);
    // 底环
    context.strokeStyle = inactiveColor;
    context.lineWidth = stroke;
    context.lineCap = props.lineCap;
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.stroke();
    // 激活弧
    if (safePercent.value > 0) {
        context.strokeStyle = activeColor;
        context.beginPath();
        context.arc(center, center, radius, start, end, !props.clockwise);
        context.stroke();
    }
    context.draw?.();
}

/** 建立上下文：微信走 2d 节点（物理像素 = 逻辑尺寸 × 像素比），其余端走旧版接口。 */
function setupContext(): void {
    // #ifdef MP-WEIXIN
    uni.createSelectorQuery()
        .in(instance?.proxy)
        .select(`#${canvasId}`)
        .node((res: unknown) => {
            const node = (res as { node?: any })?.node;
            if (!node) return;
            const pixelRatio = uni.getSystemInfoSync().pixelRatio || 1;
            const size = Number(props.width) || 100;
            node.width = size * pixelRatio;
            node.height = size * pixelRatio;
            const context = node.getContext('2d');
            context.scale(pixelRatio, pixelRatio);
            ctx = context;
            drawRing();
        })
        .exec();
    // #endif
    // #ifndef MP-WEIXIN
    ctx = uni.createCanvasContext(canvasId, instance?.proxy) as unknown as RingContext;
    drawRing();
    // #endif
}

onMounted(setupContext);

// 进度与外观变化：直接重画。
watch(
    () => [props.percent, props.activeColor, props.inactiveColor, props.borderWidth, props.lineCap, props.clockwise],
    drawRing
);

// 尺寸变化：等新尺寸样式先落到 DOM 再重建画布，否则 canvas 按旧尺寸栅格化导致拉伸。
watch(
    () => props.width,
    async () => {
        ctx = null;
        await nextTick();
        setupContext();
    }
);
</script>

<style scoped>
.snake-circle-progress {
    position: relative;
    flex-shrink: 0;
}
.snake-circle-progress__canvas {
    position: absolute;
    top: 0;
    left: 0;
}
.snake-circle-progress__content {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
