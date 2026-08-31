<script setup lang="ts">
/**
 * @component SnakeImage
 * @description 封装 uni-app `image`，提供加载、失败、淡入、圆角、圆形、WebP、长按菜单和图片预览能力。`src` 变化时会自动重置状态。
 * @see /components/image
 */

import { computed, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import SnakeLoadingIcon from '../snake-loading-icon/snake-loading-icon.vue';
import type { SnakeImageEmits, SnakeImageProps } from './types';

defineOptions({ name: 'SnakeImage', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeImageProps>(), {
    src: '',
    alt: '',
    mode: 'scaleToFill',
    width: '100%',
    height: 'auto',
    shape: 'square',
    radius: 0,
    lazyLoad: false,
    showMenuByLongpress: false,
    webp: false,
    fade: true,
    duration: 300,
    bgColor: 'var(--snake-color-surface-muted, #f7f8fa)',
    showLoading: true,
    loadingIcon: '',
    showError: true,
    errorIcon: 'image',
    preview: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeImageEmits>();
const loading = ref(Boolean(props.src));
const failed = ref(!props.src);

watch(
    () => props.src,
    value => {
        loading.value = Boolean(value);
        failed.value = !value;
    }
);
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
    opacity: loading.value || failed.value ? 0 : 1,
    transitionDuration: props.fade ? `${props.duration}ms` : '0ms'
}));

function onLoad(event: unknown) {
    loading.value = false;
    failed.value = false;
    emit('load', event);
}
function onError(event: unknown) {
    loading.value = false;
    failed.value = true;
    emit('error', event);
}
function click(event: unknown) {
    emit('click', event);
    if (props.preview && props.src && typeof uni !== 'undefined' && typeof uni.previewImage === 'function') {
        uni.previewImage({ current: props.src, urls: props.previewUrls?.length ? props.previewUrls : [props.src] });
    }
}
</script>

<template>
    <view class="snake-image" :class="customClass" :style="[$snakeThemeStyle, rootStyle]" :aria-label="alt || undefined" @click="click">
        <image
            v-if="src"
            class="snake-image__image"
            :src="src"
            :alt="alt"
            :mode="mode as any"
            :lazy-load="lazyLoad"
            :show-menu-by-longpress="showMenuByLongpress"
            :webp="webp"
            :style="imageStyle"
            @load="onLoad"
            @error="onError"
        />
        <view v-if="loading && showLoading" class="snake-image__status">
            <slot name="loading"
                ><snake-icon v-if="loadingIcon" :name="loadingIcon" /><snake-loading-icon v-else size="20"
            /></slot>
        </view>
        <view v-else-if="failed && showError" class="snake-image__status snake-image__status--error">
            <slot name="error"
                ><snake-icon :name="errorIcon" size="22" /><text class="snake-image__error-text"
                    >图片加载失败</text
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
    color: var(--snake-color-text-muted, #707184);
}
.snake-image__status--error {
    flex-direction: column;
    font-size: 24rpx;
}
.snake-image__error-text {
    margin-top: 10rpx;
}
</style>
