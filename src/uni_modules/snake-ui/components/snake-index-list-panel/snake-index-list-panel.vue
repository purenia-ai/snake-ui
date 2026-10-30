<template>
    <view class="snake-index-list-panel" :class="customClass" :style="customStyle">
        <scroll-view
            class="snake-index-list-panel__content"
            scroll-y
            :scroll-top="innerScrollTop"
            :scroll-into-view="scrollIntoView"
            @scroll="onScroll"
        >
            <slot />
        </scroll-view>
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
            >
                {{ item }}
            </view>
        </view>
        <view v-if="indexList.length" class="snake-index-list-panel__bubble" :class="{ 'is-visible': touching }">
            {{ activeIndex >= 0 ? indexList[activeIndex] : '' }}
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component IndexListPanel
 * @description 用于弹窗和定高区域的索引列表，自身管理内部 scroll-view，不依赖页面滚动位置。
 * @see /components/index-list-panel
 */

import { getCurrentInstance, nextTick, onMounted, provide, ref, toRef, watch, type CSSProperties } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { createAnchorRegistry } from '../snake-index-list/anchor-registry';
import { indexFromTouch, offsetTopPx, resolveIndex, indexListKey } from '../snake-index-list/types';
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
// Keep the command value separate from the position reported by scroll-view.
// Binding the live scroll position back to `scroll-top` makes every scroll event
// trigger another native scroll/layout pass, which is especially noticeable on
// long lists and while dragging the index rail.
const innerScrollTop = ref(Number(props.scrollTop) || 0);
const currentScrollTop = ref(Number(props.scrollTop) || 0);
const railTop = ref(0);
const railHeight = ref(0);
const anchorOffsets = ref<number[]>([]);
// 锚点位置由锚点组件自测回报（微信端父级查询跨不过自定义组件边界）。
const registry = createAnchorRegistry();
const touching = ref(false);
let updating = false;
let scrollIntoViewTimer: ReturnType<typeof setTimeout> | undefined;
const anchorId = (value: IndexValue) => `snake-index-panel-anchor-${String(value).replace(/[^a-zA-Z0-9_-]/g, '-')}`;

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
    const offset = anchorOffsets.value[index];
    if (index < anchorOffsets.value.length && Number.isFinite(offset)) {
        const nextScrollTop = Math.max(0, offset);
        currentScrollTop.value = nextScrollTop;
        innerScrollTop.value = nextScrollTop;
        scrollIntoView.value = '';
        if (scrollIntoViewTimer) clearTimeout(scrollIntoViewTimer);
        return;
    }
    scrollIntoView.value = '';
    if (scrollIntoViewTimer) clearTimeout(scrollIntoViewTimer);
    scrollIntoViewTimer = setTimeout(() => (scrollIntoView.value = anchorId(props.indexList[index])), 0);
}

function touchSelect(event: any) {
    touching.value = true;
    const y = Number(event.touches?.[0]?.clientY ?? event.changedTouches?.[0]?.clientY);
    const index = indexFromTouch(y, railTop.value, railHeight.value, props.indexList.length);
    if (index >= 0) scrollTo(index);
}

function onScroll(event: any) {
    currentScrollTop.value = Number(event.detail?.scrollTop) || 0;
    if (!anchorOffsets.value.length) void update();
    const target = currentScrollTop.value + offsetTopPx(props.offsetTop) + 1;
    let low = 0;
    let high = anchorOffsets.value.length - 1;
    let index = 0;
    while (low <= high) {
        const middle = (low + high) >> 1;
        if (anchorOffsets.value[middle] <= target) {
            index = middle;
            low = middle + 1;
        } else {
            high = middle - 1;
        }
    }
    if (anchorOffsets.value.length) setActive(index);
}

async function update() {
    if (typeof uni === 'undefined' || updating) return;
    updating = true;
    try {
        await nextTick();
        const contentTop = await new Promise<number>(resolve => {
            const query = uni.createSelectorQuery().in(instance?.proxy as any);
            query.select('.snake-index-list-panel__content').boundingClientRect();
            query.select('.snake-index-list-panel__rail').boundingClientRect();
            query.exec((results: any[]) => {
                const content = results?.[0];
                const rail = results?.[1];
                if (rail) {
                    railTop.value = Number(rail.top) || 0;
                    railHeight.value = Number(rail.height) || 0;
                }
                resolve(content ? Number(content.top) || 0 : 0);
            });
        });
        await registry.collect();
        anchorOffsets.value = props.indexList.map(value => {
            const rect = registry.rects.get(value);
            // 未回报的锚点以 Infinity 占位，scrollTo 自动退回 scroll-into-view。
            return rect ? rect.top - contentTop + currentScrollTop.value : Number.POSITIVE_INFINITY;
        });
        activeIndex.value = props.indexList.length ? Math.max(0, activeIndex.value) : -1;
    } finally {
        updating = false;
    }
}

function indexOfAnchor(value: IndexValue) {
    return props.indexList.indexOf(value);
}

function anchorStyle(value: IndexValue): CSSProperties {
    const index = indexOfAnchor(value);
    return {
        color: index === activeIndex.value ? props.activeColor : undefined
    };
}

function wrapperStyle(): CSSProperties {
    if (!props.sticky) return {};
    return {
        position: 'sticky',
        top: addUnit(props.offsetTop, 'rpx'),
        zIndex: props.zIndex
    };
}

provide(indexListKey, {
    activeIndex,
    sticky: toRef(props, 'sticky'),
    offsetTop: toRef(props, 'offsetTop'),
    zIndex: toRef(props, 'zIndex'),
    anchorId,
    anchorStyle,
    wrapperStyle,
    isActive: value => indexOfAnchor(value) === activeIndex.value,
    measureToken: registry.measureToken,
    registerAnchor: registry.registerAnchor,
    unregisterAnchor: registry.unregisterAnchor,
    reportAnchor: registry.reportAnchor
});

watch(
    () => props.scrollTop,
    value => {
        const nextScrollTop = Number(value) || 0;
        currentScrollTop.value = nextScrollTop;
        innerScrollTop.value = nextScrollTop;
    }
);
watch(
    () => props.indexList,
    () => void update(),
    { deep: true }
);
onMounted(() => void update());
defineExpose({ scrollTo, update });
</script>

<style scoped>
.snake-index-list-panel {
    position: relative;
    height: 100%;
    min-height: 400rpx;
}
.snake-index-list-panel__content {
    height: 100%;
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
    background: var(--snake-color-primary-light, #06d2901a);
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
