<template>
    <view class="snake-avatar-group" :class="customClass" :style="customStyle">
        <slot />
        <view v-if="showCollapse" class="snake-avatar-group__rest" :style="restStyle">
            <text class="snake-avatar-group__rest-text">{{ collapseLabel }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component AvatarGroup
 * @description 头像组：把若干 `snake-avatar` 叠成一排，超出 `maxCount` 时折叠为 `+N`；
 * 只渲染部分子项时用 `total` 告诉组件真实总数。
 * @see /components/avatar
 */
import { computed } from 'vue';
import { addUnit, unitToPx } from '../../libs/function/unit';
import { useChildren } from '../../libs/hooks';
import { AVATAR_GROUP_KEY, avatarGroupProps, type AvatarGroupChild, type AvatarGroupContext } from './types';

defineOptions({ name: 'SnakeAvatarGroup', options: { virtualHost: true, styleIsolation: 'shared' } });

/** 组未传尺寸时的兜底尺寸，与 snake-avatar 保持一致。 */
const DEFAULT_SIZE = 40;

const props = defineProps(avatarGroupProps);

// 使用组件关系 hooks 收集子头像（自动注册 / 按 vnode 序排列 / 卸载时注销）
const { children, linkChildren } = useChildren<AvatarGroupChild, AvatarGroupContext>(AVATAR_GROUP_KEY);

/** 真实总数：只渲染部分子项时以 total 为准，否则退回已注册的子项数。 */
const effectiveTotal = computed(() => Math.max(Number(props.total) || 0, children.length));
/** 归一后的最大显示数，非正数视为不折叠。 */
const maxCountValue = computed(() => {
    const value = Number(props.maxCount);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
});
/** 折叠基线：子项 index 大于等于该值时不渲染。 */
const visibleCount = computed(() =>
    maxCountValue.value > 0 ? Math.min(maxCountValue.value, effectiveTotal.value) : effectiveTotal.value
);
const restCount = computed(() => Math.max(0, effectiveTotal.value - visibleCount.value));
const showCollapse = computed(() => restCount.value > 0);
const collapseLabel = computed(() => props.collapseText || `+${restCount.value}`);

const resolvedSize = computed(() => props.size ?? DEFAULT_SIZE);
const overlap = computed(() => {
    const value = props.overlap;
    // 未显式给重叠距离时按尺寸的四分之一折算，并落到 px：负 margin 需要确定的数值
    if (value === undefined || value === null || value === '')
        return `${Math.round(unitToPx(resolvedSize.value) * 0.25)}px`;
    return addUnit(value);
});

linkChildren({ props, visibleCount, overlap });

/** 折叠头像的内联样式：尺寸、形状、重叠与层级都跟随组配置。 */
const restStyle = computed(() => {
    const circle = (props.shape ?? 'circle') === 'circle';
    const style: Record<string, string> = {
        width: addUnit(resolvedSize.value),
        height: addUnit(resolvedSize.value),
        borderRadius: circle ? '50%' : '6px',
        fontSize: addUnit(Math.round(unitToPx(resolvedSize.value) * 0.4)),
        boxShadow:
            '0 0 0 var(--snake-avatar-ring-width, 2px) var(--snake-avatar-ring-color, var(--snake-color-surface))'
    };
    if (children.length > 0) style.marginLeft = `-${overlap.value}`;
    // 与子头像共用一套层级计算：后渲染的压在上面时，折叠头像位于最上层
    style.zIndex = String(props.cascading === 'first-on-top' ? 0 : visibleCount.value + 1);
    return style;
});
</script>

<style scoped>
.snake-avatar-group {
    display: inline-flex;
    align-items: center;
    vertical-align: middle;
}

.snake-avatar-group__rest {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
    background-color: var(--snake-avatar-rest-bg, var(--snake-color-surface-muted, #f1f1f1));
    color: var(--snake-avatar-rest-color, var(--snake-color-text-muted, #909399));
    line-height: 1;
}

.snake-avatar-group__rest-text {
    max-width: 100%;
    overflow: hidden;
    font-size: inherit;
    line-height: 1;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
