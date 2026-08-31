<script setup lang="ts">
/**
 * @component SnakeIndexList
 * @description 通过右侧索引快速定位分组内容，与 `IndexAnchor` 配合使用。支持点击、触摸滑动、当前分组同步和吸顶锚点。
 * @see /components/index-list
 */

import { getCurrentInstance, onMounted, provide, ref, toRef, watch } from 'vue';
import { snakeIndexListKey } from '../../libs/internal/index-list';
import type { SnakeIndexListEmits, SnakeIndexListProps, SnakeIndexValue } from './types';

defineOptions({ name: 'SnakeIndexList', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeIndexListProps>(), {
    indexList: () => [],
    scrollTop: 0,
    zIndex: 965,
    sticky: true,
    offsetTop: 0,
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-text-muted, #707184)',
    railStyle: '',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeIndexListEmits>();
const instance = getCurrentInstance();
const activeIndex = ref(0);
const scrollIntoView = ref('');
const innerScrollTop = ref(Number(props.scrollTop) || 0);
const railTop = ref(0);
const railHeight = ref(0);
const anchorOffsets = ref<number[]>([]);
const touching = ref(false);
const anchorId = (value: SnakeIndexValue) => `snake-index-anchor-${String(value).replace(/[^a-zA-Z0-9_-]/g, '-')}`;
function setActive(index: number, selected = false) {
    const safe = Math.max(0, Math.min(props.indexList.length - 1, index));
    if (safe !== activeIndex.value) {
        activeIndex.value = safe;
        emit('change', { index: safe, value: props.indexList[safe] });
    }
    if (selected) emit('select', props.indexList[safe]);
}
function scrollTo(indexOrValue: number | SnakeIndexValue) {
    let index =
        typeof indexOrValue === 'number' &&
        Number.isInteger(indexOrValue) &&
        indexOrValue >= 0 &&
        indexOrValue < props.indexList.length
            ? indexOrValue
            : props.indexList.indexOf(indexOrValue);
    if (index < 0) return;
    setActive(index, true);
    scrollIntoView.value = '';
    setTimeout(() => (scrollIntoView.value = anchorId(props.indexList[index])), 0);
}
function touchSelect(event: any) {
    touching.value = true;
    const y = Number(event.touches?.[0]?.clientY ?? event.changedTouches?.[0]?.clientY);
    if (!Number.isFinite(y) || !railHeight.value) return;
    scrollTo(Math.floor(((y - railTop.value) / railHeight.value) * props.indexList.length));
}
function onScroll(event: any) {
    innerScrollTop.value = Number(event.detail?.scrollTop) || 0;
    const target = innerScrollTop.value + Number.parseFloat(String(props.offsetTop || 0));
    let index = 0;
    anchorOffsets.value.forEach((offset, position) => {
        if (offset <= target + 1) index = position;
    });
    setActive(index);
}
async function update() {
    if (typeof uni === 'undefined') return;
    await new Promise<void>(resolve => {
        const query = uni.createSelectorQuery().in(instance?.proxy as any);
        query.select('.snake-index-list__content').boundingClientRect();
        query.select('.snake-index-list__rail').boundingClientRect();
        query.selectAll('.snake-index-anchor').boundingClientRect();
        query.exec((results: any[]) => {
            const content = results?.[0];
            const rail = results?.[1];
            const anchors = results?.[2] || [];
            if (rail) {
                railTop.value = Number(rail.top) || 0;
                railHeight.value = Number(rail.height) || 0;
            }
            if (content)
                anchorOffsets.value = anchors.map(
                    (item: any) => Number(item.top) - Number(content.top) + innerScrollTop.value
                );
            resolve();
        });
    });
}
watch(
    () => props.scrollTop,
    value => (innerScrollTop.value = Number(value) || 0)
);
provide(snakeIndexListKey, {
    activeIndex,
    sticky: toRef(props, 'sticky'),
    offsetTop: toRef(props, 'offsetTop'),
    zIndex: toRef(props, 'zIndex'),
    anchorId
});
onMounted(() => void update());
defineExpose({ scrollTo, update });
</script>

<template>
    <view class="snake-index-list" :class="customClass" :style="[$snakeThemeStyle, customStyle]">
        <scroll-view
            class="snake-index-list__content"
            scroll-y
            :scroll-top="innerScrollTop"
            :scroll-into-view="scrollIntoView"
            scroll-with-animation
            @scroll="onScroll"
            ><slot
        /></scroll-view>
        <view
            class="snake-index-list__rail"
            :style="[{ zIndex }, railStyle]"
            aria-label="索引导航"
            @touchstart.stop.prevent="touchSelect"
            @touchmove.stop.prevent="touchSelect"
            @touchend="touching = false"
            @touchcancel="touching = false"
        >
            <view
                v-for="(item, index) in indexList"
                :key="`${item}-${index}`"
                class="snake-index-list__key"
                :class="{ 'is-active': activeIndex === index }"
                :style="{ color: activeIndex === index ? activeColor : inactiveColor }"
                @click="scrollTo(index)"
                >{{ item }}</view
            >
        </view>
        <view v-if="indexList.length" class="snake-index-list__bubble" :class="{ 'is-visible': touching }">{{
            indexList[activeIndex]
        }}</view>
    </view>
</template>

<style scoped>
.snake-index-list {
    position: relative;
    height: 100%;
    min-height: 400rpx;
}
.snake-index-list__content {
    box-sizing: border-box;
    height: 100%;
    padding-right: 64rpx;
}
.snake-index-list__rail {
    position: absolute;
    top: 50%;
    right: 10rpx;
    display: flex;
    flex-direction: column;
    padding: 8rpx 0;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.86);
    transform: translateY(-50%);
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
    background: var(--snake-color-primary-light, #e8f8f2);
}
.snake-index-list__bubble {
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
.snake-index-list__bubble.is-visible {
    display: flex;
}
</style>
