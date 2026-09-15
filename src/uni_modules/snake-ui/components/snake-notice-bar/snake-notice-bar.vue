<script setup lang="ts">
/**
 * @component NoticeBar
 * @description 用于公告、活动提示和多条消息轮播，支持横向跑马灯、纵向轮播、关闭与更多操作。
 * @see /components/notice-bar
 */

import {
    computed,
    getCurrentInstance,
    nextTick,
    onActivated,
    onBeforeUnmount,
    onDeactivated,
    onMounted,
    ref,
    watch
} from 'vue';
import { onPageHide, onPageShow } from '@dcloudio/uni-app';
import { addUnit } from '../../libs/function/unit';
import Icon from '../snake-icon/snake-icon.vue';
import type { NoticeBarEmits, NoticeBarProps } from './types';

defineOptions({ name: 'NoticeBar', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<NoticeBarProps>(), {
    list: () => [],
    text: '',
    type: 'warning',
    mode: 'horizontal',
    direction: 'row',
    modelValue: undefined,
    show: undefined,
    autoplay: true,
    volumeIcon: false,
    volumeSize: 18,
    moreIcon: false,
    closeIcon: false,
    bgColor: '',
    color: '',
    fontSize: 28,
    duration: 3000,
    speed: 80,
    isCircular: true,
    playState: 'play',
    disableTouch: true,
    borderRadius: 0,
    padding: '18rpx 24rpx',
    noListHidden: true,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<NoticeBarEmits>();
const instance = getCurrentInstance();
const vnodeProps = instance?.vnode.props ?? {};
const showBound = 'show' in vnodeProps;
const modelValueBound = 'modelValue' in vnodeProps;
const current = ref(0);
const lastVerticalIndex = ref(0);
const localShow = ref(true);
const pageActive = ref(true);
const marqueeKey = ref(0);
const marqueeWidth = ref(0);
const contentWidth = ref(0);
const loopDistance = ref(0);
let staticItemTimer: ReturnType<typeof setTimeout> | undefined;
let measurementId = 0;

const items = computed(() =>
    props.list.length ? props.list : Array.isArray(props.text) ? props.text : [props.text].filter(Boolean)
);
const vertical = computed(() => props.mode === 'vertical' || props.direction === 'column');
const externalShow = computed(() => (showBound ? props.show : modelValueBound ? props.modelValue : undefined));
const visible = computed(() => localShow.value && (!props.noListHidden || items.value.length > 0));
const playing = computed(() => visible.value && pageActive.value && props.autoplay && props.playState === 'play');
const currentText = computed(() => items.value[current.value] ?? '');
const marqueeText = computed(() => (props.isCircular ? items.value.join('    ') : currentText.value));
const canScroll = computed(() => marqueeWidth.value > 0 && contentWidth.value > 0);
const speedInPixels = computed(() => {
    const speed = Math.max(1, Number(props.speed) || 1);
    return typeof uni === 'undefined' ? speed / 2 : Math.max(1, uni.upx2px(speed));
});
const marqueeDuration = computed(() => {
    const distance = props.isCircular
        ? loopDistance.value || contentWidth.value
        : marqueeWidth.value + contentWidth.value;
    return `${Math.max(0.5, distance / speedInPixels.value)}s`;
});
const themeColor = computed(
    () => props.color || `var(--snake-color-${props.type}, var(--snake-color-notice, #FF9900))`
);
const themeBg = computed(
    () => props.bgColor || `var(--snake-color-${props.type}-light, var(--snake-color-notice-background, #fff8e6))`
);
const rootStyle = computed(() => [
    {
        color: themeColor.value,
        backgroundColor: themeBg.value,
        fontSize: addUnit(props.fontSize, 'rpx'),
        borderRadius: addUnit(props.borderRadius, 'rpx'),
        padding: props.padding
    },
    props.customStyle
]);
const marqueeStyle = computed(() => ({
    animationDuration: marqueeDuration.value,
    paddingLeft: props.isCircular ? undefined : `${marqueeWidth.value}px`,
    '--snake-notice-loop-distance': `-${loopDistance.value || contentWidth.value}px`
}));

function clearStaticItemTimer() {
    if (staticItemTimer) clearTimeout(staticItemTimer);
    staticItemTimer = undefined;
}
function measure() {
    if (vertical.value || !visible.value || typeof uni === 'undefined') return;
    const id = ++measurementId;
    nextTick(() => {
        const query = uni.createSelectorQuery().in(instance?.proxy as any);
        query.select('.snake-notice-bar__marquee').boundingClientRect();
        query.select('.snake-notice-bar__marquee-primary').boundingClientRect();
        query.select('.snake-notice-bar__marquee-copy').boundingClientRect();
        query.exec(result => {
            if (id !== measurementId) return;
            const wrap = result?.[0] as UniApp.NodeInfo | undefined;
            const content = result?.[1] as UniApp.NodeInfo | undefined;
            const copy = result?.[2] as UniApp.NodeInfo | undefined;
            marqueeWidth.value = Number(wrap?.width) || 0;
            contentWidth.value = Number(content?.width) || 0;
            const measuredLoopDistance = Number(copy?.left) - Number(content?.left);
            loopDistance.value = Number.isFinite(measuredLoopDistance) ? Math.max(0, measuredLoopDistance) : 0;
            scheduleStaticItem();
        });
    });
}
function scheduleStaticItem() {
    clearStaticItemTimer();
    if (vertical.value || props.isCircular || !playing.value || canScroll.value || items.value.length < 2) return;
    staticItemTimer = setTimeout(nextHorizontalItem, Math.max(0, Number(props.duration) || 0));
}
function reset() {
    clearStaticItemTimer();
    current.value = 0;
    lastVerticalIndex.value = 0;
    marqueeKey.value += 1;
    measure();
    scheduleStaticItem();
}
function nextHorizontalItem() {
    if (current.value >= items.value.length - 1) {
        emit('end');
        return;
    }
    current.value += 1;
    marqueeKey.value += 1;
    measure();
    scheduleStaticItem();
}
function change(event: any) {
    current.value = Number(event.detail?.current) || 0;
    emit('change', current.value);
    if (lastVerticalIndex.value === items.value.length - 1 && current.value === 0 && items.value.length > 1)
        emit('end');
    lastVerticalIndex.value = current.value;
}
function close(event: any) {
    event?.stopPropagation?.();
    localShow.value = false;
    emit('update:show', false);
    emit('update:modelValue', false);
    emit('close');
}
function more(event: any) {
    event?.stopPropagation?.();
    emit('getMore');
}
function marqueeEnd() {
    if (!props.isCircular) nextHorizontalItem();
}

watch(
    externalShow,
    value => {
        if (value !== undefined) localShow.value = value;
        reset();
    },
    { immediate: true }
);
watch([items, vertical, () => props.isCircular, () => props.speed, () => props.duration], reset, { deep: true });
watch(playing, value => {
    if (value) {
        marqueeKey.value += 1;
        measure();
        scheduleStaticItem();
    } else clearStaticItemTimer();
});
onMounted(measure);
onActivated(() => {
    pageActive.value = true;
    reset();
});
onDeactivated(() => {
    pageActive.value = false;
    clearStaticItemTimer();
});
onPageShow(() => {
    pageActive.value = true;
    reset();
});
onPageHide(() => {
    pageActive.value = false;
    clearStaticItemTimer();
});
onBeforeUnmount(() => {
    measurementId += 1;
    clearStaticItemTimer();
});
defineExpose({ reset });
</script>

<template>
    <view
        v-if="visible"
        class="snake-notice-bar"
        :class="customClass"
        :style="rootStyle"
        @click="emit('click', current)"
    >
        <snake-icon v-if="volumeIcon" class="snake-notice-bar__leading" name="volume" :size="volumeSize ?? 'inherit'" />
        <swiper
            v-if="vertical"
            class="snake-notice-bar__swiper"
            vertical
            circular
            :autoplay="playing"
            :interval="duration"
            :duration="300"
            :disable-touch="disableTouch"
            @change="change"
        >
            <swiper-item v-for="(item, index) in items" :key="`${item}-${index}`" class="snake-notice-bar__item">
                <text class="snake-notice-bar__text">{{ item }}</text>
            </swiper-item>
        </swiper>
        <view v-else class="snake-notice-bar__marquee">
            <view
                :key="marqueeKey"
                class="snake-notice-bar__marquee-track"
                :class="{ 'is-playing': playing && canScroll, 'is-circular': isCircular }"
                :style="marqueeStyle"
                @animationend="marqueeEnd"
            >
                <view class="snake-notice-bar__marquee-primary">{{ marqueeText }}</view>
                <view v-if="isCircular" class="snake-notice-bar__marquee-copy"
                    >&nbsp;&nbsp;&nbsp;&nbsp;{{ marqueeText }}</view
                >
            </view>
        </view>
        <snake-icon v-if="moreIcon" class="snake-notice-bar__trailing" name="right" @click="more" />
        <snake-icon v-if="closeIcon" class="snake-notice-bar__trailing" name="close" @click="close" />
    </view>
</template>

<style scoped>
.snake-notice-bar {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    overflow: hidden;
    line-height: 1.5;
}
.snake-notice-bar__leading {
    flex: none;
    margin-right: 12rpx;
}
.snake-notice-bar__trailing {
    flex: none;
    margin-left: 12rpx;
}
.snake-notice-bar__swiper {
    flex: 1;
    height: 42rpx;
}
.snake-notice-bar__item {
    display: flex;
    align-items: center;
}
.snake-notice-bar__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.snake-notice-bar__marquee {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
}
.snake-notice-bar__marquee-track {
    display: inline-flex;
    width: max-content;
    white-space: nowrap;
}
.snake-notice-bar__marquee-primary,
.snake-notice-bar__marquee-copy {
    flex: none;
}
.snake-notice-bar__marquee-track.is-playing.is-circular {
    animation: snake-notice-marquee-loop linear infinite;
}
.snake-notice-bar__marquee-track.is-playing:not(.is-circular) {
    animation: snake-notice-marquee-once linear both;
}
@keyframes snake-notice-marquee-loop {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(var(--snake-notice-loop-distance));
    }
}
@keyframes snake-notice-marquee-once {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-100%);
    }
}
</style>
