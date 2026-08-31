<script setup lang="ts">
/**
 * @component SnakeSticky
 * @description 通过节点测量和页面滚动状态实现跨端吸顶，不再只依赖浏览器 CSS sticky。
 * @see /components/sticky
 */

import { onPageScroll } from '@dcloudio/uni-app';
import { computed, getCurrentInstance, nextTick, onMounted, ref, watch, type CSSProperties } from 'vue';
import type { SnakeStickyEmits, SnakeStickyProps } from './types';

defineOptions({ name: 'SnakeSticky', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeStickyProps>(), {
    offsetTop: 0,
    customNavHeight: 0,
    zIndex: 10,
    disabled: false,
    bgColor: 'transparent',
    scrollTop: 0,
    index: 0,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeStickyEmits>();
const instance = getCurrentInstance();
const fixed = ref(false);
const height = ref(0);
const width = ref(0);
const left = ref(0);
const originTop = ref(0);
const currentScrollTop = ref(props.scrollTop);

function unitNumber(value: number | string | null | undefined) {
    const number = Number.parseFloat(String(value ?? 0));
    return Number.isFinite(number) ? number : 0;
}
const top = computed(() => unitNumber(props.offsetTop) + unitNumber(props.customNavHeight));
const placeholderStyle = computed(() => ({ height: fixed.value ? `${height.value}px` : 'auto' }));
const contentStyle = computed(() => [
    (fixed.value
        ? { position: 'fixed', top: `${top.value}px`, left: `${left.value}px`, width: `${width.value}px` }
        : { position: 'relative' }) as CSSProperties,
    { zIndex: props.zIndex, backgroundColor: props.bgColor },
    props.customStyle
]);

function setFixed(value: boolean) {
    if (fixed.value === value) return;
    fixed.value = value;
    const detail = { isFixed: value, index: props.index };
    if (value) emit('fixed', detail);
    else emit('unfixed', detail);
    emit('change', detail);
}

function updatePosition(scrollTop = currentScrollTop.value) {
    currentScrollTop.value = scrollTop;
    setFixed(!props.disabled && scrollTop + top.value >= originTop.value);
}

async function update() {
    await nextTick();
    if (typeof uni === 'undefined' || typeof uni.createSelectorQuery !== 'function') return;
    await new Promise<void>(resolve => {
        const query = uni.createSelectorQuery().in(instance?.proxy as any);
        query
            .select('.snake-sticky__content')
            .boundingClientRect((rect: any) => {
                if (rect) {
                    height.value = Number(rect.height) || height.value;
                    width.value = Number(rect.width) || width.value;
                    left.value = Number(rect.left) || 0;
                    if (!fixed.value) originTop.value = Number(rect.top) + currentScrollTop.value;
                }
            })
            .exec(() => {
                updatePosition();
                resolve();
            });
    });
}

watch(
    () => props.scrollTop,
    value => updatePosition(Number(value) || 0)
);
watch(
    () => props.disabled,
    disabled => {
        if (disabled) setFixed(false);
        else updatePosition();
    }
);
onPageScroll(event => updatePosition(Number(event.scrollTop) || 0));
onMounted(() => void update());
defineExpose({ update });
</script>

<template>
    <view class="snake-sticky" :style="placeholderStyle">
        <view class="snake-sticky__content" :class="customClass" :style="[$snakeThemeStyle, contentStyle]">
            <slot />
        </view>
    </view>
</template>
