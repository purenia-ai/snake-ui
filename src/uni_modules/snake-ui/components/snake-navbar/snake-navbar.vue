<script setup lang="ts">
/**
 * @component SnakeNavbar
 * @description 用于页面顶部导航，支持状态栏安全区、返回操作、固定定位、标题及左右插槽。
 * @see /components/navbar
 */

import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import type { SnakeNavbarEmits, SnakeNavbarProps } from './types';

defineOptions({ name: 'SnakeNavbar', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<SnakeNavbarProps>(), {
    title: '',
    height: 44,
    backIconColor: 'var(--snake-color-text, #303133)',
    backIconName: 'arrow-left',
    backIconSize: 40,
    backText: '',
    backTextStyle: '',
    titleWidth: 360,
    titleColor: 'var(--snake-color-text, #303133)',
    titleSize: 32,
    titleBold: false,
    isBack: true,
    background: 'var(--snake-color-surface, #fff)',
    fixed: true,
    immersive: false,
    safeAreaInsetTop: true,
    borderBottom: true,
    zIndex: 980,
    customBack: null,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeNavbarEmits>();

const systemInfo = uni.getSystemInfoSync();
const statusBarHeight = computed(() => (props.safeAreaInsetTop ? Number(systemInfo.statusBarHeight) || 0 : 0));
const navbarHeight = computed(() => Number.parseFloat(String(props.height)) || 44);
const placeholderHeight = computed(() => navbarHeight.value + statusBarHeight.value);
const backgroundStyle = computed(() =>
    typeof props.background === 'string' ? { background: props.background } : props.background
);
const rootStyle = computed(() => [backgroundStyle.value, { zIndex: Number(props.zIndex) || 980 }, props.customStyle]);
const innerStyle = computed(() => ({ height: navbarHeight.value + 'px' }));
const titleStyle = computed(() => ({
    width: addUnit(props.titleWidth, 'rpx'),
    color: props.titleColor,
    fontSize: addUnit(props.titleSize, 'rpx'),
    fontWeight: props.titleBold ? '700' : '500'
}));

function goBack(event: unknown) {
    emit('back', event);
    if (props.customBack) {
        props.customBack();
        return;
    }
    uni.navigateBack();
}
</script>

<template>
    <view class="snake-navbar-host" :style="$snakeThemeStyle">
        <view
            :class="['snake-navbar', { 'is-fixed': fixed, 'has-border': borderBottom }, customClass]"
            :style="rootStyle"
        >
            <view class="snake-navbar__status" :style="{ height: statusBarHeight + 'px' }" />
            <view class="snake-navbar__inner" :style="innerStyle">
                <view class="snake-navbar__left">
                    <view
                        v-if="isBack"
                        class="snake-navbar__back"
                        hover-class="snake-navbar__hit--hover"
                        @click="goBack"
                    >
                        <snake-icon :name="backIconName" :size="backIconSize" :color="backIconColor" />
                        <text v-if="backText" class="snake-navbar__back-text" :style="backTextStyle">{{
                            backText
                        }}</text>
                    </view>
                    <slot name="left" />
                </view>

                <view v-if="title" class="snake-navbar__title" :style="titleStyle">{{ title }}</view>
                <view v-else class="snake-navbar__content"><slot /></view>

                <view class="snake-navbar__right"><slot name="right" /></view>
            </view>
        </view>
        <view
            v-if="fixed && !immersive"
            class="snake-navbar__placeholder"
            :style="{ height: placeholderHeight + 'px' }"
        />
    </view>
</template>

<style scoped>
.snake-navbar-host,
.snake-navbar {
    box-sizing: border-box;
    width: 100%;
}
.snake-navbar {
    position: relative;
}
.snake-navbar.is-fixed {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
}
.snake-navbar.has-border {
    border-bottom: 1rpx solid var(--snake-color-divider, #ebeef5);
}
.snake-navbar__status {
    width: 100%;
}
.snake-navbar__inner {
    position: relative;
    display: flex;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}
.snake-navbar__left,
.snake-navbar__right {
    position: relative;
    z-index: 2;
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
    height: 100%;
}
.snake-navbar__right {
    justify-content: flex-end;
}
.snake-navbar__back {
    display: flex;
    align-items: center;
    min-width: 88rpx;
    height: 100%;
    padding: 0 20rpx;
}
.snake-navbar__back-text {
    overflow: hidden;
    margin-left: 4rpx;
    font-size: 28rpx;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
}
	.snake-navbar__title,
	.snake-navbar__content {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: calc(100% - 192rpx);
    text-align: center;
    transform: translateX(-50%);
}
.snake-navbar__title {
    overflow: hidden;
    line-height: 1.2;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.snake-navbar__content {
    width: calc(100% - 192rpx);
}
.snake-navbar__hit--hover {
    background: rgba(0, 0, 0, 0.06);
}
.snake-navbar__placeholder {
    width: 100%;
}
</style>
