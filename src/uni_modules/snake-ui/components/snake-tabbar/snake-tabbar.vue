<script setup lang="ts">
/**
 * @component Tabbar
 * @description 底部导航栏，提供跨端安全区、激活态、徽标和禁用状态。
 * @see /components/tabbar
 */
import { computed, getCurrentInstance, onMounted } from 'vue';
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
    hideTabBar: true,
    midButton: false,
    iconSize: 40,
    midButtonSize: 100,
    textSize: 22,
    gap: 5,
    height: 104,
    zIndex: 120
});

const emit = defineEmits<TabbarEmits>();
// `items` 是 Snake 的别名；保留 `list` 以兼容 uView 的配置结构。
const tabItems = computed(() => (props.items.length ? props.items : props.list));
// 只有调用方显式传入 v-model 时才按索引高亮，避免默认值覆盖 `current`。
const usesModelValue = computed(() => 'modelValue' in (getCurrentInstance()?.vnode.props ?? {}));
// 任一项指定宽度后，未指定项必须改为填充剩余空间，不能再按百分比分配。
const hasCustomWidth = computed(() =>
    tabItems.value.some(item => item.width !== undefined && item.width !== null && item.width !== '')
);
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
const spacerStyle = computed(() => {
    if (!props.fixed) return { height: '0' };

    // 凸起按钮会越过栏顶；占位同步增加 60rpx，防止页面末尾内容被遮住。
    const midButtonHeight = props.midButton ? '60rpx' : '1px';
    const safeAreaHeight = props.safeAreaInsetBottom ? ' + env(safe-area-inset-bottom)' : '';
    return { height: `calc(${addUnit(props.height, 'rpx')} + ${midButtonHeight}${safeAreaHeight})` };
});

onMounted(() => {
    if (!props.hideTabBar) return;

    // uni-app only permits this API on pages declared in the native tabBar.
    // A component library cannot inspect the consumer's pages.json at runtime,
    // so explicitly consume that expected failure on ordinary pages.
    uni.hideTabBar({ fail: () => {} });
});

function isActive(item: TabbarItem, index: number) {
    // pagePath 模式以真实路由为准；纯组件模式才由 v-model/current 控制。
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

function itemStyle(item: TabbarItem): Record<string, string> {
    const style: Record<string, string> = {};
    if (item.width !== undefined && item.width !== null && item.width !== '') {
        const width = addUnit(item.width, 'rpx');
        style.flex = `0 0 ${width}`;
        style.width = width;
    } else if (hasCustomWidth.value) {
        style.flex = '1 1 auto';
        style.width = 'auto';
    } else if (tabItems.value.length) {
        const width = `${100 / tabItems.value.length}%`;
        style.flex = `0 0 ${width}`;
        style.width = width;
    }

    if (props.midButton && item.midButton) {
        // 图标绝对定位后不再参与文档流，额外顶部内边距为标签留出空间。
        const size =
            Number.parseFloat(String(itemIconSize(item))) || Number.parseFloat(String(props.midButtonSize)) || 100;
        style.paddingTop = addUnit(size / 2 + 8, 'rpx');
        style.boxSizing = 'border-box';
    }
    return style;
}

async function clickItem(item: TabbarItem, index: number) {
    if (item.disabled) return;

    if (props.beforeSwitch) {
        try {
            // 与 uView 一致：同步场景必须明确返回 true；Promise resolve 即表示放行。
            const result = props.beforeSwitch(index);
            if (typeof result === 'object' && result !== null && 'then' in result) await result;
            else if (result !== true) return;
        } catch {
            return;
        }
    }

    emit('change', itemKey(item, index), item);
    // 原生 tabBar 页面只能通过 switchTab 切换；没有 pagePath 时才更新本地 v-model。
    if (item.pagePath) uni.switchTab({ url: item.pagePath });
    else emit('update:modelValue', index);
}
</script>

<template>
    <view v-if="show" class="snake-tabbar-spacer" :style="spacerStyle" />
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
        @touchmove.stop.prevent="() => {}"
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
                :style="itemStyle(item)"
                :aria-label="item.text || ''"
                :aria-current="isActive(item, index) ? 'page' : undefined"
                @tap.stop="clickItem(item, index)"
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
