<script setup lang="ts">
/**
 * @component SnakeCheckbox
 * @description 可独立绑定 boolean，也可放入 CheckboxGroup，通过 `name` 管理数组值。
 * @see /components/checkbox
 */

import { computed, inject } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { snakeCheckboxGroupKey } from '../../libs/internal/checkbox';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import { snakeCheckboxProps } from './types';
import type { SnakeCheckboxEmits } from './types';
defineOptions({ name: 'SnakeCheckbox', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(snakeCheckboxProps);
const emit = defineEmits<SnakeCheckboxEmits>();
const group = inject(snakeCheckboxGroupKey, null);
const formItem = inject(snakeFormItemKey, null);
const checked = computed(() =>
    group ? group.modelValue.value.some(value => Object.is(value, props.name)) : props.modelValue
);
const disabled = computed(() => props.disabled || Boolean(group?.disabled.value));
const shape = computed(() => props.shape || group?.shape.value || 'square');
const size = computed(() => props.size || group?.size.value || 'default');
const activeColor = computed(
    () => props.activeColor || group?.activeColor.value || 'var(--snake-color-primary,#06D290)'
);
const inactiveColor = computed(
    () => props.inactiveColor || group?.inactiveColor.value || 'var(--snake-color-border,#c0c4cc)'
);
const iconSize = computed(() => props.iconSize || group?.iconSize.value || 34);
const labelSize = computed(() => props.labelSize || group?.labelSize.value || 28);
const iconStyle = computed(() => ({
    width: addUnit(iconSize.value, 'rpx'),
    height: addUnit(iconSize.value, 'rpx'),
    borderColor: checked.value ? activeColor.value : inactiveColor.value,
    backgroundColor: checked.value ? activeColor.value : 'transparent'
}));
function toggle(event: unknown, fromLabel = false) {
    emit('click', event);
    if (disabled.value || (fromLabel && props.labelDisabled)) return;
    const next = !checked.value;
    if (group) group.toggle(props.name, next);
    else {
        emit('update:modelValue', next);
        emit('change', next, props.name);
        void formItem?.notify('change');
    }
}
</script>
<template>
    <view
        class="snake-checkbox"
        role="checkbox"
        :aria-checked="checked"
        :aria-disabled="disabled"
        :tabindex="disabled ? -1 : 0"
        :class="[customClass, `snake-checkbox--${size}`, { 'is-disabled': disabled }]"
        :style="customStyle"
        @keydown.enter.prevent="toggle($event)"
        @keydown.space.prevent="toggle($event)"
        ><view class="snake-checkbox__icon" :class="`is-${shape}`" :style="iconStyle" @click="toggle($event)"
            ><snake-icon
                v-if="checked"
                name="checkmark"
                :color="iconColor"
                :size="Number(iconSize) * (20 / 34)" /></view
        ><view
            class="snake-checkbox__label"
            :style="{ fontSize: addUnit(labelSize, 'rpx') }"
            @click="toggle($event, true)"
            ><slot>{{ label }}</slot></view
        ></view
    >
</template>
<style scoped>
.snake-checkbox {
    display: inline-flex;
    align-items: center;
    gap: 12rpx;
    color: var(--snake-color-text, #303133);
}
.snake-checkbox:focus-visible {
    outline: 2px solid var(--snake-color-primary, #06d290);
    outline-offset: 4rpx;
}
.snake-checkbox.is-disabled {
    opacity: 0.45;
}
.snake-checkbox__icon {
    display: flex;
    flex: none;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
    border: 1px solid;
    transition:
        border-color 0.2s,
        background-color 0.2s;
}

@media (prefers-reduced-motion: reduce) {
    .snake-checkbox__icon {
        transition: none;
    }
}
.snake-checkbox__icon.is-square {
    border-radius: 6rpx;
}
.snake-checkbox__icon.is-circle {
    border-radius: 50%;
}
.snake-checkbox__label {
    line-height: 1.5;
}
</style>
