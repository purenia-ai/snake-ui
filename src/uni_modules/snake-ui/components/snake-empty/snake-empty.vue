<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { snakeTranslate } from '../../locale';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import type { SnakeEmptyProps } from './types';

defineOptions({ name: 'SnakeEmpty', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeEmptyProps>(), {
    show: true,
    mode: 'data',
    src: '',
    icon: '',
    iconColor: 'var(--snake-color-text-light, #c0c4cc)',
    iconSize: 120,
    text: '',
    color: '',
    textColor: 'var(--snake-color-text-muted, #707184)',
    fontSize: 26,
    marginTop: 0,
    customClass: '',
    customStyle: ''
});
const modeTexts: Record<string, string> = {
    data: '暂无数据',
    list: '暂无内容',
    search: '未找到相关内容',
    page: '页面不存在',
    order: '暂无订单',
    coupon: '暂无优惠券',
    favor: '暂无收藏',
    permission: '暂无权限',
    history: '暂无历史记录',
    message: '暂无消息',
    wifi: '网络连接异常',
    address: '暂无地址',
    car: '购物车是空的'
};
const displayText = computed(() => props.text || modeTexts[props.mode] || snakeTranslate('common.empty'));
const source = computed(() => props.src || props.icon);
const isImage = computed(() => /^(https?:|data:|\/|\.\/|\.\.\/)/i.test(source.value));
const modeIcons: Record<string, string> = {
    data: 'image',
    list: 'menu',
    search: 'search',
    page: 'page',
    order: 'list',
    coupon: 'coupon',
    favor: 'star',
    permission: 'lock',
    history: 'clock',
    message: 'info',
    wifi: 'warning',
    address: 'location',
    car: 'cart'
};
const iconName = computed(() => source.value || modeIcons[props.mode] || 'image');
const rootStyle = computed(() => [{ marginTop: addUnit(props.marginTop, 'rpx') }, props.customStyle]);
const imageStyle = computed(() => ({ width: addUnit(props.iconSize, 'rpx'), height: addUnit(props.iconSize, 'rpx') }));
const textStyle = computed(() => ({ color: props.color || props.textColor, fontSize: addUnit(props.fontSize, 'rpx') }));
</script>

<template>
    <view v-if="show" class="snake-empty" :class="customClass" :style="[$snakeThemeStyle, rootStyle]">
        <slot name="icon">
            <image v-if="isImage" class="snake-empty__image" :src="iconName" mode="aspectFit" :style="imageStyle" />
            <snake-icon v-else :name="iconName" :color="iconColor" :size="iconSize" />
        </slot>
        <slot
            ><text class="snake-empty__text" :style="textStyle">{{ displayText }}</text></slot
        >
        <view v-if="$slots.bottom" class="snake-empty__bottom"><slot name="bottom" /></view>
    </view>
</template>

<style scoped>
.snake-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40rpx 24rpx;
}
.snake-empty__image {
    display: block;
}
.snake-empty__text {
    margin-top: 20rpx;
    line-height: 1.5;
}
.snake-empty__bottom {
    margin-top: 28rpx;
}
</style>
