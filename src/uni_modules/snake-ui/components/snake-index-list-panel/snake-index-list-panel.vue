<script setup lang="ts">
/**
 * @component IndexListPanel
 * @description 用于弹窗和定高区域的索引列表，自身管理内部 scroll-view，不依赖页面滚动位置。
 * @see /components/index-list-panel
 */

import {
    getCurrentInstance,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    toRef,
    watch,
    type CSSProperties
} from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { indexFromTouch, offsetTopPx, resolveIndex, indexListKey } from '../../libs/internal/index-list';
import type { IndexValue } from '../snake-index-list/types';
import type { IndexListPanelEmits, IndexListPanelProps } from './types';

defineOptions({ name: 'IndexListPanel', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<IndexListPanelProps>(), {
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
const emit = defineEmits<IndexListPanelEmits>();
const instance = getCurrentInstance();
const activeIndex = ref(props.indexList.length ? 0 : -1);
const scrollIntoView = ref('');
const innerScrollTop = ref(Number(props.scrollTop) || 0);
const railTop = ref(0);
const railHeight = ref(0);
const anchorOffsets = ref<number[]>([]);
const touching = ref(false);
let measureTimer: ReturnType<typeof setTimeout> | undefined;
const anchorId = (value: IndexValue) =>
    `snake-index-panel-anchor-${String(value).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

function setActive(index: number, selected = false) {
    if (!props.indexList.length || index < 0 || index >= props.indexList.length) return;
    if (index !== activeIndex.value) {
        activeIndex.value = index;
        emit('change', { index, value: props.indexList[index] });
    }
    if (selected) emit('select', props.indexList[index]);
}

function scrollTo(indexOrValue: number | IndexValue) {
    const index = resolveIndex(indexOrValue, props.indexList);
    if (index < 0) return;
    setActive(index, true);
    if (index < anchorOffsets.value.length) {
        innerScrollTop.value = anchorOffsets.value[index];
        scrollIntoView.value = '';
        return;
    }
    scrollIntoView.value = '';
    setTimeout(() => (scrollIntoView.value = anchorId(props.indexList[index])), 0);
}

function touchSelect(event: any) {
    touching.value = true;
    const y = Number(event.touches?.[0]?.clientY ?? event.changedTouches?.[0]?.clientY);
    const index = indexFromTouch(y, railTop.value, railHeight.value, props.indexList.length);
    if (index >= 0) scrollTo(index);
}

function onScroll(event: any) {
    innerScrollTop.value = Number(event.detail?.scrollTop) || 0;
    if (!anchorOffsets.value.length) void update();
    if (measureTimer) clearTimeout(measureTimer);
    measureTimer = setTimeout(() => {
        measureTimer = undefined;
        void update();
    }, 300);
    const target = innerScrollTop.value + offsetTopPx(props.offsetTop);
    let index = 0;
    anchorOffsets.value.forEach((offset, position) => {
        if (offset <= target + 1) index = position;
    });
    setActive(index);
}

async function update() {
    if (typeof uni === 'undefined') return;
    await nextTick();
    await new Promise<void>(resolve => {
        const query = uni.createSelectorQuery().in(instance?.proxy as any);
        query.select('.snake-index-list-panel__content').boundingClientRect();
        query.select('.snake-index-list-panel__rail').boundingClientRect();
        query.selectAll('.snake-index-anchor__wrapper').boundingClientRect();
        query.exec((results: any[]) => {
            const content = results?.[0];
            const rail = results?.[1];
            const anchors = results?.[2] || [];
            if (rail) {
                railTop.value = Number(rail.top) || 0;
                railHeight.value = Number(rail.height) || 0;
            }
            if (content) {
                anchorOffsets.value = anchors.map(
                    (item: any) => Number(item.top) - Number(content.top) + innerScrollTop.value
                );
            }
            activeIndex.value = props.indexList.length ? Math.max(0, activeIndex.value) : -1;
            resolve();
        });
    });
}

function indexOfAnchor(value: IndexValue) {
    return props.indexList.indexOf(value);
}

function anchorStyle(value: IndexValue): CSSProperties {
    const index = indexOfAnchor(value);
    return {
        position: props.sticky ? 'sticky' : 'relative',
        top: props.sticky ? addUnit(props.offsetTop, 'rpx') : 'auto',
        zIndex: props.zIndex,
        color: index === activeIndex.value ? props.activeColor : undefined
    };
}

provide(indexListKey, {
    activeIndex,
    sticky: toRef(props, 'sticky'),
    offsetTop: toRef(props, 'offsetTop'),
    zIndex: toRef(props, 'zIndex'),
    anchorId,
    anchorStyle,
    wrapperStyle: () => ({}),
    isActive: value => indexOfAnchor(value) === activeIndex.value
});

watch(
    () => props.scrollTop,
    value => (innerScrollTop.value = Number(value) || 0)
);
watch(
    () => props.indexList,
    () => void update(),
    { deep: true }
);
onMounted(() => void update());
onBeforeUnmount(() => {
    if (measureTimer) clearTimeout(measureTimer);
});
defineExpose({ scrollTo, update });
</script>

<template>
    <view class="snake-index-list-panel" :class="customClass" :style="customStyle">
        <scroll-view
            class="snake-index-list-panel__content"
            scroll-y
            :scroll-top="innerScrollTop"
            :scroll-into-view="scrollIntoView"
            scroll-with-animation
            @scroll="onScroll"
            ><slot
        /></scroll-view>
        <view
            v-if="indexList.length"
            class="snake-index-list-panel__rail"
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
                class="snake-index-list-panel__key"
                :class="{ 'is-active': activeIndex === index }"
                :style="{ color: activeIndex === index ? activeColor : inactiveColor }"
                @click="scrollTo(index)"
                >{{ item }}</view
            >
        </view>
        <view v-if="indexList.length" class="snake-index-list-panel__bubble" :class="{ 'is-visible': touching }">{{
            activeIndex >= 0 ? indexList[activeIndex] : ''
        }}</view>
    </view>
</template>

<style scoped>
.snake-index-list-panel {
    position: relative;
    height: 100%;
    min-height: 400rpx;
}
.snake-index-list-panel__content {
    box-sizing: border-box;
    height: 100%;
    padding-right: 64rpx;
}
.snake-index-list-panel__rail {
    position: absolute;
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
.snake-index-list-panel__key {
    display: flex;
    min-width: 44rpx;
    min-height: 34rpx;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 20rpx;
    line-height: 34rpx;
}
.snake-index-list-panel__key.is-active {
    font-weight: 700;
    background: var(--snake-color-primary-light, rgba(6, 210, 144, 0.1));
}
.snake-index-list-panel__bubble {
    position: absolute;
    top: 50%;
    left: 50%;
    display: none;
    width: 96rpx;
    height: 96rpx;
    align-items: center;
    justify-content: center;
    border-radius: 16rpx;
    color: #fff;
    font-size: 42rpx;
    background: rgba(0, 0, 0, 0.58);
    transform: translate(-50%, -50%);
}
.snake-index-list-panel__bubble.is-visible {
    display: flex;
}
</style>
