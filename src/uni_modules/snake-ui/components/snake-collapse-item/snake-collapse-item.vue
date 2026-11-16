<template>
    <view
        class="snake-collapse-item"
        :class="[
            {
                'snake-collapse-item--active': active,
                'snake-collapse-item--disabled': disabled,
                'snake-collapse-item--border': border
            },
            customClass
        ]"
        :style="customStyle"
    >
        <view class="snake-collapse-item__header" @click="onToggle">
            <view v-if="icon || $slots.icon" class="snake-collapse-item__icon-wrap">
                <slot name="icon">
                    <snake-icon
                        :name="icon"
                        :size="16"
                        :margin-left="0"
                        :margin-right="0"
                        custom-class="snake-collapse-item__icon"
                    />
                </slot>
            </view>
            <view class="snake-collapse-item__title">
                <slot name="title">{{ title }}</slot>
            </view>
            <view class="snake-collapse-item__value">
                <slot name="value" />
            </view>
            <snake-icon
                name="arrow-down"
                :size="12"
                :margin-left="6"
                :margin-right="0"
                custom-class="snake-collapse-item__arrow"
                :class="{ 'snake-collapse-item__arrow--active': active }"
            />
        </view>
        <view class="snake-collapse-item__wrapper" :style="wrapperStyle">
            <view class="snake-collapse-item__content">
                <slot />
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component CollapseItem
 * @description 折叠面板子项：点击标题展开或收起内容，状态由父级 Collapse 统一管理。
 * @see /components/collapse
 */
import { computed } from 'vue';
import Icon from '../snake-icon/snake-icon.vue';
import { useParent } from '../../libs/hooks';
import { collapseContextKey, type CollapseContext } from '../snake-collapse/types';
import { collapseItemProps } from './types';

defineOptions({
    name: 'SnakeCollapseItem',
    options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' }
});

const props = defineProps(collapseItemProps);
const { parent, index } = useParent<CollapseContext>(collapseContextKey);

/** 未显式传 name 时退化为模板序号，保证父级能唯一定位。 */
const itemName = computed<string | number>(() => (props.name === '' ? index.value : props.name));

const active = computed(() => (parent.value ? parent.value.isActive(itemName.value) : false));

/** 展开高度取足够大的上限做过渡：小程序下逐帧测量会触发重排抖动，这里换取稳定性。 */
const wrapperStyle = computed(() => ({
    maxHeight: active.value ? 'var(--snake-collapse-max-height, 1000px)' : '0px',
    transition: `max-height ${props.duration}ms ease`
}));

function onToggle() {
    if (props.disabled) return;
    parent.value?.toggle(itemName.value);
}
</script>

<style scoped>
.snake-collapse-item {
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    background-color: var(--snake-collapse-bg, var(--snake-color-surface, #ffffff));
}

.snake-collapse-item--border::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background-color: var(--snake-collapse-border-color, var(--snake-color-divider, #e4e7ed));
    transform: scaleY(0.5);
    transform-origin: 0 100%;
}

.snake-collapse-item__header {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: var(--snake-collapse-header-height, 48px);
    padding: 10px 16px;
    color: var(--snake-color-text, #303133);
    font-size: var(--snake-collapse-font-size, 15px);
    line-height: 1.4;
}

.snake-collapse-item--disabled .snake-collapse-item__header {
    color: var(--snake-color-text-light, #c0c4cc);
}

.snake-collapse-item__title {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.snake-collapse-item__value {
    flex: 0 0 auto;
    margin-left: 8px;
    color: var(--snake-color-text-muted, #909399);
    font-size: 12px;
}

.snake-collapse-item__icon-wrap {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    margin-right: 6px;
    color: inherit;
}

.snake-collapse-item__icon {
    color: inherit;
}

.snake-collapse-item__arrow {
    flex: 0 0 auto;
    color: var(--snake-collapse-arrow-color, var(--snake-color-text-muted, #909399));
    transition: transform 200ms ease;
}

.snake-collapse-item__arrow--active {
    transform: rotate(180deg);
}

.snake-collapse-item__wrapper {
    overflow: hidden;
}

.snake-collapse-item__content {
    padding: 0 16px 12px;
    color: var(--snake-color-text-secondary, #606266);
    font-size: 14px;
    line-height: 1.6;
}
</style>
