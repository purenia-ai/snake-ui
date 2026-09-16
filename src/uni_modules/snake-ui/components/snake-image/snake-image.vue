<template>
    <view class="snake-image" :class="customClass" :style="rootStyle" :aria-label="alt || undefined" @click="click">
        <image
            v-if="displaySrc"
            :key="imageKey"
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
        <view v-if="isLoading && showLoading" class="snake-image__status" :style="statusStyle">
            <slot name="loading">
                <image v-if="loadingImg" class="snake-image__status-image" :src="loadingImg" mode="aspectFit" />
                <snake-icon v-else-if="loadingIcon" :name="loadingIcon" />
                <snake-loading v-else size="20" />
            </slot>
        </view>
        <view
            v-else-if="status === 'error' && showError"
            class="snake-image__status snake-image__status--error"
            :style="statusStyle"
        >
            <slot name="error">
                <image v-if="errorImg" class="snake-image__status-image" :src="errorImg" mode="aspectFit" />
                <template v-else>
                    <snake-icon :name="errorIcon" size="22" />
                    <text class="snake-image__error-text">{{ errorText }}</text>
                </template>
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

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { translate } from '../../locale';
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
    loadingIcon: '',
    loadingImg: '',
    showError: true,
    errorIcon: 'image',
    errorImg: '',
    preview: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<ImageEmits>();
type ImageStatus = 'idle' | 'loading' | 'success' | 'error';

const status = ref<ImageStatus>(props.src ? (props.lazyLoad ? 'idle' : 'loading') : 'error');
const shouldLoad = ref(!props.lazyLoad && Boolean(props.src));
const imageKey = ref(0);
const instance = getCurrentInstance();
let observer: ReturnType<typeof uni.createIntersectionObserver> | undefined;
let mounted = false;

const isLoading = computed(() => status.value === 'idle' || status.value === 'loading');
const displaySrc = computed(() => (shouldLoad.value ? props.src : ''));
const previewUrls = computed(() => (props.previewUrls?.length ? props.previewUrls : [props.src]));
const autoHeight = computed(() => props.height === 'auto' || props.height == null);
const errorText = computed(() => translate('image.error'));
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
const statusStyle = computed(() => (autoHeight.value ? undefined : { minHeight: '0' }));

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
    imageKey.value += 1;
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
/** 供业务在失败重试或鉴权地址刷新后重新发起当前资源请求。 */
function reload() {
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
onMounted(() => {
    mounted = true;
    resetLoadState();
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
    min-height: 120rpx;
    color: var(--snake-image-status-color, var(--snake-color-text-muted, #909399));
    background-color: var(--snake-image-status-bg, transparent);
}
.snake-image__status--error {
    flex-direction: column;
    font-size: 24rpx;
    color: var(--snake-image-error-color, var(--snake-color-text-muted, #909399));
}
.snake-image__status-image {
    width: 100%;
    height: 100%;
}
.snake-image__error-text {
    margin-top: 10rpx;
}
</style>
