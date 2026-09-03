<script setup lang="ts">
/**
 * @component SnakeRadio
 * @description 可独立绑定 boolean，也可在 RadioGroup 中通过 `name` 参与互斥选择。
 * @see /components/radio
 */

import { computed, inject } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { snakeRadioGroupKey } from '../../libs/internal/radio';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import { snakeRadioProps } from './types';
import type { SnakeRadioEmits } from './types';
defineOptions({ name: 'SnakeRadio', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(snakeRadioProps);
const emit = defineEmits<SnakeRadioEmits>();
const group = inject(snakeRadioGroupKey, null);
const formItem = inject(snakeFormItemKey, null);
const checked = computed(() => (group ? Object.is(group.modelValue.value, props.name) : props.modelValue));
const disabled = computed(() => props.disabled || Boolean(group?.disabled.value));
const shape = computed(() => props.shape || group?.shape.value || 'circle');
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
function select(event: unknown, fromLabel = false) {
    emit('click', event);
    if (disabled.value || checked.value || (fromLabel && props.labelDisabled)) return;
    if (group) group.select(props.name);
    else {
        emit('update:modelValue', true);
        emit('change', true, props.name);
        void formItem?.notify('change');
    }
}
</script>
<template>
    <view
        class="snake-radio"
        role="radio"
        :aria-checked="checked"
        :aria-disabled="disabled"
        :tabindex="disabled ? -1 : 0"
        :class="[customClass, `snake-radio--${size}`, { 'is-disabled': disabled }]"
        :style="customStyle"
        @keydown.enter.prevent="select($event)"
        @keydown.space.prevent="select($event)"
        ><view class="snake-radio__icon" :class="`is-${shape}`" :style="iconStyle" @click="select($event)"
            ><snake-icon
                v-if="checked"
                name="checkmark"
                :color="iconColor"
                :size="Number(iconSize) * (20 / 34)" /></view
        ><view class="snake-radio__label" :style="{ fontSize: addUnit(labelSize, 'rpx') }" @click="select($event, true)"
            ><slot>{{ label }}</slot></view
        ></view
    >
</template>
<style scoped>
.snake-radio {
    display: inline-flex;
    align-items: center;
    gap: 12rpx;
    color: var(--snake-color-text, #303133);
}
.snake-radio:focus-visible {
    outline: 2px solid var(--snake-color-primary, #06d290);
    outline-offset: 4rpx;
}
.snake-radio.is-disabled {
    opacity: 0.45;
}
.snake-radio__icon {
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
    .snake-radio__icon {
        transition: none;
    }
}
.snake-radio__icon.is-square {
    border-radius: 6rpx;
}
.snake-radio__icon.is-circle {
    border-radius: 50%;
}
.snake-radio__label {
    line-height: 1.5;
}
</style>
