<template>
    <view class="snake-collapse" :class="[{ 'snake-collapse--border': border }, customClass]" :style="customStyle">
        <slot />
    </view>
</template>

<script setup lang="ts">
/**
 * @component Collapse
 * @description 折叠面板容器：统一管理一组子面板的展开态，支持手风琴与多项展开。
 * @see /components/collapse
 */
import { toRef, type ComponentPublicInstance } from 'vue';
import { useChildren } from '../../libs/hooks';
import {
    collapseContextKey,
    collapseProps,
    type CollapseContext,
    type CollapseEmits,
    type CollapseValue
} from './types';

defineOptions({
    name: 'SnakeCollapse',
    options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' }
});

const props = defineProps(collapseProps);
const emit = defineEmits<CollapseEmits>();

const { linkChildren } = useChildren<ComponentPublicInstance, CollapseContext>(collapseContextKey);

/** 统一把单值/数组归一化成数组，避免父组件传错类型时静默失效。 */
function normalizeValue(value: CollapseValue): (string | number)[] {
    if (Array.isArray(value)) return value;
    if (value === '' || value === undefined || value === null) return [];
    return [value];
}

function isActive(name: string | number): boolean {
    return normalizeValue(props.modelValue).includes(name);
}

function toggle(name: string | number) {
    const current = normalizeValue(props.modelValue);
    let next: CollapseValue;
    if (props.accordion) {
        next = current.includes(name) ? '' : name;
    } else {
        next = current.includes(name) ? current.filter(item => item !== name) : [...current, name];
    }
    emit('update:modelValue', next);
    emit('change', next);
}

linkChildren({
    isActive,
    toggle,
    accordion: toRef(props, 'accordion'),
    border: toRef(props, 'border')
});
</script>

<style scoped>
.snake-collapse {
    box-sizing: border-box;
    width: 100%;
    background-color: var(--snake-collapse-bg, var(--snake-color-surface, #ffffff));
}

.snake-collapse--border {
    border-top: 1px solid var(--snake-collapse-border-color, var(--snake-color-divider, #e4e7ed));
}
</style>
