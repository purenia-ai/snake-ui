<script setup lang="ts">
/**
 * @component Tabbar
 * @description 底部导航栏，提供跨端安全区、激活态、徽标和禁用状态。
 * @see /components/tabbar
 */
import { computed, getCurrentInstance } from 'vue';
import { addUnit } from '../../libs/function/unit';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import type { TabbarEmits, TabbarItem, TabbarProps } from './types';

defineOptions({
    name: 'Tabbar',
    options: { addGlobalClass: true, styleIsolation: 'shared' }
});

const props = withDefaults(defineProps<TabbarProps>(), {
    items: () => [],
    list: () => [],
    current: '',
    modelValue: 0,
    show: true,
    fixed: true,
    safeAreaInsetBottom: true,
    customStyle: '',
    customClass: '',
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-text-muted, #909399)',
    bgColor: 'var(--snake-color-surface)',
    borderTop: true,
    midButton: false,
    iconSize: 40,
    midButtonSize: 100,
    textSize: 22,
    gap: 5,
    height: 104,
    zIndex: 120
});

const emit = defineEmits<TabbarEmits>();
const tabItems = computed(() => (props.items.length ? props.items : props.list));
const usesModelValue = computed(() => 'modelValue' in (getCurrentInstance()?.vnode.props ?? {}));
const currentPage = computed(() => {
    const pages = getCurrentPages();
    return pages.length ? `/${pages[pages.length - 1].route}` : '';
});
const rootStyle = computed(() => [
    {
        '--snake-tabbar-active': props.activeColor,
        '--snake-tabbar-inactive': props.inactiveColor,
        zIndex: props.zIndex,
        backgroundColor: props.bgColor
    },
    props.customStyle
]);

function isActive(item: TabbarItem, index: number) {
    if (item.pagePath) return item.pagePath === currentPage.value;
    if (usesModelValue.value) return index === props.modelValue;
    return item.key === props.current;
}

function iconName(item: TabbarItem, index: number) {
    const normal = item.iconPath ?? item.icon;
    return isActive(item, index) ? item.selectedIconPath || normal : normal;
}

function iconPrefix(item: TabbarItem) {
    if (typeof item.customIcon === 'string') return item.customIcon;
    return item.customIcon ? 'custom-icon' : 'sicon';
}

function itemIconSize(item: TabbarItem) {
    if (props.midButton && item.midButton) return props.midButtonSize;
    return item.iconSize ?? props.iconSize;
}

function itemTextSize(item: TabbarItem) {
    return item.textSize ?? props.textSize;
}

function itemKey(item: TabbarItem, index: number) {
    return item.key ?? index;
}

function clickItem(item: TabbarItem, index: number) {
    if (item.disabled) return;
    emit('change', itemKey(item, index), item);
    if (!item.pagePath) emit('update:modelValue', index);
}
</script>

<template>
    <view
        v-if="show"
        :class="['snake-tabbar-spacer', { 'snake-tabbar-spacer--safe': safeAreaInsetBottom && fixed }]"
        :style="{ height: fixed ? addUnit(height, 'rpx') : '0' }"
    />
    <view
        v-if="show"
        :class="[
            'snake-tabbar',
            customClass,
            {
                'snake-tabbar--fixed': fixed,
                'snake-tabbar--safe': safeAreaInsetBottom,
                'snake-tabbar--border': borderTop
            }
        ]"
        :style="rootStyle"
        role="navigation"
    >
        <view class="snake-tabbar__inner" :style="{ height: addUnit(height, 'rpx') }">
            <view
                v-for="(item, index) in tabItems"
                :key="String(itemKey(item, index))"
                :class="[
                    'snake-tabbar__item',
                    {
                        'snake-tabbar__item--active': isActive(item, index),
                        'snake-tabbar__item--disabled': item.disabled,
                        'snake-tabbar__item--mid': midButton && item.midButton
                    }
                ]"
                hover-class="snake-tabbar__item--hover"
                :aria-label="item.text || ''"
                :aria-current="isActive(item, index) ? 'page' : undefined"
                @click="clickItem(item, index)"
            >
                <view class="snake-tabbar__icon-wrap" :style="{ gap: addUnit(item.gap ?? gap, 'rpx') }"
                    ><SnakeIcon
                        v-if="iconName(item, index)"
                        :name="iconName(item, index)"
                        :size="itemIconSize(item)"
                        :bold="isActive(item, index)"
                        :color="isActive(item, index) ? activeColor : inactiveColor"
                        :custom-prefix="iconPrefix(item)"
                    /><text
                        v-if="item.badge !== undefined || item.count !== undefined || item.isDot"
                        class="snake-tabbar__badge"
                        >{{ item.isDot ? '' : (item.badge ?? item.count) }}</text
                    ></view
                >
                <text class="snake-tabbar__label" :style="{ fontSize: addUnit(itemTextSize(item), 'rpx') }">{{
                    item.text
                }}</text>
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
.snake-tabbar-spacer {
    width: 100%;
}
.snake-tabbar-spacer--safe {
    height: calc(104rpx + env(safe-area-inset-bottom)) !important;
}
.snake-tabbar {
    box-shadow: 0 -6rpx 24rpx rgba(6, 39, 28, 0.07);
    color: var(--snake-tabbar-inactive);
}
.snake-tabbar--border {
    border-top: 1px solid var(--snake-color-divider);
}
.snake-tabbar--fixed {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
}
.snake-tabbar--safe {
    padding-bottom: env(safe-area-inset-bottom);
}
.snake-tabbar__inner {
    display: flex;
    max-width: 760px;
    margin: 0 auto;
    align-items: stretch;
}
.snake-tabbar__item {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 5rpx;
    color: var(--snake-tabbar-inactive);
    transition:
        background-color 0.2s,
        color 0.2s;
}
.snake-tabbar__item--active {
    color: var(--snake-tabbar-active);
    font-weight: 650;
}
.snake-tabbar__item--disabled {
    opacity: 0.45;
}
.snake-tabbar__item--mid {
    position: relative;
}
.snake-tabbar__item--mid .snake-tabbar__icon-wrap {
    position: absolute;
    top: -55rpx;
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    background: var(--snake-color-surface);
    box-shadow: 0 0 0 1px var(--snake-color-divider);
}
.snake-tabbar__item--hover {
    background: var(--snake-color-surface-muted);
}
.snake-tabbar__icon-wrap {
    position: relative;
    display: flex;
    height: 42rpx;
    align-items: center;
    justify-content: center;
}
.snake-tabbar__badge {
    position: absolute;
    top: -8rpx;
    right: -24rpx;
    min-width: 24rpx;
    padding: 2rpx 6rpx;
    border-radius: 999rpx;
    color: #fff;
    background: var(--snake-color-error, #f56c6c);
    font-size: 16rpx;
    line-height: 20rpx;
    text-align: center;
}
.snake-tabbar__label {
    font-size: 22rpx;
    line-height: 1.2;
}
@media (prefers-reduced-motion: reduce) {
    .snake-tabbar__item {
        transition: none;
    }
}
</style>
