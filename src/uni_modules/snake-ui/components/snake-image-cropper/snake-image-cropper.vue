<template>
    <view
        v-if="visible"
        class="snake-image-cropper"
        :class="customClass"
        :style="[rootStyle, customStyle]"
        @touchmove.stop="onRootTouchMove"
    >
        <view class="snake-image-cropper__stage" :style="stageStyle">
            <!-- 裁剪框：四块遮罩拼出「挖洞」效果，pointer-events 关掉才能摸到下面的图片 -->
            <view class="snake-image-cropper__cut" :class="{ 'snake-image-cropper__cut--moving': moving }">
                <view
                    class="snake-image-cropper__overlay snake-image-cropper__overlay--sized"
                    :style="{ height: addUnit(cutRect.top) }"
                />
                <view class="snake-image-cropper__cut-middle" :style="{ height: addUnit(cutRect.height) }">
                    <view
                        class="snake-image-cropper__overlay snake-image-cropper__overlay--sized"
                        :style="{ width: addUnit(cutRect.left) }"
                    />
                    <view class="snake-image-cropper__cut-body" :style="cutBodyStyle">
                        <view class="snake-image-cropper__gridline snake-image-cropper__gridline--x1" />
                        <view class="snake-image-cropper__gridline snake-image-cropper__gridline--x2" />
                        <view class="snake-image-cropper__gridline snake-image-cropper__gridline--y1" />
                        <view class="snake-image-cropper__gridline snake-image-cropper__gridline--y2" />
                        <view class="snake-image-cropper__corner snake-image-cropper__corner--left-top" />
                        <view class="snake-image-cropper__corner snake-image-cropper__corner--right-top" />
                        <view class="snake-image-cropper__corner snake-image-cropper__corner--left-bottom" />
                        <view class="snake-image-cropper__corner snake-image-cropper__corner--right-bottom" />
                    </view>
                    <view class="snake-image-cropper__overlay snake-image-cropper__overlay--fill" />
                </view>
                <view class="snake-image-cropper__overlay snake-image-cropper__overlay--fill" />
            </view>

            <image
                v-if="displaySrc"
                class="snake-image-cropper__img"
                :src="displaySrc"
                :style="imageStyle"
                :lazy-load="false"
                @touchstart="onImageTouchStart"
                @touchmove.stop="onImageTouchMove"
                @touchend="onImageTouchEnd"
                @touchcancel="onImageTouchEnd"
            />

            <view v-if="!loaded" class="snake-image-cropper__status">
                <SnakeLoading v-if="!loadFailed" :size="18" />
                <text v-else class="snake-image-cropper__status-text">{{ failedText }}</text>
            </view>
        </view>

        <!-- 导出用的画布全程离屏，只负责 drawImage，屏幕上不可见 -->
        <canvas
            :canvas-id="canvasId"
            :id="canvasId"
            class="snake-image-cropper__canvas"
            :disable-scroll="true"
            :style="canvasStyle"
        />

        <view class="snake-image-cropper__footer" :style="footerStyle">
            <view v-if="!disabledRotate" class="snake-image-cropper__tools">
                <view class="snake-image-cropper__rotate" @click="onRotate">
                    <SnakeIcon
                        name="reload"
                        :size="ROTATE_ICON_SIZE"
                        :color="iconColor"
                        :margin-left="0"
                        :margin-right="0"
                    />
                </view>
            </view>
            <view class="snake-image-cropper__buttons">
                <view class="snake-image-cropper__cancel" @click="onCancel">{{ cancelLabel }}</view>
                <view class="snake-image-cropper__confirm">
                    <SnakeButton
                        type="primary"
                        size="large"
                        block
                        :text="confirmLabel"
                        :disabled="!canConfirm"
                        :loading="exporting"
                        @click="onConfirm"
                    />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component ImageCropper
 * @description 全屏图片裁剪层：拖拽、双指缩放、90° 旋转与自定义宽高比，确认后用离屏 canvas
 * 导出临时文件。
 * @see /components/image-cropper
 */
import { computed, getCurrentInstance, onBeforeUnmount, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { guid } from '../../libs/function/guid';
import { getSystemInfo } from '../../libs/function/system';
import { isDebugMode } from '../../libs/config/state';
import zIndex from '../../libs/config/zIndex';
import { translate } from '../../locale';
import SnakeButton from '../snake-button/snake-button.vue';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import SnakeLoading from '../snake-loading/snake-loading.vue';
import {
    clampPosition,
    clampScale,
    computeCutRect,
    resolveInitialPlacement,
    touchDistance,
    type CropperRect
} from './geometry';
import { imageCropperProps, type ImageCropperEmits, type ImageCropperExpose } from './types';

defineOptions({ name: 'SnakeImageCropper', options: { virtualHost: true, styleIsolation: 'shared' } });

/** 裁剪框与舞台边缘的留白。 */
const CUT_GAP = 20;
/** 旋转图标大小；工具行跟着留出高度，保证点击区域不是一条细边。 */
const ROTATE_ICON_SIZE = 28;
/** 工具行高度：图标 28 上下各留 6 的呼吸。 */
const TOOLBAR_HEIGHT = 40;
/** 底部操作区的上下内边距，与样式里的 padding 保持一致。 */
const FOOTER_PADDING = 16;
/**
 * 底部操作区内容高度：上内边距 16 + 工具行 40 + 间距 12 + 按钮行 46 + 下内边距 16 = 130。
 * 按钮行按 snake-button `size="large"` 的 46px 算，样式里也把行高锁成 46px，两边不会各算各的。
 */
const FOOTER_HEIGHT = FOOTER_PADDING * 2 + TOOLBAR_HEIGHT + 12 + 46;
/** 旋转时的过渡时长，与样式里的 transition-duration 保持一致。 */
const ANIMATION_DURATION = 300;

const props = defineProps(imageCropperProps);
const emit = defineEmits<ImageCropperEmits>();

const instance = getCurrentInstance();

/** canvas 唯一标识：同一个页面可能存在多个裁剪器。 */
const canvasId = guid('snake-image-cropper');

/** 裁剪框矩形（舞台坐标）。 */
const cutRect = ref<CropperRect>({ width: 0, height: 0, left: 0, top: 0 });
/** 舞台高度。 */
const stageHeight = ref(0);
/** 视口尺寸与底部安全区，打开时刷新一次。 */
const viewport = ref({ width: 0, height: 0, safeBottom: 0 });

/** 原图尺寸。 */
const imageWidth = ref(0);
const imageHeight = ref(0);
/** 原图本地路径；小程序端 drawImage 必须用它，网络地址画不出来。 */
const localPath = ref('');
/** 缩放前的基准尺寸。 */
const baseSize = ref({ width: 0, height: 0 });
/** 缩放倍数，1 表示恰好覆盖裁剪框（显式传给 imgWidth 时除外）。 */
const scale = ref(1);
/** 旋转角度，始终是 90 的倍数。 */
const angle = ref(0);
/** 图片中心点，相对裁剪框左上角。 */
const centerLeft = ref(0);
const centerTop = ref(0);

/** 是否处于手势中，驱动遮罩高亮。 */
const moving = ref(false);
/** 是否正在播放旋转过渡。 */
const animating = ref(false);
/** 图片信息是否就绪。 */
const loaded = ref(false);
/** 图片是否读取失败。 */
const loadFailed = ref(false);
/** 是否正在导出。 */
const exporting = ref(false);

/** 缓存的 canvas 上下文：同一层只建一次，关闭时丢弃。 */
let context: UniApp.CanvasContext | null = null;
let animationTimer: ReturnType<typeof setTimeout> | null = null;
/** 单指拖动时「手指 - 图片中心」的偏移。 */
let dragOffset = { x: 0, y: 0 };
/** 双指缩放上一帧的两指距离。 */
let lastFingerDistance = 0;

const visible = computed(() => Boolean(props.modelValue ?? props.show ?? false));
const zIndexValue = computed(() => props.zIndex ?? zIndex.popup);
const exportScaleValue = computed(() => {
    const value = Math.round(Number(props.exportScale));
    return Number.isFinite(value) && value > 0 ? value : 2;
});
const maxScaleValue = computed(() => {
    const value = Number(props.maxScale);
    return Number.isFinite(value) && value > 1 ? value : 1;
});
const canvasWidth = computed(() => Math.round(cutRect.value.width * exportScaleValue.value));
const canvasHeight = computed(() => Math.round(cutRect.value.height * exportScaleValue.value));
const displaySrc = computed(() => (loaded.value ? localPath.value : ''));
const canConfirm = computed(() => loaded.value && !exporting.value && cutRect.value.width > 0);
const confirmLabel = computed(() => props.confirmText || translate('common.confirm') || '确定');
const cancelLabel = computed(() => props.cancelText || translate('common.cancel') || '取消');
const failedText = computed(() => translate('image.error') || '图片加载失败');
const iconColor = computed(() => 'var(--snake-image-cropper-footer-color, #ffffff)');

const rootStyle = computed(() => ({ zIndex: zIndexValue.value }));
const stageStyle = computed(() => ({ height: addUnit(stageHeight.value) }));
const cutBodyStyle = computed(() => ({
    width: addUnit(cutRect.value.width),
    height: addUnit(cutRect.value.height)
}));
/** 底部操作区固定占位，安全区用同一个数同时驱动高度与内边距。 */
const footerStyle = computed(() => ({
    height: addUnit(FOOTER_HEIGHT + viewport.value.safeBottom),
    // 行内 bottom 会覆盖样式里的 padding 简写，所以要把基准内边距一起加上
    paddingBottom: addUnit(FOOTER_PADDING + viewport.value.safeBottom)
}));
const canvasStyle = computed(() => ({
    width: addUnit(canvasWidth.value),
    height: addUnit(canvasHeight.value),
    left: addUnit(-canvasWidth.value),
    top: addUnit(-canvasHeight.value)
}));

const imageStyle = computed(() => {
    const { width, height } = baseSize.value;
    if (!width || !height) return {};
    // translate 作用在左上角，配合 transform-origin: center，等效于把图片中心放到目标点
    const translateX = cutRect.value.left + centerLeft.value - width / 2;
    const translateY = cutRect.value.top + centerTop.value - height / 2;
    return {
        width: addUnit(width),
        height: addUnit(height),
        transform: `translate(${addUnit(translateX)}, ${addUnit(translateY)}) scale(${scale.value}) rotate(${angle.value}deg)`,
        transitionDuration: animating.value ? `${ANIMATION_DURATION}ms` : '0ms'
    };
});

/** 由系统信息推出底部安全区：safeArea 的度量基准是屏幕，不是 window。 */
function resolveSafeBottom(info: UniApp.GetSystemInfoResult): number {
    const screenHeight = Number(info.screenHeight) || 0;
    const safeBottom = Number(info.safeArea?.bottom) || 0;
    if (screenHeight <= 0 || safeBottom <= 0) return 0;
    return Math.max(screenHeight - safeBottom, 0);
}

/** 重算舞台与裁剪框；视频/刘海等尺寸变化靠重新打开时刷新。 */
function computeLayout() {
    const info = getSystemInfo();
    const safeBottom = props.safeAreaInsetBottom ? resolveSafeBottom(info) : 0;
    const stage = Math.max((Number(info.windowHeight) || 0) - FOOTER_HEIGHT - safeBottom, 0);
    viewport.value = {
        width: Number(info.windowWidth) || 0,
        height: Number(info.windowHeight) || 0,
        safeBottom
    };
    stageHeight.value = stage;
    cutRect.value = computeCutRect({
        width: viewport.value.width,
        height: stage,
        gap: CUT_GAP,
        aspectRatio: props.aspectRatio
    });
}

/** 把图片摆到「恰好覆盖裁剪框并居中」的初始位置。 */
function applyInitialPlacement() {
    const placement = resolveInitialPlacement({
        imageWidth: imageWidth.value,
        imageHeight: imageHeight.value,
        cutWidth: cutRect.value.width,
        cutHeight: cutRect.value.height,
        imgWidth: props.imgWidth,
        imgHeight: props.imgHeight,
        viewportWidth: viewport.value.width,
        viewportHeight: viewport.value.height
    });
    baseSize.value = { width: placement.width, height: placement.height };
    scale.value = placement.scale;
    angle.value = 0;
    centerLeft.value = cutRect.value.width / 2;
    centerTop.value = cutRect.value.height / 2;
    applyClamp();
}

/** 缩放下限与位置边界一次算齐；`nextScale` 缺省时沿用当前缩放。 */
function applyClamp(nextScale?: number) {
    const safeScale = clampScale({
        width: baseSize.value.width,
        height: baseSize.value.height,
        scale: nextScale ?? scale.value,
        cutWidth: cutRect.value.width,
        cutHeight: cutRect.value.height,
        angle: angle.value
    });
    const position = clampPosition({
        left: centerLeft.value,
        top: centerTop.value,
        width: baseSize.value.width,
        height: baseSize.value.height,
        scale: safeScale,
        cutWidth: cutRect.value.width,
        cutHeight: cutRect.value.height,
        angle: angle.value
    });
    scale.value = safeScale;
    centerLeft.value = position.left;
    centerTop.value = position.top;
}

/** 读取图片信息；网络图片必须走 getImageInfo 才能拿到本地路径。 */
function readImage() {
    if (!props.src) {
        loaded.value = false;
        loadFailed.value = true;
        localPath.value = '';
        return;
    }
    loadFailed.value = false;
    uni.getImageInfo({
        src: props.src,
        success: res => {
            imageWidth.value = Number(res.width) || 0;
            imageHeight.value = Number(res.height) || 0;
            localPath.value = res.path || props.src;
            loaded.value = imageWidth.value > 0 && imageHeight.value > 0;
            loadFailed.value = !loaded.value;
            if (loaded.value) applyInitialPlacement();
            emit('imgloaded', {
                width: imageWidth.value,
                height: imageHeight.value,
                path: localPath.value
            });
        },
        fail: error => {
            loaded.value = false;
            loadFailed.value = true;
            localPath.value = '';
            emit('imgloaderror', {
                src: props.src,
                errMsg: String((error as { errMsg?: string })?.errMsg ?? '')
            });
        }
    });
}

/** 打开：重算布局并重新读图。 */
function initialize() {
    computeLayout();
    moving.value = false;
    animating.value = false;
    readImage();
}

/** 关闭：清掉手势与画布上下文，图片信息留着，避免同一张图重复读取。 */
function resetInteraction() {
    moving.value = false;
    animating.value = false;
    exporting.value = false;
    if (animationTimer) {
        clearTimeout(animationTimer);
        animationTimer = null;
    }
    context = null;
}

/** 归整到最近的 90 倍数并落到 [0, 360)。 */
function normalizeAngle(value: number): number {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    const turns = Math.round(numeric / 90) % 4;
    return ((turns + 4) % 4) * 90;
}

function scheduleAnimationEnd() {
    if (animationTimer) clearTimeout(animationTimer);
    animationTimer = setTimeout(() => {
        animating.value = false;
        animationTimer = null;
    }, ANIMATION_DURATION);
}

function setRotate(value: number) {
    if (props.disabledRotate) return;
    const next = normalizeAngle(value);
    if (next === angle.value) return;
    animating.value = true;
    angle.value = next;
    applyClamp();
    scheduleAnimationEnd();
}

function onRotate() {
    setRotate(angle.value - 90);
}

/** 回到初始态：角度归零、缩放铺满、居中。 */
function reset() {
    moving.value = false;
    animating.value = false;
    applyInitialPlacement();
}

function readTouches(event: unknown): Array<{ x: number; y: number }> {
    const source = event as { touches?: Array<Record<string, number>> } | null;
    const touches = source?.touches ?? [];
    return Array.from(touches).map(touch => ({
        x: Number(touch.clientX ?? touch.pageX) || 0,
        y: Number(touch.clientY ?? touch.pageY) || 0
    }));
}

/** 小程序端没有 preventDefault，滚动靠模板上的 `.stop`；H5 端补一次默认行为拦截。 */
function preventPageScroll(event: unknown) {
    if (!props.lockScroll) return;
    const source = event as { preventDefault?: () => void } | null;
    source?.preventDefault?.();
}

function onRootTouchMove(event: unknown) {
    preventPageScroll(event);
}

function onImageTouchStart(event: unknown) {
    moving.value = true;
    const points = readTouches(event);
    if (points.length >= 2) {
        lastFingerDistance = touchDistance(points[0], points[1]);
        return;
    }
    if (!points.length) return;
    dragOffset = {
        x: points[0].x - (cutRect.value.left + centerLeft.value),
        y: points[0].y - (cutRect.value.top + centerTop.value)
    };
}

function onImageTouchMove(event: unknown) {
    preventPageScroll(event);
    const points = readTouches(event);
    if (points.length >= 2) {
        const distance = touchDistance(points[0], points[1]);
        if (lastFingerDistance > 0 && distance > 0) {
            // 先按 maxScale 截断上限，再由 clampScale 兜住「不低于铺满」，顺序不能反
            const nextScale = Math.min(scale.value * (distance / lastFingerDistance), maxScaleValue.value);
            applyClamp(nextScale);
        }
        lastFingerDistance = distance;
        return;
    }
    if (!points.length) return;
    centerLeft.value = points[0].x - dragOffset.x - cutRect.value.left;
    centerTop.value = points[0].y - dragOffset.y - cutRect.value.top;
    applyClamp();
}

function onImageTouchEnd(event: unknown) {
    const points = readTouches(event);
    if (points.length) {
        // 双指抬起一根时人还没离开屏幕：重新锚定单指偏移，否则接着拖动会跳一下
        dragOffset = {
            x: points[0].x - (cutRect.value.left + centerLeft.value),
            y: points[0].y - (cutRect.value.top + centerTop.value)
        };
        lastFingerDistance = 0;
        return;
    }
    moving.value = false;
    lastFingerDistance = 0;
}

/** 懒创建画布上下文：图层是 v-if，关闭即销毁，上下文跟着丢弃。 */
function ensureContext(): UniApp.CanvasContext | null {
    if (!context) {
        context = uni.createCanvasContext(canvasId, instance?.proxy ?? undefined);
    }
    return context;
}

/** canvasToTempFilePath 的宽高按 canvas 元素像素取整，避免半像素导致边缘错位。 */
function exportTempFile() {
    const width = canvasWidth.value;
    const height = canvasHeight.value;
    if (!width || !height) {
        exporting.value = false;
        return;
    }
    const isPng = props.fileType !== 'jpg';
    const quality = isPng ? undefined : Math.min(1, Math.max(0, Number(props.quality) || 1));
    uni.canvasToTempFilePath(
        {
            canvasId,
            width,
            height,
            destWidth: width,
            destHeight: height,
            fileType: props.fileType,
            quality,
            success: res => {
                const tempFilePath = String(
                    (res as { tempFilePath?: string; filePath?: string })?.tempFilePath ??
                        (res as { filePath?: string })?.filePath ??
                        ''
                );
                if (!tempFilePath) {
                    exporting.value = false;
                    if (isDebugMode('warn')) console.warn('[Snake UI] image-cropper export returned no path');
                    return;
                }
                emit('confirm', { tempFilePath, width, height });
                close();
            },
            fail: error => {
                // 导出失败保持打开，用户还能重试；关闭的话只会拿到一个空结果
                exporting.value = false;
                if (isDebugMode('warn')) console.warn('[Snake UI] image-cropper export failed', error);
            }
        },
        instance?.proxy ?? undefined
    );
}

/**
 * 绘制裁剪结果。
 * `save` / `restore` 必须成对：旧版 canvas 的变换矩阵是累积的，少一次 restore 的话
 * 第二次导出会把上一次的位移和旋转再叠一遍。
 */
function draw() {
    if (!loaded.value || !localPath.value) return;
    const ctx = ensureContext();
    if (!ctx) return;

    const exportScale = exportScaleValue.value;
    const width = baseSize.value.width * scale.value * exportScale;
    const height = baseSize.value.height * scale.value * exportScale;
    const offsetX = (centerLeft.value - cutRect.value.width / 2) * exportScale;
    const offsetY = (centerTop.value - cutRect.value.height / 2) * exportScale;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.rotate((angle.value * Math.PI) / 180);
    ctx.drawImage(localPath.value, -width / 2, -height / 2, width, height);
    ctx.restore();
    ctx.draw(false, () => exportTempFile());
}

function onConfirm() {
    if (!canConfirm.value) return;
    exporting.value = true;
    draw();
}

function close() {
    emit('update:modelValue', false);
    emit('update:show', false);
}

function onCancel() {
    emit('cancel');
    close();
}

watch(
    () => props.src,
    () => {
        if (!visible.value) return;
        readImage();
    }
);

// immediate：允许挂载时就已经是打开状态（例如详情页直接用 `:show="true"` 承载裁剪）
watch(
    visible,
    open => {
        if (open) {
            initialize();
            return;
        }
        resetInteraction();
    },
    { immediate: true }
);

watch(
    () => props.aspectRatio,
    () => {
        if (!visible.value) return;
        computeLayout();
        applyInitialPlacement();
    }
);

onBeforeUnmount(() => {
    if (animationTimer) {
        clearTimeout(animationTimer);
        animationTimer = null;
    }
    context = null;
});

defineExpose<ImageCropperExpose>({ setRotate, reset });
</script>

<style scoped>
.snake-image-cropper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    overflow: hidden;
    background-color: var(--snake-image-cropper-bg, #000000);
    /* H5 端 stopPropagation 拦不住原生滚动，靠 touch-action 关掉手势识别 */
    touch-action: none;
}

.snake-image-cropper__stage {
    position: relative;
    width: 100%;
    flex: none;
    overflow: hidden;
}

.snake-image-cropper__cut {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    z-index: 3;
    pointer-events: none;
}

.snake-image-cropper__cut-middle {
    display: flex;
    flex: none;
}

.snake-image-cropper__overlay {
    background-color: var(--snake-image-cropper-mask, rgba(0, 0, 0, 0.55));
    transition: background-color var(--snake-image-cropper-mask-transition, 0.2s);
}

/* 上下左右四块遮罩拼出挖洞：两块定尺寸，两块吃掉剩余空间 */
.snake-image-cropper__overlay--sized {
    flex: none;
}

.snake-image-cropper__overlay--fill {
    flex: 1;
}

.snake-image-cropper__cut--moving .snake-image-cropper__overlay {
    background-color: var(--snake-image-cropper-mask-highlight, transparent);
}

.snake-image-cropper__cut-body {
    position: relative;
    flex: none;
    box-sizing: border-box;
}

/* 1 物理像素细线：直接写 1px 在高倍屏上会变粗，放大两倍再缩回去 */
.snake-image-cropper__cut-body::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 200%;
    box-sizing: border-box;
    border: 1px solid var(--snake-image-cropper-border-color, #ffffff);
    transform: scale(0.5);
    transform-origin: 0 0;
}

.snake-image-cropper__gridline {
    position: absolute;
    background-color: var(--snake-image-cropper-gridline-color, rgba(255, 255, 255, 0.35));
}

.snake-image-cropper__gridline--x1,
.snake-image-cropper__gridline--x2 {
    left: 0;
    width: 100%;
    height: 1px;
}

.snake-image-cropper__gridline--x1 {
    top: 33.33%;
}

.snake-image-cropper__gridline--x2 {
    top: 66.66%;
}

.snake-image-cropper__gridline--y1,
.snake-image-cropper__gridline--y2 {
    top: 0;
    width: 1px;
    height: 100%;
}

.snake-image-cropper__gridline--y1 {
    left: 33.33%;
}

.snake-image-cropper__gridline--y2 {
    left: 66.66%;
}

.snake-image-cropper__corner {
    position: absolute;
    width: 20px;
    height: 20px;
}

.snake-image-cropper__corner::before,
.snake-image-cropper__corner::after {
    content: '';
    position: absolute;
    background-color: var(--snake-image-cropper-corner-color, #ffffff);
}

.snake-image-cropper__corner::before {
    width: 2px;
    height: 20px;
}

.snake-image-cropper__corner::after {
    width: 20px;
    height: 2px;
}

.snake-image-cropper__corner--left-top {
    top: 0;
    left: 0;
}

.snake-image-cropper__corner--right-top {
    top: 0;
    right: 0;
}

.snake-image-cropper__corner--left-bottom {
    bottom: 0;
    left: 0;
}

.snake-image-cropper__corner--right-bottom {
    right: 0;
    bottom: 0;
}

.snake-image-cropper__img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    transform-origin: center center;
    backface-visibility: hidden;
}

.snake-image-cropper__status {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    z-index: 4;
}

.snake-image-cropper__status-text {
    color: var(--snake-image-cropper-footer-color, #ffffff);
    font-size: 14px;
}

.snake-image-cropper__canvas {
    position: fixed;
    background-color: var(--snake-image-cropper-bg, #000000);
    pointer-events: none;
    z-index: 1;
}

.snake-image-cropper__footer {
    position: relative;
    display: flex;
    flex: none;
    flex-direction: column;
    justify-content: flex-end;
    box-sizing: border-box;
    padding: 16px;
    z-index: 4;
}

/* 工具行：水平居中，与下方按钮留出固定间隔 */
.snake-image-cropper__tools {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content: center;
}

.snake-image-cropper__rotate {
    display: flex;
    width: 48px;
    height: 40px;
    align-items: center;
    justify-content: center;
}

.snake-image-cropper__buttons {
    display: flex;
    height: 46px;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
}

.snake-image-cropper__cancel {
    display: flex;
    height: 100%;
    flex: none;
    align-items: center;
    padding: 0 12px;
    color: var(--snake-image-cropper-footer-color, #ffffff);
    font-size: 15px;
}

.snake-image-cropper__confirm {
    height: 100%;
    flex: 1;
}
</style>
