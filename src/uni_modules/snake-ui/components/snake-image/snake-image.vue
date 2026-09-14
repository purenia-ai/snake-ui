<script setup lang="ts">
/**
 * @component Image
 * @description 封装 uni-app `image`，提供加载、失败、淡入、圆角、圆形、WebP、长按菜单和图片预览能力。`src` 变化时会自动重置状态。
 * @see /components/image
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import Icon from '../snake-icon/snake-icon.vue';
import LoadingIcon from '../snake-loading-icon/snake-loading-icon.vue';
import type { ImageEmits, ImageProps } from './types';

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
    lazy: false,
    lazyThreshold: 100,
    showMenuByLongpress: false,
    webp: false,
    fade: true,
    duration: 300,
    bgColor: 'var(--snake-color-surface-muted, #f7f8fa)',
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

const status = ref<ImageStatus>(props.src ? (props.lazy ? 'idle' : 'loading') : 'error');
const shouldLoad = ref(!props.lazy && Boolean(props.src));
const instance = getCurrentInstance();
let observer: ReturnType<typeof uni.createIntersectionObserver> | undefined;
let mounted = false;

const isLoading = computed(() => status.value === 'idle' || status.value === 'loading');
const displaySrc = computed(() => (shouldLoad.value ? props.src : ''));
const rootStyle = computed(() => [
    {
        width: addUnit(props.width),
        height: props.height === 'auto' ? 'auto' : addUnit(props.height),
        borderRadius: props.shape === 'circle' ? '50%' : addUnit(props.radius),
        backgroundColor: props.bgColor
    },
    props.customStyle
]);
const imageStyle = computed(() => ({
    height: props.height === 'auto' ? 'auto' : '100%',
    opacity: status.value === 'success' ? 1 : 0,
    transitionDuration: props.fade ? `${props.duration}ms` : '0ms'
}));

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
    if (!props.lazy || !props.src || !mounted || typeof uni === 'undefined' || !uni.createIntersectionObserver) {
        startLoading();
        return;
    }
    try {
        observer = uni.createIntersectionObserver(instance?.proxy as any, { thresholds: [0, 0.01] });
        observer.relativeToViewport({ top: props.lazyThreshold, bottom: props.lazyThreshold }).observe('.snake-image', result => {
            if (result?.intersectionRatio > 0) startLoading();
        });
    } catch {
        startLoading();
    }
}

function resetLoadState() {
    disconnectObserver();
    if (!props.src) {
        shouldLoad.value = false;
        status.value = 'error';
        return;
    }
    if (!props.lazy) {
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
function click(event: unknown) {
    emit('click', event);
    if (props.preview && props.src && typeof uni !== 'undefined' && typeof uni.previewImage === 'function') {
        uni.previewImage({ current: props.src, urls: props.previewUrls?.length ? props.previewUrls : [props.src] });
    }
}

watch([() => props.src, () => props.lazy], resetLoadState);
onMounted(() => {
    mounted = true;
    resetLoadState();
});
onBeforeUnmount(disconnectObserver);
</script>

<template>
    <view class="snake-image" :class="customClass" :style="rootStyle" :aria-label="alt || undefined" @click="click">
        <image
            v-if="displaySrc"
            class="snake-image__image"
            :src="displaySrc"
            :alt="alt"
            :mode="mode as any"
            :lazy-load="lazyLoad"
            :show-menu-by-longpress="showMenuByLongpress"
            :webp="webp"
            :style="imageStyle"
            @load="onLoad"
            @error="onError"
        />
        <view v-if="isLoading && showLoading" class="snake-image__status">
            <slot name="loading"
                ><image v-if="loadingImg" class="snake-image__status-image" :src="loadingImg" mode="aspectFit" /><snake-icon
                    v-else-if="loadingIcon"
                    :name="loadingIcon" /><snake-loading-icon v-else size="20"
            /></slot>
        </view>
        <view v-else-if="status === 'error' && showError" class="snake-image__status snake-image__status--error">
            <slot name="error"
                ><image v-if="errorImg" class="snake-image__status-image" :src="errorImg" mode="aspectFit" /><template v-else
                    ><snake-icon :name="errorIcon" size="22" /><text class="snake-image__error-text">图片加载失败</text></template
                ></slot
            >
        </view>
    </view>
</template>

<style scoped>
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
    color: var(--snake-color-text-muted, #909399);
}
.snake-image__status--error {
    flex-direction: column;
    font-size: 24rpx;
}
.snake-image__status-image {
    width: 100%;
    height: 100%;
}
.snake-image__error-text {
    margin-top: 10rpx;
}
</style>
