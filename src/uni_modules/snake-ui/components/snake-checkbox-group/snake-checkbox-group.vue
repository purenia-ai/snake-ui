<script setup lang="ts">
/**
 * @component SnakeCheckboxGroup
 * @description 管理一组 Checkbox 的数组值、禁用状态、最大选择数和布局。
 * @see /components/checkbox-group
 */

import { computed, inject, provide, toRef } from 'vue';
import { snakeCheckboxGroupKey } from '../../libs/internal/checkbox';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import type { SnakeCheckboxGroupEmits, SnakeCheckboxGroupProps } from './types';
defineOptions({ name: 'SnakeCheckboxGroup', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeCheckboxGroupProps>(), {
    modelValue: () => [],
    disabled: false,
    max: 0,
    direction: 'row',
    size: 'default',
    activeColor: 'var(--snake-color-primary,#06D290)',
    inactiveColor: 'var(--snake-color-border,#c0c4cc)',
    iconSize: 34,
    labelSize: 28,
    shape: 'square',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeCheckboxGroupEmits>();
const formItem = inject(snakeFormItemKey, null);
const value = computed(() => props.modelValue || []);
function toggle(name: unknown, checked: boolean) {
    const next = [...value.value];
    const index = next.findIndex(item => Object.is(item, name));
    if (checked && index < 0) {
        if (props.max > 0 && next.length >= props.max) return;
        next.push(name);
    } else if (!checked && index >= 0) next.splice(index, 1);
    else return;
    emit('update:modelValue', next);
    emit('change', next);
    void formItem?.notify('change');
}
provide(snakeCheckboxGroupKey, {
    modelValue: value,
    disabled: toRef(props, 'disabled'),
    max: toRef(props, 'max'),
    size: toRef(props, 'size'),
    activeColor: toRef(props, 'activeColor'),
    inactiveColor: toRef(props, 'inactiveColor'),
    iconSize: toRef(props, 'iconSize'),
    labelSize: toRef(props, 'labelSize'),
    shape: toRef(props, 'shape'),
    toggle
});
</script>
<template>
    <view
        class="snake-checkbox-group"
        :class="[customClass, `is-${placement || direction}`]"
        :style="[$snakeThemeStyle, customStyle]"
        ><slot
    /></view>
</template>
<style scoped>
.snake-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx 28rpx;
}
.snake-checkbox-group.is-column {
    flex-direction: column;
    align-items: flex-start;
}
</style>
