<template>
    <view class="snake-index-list" :class="customClass" :style="customStyle">
        <slot />
        <view
            v-if="indexList.length"
            class="snake-index-list__rail"
            :style="[{ zIndex: props.zIndex }, railStyle]"
            aria-label="索引导航"
            @touchstart.stop.prevent="touchSelect"
            @touchmove.stop.prevent="touchSelect"
            @touchend.stop.prevent="touching = false"
            @touchcancel.stop.prevent="touching = false"
        >
            <view
                v-for="(item, index) in indexList"
                :key="`${item}-${index}`"
                class="snake-index-list__key"
                :class="{ 'is-active': activeIndex === index }"
                :style="{ color: activeIndex === index ? activeColor : inactiveColor }"
                @click="scrollTo(index)"
            >
                {{ item }}
            </view>
        </view>
        <view
            v-if="indexList.length"
            class="snake-index-list__bubble"
            :class="{ 'is-visible': touching }"
            :style="{ zIndex: props.zIndex + 1 }"
        >
            {{ activeIndex >= 0 ? indexList[activeIndex] : '' }}
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component IndexList
 * @description 跟随页面滚动的索引列表，通过右侧索引快速定位分组内容，并与 IndexAnchor 配合实现吸顶。
 * @see /components/index-list
 */

import { computed, getCurrentInstance, nextTick, onMounted, provide, ref, toRef, watch, type CSSProperties } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { indexFromTouch, offsetTopPx, resolveIndex, indexListKey } from './types';
import type { IndexListEmits, IndexListProps, IndexValue } from './types';

defineOptions({ name: 'IndexList', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<IndexListProps>(), {
    indexList: () => [],
    scrollTop: 0,
    zIndex: zIndex.indexListSticky,
    sticky: true,
    offsetTop: 0,
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-text-muted, #909399)',
    railStyle: '',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<IndexListEmits>();
const instance = getCurrentInstance();
const activeIndex = ref(-1);
const touching = ref(false);
const railTop = ref(0);
const railHeight = ref(0);
const listLeft = ref(0);
const listWidth = ref(0);
const anchorTops = ref<number[]>([]);
const anchorHeights = ref<number[]>([]);
const currentScrollTop = computed(() => Number(props.scrollTop) || 0);
const currentOffsetTop = computed(() => offsetTopPx(props.offsetTop));
const anchorId = (value: IndexValue) => `snake-index-anchor-${String(value).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

function setActive(index: number, selected = false) {
    if (!props.indexList.length || index < 0 || index >= props.indexList.length) return;
    if (index !== activeIndex.value) {
        activeIndex.value = index;
        emit('change', { index, value: props.indexList[index] });
    }
    if (selected) emit('select', props.indexList[index]);
}

function updateActive() {
    if (!anchorTops.value.length) {
        activeIndex.value = -1;
        return;
    }
    const target = currentScrollTop.value + currentOffsetTop.value;
    let index = -1;
    anchorTops.value.forEach((top, position) => {
        if (top <= target + 1) index = position;
    });
    if (index >= 0) setActive(index);
    else activeIndex.value = -1;
}

function scrollTo(indexOrValue: number | IndexValue) {
    const index = resolveIndex(indexOrValue, props.indexList);
    if (index < 0 || index >= anchorTops.value.length) return;
    setActive(index, true);
    uni.pageScrollTo({ duration: 0, scrollTop: Math.max(0, anchorTops.value[index] - currentOffsetTop.value) });
}

function touchSelect(event: any) {
    touching.value = true;
    const y = Number(event.touches?.[0]?.clientY ?? event.changedTouches?.[0]?.clientY);
    const index = indexFromTouch(y, railTop.value, railHeight.value, props.indexList.length);
    if (index >= 0) scrollTo(index);
}

async function update() {
    if (typeof uni === 'undefined') return;
    await nextTick();
    await new Promise<void>(resolve => {
        const query = uni.createSelectorQuery().in(instance?.proxy as any);
        query.select('.snake-index-list').boundingClientRect();
        query.select('.snake-index-list__rail').boundingClientRect();
        query.selectAll('.snake-index-anchor__wrapper').boundingClientRect();
        query.exec((results: any[]) => {
            const list = results?.[0];
            const rail = results?.[1];
            const anchors = results?.[2] || [];
            if (list) {
                listLeft.value = Number(list.left) || 0;
                listWidth.value = Number(list.width) || 0;
            }
            if (rail) {
                railTop.value = Number(rail.top) || 0;
                railHeight.value = Number(rail.height) || 0;
            }
            anchorTops.value = anchors.map((item: any) => Number(item.top) + currentScrollTop.value);
            anchorHeights.value = anchors.map((item: any) => Number(item.height) || 0);
            updateActive();
            resolve();
        });
    });
}

function indexOfAnchor(value: IndexValue) {
    return props.indexList.indexOf(value);
}

function anchorStyle(value: IndexValue): CSSProperties {
    const index = indexOfAnchor(value);
    if (!props.sticky || index < 0 || index !== activeIndex.value) return {};
    const height = anchorHeights.value[index] || 0;
    const nextTop = anchorTops.value[index + 1];
    const nextViewportTop = nextTop === undefined ? Number.POSITIVE_INFINITY : nextTop - currentScrollTop.value;
    const translateY = Math.min(0, nextViewportTop - currentOffsetTop.value - height);
    return {
        position: 'fixed',
        top: `${currentOffsetTop.value}px`,
        left: `${listLeft.value}px`,
        width: `${listWidth.value}px`,
        zIndex: props.zIndex,
        color: props.activeColor,
        transform: `translate3d(0, ${translateY}px, 0)`
    };
}

function wrapperStyle(value: IndexValue): CSSProperties {
    const index = indexOfAnchor(value);
    return props.sticky && index === activeIndex.value ? { height: `${anchorHeights.value[index] || 0}px` } : {};
}

provide(indexListKey, {
    activeIndex,
    sticky: toRef(props, 'sticky'),
    offsetTop: toRef(props, 'offsetTop'),
    zIndex: toRef(props, 'zIndex'),
    anchorId,
    anchorStyle,
    wrapperStyle,
    isActive: value => indexOfAnchor(value) === activeIndex.value
});

watch(() => props.scrollTop, updateActive);
watch(() => props.offsetTop, updateActive);
watch(
    () => props.indexList,
    () => void update(),
    { deep: true }
);
onMounted(() => void update());
defineExpose({ scrollTo, update });
</script>

<style scoped>
.snake-index-list {
    position: relative;
    box-sizing: border-box;
    padding-right: 64rpx;
}
.snake-index-list__rail {
    position: fixed;
    top: 50%;
    right: 10rpx;
    display: flex;
    flex-direction: column;
    padding: 8rpx 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.86);
    transform: translateY(-50%);
    user-select: none;
}
.snake-index-list__key {
    display: flex;
    min-width: 44rpx;
    min-height: 34rpx;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 20rpx;
    line-height: 34rpx;
}
.snake-index-list__key.is-active {
    font-weight: 700;
    background: var(--snake-color-primary-light, rgba(6, 210, 144, 0.1));
}
.snake-index-list__bubble {
    position: fixed;
    top: 50%;
    right: 90rpx;
    display: none;
    width: 96rpx;
    height: 96rpx;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx;
    color: #fff;
    font-size: 42rpx;
    background: rgba(0, 0, 0, 0.58);
    transform: translateY(-50%);
}
.snake-index-list__bubble.is-visible {
    display: flex;
}
</style>
