<template>
    <view class="snake-qr-code" :class="customClass" :style="customStyle" @click="handleClick">
        <!-- #ifdef MP-WEIXIN -->
        <canvas type="2d" :id="canvasId" :style="canvasStyle" />
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <canvas :id="canvasId" :canvas-id="canvasId" :width="canvasSize" :height="canvasSize" :style="canvasStyle" />
        <!-- #endif -->
    </view>
</template>

<script setup lang="ts">
/**
 * @component QrCode
 * @description 二维码组件，把文本或链接渲染为 canvas 二维码，支持纠错级别、颜色定制、中心 Logo 与导出临时图片。
 * @see /components/qr-code
 */

import { computed, getCurrentInstance, nextTick, onBeforeMount, onMounted, ref, toRaw, watch } from 'vue';
import { addUnit, getSystemInfo, guid } from '../../libs/function';
import { generateQRCode, QRErrorCorrectLevel } from './qrcode';
import { qrCodeProps } from './types';
import type { QrCodeEmits, QrCodeExpose } from './types';

defineOptions({ name: 'QrCode', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(qrCodeProps);
const emit = defineEmits<QrCodeEmits>();

const instance = getCurrentInstance();
const proxy = instance?.proxy;

/** 二维码绘制所需的画布方法子集，覆盖旧版 CanvasContext 与微信 2d 上下文两条通道。 */
interface QrCanvasContext {
    clearRect(x: number, y: number, width: number, height: number): void;
    setFillStyle(style: string): void;
    fillRect(x: number, y: number, width: number, height: number): void;
    drawImage(image: unknown, x: number, y: number, width: number, height: number): void;
    draw(reserve?: boolean, callback?: () => void): void;
}

/** 微信 2d canvas 节点（按需声明用到的能力，其余平台走旧版上下文）。 */
interface WechatCanvasNode {
    width: number;
    height: number;
    getContext: (type: '2d') => CanvasRenderingContext2D | null;
    createImage?: () => WechatCanvasImage;
}

/** 微信 canvas.createImage 返回的图片对象。 */
interface WechatCanvasImage {
    crossOrigin?: string;
    onload?: () => void;
    onerror?: (error: unknown) => void;
    src: string;
}

const canvasStyle = computed(() => ({
    width: addUnit(props.size, 'px'),
    height: addUnit(props.size, 'px')
}));

/** Canvas 标识：同页多实例时由业务显式传入，否则自动生成。 */
const canvasId = props.canvasId || guid('snake-qr');
const canvasNode = ref<WechatCanvasNode | null>(null);
const nativeCtx = ref<CanvasRenderingContext2D | null>(null);
const canvasCtx = ref<QrCanvasContext | null>(null);
const pixelRatio = ref(1);
const isCanvasReady = ref(false);
let drawTask: Promise<void> = Promise.resolve();

/** 旧版 canvas 的位图尺寸：支付宝需要按像素比放大，其余平台与逻辑尺寸一致。 */
const canvasSize = computed(() => {
    let size = props.size;
    // #ifdef MP-ALIPAY
    size *= pixelRatio.value;
    // #endif
    return size;
});

watch(
    [
        () => props.text,
        () => props.size,
        () => props.correctLevel,
        () => props.colorDark,
        () => props.colorLight,
        () => props.margin,
        () => props.logo,
        () => props.logoWidth,
        () => props.logoHeight
    ],
    (values, oldValues) => {
        if (!isCanvasReady.value) return;
        // #ifdef MP-ALIPAY
        if (values[1] !== oldValues[1]) {
            canvasCtx.value = null;
        }
        // #endif
        requestDraw();
    },
    { flush: 'post' }
);

onBeforeMount(() => {
    // #ifdef H5 || MP-ALIPAY
    pixelRatio.value = getSystemInfo().pixelRatio || 1;
    // #endif
});

onMounted(() => {
    nextTick(initCanvas);
});

/** 初始化画布：微信走 2d 节点查询，其余平台绘制时按需创建旧版上下文。 */
function initCanvas() {
    // #ifdef MP-WEIXIN
    uni.createSelectorQuery()
        .in(proxy)
        .select(`#${canvasId}`)
        .node((res: any) => {
            if (!res?.node) {
                emit('error', new Error('Canvas node not found'));
                return;
            }
            const canvas = res.node as WechatCanvasNode;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                emit('error', new Error('Failed to get canvas context'));
                return;
            }
            pixelRatio.value = getSystemInfo().pixelRatio || 1;
            canvasNode.value = canvas;
            nativeCtx.value = ctx;
            canvasCtx.value = toQrContext(ctx);
            isCanvasReady.value = true;
            requestDraw();
        })
        .exec();
    // #endif

    // #ifndef MP-WEIXIN
    isCanvasReady.value = true;
    requestDraw();
    // #endif
}

/** 把微信 2d 原生上下文适配为统一绘制接口（对齐旧版 setFillStyle 语义）。 */
function toQrContext(ctx: CanvasRenderingContext2D): QrCanvasContext {
    return {
        clearRect: (x, y, width, height) => ctx.clearRect(x, y, width, height),
        setFillStyle: style => {
            ctx.fillStyle = style;
        },
        fillRect: (x, y, width, height) => ctx.fillRect(x, y, width, height),
        drawImage: (image, x, y, width, height) => ctx.drawImage(image as CanvasImageSource, x, y, width, height),
        draw: () => undefined
    };
}

function requestDraw() {
    drawTask = draw();
}

async function draw() {
    if (!isCanvasReady.value) return;

    // #ifdef MP-WEIXIN
    syncWechatCanvas();
    // #endif

    let ctx = canvasCtx.value;
    // #ifndef MP-WEIXIN
    if (!ctx) {
        const alipay = (globalThis as Record<string, any>).my;
        const raw = alipay?.createCanvasContext
            ? alipay.createCanvasContext(canvasId)
            : uni.createCanvasContext(canvasId, proxy);
        // #ifdef MP-ALIPAY
        (raw as UniApp.CanvasContext).scale(pixelRatio.value, pixelRatio.value);
        // #endif
        ctx = raw as unknown as QrCanvasContext;
        canvasCtx.value = ctx;
    }
    // #endif

    if (!ctx) {
        emit('error', new Error('Canvas context not available'));
        return;
    }

    try {
        ctx.clearRect(0, 0, props.size, props.size);
        ctx.setFillStyle(props.colorLight);
        ctx.fillRect(0, 0, props.size, props.size);

        if (!props.text) {
            // #ifndef MP-WEIXIN
            await flushCanvas(ctx);
            // #endif
            return;
        }

        let modules: boolean[][];
        try {
            const level = QRErrorCorrectLevel[props.correctLevel] ?? QRErrorCorrectLevel.H;
            modules = generateQRCode(props.text, { errorCorrectLevel: level }).modules;
        } catch (error) {
            emit('error', error);
            return;
        }

        ctx.setFillStyle(props.colorDark);
        drawSquareModules(ctx, modules);

        if (props.logo) {
            await drawLogo(ctx);
        }

        // #ifndef MP-WEIXIN
        await flushCanvas(ctx);
        // #endif
    } catch (error) {
        emit('error', error);
    }
}

/** 逐行合并连续深色模块，减少 fillRect 调用次数。 */
function drawSquareModules(ctx: QrCanvasContext, modules: boolean[][]) {
    const count = modules.length;
    const tile = (props.size - props.margin * 2) / count;
    for (let row = 0; row < count; row++) {
        let runStart = -1;
        for (let col = 0; col <= count; col++) {
            if (col < count && modules[row][col]) {
                if (runStart === -1) runStart = col;
                continue;
            }
            if (runStart === -1) continue;
            const x = Math.ceil(runStart * tile) + props.margin;
            const y = Math.ceil(row * tile) + props.margin;
            const width = Math.ceil(col * tile) - Math.ceil(runStart * tile);
            const height = Math.ceil((row + 1) * tile) - Math.ceil(row * tile);
            ctx.fillRect(x, y, width, height);
            runStart = -1;
        }
    }
}

/** 绘制中心 Logo：微信优先用 canvas 2d 的 createImage，其余走 getImageInfo。 */
async function drawLogo(ctx: QrCanvasContext) {
    const logoWidth = props.logoWidth || props.size * 0.2;
    const logoHeight = props.logoHeight || logoWidth;
    const x = (props.size - logoWidth) / 2;
    const y = (props.size - logoHeight) / 2;

    // #ifdef MP-WEIXIN
    if (canvasNode.value?.createImage) {
        try {
            const image = await loadImageWithCreateImage(props.logo);
            drawLogoContent(ctx, image, x, y, logoWidth, logoHeight);
            return;
        } catch (error) {
            void error; // 落到 getImageInfo 兜底
        }
    }
    // #endif

    try {
        const path = await loadImageWithGetImageInfo(props.logo);
        drawLogoContent(ctx, path, x, y, logoWidth, logoHeight);
    } catch (error) {
        // Logo 加载失败时保留原矩阵不覆盖，二维码仍可扫描。
        emit('error', error);
    }
}

function drawLogoContent(ctx: QrCanvasContext, image: unknown, x: number, y: number, width: number, height: number) {
    const padding = 4;
    ctx.setFillStyle('#ffffff');
    ctx.fillRect(x - padding, y - padding, width + padding * 2, height + padding * 2);
    ctx.drawImage(image, x, y, width, height);
}

// #ifdef MP-WEIXIN
function loadImageWithCreateImage(src: string): Promise<WechatCanvasImage> {
    return new Promise((resolve, reject) => {
        const canvas = toRaw(canvasNode.value);
        const createImage = canvas?.createImage;
        if (!createImage) {
            reject(new Error('canvas.createImage is unavailable'));
            return;
        }
        const image = createImage();
        image.crossOrigin = 'anonymous';
        image.onload = () => resolve(image);
        image.onerror = error => reject(error);
        image.src = src;
    });
}
// #endif

function loadImageWithGetImageInfo(src: string): Promise<string> {
    return new Promise((resolve, reject) => {
        uni.getImageInfo({ src, success: res => resolve(res.path), fail: reject });
    });
}

// #ifndef MP-WEIXIN
/** 旧版画布需要显式 draw 提交；H5 上回调可能不触发，按帧兜底放行。 */
function flushCanvas(ctx: QrCanvasContext) {
    return new Promise<void>(resolve => {
        let settled = false;
        const done = () => {
            if (settled) return;
            settled = true;
            resolve();
        };
        try {
            ctx.draw(false, done);
        } catch (error) {
            void error;
            ctx.draw(false);
        }
        setTimeout(done, 16);
    });
}
// #endif

// #ifdef MP-WEIXIN
/** 同步微信 2d 画布位图尺寸并按像素比缩放坐标系，保证清晰度。 */
function syncWechatCanvas() {
    const canvas = toRaw(canvasNode.value);
    const ctx = nativeCtx.value;
    if (!canvas || !ctx) return;

    const dpr = getSystemInfo().pixelRatio || 1;
    const width = props.size * dpr;
    const height = props.size * dpr;
    pixelRatio.value = dpr;

    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    if (typeof ctx.setTransform === 'function') {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (typeof ctx.resetTransform === 'function') {
        ctx.resetTransform();
    } else {
        canvas.width = width;
        canvas.height = height;
    }

    ctx.scale(dpr, dpr);
}
// #endif

/** 等待当前绘制完成后导出二维码临时图片路径。 */
async function exportImage(): Promise<string> {
    await drawTask;

    return new Promise((resolve, reject) => {
        const exportSize = props.size * pixelRatio.value;
        let sourceSize = exportSize;
        // #ifdef H5
        sourceSize = props.size;
        // #endif
        const options = {
            canvasId: canvasId,
            width: sourceSize,
            height: sourceSize,
            destWidth: exportSize,
            destHeight: exportSize,
            success: (res: UniApp.CanvasToTempFilePathRes) => resolve(res.tempFilePath),
            fail: reject
        } as UniApp.CanvasToTempFilePathOptions & { canvas?: unknown };

        // #ifdef MP-WEIXIN
        if (canvasNode.value) {
            options.canvas = toRaw(canvasNode.value);
        }
        // #endif

        // #ifndef MP-ALIPAY
        uni.canvasToTempFilePath(options, proxy);
        // #endif
        // #ifdef MP-ALIPAY
        uni.canvasToTempFilePath(options);
        // #endif
    });
}

function handleClick(event: Event) {
    emit('click', event);
}

defineExpose<QrCodeExpose>({
    exportImage
});
</script>

<style scoped>
.snake-qr-code {
    display: inline-block;
    line-height: 0;
    font-size: 0;
}
</style>
