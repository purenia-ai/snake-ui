<script setup lang="ts">
/**
 * @component SnakeRadioGroup
 * @description 管理一组 Radio 的互斥值、禁用状态、颜色与横纵布局。
 * @see /components/radio-group
 */

import { computed, inject, provide, toRef } from 'vue';
import { snakeRadioGroupKey } from '../../libs/internal/radio';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import type { SnakeRadioGroupEmits, SnakeRadioGroupProps } from './types';
defineOptions({ name: 'SnakeRadioGroup', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeRadioGroupProps>(), {
    disabled: false,
    direction: 'row',
    size: 'default',
    activeColor: 'var(--snake-color-primary,#06D290)',
    inactiveColor: 'var(--snake-color-border,#c0c4cc)',
    iconSize: 34,
    labelSize: 28,
    shape: 'circle',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeRadioGroupEmits>();
const formItem = inject(snakeFormItemKey, null);
const value = computed(() => props.modelValue);
function select(name: unknown) {
    if (Object.is(value.value, name)) return;
    emit('update:modelValue', name);
    emit('change', name);
    void formItem?.notify('change');
}
provide(snakeRadioGroupKey, {
    modelValue: value,
    disabled: toRef(props, 'disabled'),
    size: toRef(props, 'size'),
    activeColor: toRef(props, 'activeColor'),
    inactiveColor: toRef(props, 'inactiveColor'),
    iconSize: toRef(props, 'iconSize'),
    labelSize: toRef(props, 'labelSize'),
    shape: toRef(props, 'shape'),
    select
});
</script>
<template>
    <view
        class="snake-radio-group"
        :class="[customClass, `is-${placement || direction}`]"
        :style="[$snakeThemeStyle, customStyle]"
        ><slot
    /></view>
</template>
<style scoped>
.snake-radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx 28rpx;
}
.snake-radio-group.is-column {
    flex-direction: column;
    align-items: flex-start;
}
</style>
