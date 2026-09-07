<script setup lang="ts">
/**
 * @component SnakeTabs
 * @description 对齐 uView Pro 的 tabs 标签组件，支持横向滚动、激活项居中、徽标和滑块。
 * @see /components/tabs
 */
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { SnakeTabItem, SnakeTabsEmits, SnakeTabsProps } from './types';

defineOptions({
    name: 'SnakeTabs',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<SnakeTabsProps>(), {
    customStyle: '',
    customClass: '',
    isScroll: true,
    list: () => [],
    current: 0,
    height: 80,
    fontSize: 30,
    duration: 0.5,
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-text, #303133)',
    barWidth: 40,
    barHeight: 6,
    gutter: 30,
    bgColor: '#fff',
    name: 'name',
    count: 'count',
    offset: () => [5, 20],
    isDot: false,
    bold: true,
    activeItemStyle: () => ({}),
    showBar: true,
    barStyle: () => ({}),
    itemWidth: 'auto'
});

const emit = defineEmits<SnakeTabsEmits>();
const instance = getCurrentInstance();
const scrollLeft = ref(0);
const tabQueryInfo = ref<UniApp.NodeInfo[]>([]);
const componentWidth = ref(0);
const scrollBarLeft = ref(0);
const parentLeft = ref(0);
const id = `snake-tabs-${instance?.uid ?? 0}`;
const currentIndex = ref<number | string>(props.current);
const barFirstTimeMove = ref(true);
let initTimer: ReturnType<typeof setTimeout> | undefined;
let firstMoveTimer: ReturnType<typeof setTimeout> | undefined;

const rootStyle = computed(() => [{ background: props.bgColor }, props.customStyle]);
const tabBarStyle = computed(() => [
    {
        width: addUnit(props.barWidth, 'rpx'),
        transform: `translate(${scrollBarLeft.value}px, -100%)`,
        transitionDuration: `${barFirstTimeMove.value ? 0 : props.duration}s`,
        backgroundColor: props.activeColor,
        height: addUnit(props.barHeight, 'rpx'),
        opacity: barFirstTimeMove.value ? 0 : 1,
        borderRadius: `${Number(props.barHeight) / 2}px`
    },
    props.barStyle
]);

function itemValue(item: SnakeTabItem, key: string, fallback: 'name' | 'count') {
    return item[key] || item[fallback];
}

function badgeCount(item: SnakeTabItem) {
    return itemValue(item, props.count, 'count') || 0;
}

function badgeText(item: SnakeTabItem) {
    if (props.isDot) return '';
    const value = badgeCount(item);
    return Number(value) > 99 ? '99+' : value;
}

function tabItemStyle(index: number) {
    const style: Record<string, string> = {
        height: addUnit(props.height, 'rpx'),
        lineHeight: addUnit(props.height, 'rpx'),
        fontSize: addUnit(props.fontSize, 'rpx'),
        transitionDuration: `${props.duration}s`,
        padding: props.isScroll ? `0 ${addUnit(props.gutter, 'rpx')}` : '',
        flex: props.isScroll ? 'auto' : '1',
        width: addUnit(props.itemWidth),
        color: index === Number(currentIndex.value) ? props.activeColor : props.inactiveColor
    };
    if (index === Number(currentIndex.value) && props.bold) style.fontWeight = 'bold';
    return [style, index === Number(currentIndex.value) ? props.activeItemStyle : {}];
}

function getRect(selector: string) {
    return new Promise<UniApp.NodeInfo | null>(resolve => {
        uni.createSelectorQuery()
            .in(instance?.proxy as any)
            .select(selector)
            .boundingClientRect(rect => resolve((rect as UniApp.NodeInfo | null) ?? null))
            .exec();
    });
}

async function init() {
    await nextTick();
    if (typeof uni === 'undefined' || typeof uni.createSelectorQuery !== 'function') return;
    const tabRect = await getRect(`#${id}`);
    if (!tabRect) return;
    parentLeft.value = Number(tabRect.left) || 0;
    componentWidth.value = Number(tabRect.width) || 0;
    getTabRect();
}

function clickTab(index: number) {
    if (index === Number(currentIndex.value)) return;
    emit('change', index);
}

function getTabRect() {
    const query = uni.createSelectorQuery().in(instance?.proxy as any);
    for (let index = 0; index < props.list.length; index += 1) {
        query.select(`#${id}-item-${index}`).fields({ size: true, rect: true }, () => {});
    }
    query.exec(results => {
        tabQueryInfo.value = (results ?? []) as UniApp.NodeInfo[];
        scrollByIndex();
    });
}

function scrollByIndex() {
    const tabInfo = tabQueryInfo.value[Number(currentIndex.value)];
    if (!tabInfo) return;
    const tabWidth = Number(tabInfo.width) || 0;
    const offsetLeft = (Number(tabInfo.left) || 0) - parentLeft.value;
    const nextScrollLeft = offsetLeft - (componentWidth.value - tabWidth) / 2;
    scrollLeft.value = nextScrollLeft < 0 ? 0 : nextScrollLeft;
    const left = (Number(tabInfo.left) || 0) + tabWidth / 2 - parentLeft.value;
    scrollBarLeft.value = left - uni.upx2px(Number(props.barWidth)) / 2;
    if (!barFirstTimeMove.value) return;
    if (firstMoveTimer) clearTimeout(firstMoveTimer);
    firstMoveTimer = setTimeout(() => {
        barFirstTimeMove.value = false;
        firstMoveTimer = undefined;
    }, 100);
}

watch(
    () => props.list,
    (nextList, previousList) => {
        if (nextList.length !== previousList.length) currentIndex.value = 0;
        void nextTick(init);
    }
);

watch(
    () => props.current,
    value => {
        void nextTick(() => {
            currentIndex.value = value;
            scrollByIndex();
        });
    },
    { immediate: true }
);

onMounted(() => {
    void nextTick(() => {
        initTimer = setTimeout(() => {
            initTimer = undefined;
            void init();
        }, 500);
    });
});

onBeforeUnmount(() => {
    if (initTimer) clearTimeout(initTimer);
    if (firstMoveTimer) clearTimeout(firstMoveTimer);
});

defineExpose({ init, clickTab, scrollByIndex });
</script>

<template>
    <view class="snake-tabs" :style="rootStyle" :class="customClass">
        <view>
            <scroll-view
                scroll-x
                class="snake-tabs__scroll-view"
                :scroll-left="scrollLeft"
                :show-scrollbar="false"
                scroll-with-animation
            >
                <view :id="id" class="snake-tabs__scroll-box" :class="{ 'snake-tabs__scroll-flex': !isScroll }">
                    <view
                        v-for="(item, index) in list"
                        :id="`${id}-item-${index}`"
                        :key="index"
                        class="snake-tabs__item snake-line-1"
                        :class="{ 'snake-tabs__item--hidden': item.hidden }"
                        :style="tabItemStyle(index)"
                        @tap="clickTab(index)"
                    >
                        <view
                            v-if="Number(badgeCount(item)) !== 0"
                            class="snake-tabs__badge"
                            :class="{ 'snake-tabs__badge--dot': isDot }"
                            :style="{ top: `${offset[0]}rpx`, right: `${offset[1]}rpx` }"
                        >{{ badgeText(item) }}</view>
                        {{ itemValue(item, name, 'name') }}
                    </view>
                    <view v-if="showBar" class="snake-tabs__bar" :style="tabBarStyle" />
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<style scoped>
.snake-tabs,
.snake-tabs__scroll-view,
.snake-tabs__scroll-box,
.snake-tabs__item { box-sizing: border-box; }
.snake-tabs__scroll-box { position: relative; white-space: nowrap; }
.snake-tabs__scroll-view { position: relative; width: 100%; white-space: nowrap; }
.snake-tabs__item {
    position: relative;
    display: inline-block;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition-property: background-color, color;
}
.snake-tabs__item--hidden { display: none; }
.snake-tabs__bar { position: absolute; bottom: 0; }
.snake-tabs__scroll-flex { display: flex; justify-content: space-between; }
.snake-tabs__badge {
    position: absolute;
    z-index: 9;
    display: inline-flex;
    min-width: 28rpx;
    height: 28rpx;
    align-items: center;
    justify-content: center;
    padding: 0 7rpx;
    border-radius: 100rpx;
    color: #fff;
    background: var(--snake-color-error, #fa3534);
    font-size: 18rpx;
    line-height: 28rpx;
    transform: scale(0.8);
    transform-origin: center;
}
.snake-tabs__badge--dot { width: 16rpx; min-width: 16rpx; height: 16rpx; padding: 0; }
::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    background: transparent;
    -webkit-appearance: none;
}
/* #ifdef H5 */
.snake-tabs__scroll-view :deep(::-webkit-scrollbar) {
    display: none;
    width: 0 !important;
    height: 0 !important;
    background: transparent;
    -webkit-appearance: none;
}
/* #endif */
</style>
