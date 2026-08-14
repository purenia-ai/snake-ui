<script setup lang="ts">
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
            :error-icon="errorImg || 'image'"
            :custom-style="customStyle"
            lazy-load
            @click="emit('click', $event, index)"
            @load="emit('load', $event, index)"
            @error="emit('error', $event, index)"
        >
            <template v-if="$slots.loading" #loading><slot name="loading" /></template>
            <template v-if="$slots.error" #error><slot name="error" /></template>
        </snake-image>
    </view>
</template>
