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
                        :class="{
                            'snake-tabs__item--hidden': item.hidden,
                            'snake-tabs__item--disabled': item.disabled
                        }"
                        :style="tabItemStyle(index)"
                        @tap="clickTab(index)"
                    >
                        <view
                            v-if="Number(badgeCount(item)) !== 0"
                            class="snake-tabs__badge"
                            :class="{ 'snake-tabs__badge--dot': isDot }"
                            :style="{ top: $snake.addUnit(offset[0]), right: $snake.addUnit(offset[1]) }"
                        >
                            {{ badgeText(item) }}
                        </view>
                        {{ itemValue(item, name, 'name') }}
                    </view>
                    <view v-if="showBar" class="snake-tabs__bar" :style="tabBarStyle" />
                </view>
            </scroll-view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Tabs
 * @description tabs 标签组件，支持横向滚动、激活项居中、徽标和滑块。
 * @see /components/tabs
 */
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { addUnit, unitToPx } from '../../libs/function/unit';
import type { TabItem, TabsEmits, TabsProps } from './types';

defineOptions({
    name: 'Tabs',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<TabsProps>(), {
    customStyle: '',
    customClass: '',
    isScroll: true,
    list: () => [],
    current: 0,
    height: 40,
    fontSize: 15,
    duration: 0.5,
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-text, #303133)',
    barWidth: 20,
    barHeight: 3,
    gutter: 15,
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

const emit = defineEmits<TabsEmits>();
const instance = getCurrentInstance();
const scrollLeft = ref(0);
const componentWidth = ref(0);
const scrollBarLeft = ref(0);
const id = `snake-tabs-${instance?.uid ?? 0}`;
const currentIndex = ref<number | string>(props.current);
const barFirstTimeMove = ref(true);
let initTimer: ReturnType<typeof setTimeout> | undefined;
let firstMoveTimer: ReturnType<typeof setTimeout> | undefined;

const rootStyle = computed(() => [{ background: props.bgColor }, props.customStyle]);
const tabBarStyle = computed(() => [
    {
        width: addUnit(props.barWidth),
        // 底部固定 3px 间隙（与默认 barHeight 等值，默认视觉不变）：
        // 此前 translateY(-100%) 让抬升量随厚度翻倍，bar 加粗后顶到文字失去间距。
        bottom: '3px',
        transform: `translateX(${scrollBarLeft.value}px)`,
        transitionDuration: `${barFirstTimeMove.value ? 0 : props.duration}s`,
        backgroundColor: props.activeColor,
        height: addUnit(props.barHeight),
        opacity: barFirstTimeMove.value ? 0 : 1,
        borderRadius: `${unitToPx(props.barHeight) / 2}px`
    },
    props.barStyle
]);

function itemValue(item: TabItem, key: string, fallback: 'name' | 'count') {
    return item[key] || item[fallback];
}

function badgeCount(item: TabItem) {
    return itemValue(item, props.count, 'count') || 0;
}

function badgeText(item: TabItem) {
    if (props.isDot) return '';
    const value = badgeCount(item);
    return Number(value) > 99 ? '99+' : value;
}

function tabItemStyle(index: number) {
    const style: Record<string, string> = {
        height: addUnit(props.height),
        lineHeight: addUnit(props.height),
        fontSize: addUnit(props.fontSize),
        transitionDuration: `${props.duration}s`,
        padding: props.isScroll ? `0 ${addUnit(props.gutter)}` : '',
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
    await scrollByIndex();
}

function clickTab(index: number) {
    emit('click', index);
    if (props.list[index]?.disabled) {
        emit('disabled', index);
        return;
    }
    if (index === Number(currentIndex.value)) return;
    emit('change', index);
}

/** 批量查询全部标签宽度：滑块与居中滚动改用“宽度累加”推算内容坐标，与滚动偏移解耦。 */
function queryTabRects(): Promise<(UniApp.NodeInfo | null)[]> {
    return new Promise(resolve => {
        const query = uni.createSelectorQuery().in(instance?.proxy as any);
        for (let index = 0; index < props.list.length; index += 1) {
            query.select(`#${id}-item-${index}`).fields({ size: true }, () => {});
        }
        query.exec(results => resolve((results ?? []) as (UniApp.NodeInfo | null)[]));
    });
}

/**
 * 现场测量并更新滚动与滑块位置：每次切换重新取宽，晚到的字体、语言切换
 * 或同长度换标不会再让滑块停在陈旧位置；返回 false 表示测量未就绪。
 */
async function scrollByIndex(): Promise<boolean> {
    if (typeof uni === 'undefined' || typeof uni.createSelectorQuery !== 'function') return false;
    const [tabRects, wrapRect] = await Promise.all([queryTabRects(), getRect(`#${id}`)]);
    const measuredWidth = Number(wrapRect?.width) || 0;
    if (measuredWidth) componentWidth.value = measuredWidth;
    const index = Number(currentIndex.value);
    const tabInfo = tabRects[index];
    if (!tabInfo || !Number(tabInfo.width)) return false;
    const tabWidth = Number(tabInfo.width) || 0;
    const offsetLeft = tabRects.slice(0, index).reduce((sum, rect) => sum + (Number(rect?.width) || 0), 0);
    const nextScrollLeft = offsetLeft - (componentWidth.value - tabWidth) / 2;
    // scroll-left 设置相同值时 scroll-view 不会再次滚动，加微量扰动让回切标签也能回中
    scrollLeft.value =
        nextScrollLeft < 0
            ? 0
            : nextScrollLeft === scrollLeft.value
              ? nextScrollLeft + Math.random() / 10000
              : nextScrollLeft;
    const left = offsetLeft + tabWidth / 2;
    scrollBarLeft.value = left - unitToPx(props.barWidth) / 2;
    if (barFirstTimeMove.value) {
        if (firstMoveTimer) clearTimeout(firstMoveTimer);
        firstMoveTimer = setTimeout(() => {
            barFirstTimeMove.value = false;
            firstMoveTimer = undefined;
        }, 100);
    }
    return true;
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
            void scrollByIndex();
        });
    },
    { immediate: true }
);

onMounted(() => {
    void nextTick(async () => {
        // 首测失败的常见原因是异步内容或布局未就绪：短间隔重试，
        // 替代旧版固定 500ms 延时——就绪快则快，最多 5 次。
        for (let attempt = 0; attempt < 5; attempt += 1) {
            if (await scrollByIndex()) return;
            await new Promise<void>(resolve => {
                initTimer = setTimeout(resolve, 50);
            });
        }
    });
});

onBeforeUnmount(() => {
    if (initTimer) clearTimeout(initTimer);
    if (firstMoveTimer) clearTimeout(firstMoveTimer);
});

defineExpose({ init, clickTab, scrollByIndex });
</script>

<style scoped>
.snake-tabs,
.snake-tabs__scroll-view,
.snake-tabs__scroll-box,
.snake-tabs__item {
    box-sizing: border-box;
}
.snake-tabs__scroll-box {
    position: relative;
    white-space: nowrap;
}
.snake-tabs__scroll-view {
    position: relative;
    width: 100%;
    white-space: nowrap;
}
.snake-tabs__item {
    position: relative;
    display: inline-block;
    overflow: hidden;
    text-align: center;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition-property: background-color, color;
}
.snake-tabs__item--hidden {
    display: none;
}
.snake-tabs__item--disabled {
    opacity: 0.4;
}
.snake-tabs__bar {
    position: absolute;
    bottom: 0;
}
.snake-tabs__scroll-flex {
    display: flex;
    justify-content: space-between;
}
.snake-tabs__badge {
    position: absolute;
    z-index: 9;
    display: inline-flex;
    min-width: 14px;
    height: 14px;
    align-items: center;
    justify-content: center;
    padding: 0 3.5px;
    border-radius: 50px;
    color: #fff;
    background: var(--snake-color-error, #fa3534);
    font-size: 9px;
    line-height: 14px;
    transform: scale(0.8);
    transform-origin: center;
}
.snake-tabs__badge--dot {
    width: 8px;
    min-width: 8px;
    height: 8px;
    padding: 0;
}
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
