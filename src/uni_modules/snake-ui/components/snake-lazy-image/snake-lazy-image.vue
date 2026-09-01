<script setup lang="ts">
/**
 * @component SnakeLazyImage
 * @description 图片进入视口阈值后才设置真实地址，适合商品长列表。组件优先使用 `uni.createIntersectionObserver`，不支持时安全降级为立即加载。
 * @see /components/lazy-image
 */

import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue';
import SnakeImage from '../snake-image/snake-image.vue';
import type { SnakeLazyImageEmits, SnakeLazyImageProps } from './types';

defineOptions({ name: 'SnakeLazyImage', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeLazyImageProps>(), {
    src: '',
    loadingImg: '',
    errorImg: '',
    threshold: 100,
    index: 0,
    mode: 'widthFix',
    width: '100%',
    height: 'auto',
    radius: 0,
    fade: true,
    duration: 300,
    customStyle: ''
});
const emit = defineEmits<SnakeLazyImageEmits>();
const visible = ref(false);
const instance = getCurrentInstance();
let observer: any;

function onLoad(event: unknown) {
    if (!visible.value) return;
    emit('load', event, props.index);
}

function onError(event: unknown) {
    if (!visible.value) return;
    emit('error', event, props.index);
}

onMounted(() => {
    if (typeof uni === 'undefined' || typeof uni.createIntersectionObserver !== 'function') {
        visible.value = true;
        return;
    }
    try {
        observer = uni.createIntersectionObserver(instance?.proxy as any, { thresholds: [0, 0.01] });
        observer
            .relativeToViewport({ top: props.threshold, bottom: props.threshold })
            .observe('.snake-lazy-image', (result: any) => {
                if (result?.intersectionRatio > 0) {
                    visible.value = true;
                    observer?.disconnect();
                }
            });
    } catch {
        visible.value = true;
    }
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
    <view class="snake-lazy-image">
        <snake-image
            :src="visible ? src : loadingImg"
            :mode="mode"
            :width="width"
            :height="height"
            :radius="radius"
            :fade="fade"
            :duration="duration"
            error-icon="image"
            :custom-style="customStyle"
            lazy-load
            @click="emit('click', $event, index)"
            @load="onLoad"
            @error="onError"
        >
            <template v-if="$slots.loading" #loading><slot name="loading" /></template>
            <template v-if="$slots.error || errorImg" #error>
                <slot name="error">
                    <image class="snake-lazy-image__error-image" :src="errorImg" mode="aspectFit" />
                </slot>
            </template>
        </snake-image>
    </view>
</template>

<style scoped>
.snake-lazy-image__error-image {
    width: 100%;
    height: 100%;
}
</style>
