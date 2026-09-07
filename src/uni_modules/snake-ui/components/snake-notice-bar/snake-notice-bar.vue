<script setup lang="ts">
/**
 * @component SnakeNoticeBar
 * @description 用于公告、活动提示和多条消息轮播，支持横向跑马灯、纵向轮播、关闭与更多操作。
 * @see /components/notice-bar
 */

import { computed, ref } from 'vue';
import { addUnit } from '../../libs/function/unit';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import type { SnakeNoticeBarEmits, SnakeNoticeBarProps } from './types';

defineOptions({ name: 'SnakeNoticeBar', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeNoticeBarProps>(), {
    list: () => [],
    text: '',
    type: 'warning',
    mode: 'horizontal',
    direction: 'row',
    show: true,
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
const emit = defineEmits<SnakeNoticeBarEmits>();
const current = ref(0);
const items = computed(() =>
    props.list.length ? props.list : Array.isArray(props.text) ? props.text : [props.text].filter(Boolean)
);
const vertical = computed(() => props.mode === 'vertical' || props.direction === 'column');
const visible = computed(() => props.show && (!props.noListHidden || items.value.length > 0));
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
const marqueeDuration = computed(
    () => `${Math.max(3, (items.value.join(' · ').length * 28) / Math.max(1, props.speed))}s`
);
function change(event: any) {
    current.value = Number(event.detail?.current) || 0;
    emit('change', current.value);
}
function close(event: any) {
    event?.stopPropagation?.();
    emit('close');
}
function more(event: any) {
    event?.stopPropagation?.();
    emit('getMore');
}
</script>

<template>
    <view
        v-if="visible"
        class="snake-notice-bar"
        :class="customClass"
        :style="rootStyle"
        @click="emit('click', current)"
    >
        <snake-icon v-if="volumeIcon" class="snake-notice-bar__leading" name="info" :size="volumeSize ?? 'inherit'" />
        <swiper
            v-if="vertical"
            class="snake-notice-bar__swiper"
            vertical
            circular
            :autoplay="autoplay && playState === 'play'"
            :interval="duration"
            :duration="300"
            :disable-touch="disableTouch"
            @change="change"
        >
            <swiper-item v-for="(item, index) in items" :key="`${item}-${index}`" class="snake-notice-bar__item"
                ><text class="snake-notice-bar__text">{{ item }}</text></swiper-item
            >
        </swiper>
        <view v-else class="snake-notice-bar__marquee"
            ><view
                class="snake-notice-bar__marquee-track"
                :class="{ 'is-playing': autoplay && playState === 'play' }"
                :style="{ animationDuration: marqueeDuration }"
                ><text>{{ items.join('    ') }}</text
                ><text v-if="isCircular">&nbsp;&nbsp;&nbsp;&nbsp;{{ items.join('    ') }}</text></view
            ></view
        >
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
.snake-notice-bar__marquee-track.is-playing {
    animation: snake-notice-marquee linear infinite;
}
@keyframes snake-notice-marquee {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
}
</style>
