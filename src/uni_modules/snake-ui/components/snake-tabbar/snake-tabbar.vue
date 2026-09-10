<script setup lang="ts">
/**
 * @component Tabbar
 * @description 底部导航栏，提供跨端安全区、激活态、徽标和禁用状态。
 * @see /components/tabbar
 */
import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import type { TabbarEmits, TabbarItem, TabbarProps } from './types';

defineOptions({
    name: 'Tabbar',
    options: { addGlobalClass: true, styleIsolation: 'shared' }
});

const props = withDefaults(defineProps<TabbarProps>(), {
    items: () => [],
    current: '',
    fixed: true,
    safeAreaInsetBottom: true,
    customStyle: '',
    customClass: '',
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: 'var(--snake-color-text-muted, #909399)',
    height: 104,
    zIndex: 120
});

const emit = defineEmits<TabbarEmits>();
const rootStyle = computed(() => [
    {
        '--snake-tabbar-active': props.activeColor,
        '--snake-tabbar-inactive': props.inactiveColor,
        zIndex: props.zIndex
    },
    props.customStyle
]);

function isActive(key: string | number) {
    return key === props.current;
}

function clickItem(item: TabbarItem) {
    if (item.disabled) return;
    emit('change', item.key, item);
}
</script>

<template>
    <view
        :class="['snake-tabbar-spacer', { 'snake-tabbar-spacer--safe': safeAreaInsetBottom && fixed }]"
        :style="{ height: fixed ? addUnit(height, 'rpx') : '0' }"
    />
    <view
        :class="[
            'snake-tabbar',
            customClass,
            { 'snake-tabbar--fixed': fixed, 'snake-tabbar--safe': safeAreaInsetBottom }
        ]"
        :style="rootStyle"
        role="navigation"
    >
        <view class="snake-tabbar__inner" :style="{ height: addUnit(height, 'rpx') }">
            <view
                v-for="item in items"
                :key="String(item.key)"
                :class="[
                    'snake-tabbar__item',
                    { 'snake-tabbar__item--active': isActive(item.key), 'snake-tabbar__item--disabled': item.disabled }
                ]"
                hover-class="snake-tabbar__item--hover"
                :aria-label="item.text"
                :aria-current="isActive(item.key) ? 'page' : undefined"
                @click="clickItem(item)"
            >
                <view class="snake-tabbar__icon-wrap"
                    ><SnakeIcon v-if="item.icon" :name="item.icon" :size="20" :bold="isActive(item.key)" /><text
                        v-if="item.badge !== undefined"
                        class="snake-tabbar__badge"
                        >{{ item.badge }}</text
                    ></view
                >
                <text class="snake-tabbar__label">{{ item.text }}</text>
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
    border-top: 1px solid var(--snake-color-divider);
    background: var(--snake-color-surface);
    box-shadow: 0 -6rpx 24rpx rgba(6, 39, 28, 0.07);
    color: var(--snake-tabbar-inactive);
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
