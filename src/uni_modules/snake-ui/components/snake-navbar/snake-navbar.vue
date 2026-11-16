<template>
    <view class="snake-navbar-host">
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
                        :hover-stay-time="70"
                        @click="goBack"
                    >
                        <snake-icon :name="backIconName" :size="backIconSize ?? 'inherit'" :color="backIconColor" />
                        <text v-if="backText" class="snake-navbar__back-text" :style="backTextStyleMerged">
                            {{ backText }}
                        </text>
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

<script setup lang="ts">
/**
 * @component Navbar
 * @description 用于页面顶部导航，支持状态栏安全区、返回操作、固定定位、标题及左右插槽。
 * @see /components/navbar
 */

import { computed } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { toStyle } from '../../libs/function/style';
import Icon from '../snake-icon/snake-icon.vue';
import type { NavbarEmits, NavbarProps } from './types';

defineOptions({ name: 'Navbar', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<NavbarProps>(), {
    title: '',
    height: 44,
    backIconColor: 'var(--snake-color-text, #303133)',
    backIconName: 'arrow-left',
    backIconSize: 20,
    backText: '',
    backTextStyle: '',
    titleWidth: 180,
    titleColor: 'var(--snake-color-text, #303133)',
    titleSize: 16,
    titleBold: false,
    isBack: true,
    background: 'var(--snake-color-surface, #fff)',
    fixed: true,
    immersive: false,
    safeAreaInsetTop: true,
    borderBottom: true,
    zIndex: zIndex.navbar,
    customBack: null,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<NavbarEmits>();

const systemInfo = uni.getSystemInfoSync();
const statusBarHeight = computed(() => (props.safeAreaInsetTop ? Number(systemInfo.statusBarHeight) || 0 : 0));
const navbarHeight = computed(() => Number.parseFloat(String(props.height)) || 44);
const placeholderHeight = computed(() => navbarHeight.value + statusBarHeight.value);

/**
 * 小程序右上角胶囊浮在导航栏右侧，右侧插槽必须让出这段宽度，否则内容被胶囊压住；
 * 标题的最大宽度同样扣掉这段，长标题才不会钻到胶囊下面。
 * H5 / App 没有胶囊，取 0，行为与之前一致。
 */
function capsuleInset(): number {
    let inset = 0;
    // #ifdef MP-WEIXIN || MP-QQ
    try {
        const menu = uni.getMenuButtonBoundingClientRect();
        const windowWidth = Number(systemInfo.windowWidth) || Number(systemInfo.screenWidth) || 0;
        inset = menu && menu.left ? windowWidth - Number(menu.left) : 0;
    } catch {
        inset = 0;
    }
    // #endif
    return inset > 0 ? Math.round(inset) : 0;
}
const capsuleWidth = capsuleInset();

const backgroundStyle = computed(() =>
    typeof props.background === 'string' ? { background: props.background } : props.background
);
const rootStyle = computed(() => [
    backgroundStyle.value,
    { zIndex: Number(props.zIndex) || zIndex.navbar },
    props.customStyle
]);
const innerStyle = computed(() => ({
    height: navbarHeight.value + 'px',
    '--snake-navbar-capsule-inset': capsuleWidth + 'px',
    ...(capsuleWidth ? { paddingRight: capsuleWidth + 'px' } : {})
}));
const titleStyle = computed(() => ({
    width: addUnit(props.titleWidth),
    color: props.titleColor,
    fontSize: addUnit(props.titleSize),
    fontWeight: props.titleBold ? '700' : '500'
}));
/** 返回辅助文字默认跟随返回图标颜色，backTextStyle 里的同名字段仍然优先。 */
const backTextStyleMerged = computed(() => toStyle({ color: props.backIconColor }, props.backTextStyle));

function goBack(event: unknown) {
    emit('back', event);
    if (props.customBack) {
        props.customBack();
        return;
    }
    uni.navigateBack();
}
</script>

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
/* 半像素底边：1px 边框在高分屏上偏粗，缩放 0.5 后与小程序原生导航栏一致。 */
.snake-navbar.has-border::after {
    content: ' ';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 3;
    border-bottom: 1px solid var(--snake-color-divider, #ebeef5);
    transform: scaleY(0.5);
    transform-origin: 0 100%;
    pointer-events: none;
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
    box-sizing: border-box;
    align-items: center;
    min-width: 44px;
    height: 100%;
    padding: 0 12px;
}
.snake-navbar__back-text {
    overflow: hidden;
    margin-left: 2px;
    font-size: 14px;
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
    max-width: calc(100% - 96px - var(--snake-navbar-capsule-inset, 0px));
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
    width: calc(100% - 96px - var(--snake-navbar-capsule-inset, 0px));
}
/* 按压反馈用前景变淡（iOS 返回键的做法）：叠一块半透明黑在彩色导航栏上会显成灰色方块。 */
.snake-navbar__hit--hover {
    opacity: 0.55;
    transition: opacity 0.15s ease;
}
.snake-navbar__placeholder {
    width: 100%;
}
</style>
