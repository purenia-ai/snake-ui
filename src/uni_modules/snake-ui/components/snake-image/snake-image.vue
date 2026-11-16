<template>
    <view class="snake-image" :class="customClass" :style="rootStyle" :aria-label="alt || undefined" @click="click">
        <!-- 不写 :key：重挂由状态驱动（失败即卸载、reload 时先卸载一帧），避免与 v-if 链的编译期自动 key 撞车 -->
        <image
            v-if="imageRendered"
            class="snake-image__image"
            :src="displaySrc"
            :alt="alt"
            :mode="mode"
            :show-menu-by-longpress="showMenuByLongpress"
            :webp="webp"
            :style="imageStyle"
            @load="onLoad"
            @error="onError"
        />
        <view
            v-if="isLoading && showLoading"
            class="snake-image__status"
            :class="{ 'snake-image__status--flow': placeholderInFlow }"
            :style="statusStyle"
        >
            <slot name="loading">
                <image
                    v-if="loadingImg && !loadingImageFailed"
                    class="snake-image__status-image"
                    :src="loadingImg"
                    mode="aspectFit"
                    @error="onLoadingImageError"
                />
                <snake-icon v-else-if="loadingIcon" :name="loadingIcon" :size="statusSize" />
            </slot>
        </view>
        <!-- 两个占位拆成独立 v-if：语义等价（加载与失败互斥），且编译器不再给这条链分配自动 key -->
        <view
            v-if="status === 'error' && showError"
            class="snake-image__status snake-image__status--error"
            :class="{ 'snake-image__status--flow': placeholderInFlow }"
            :style="statusStyle"
        >
            <slot name="error">
                <image
                    v-if="errorImg && !errorImageFailed"
                    class="snake-image__status-image"
                    :src="errorImg"
                    mode="aspectFit"
                    @error="onErrorImageError"
                />
                <snake-icon v-else :name="errorIcon" :size="statusSize" />
            </slot>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Image
 * @description 封装 uni-app `image`，提供加载、失败、淡入、圆角、圆形、WebP、长按菜单和图片预览能力。`src` 变化时会自动重置状态。
 * @see /components/image
 */

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { addUnit, unitToPx } from '../../libs/function/unit';
import type { ImageEmits, ImageExpose, ImageProps } from './types';

defineOptions({ name: 'SnakeImage', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<ImageProps>(), {
    src: '',
    alt: '',
    mode: 'scaleToFill',
    width: '100%',
    height: 'auto',
    shape: 'square',
    radius: 0,
    lazyLoad: false,
    lazyThreshold: 100,
    showMenuByLongpress: false,
    webp: false,
    fade: true,
    duration: 300,
    showLoading: true,
    loadingIcon: 'photo',
    loadingImg: '',
    showError: true,
    errorIcon: 'error-circle',
    errorImg: '',
    preview: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<ImageEmits>();
type ImageStatus = 'idle' | 'loading' | 'success' | 'error';

const status = ref<ImageStatus>(props.src ? (props.lazyLoad ? 'idle' : 'loading') : 'error');
const shouldLoad = ref(!props.lazyLoad && Boolean(props.src));
/** reload 时临时卸载图片节点的瞬态标志：原生 image 只有重新挂载才会对同一地址再发一次请求。 */
const remounting = ref(false);
const loadingImageFailed = ref(false);
const errorImageFailed = ref(false);
const instance = getCurrentInstance();
let observer: ReturnType<typeof uni.createIntersectionObserver> | undefined;
let mounted = false;

const isLoading = computed(() => status.value === 'idle' || status.value === 'loading');
const displaySrc = computed(() => (shouldLoad.value ? props.src : ''));
const previewUrls = computed(() => (props.previewUrls?.length ? props.previewUrls : [props.src]));
const autoHeight = computed(() => props.height === 'auto' || props.height == null);
/** 图片节点是否挂载：失败态卸载，reload 期间临时卸载；改地址则节点常驻、由原生 image 自己重新请求。 */
const imageRendered = computed(() => Boolean(displaySrc.value) && status.value !== 'error' && !remounting.value);
/** 图片不占用布局时（失败、懒加载待触发）占位层改走文档流撑高，避免 `height="auto"` 塌成 0。 */
const placeholderInFlow = computed(() => autoHeight.value && !imageRendered.value);
const rootStyle = computed(() => [
    {
        width: addUnit(props.width),
        height: autoHeight.value ? 'auto' : addUnit(props.height),
        borderRadius: props.shape === 'circle' ? '50%' : addUnit(props.radius),
        backgroundColor: props.bgColor
    },
    props.customStyle
]);
const imageStyle = computed(() => ({
    height: autoHeight.value ? 'auto' : '100%',
    opacity: status.value === 'success' ? 1 : 0,
    transitionDuration: props.fade ? `${props.duration}ms` : '0ms'
}));
const statusStyle = computed(() => {
    const style: Record<string, string> = {};
    if (props.bgColor) style.backgroundColor = props.bgColor;
    if (!autoHeight.value) style.minHeight = '0';
    return style;
});

/** 状态图标只接受裸数字 / px / rpx，百分比与视口单位不参与尺寸推断。 */
const PLAIN_UNIT_PATTERN = /^-?\d+(?:\.\d+)?(?:px|rpx)?$/i;
const STATUS_ICON_MIN = 12;
const STATUS_ICON_MAX = 24;

function measureContainerSide(value: unknown): number {
    const raw = String(value ?? '').trim();
    return PLAIN_UNIT_PATTERN.test(raw) ? unitToPx(raw) : 0;
}

/** 状态图标尺寸：跟随容器短边取一半并收敛到 12–24，容器尺寸不可解析时回退 24。 */
const statusSize = computed(() => {
    const sides = [measureContainerSide(props.width), autoHeight.value ? 0 : measureContainerSide(props.height)].filter(
        side => side > 0
    );
    if (!sides.length) return STATUS_ICON_MAX;
    const shortest = Math.min(...sides);
    return Math.max(STATUS_ICON_MIN, Math.min(STATUS_ICON_MAX, Math.round(shortest / 2)));
});

function disconnectObserver() {
    observer?.disconnect();
    observer = undefined;
}

function startLoading() {
    if (!props.src) {
        status.value = 'error';
        return;
    }
    shouldLoad.value = true;
    status.value = 'loading';
    disconnectObserver();
}

function observeViewport() {
    if (!props.lazyLoad || !props.src || !mounted || typeof uni === 'undefined' || !uni.createIntersectionObserver) {
        startLoading();
        return;
    }
    try {
        observer = uni.createIntersectionObserver(instance?.proxy as any, { thresholds: [0, 0.01] });
        observer
            .relativeToViewport({ top: props.lazyThreshold, bottom: props.lazyThreshold })
            .observe('.snake-image', result => {
                if (result?.intersectionRatio > 0) startLoading();
            });
    } catch {
        startLoading();
    }
}

function resetLoadState() {
    disconnectObserver();
    loadingImageFailed.value = false;
    errorImageFailed.value = false;
    if (!props.src) {
        shouldLoad.value = false;
        status.value = 'error';
        return;
    }
    if (!props.lazyLoad) {
        startLoading();
        return;
    }
    shouldLoad.value = false;
    status.value = 'idle';
    observeViewport();
}

function onLoad(event: unknown) {
    status.value = 'success';
    emit('load', event);
}
function onError(event: unknown) {
    status.value = 'error';
    emit('error', event);
}
/** 占位图自身请求失败时回退到内置图标，避免失败状态出现空白。 */
function onLoadingImageError() {
    loadingImageFailed.value = true;
}
function onErrorImageError() {
    errorImageFailed.value = true;
}
/** 供业务在失败重试或鉴权地址刷新后重新发起当前资源请求。 */
async function reload() {
    // 同一地址在已成功 / 加载中时节点常驻，只有先卸载一帧再挂回来才会产生新请求；全程不依赖 :key。
    remounting.value = true;
    await nextTick();
    remounting.value = false;
    resetLoadState();
}
function click(event: unknown) {
    emit('click', event);
    if (
        props.preview &&
        status.value === 'success' &&
        props.src &&
        typeof uni !== 'undefined' &&
        typeof uni.previewImage === 'function'
    ) {
        const urls = previewUrls.value;
        uni.previewImage({ current: urls.includes(props.src) ? props.src : urls[0], urls });
    }
}

watch([() => props.src, () => props.lazyLoad, () => props.lazyThreshold], resetLoadState);
watch(
    () => props.loadingImg,
    () => {
        loadingImageFailed.value = false;
    }
);
watch(
    () => props.errorImg,
    () => {
        errorImageFailed.value = false;
    }
);
onMounted(() => {
    mounted = true;
    // 非懒加载图片在首次渲染时已发起请求，再走一次重置会重复创建图片节点并发起请求。
    if (props.lazyLoad) resetLoadState();
});
onBeforeUnmount(disconnectObserver);

defineExpose<ImageExpose>({ reload });
</script>

<style lang="scss" scoped>
.snake-image {
    position: relative;
    display: block;
    box-sizing: border-box;
    overflow: hidden;
}
.snake-image__image {
    display: block;
    width: 100%;
    transition-property: opacity;
}
.snake-image__status {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
    color: var(--snake-image-status-color, var(--snake-color-text-muted, #909399));
    background-color: var(--snake-image-status-bg, var(--snake-color-surface-muted, #f1f1f1));
}
.snake-image__status--flow {
    /* 图片节点不在渲染（失败 / 懒加载待触发）时由占位层接管高度，auto 高度不会塌成 0 */
    position: static;
}
.snake-image__status--error {
    flex-direction: column;
    color: var(--snake-image-error-color, var(--snake-color-text-muted, #909399));
}
.snake-image__status-image {
    width: 100%;
    height: 100%;
}
</style>
