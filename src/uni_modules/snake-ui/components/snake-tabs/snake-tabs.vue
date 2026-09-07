<script setup lang="ts">
/**
 * @component SnakeTabs
 * @description 用于分类导航和状态筛选。标签较多时，激活项会自动滚动到容器中间；同时支持隐藏或禁用标签、数量或圆点徽标及自定义指示线。
 * @see /components/tabs
 */

import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { SnakeTabItem, SnakeTabsEmits, SnakeTabsProps } from './types';

defineOptions({ name: 'SnakeTabs', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeTabsProps>(), {
    list: () => [],
    current: 0,
    name: 'name',
    count: 'count',
    scrollable: true,
    height: 80,
    fontSize: 30,
    duration: 0.3,
    lineColor: 'var(--snake-color-primary, #06D290)',
    activeColor: 'var(--snake-color-text, #303133)',
    inactiveColor: 'var(--snake-color-text-secondary, #606266)',
    barWidth: 40,
    barHeight: 6,
    gutter: 30,
    bgColor: 'transparent',
    offset: () => [5, 20],
    isDot: false,
    bold: true,
    activeItemStyle: '',
    showBar: true,
    barStyle: '',
    itemWidth: 'auto',
    customClass: '',
    customStyle: ''
});

const emit = defineEmits<SnakeTabsEmits>();
const instance = getCurrentInstance();
const itemIdPrefix = `snake-tabs-${instance?.uid ?? 0}-item`;
const scrollLeft = ref(0);
const indicatorLeft = ref(0);
const indicatorReady = ref(false);
const firstLayout = ref(true);

let layoutVersion = 0;
let layoutTimer: ReturnType<typeof setTimeout> | undefined;
let animationTimer: ReturnType<typeof setTimeout> | undefined;

const active = computed(() => {
    if (!props.list.length) return -1;
    const value = Number(props.current);
    const index = Number.isFinite(value) ? Math.trunc(value) : 0;
    return Math.max(0, Math.min(props.list.length - 1, index));
});
const canScroll = computed(() => props.isScroll ?? props.scrollable);
const durationSeconds = computed(() => {
    const value = Number(props.duration);
    return Number.isFinite(value) && value >= 0 ? value : 0.3;
});
const rootStyle = computed(() => [
    {
        height: addUnit(props.height, 'rpx'),
        backgroundColor: props.bgColor
    },
    props.customStyle
]);
const indicatorStyle = computed(() => [
    {
        left: `${indicatorLeft.value}px`,
        width: addUnit(props.barWidth, 'rpx'),
        height: addUnit(props.barHeight, 'rpx'),
        backgroundColor: props.lineColor,
        borderRadius: '999rpx',
        opacity: indicatorReady.value ? 1 : 0,
        transitionDuration: `${firstLayout.value ? 0 : durationSeconds.value}s`
    },
    props.barStyle
]);

function isObjectItem(item: SnakeTabItem): item is Exclude<SnakeTabItem, string> {
    return typeof item !== 'string';
}

function label(item: SnakeTabItem) {
    if (!isObjectItem(item)) return item;
    return String(item[props.name] ?? item.name ?? '');
}

function badge(item: SnakeTabItem) {
    if (!isObjectItem(item)) return '';
    return item[props.count] ?? item.count ?? '';
}

function showBadge(item: SnakeTabItem) {
    const value = badge(item);
    return value !== '' && value !== null && value !== undefined;
}

function isHidden(item: SnakeTabItem) {
    return isObjectItem(item) && Boolean(item.hidden);
}

function isDisabled(item: SnakeTabItem) {
    return isObjectItem(item) && Boolean(item.disabled);
}

function itemStyle(index: number) {
    const selected = index === active.value;
    const style = {
        color: selected ? props.activeColor : props.inactiveColor,
        fontSize: addUnit(props.fontSize, 'rpx'),
        fontWeight: selected && props.bold ? '600' : '400',
        transitionDuration: `${durationSeconds.value}s`,
        flex: canScroll.value ? 'none' : '1',
        width: props.itemWidth === 'auto' ? undefined : addUnit(props.itemWidth, 'rpx'),
        paddingLeft: canScroll.value ? addUnit(props.gutter, 'rpx') : undefined,
        paddingRight: canScroll.value ? addUnit(props.gutter, 'rpx') : undefined,
        opacity: isDisabled(props.list[index]) ? 0.45 : 1
    };
    return [style, selected ? props.activeItemStyle : ''];
}

function badgeStyle() {
    return {
        top: addUnit(props.offset[0], 'rpx'),
        right: addUnit(props.offset[1], 'rpx')
    };
}

function itemId(index: number) {
    return `${itemIdPrefix}-${index}`;
}

function hideIndicator() {
    if (animationTimer) clearTimeout(animationTimer);
    animationTimer = undefined;
    indicatorReady.value = false;
    firstLayout.value = true;
}

function finishFirstLayout() {
    if (!firstLayout.value) return;
    if (animationTimer) clearTimeout(animationTimer);
    animationTimer = setTimeout(() => {
        firstLayout.value = false;
        animationTimer = undefined;
    }, 16);
}

/**
 * 在视图更新后批量测量容器、轨道和标签位置。
 * layoutVersion 保证快速连续刷新时，较早返回的节点查询不会覆盖最新布局。
 */
async function init() {
    const version = ++layoutVersion;
    await nextTick();

    if (typeof uni === 'undefined' || typeof uni.createSelectorQuery !== 'function') return;

    await new Promise<void>(resolve => {
        const query = uni.createSelectorQuery().in(instance?.proxy as any);
        query.select('.snake-tabs__viewport').boundingClientRect();
        query.select('.snake-tabs__track').boundingClientRect();
        for (let index = 0; index < props.list.length; index += 1) {
            query.select(`#${itemId(index)}`).boundingClientRect();
        }
        query.exec((results: any[]) => {
            if (version !== layoutVersion) {
                resolve();
                return;
            }

            const viewport = results?.[0];
            const track = results?.[1];
            const itemRect = active.value >= 0 ? results?.[active.value + 2] : null;
            const activeItem = active.value >= 0 ? props.list[active.value] : undefined;

            if (!viewport || !track || !itemRect || !activeItem || isHidden(activeItem)) {
                scrollLeft.value = 0;
                hideIndicator();
                resolve();
                return;
            }

            const viewportWidth = Number(viewport.width) || 0;
            const contentCenter =
                (Number(itemRect.left) || 0) - (Number(track.left) || 0) + (Number(itemRect.width) || 0) / 2;

            indicatorLeft.value = contentCenter;
            scrollLeft.value = canScroll.value ? Math.max(0, contentCenter - viewportWidth / 2) : 0;
            indicatorReady.value = true;
            finishFirstLayout();
            resolve();
        });
    });
}

async function scrollByIndex() {
    await init();
}

/** 合并同一轮中的多次列表或尺寸变化，避免重复执行节点测量。 */
function scheduleInit() {
    if (layoutTimer) clearTimeout(layoutTimer);
    layoutTimer = setTimeout(() => {
        layoutTimer = undefined;
        void init();
    }, 0);
}

function select(item: SnakeTabItem, index: number) {
    emit('click', { index, item });
    if (isHidden(item) || isDisabled(item) || index === active.value) return;
    emit('change', index);
}

function selectAdjacent(index: number, direction: -1 | 1) {
    for (let offset = 1; offset <= props.list.length; offset += 1) {
        const target = (index + direction * offset + props.list.length) % props.list.length;
        const item = props.list[target];
        if (item && !isHidden(item) && !isDisabled(item)) {
            select(item, target);
            return;
        }
    }
}

watch(
    () => [
        props.list,
        props.current,
        props.name,
        props.fontSize,
        props.gutter,
        props.itemWidth,
        props.isScroll,
        props.scrollable
    ],
    scheduleInit,
    { deep: true }
);

onMounted(scheduleInit);

onBeforeUnmount(() => {
    layoutVersion += 1;
    if (layoutTimer) clearTimeout(layoutTimer);
    if (animationTimer) clearTimeout(animationTimer);
});

defineExpose({ init, scrollByIndex });
</script>

<template>
    <view class="snake-tabs" :class="customClass" :style="rootStyle">
        <scroll-view
            class="snake-tabs__viewport"
            :scroll-x="canScroll"
            :scroll-left="scrollLeft"
            scroll-with-animation
            :show-scrollbar="false"
        >
            <view class="snake-tabs__track" :class="{ 'is-scrollable': canScroll }" role="tablist">
                <view
                    v-for="(item, index) in list"
                    :id="itemId(index)"
                    :key="index"
                    class="snake-tabs__item"
                    :class="{ 'is-active': index === active, 'is-hidden': isHidden(item), 'is-disabled': isDisabled(item) }"
                    :style="itemStyle(index)"
                    role="tab"
                    :aria-selected="index === active"
                    :aria-disabled="isDisabled(item)"
                    :tabindex="isHidden(item) || isDisabled(item) ? -1 : index === active ? 0 : -1"
                    @click="select(item, index)"
                    @keydown.left.prevent="selectAdjacent(index, -1)"
                    @keydown.right.prevent="selectAdjacent(index, 1)"
                >
                    <view class="snake-tabs__label">
                        <text>{{ label(item) }}</text>
                        <text
                            v-if="showBadge(item)"
                            class="snake-tabs__badge"
                            :class="{ 'is-dot': isDot }"
                            :style="badgeStyle()"
                        >
                            {{ isDot ? '' : badge(item) }}
                        </text>
                    </view>
                </view>
                <view v-if="showBar" class="snake-tabs__line" :style="indicatorStyle" />
            </view>
        </scroll-view>
    </view>
</template>

<style scoped>
.snake-tabs,
.snake-tabs__viewport {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}

.snake-tabs__viewport {
    position: relative;
    white-space: nowrap;
}

.snake-tabs__track {
    position: relative;
    display: flex;
    min-width: 100%;
    height: 100%;
}

.snake-tabs__track.is-scrollable {
    display: inline-flex;
}

.snake-tabs__item {
    position: relative;
    box-sizing: border-box;
    display: flex;
    min-width: 0;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition-property: color;
}

.snake-tabs__item.is-hidden {
    display: none;
}

.snake-tabs__item.is-disabled {
    cursor: not-allowed;
}

.snake-tabs__label {
    position: relative;
    display: inline-flex;
    height: 100%;
    align-items: center;
}

.snake-tabs__badge {
    position: absolute;
    z-index: 1;
    min-width: 28rpx;
    height: 28rpx;
    padding: 0 7rpx;
    border-radius: 14rpx;
    color: #fff;
    background: var(--snake-color-error, #FA3534);
    font-size: 18rpx;
    line-height: 28rpx;
    text-align: center;
}

.snake-tabs__badge.is-dot {
    width: 12rpx;
    min-width: 12rpx;
    height: 12rpx;
    padding: 0;
}

.snake-tabs__line {
    position: absolute;
    bottom: 0;
    box-sizing: border-box;
    transform: translateX(-50%);
    transition-property: left, width, height, background-color, opacity;
    transition-timing-function: ease;
}

/* #ifdef H5 */
.snake-tabs__viewport :deep(::-webkit-scrollbar) {
    display: none;
    width: 0 !important;
    height: 0 !important;
    background: transparent;
    -webkit-appearance: none;
}
/* #endif */

@media (prefers-reduced-motion: reduce) {
    .snake-tabs__item,
    .snake-tabs__line {
        transition-duration: 0s !important;
    }
}
</style>
