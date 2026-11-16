<template>
    <view
        class="snake-grid-item"
        :class="[
            {
                'snake-grid-item--bordered': bordered,
                'snake-grid-item--square': square,
                'snake-grid-item--clickable': clickable && !disabled,
                'snake-grid-item--disabled': disabled
            },
            customClass
        ]"
        :style="[itemStyle, customStyle]"
        :hover-class="clickable && !disabled ? 'snake-grid-item--hover' : 'none'"
        hover-stay-time="80"
        @click="onClick"
    >
        <view class="snake-grid-item__inner" :style="innerStyle">
            <view class="snake-grid-item__icon-wrap">
                <snake-badge v-if="hasBadge" :value="badge" custom-class="snake-grid-item__badge">
                    <snake-icon
                        v-if="icon"
                        :name="icon"
                        :size="resolvedIconSize"
                        :color="iconColor"
                        :margin-left="0"
                        :margin-right="0"
                        custom-class="snake-grid-item__icon"
                    />
                    <slot v-else name="icon" />
                </snake-badge>
                <template v-else>
                    <snake-icon
                        v-if="icon"
                        :name="icon"
                        :size="resolvedIconSize"
                        :color="iconColor"
                        :margin-left="0"
                        :margin-right="0"
                        custom-class="snake-grid-item__icon"
                    />
                    <slot v-else name="icon" />
                </template>
            </view>
            <view v-if="text || $slots.default" class="snake-grid-item__text">
                <slot>{{ text }}</slot>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component GridItem
 * @description 宫格子项：图标 + 文案的九宫格入口，支持角标、禁用与点击派发。
 * @see /components/grid
 */
import { computed } from 'vue';
import Icon from '../snake-icon/snake-icon.vue';
import Badge from '../snake-badge/snake-badge.vue';
import { unitToPx } from '../../libs/function/unit';
import { useParent } from '../../libs/hooks';
import { gridContextKey, type GridContext } from '../snake-grid/types';
import { gridItemProps, type GridItemEmits } from './types';

defineOptions({
    name: 'SnakeGridItem',
    options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' }
});

const props = defineProps(gridItemProps);
const emit = defineEmits<GridItemEmits>();
const { parent, index } = useParent<GridContext>(gridContextKey);

const column = computed(() => Math.max(1, Math.round(parent.value?.column.value ?? 4)));
const bordered = computed(() => Boolean(parent.value?.border.value));
const square = computed(() => Boolean(parent.value?.square.value));
const clickable = computed(() => Boolean(parent.value?.clickable.value));
const hasBadge = computed(() => props.badge !== '' && props.badge !== null && props.badge !== undefined);
const resolvedIconSize = computed(() => props.iconSize || 24);

/** 宽度按列数等分。 */
const itemStyle = computed(() => ({
    width: `${100 / column.value}%`
}));

const innerStyle = computed(() => {
    const gutter = Number(unitToPx(parent.value?.gutter.value ?? 0));
    // gutter 只负责相邻格子的间距；--snake-grid-item-padding 是额外的内容留白，
    // 留给角标（圆心压在图标右上角、向上溢出 7px）和圆角卡片的裁剪边界做缓冲。
    const padding = `calc(${gutter > 0 ? gutter / 2 : 0}px + var(--snake-grid-item-padding, 0px))`;
    if (!square.value) return { padding } as const;
    return { padding, position: 'absolute', top: '0', right: '0', bottom: '0', left: '0' } as const;
});

function onClick(event: unknown) {
    if (props.disabled) return;
    emit('click', Math.max(0, index.value), event);
}
</script>

<style scoped>
.snake-grid-item {
    position: relative;
    box-sizing: border-box;
}

.snake-grid-item--bordered {
    border-right: 1px solid var(--snake-grid-border-color, var(--snake-color-divider, #e4e7ed));
    border-bottom: 1px solid var(--snake-grid-border-color, var(--snake-color-divider, #e4e7ed));
}

/* 等高：用 padding-top 撑出正方形，内容绝对定位，避免依赖 JS 测量 */
.snake-grid-item--square::before {
    content: '';
    display: block;
    padding-top: 100%;
}

.snake-grid-item__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.snake-grid-item__icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.snake-grid-item__icon {
    color: var(--snake-grid-icon-color, var(--snake-color-text-secondary, #606266));
}

.snake-grid-item__text {
    margin-top: 6px;
    max-width: 100%;
    overflow: hidden;
    color: var(--snake-color-text, #303133);
    font-size: var(--snake-grid-text-size, 14px);
    line-height: 1.4;
    white-space: nowrap;
    text-align: center;
    text-overflow: ellipsis;
}

/* 点击态用 hover-class 而非 :active：WXSS 的选择器白名单里没有伪类 :active，小程序端不生效 */
.snake-grid-item--hover {
    background-color: var(--snake-color-surface-muted, #f1f1f1);
}

.snake-grid-item--disabled {
    opacity: 0.4;
}
</style>
