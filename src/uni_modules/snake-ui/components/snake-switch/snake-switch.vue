<template>
    <view
        class="snake-switch"
        :class="[customClass, { 'is-disabled': disabled || loading }]"
        :style="[trackStyle, customStyle]"
        role="switch"
        :aria-checked="checked"
        :aria-disabled="disabled || loading"
        :tabindex="disabled || loading ? -1 : 0"
        @click="toggle"
        @keydown.enter.prevent="toggle($event)"
        @keydown.space.prevent="toggle($event)"
    >
        <view class="snake-switch__thumb" :style="thumbStyle">
            <snake-loading v-if="loading" :size="numericSize * 0.55" :color="checked ? activeColor : '#909399'" />
        </view>
    </view>
</template>
<script setup lang="ts">
/**
 * @component Switch
 * @description 切换 boolean、字符串或数字状态，支持加载、禁用、自定义值和短震动反馈。
 * @see /components/switch
 */

import { computed, inject } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { formItemKey } from '../snake-form-item/types';
import SnakeLoading from '../snake-loading/snake-loading.vue';
import type { SwitchEmits, SwitchProps } from './types';
defineOptions({ name: 'SnakeSwitch', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SwitchProps>(), {
    modelValue: false,
    activeValue: true,
    inactiveValue: false,
    loading: false,
    disabled: false,
    activeColor: 'var(--snake-color-primary,#06D290)',
    inactiveColor: 'var(--snake-color-border,#dcdfe6)',
    space: 1,
    vibrateShort: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SwitchEmits>();
const formItem = inject(formItemKey, null);
const checked = computed(() => Object.is(props.modelValue, props.activeValue));
const resolvedSize = computed(() => {
    const size = props.size || formItem?.size.value || 25;
    return size === 'small' ? 20 : size === 'large' ? 30 : size === 'default' ? 25 : size;
});
const numericSize = computed(() => Number.parseFloat(String(resolvedSize.value)) || 25);
const numericSpace = computed(() => Number.parseFloat(String(props.space)) || 0);
const trackStyle = computed(() => ({
    width: addUnit(numericSize.value * 1.8),
    height: addUnit(resolvedSize.value),
    padding: addUnit(props.space),
    backgroundColor: checked.value ? props.activeColor : props.inactiveColor
}));
const thumbStyle = computed(() => ({
    width: addUnit(numericSize.value - numericSpace.value * 2),
    height: addUnit(numericSize.value - numericSpace.value * 2),
    transform: checked.value ? `translateX(${addUnit(numericSize.value * 0.8)})` : 'translateX(0)'
}));
function toggle(event: unknown) {
    emit('click', event);
    if (props.disabled || props.loading) return;
    const next = checked.value ? props.inactiveValue : props.activeValue;
    if (props.vibrateShort && typeof uni !== 'undefined' && uni.vibrateShort)
        uni.vibrateShort({ fail: () => undefined });
    emit('update:modelValue', next);
    emit('change', next);
    void formItem?.notify('change');
}
</script>
<style scoped>
.snake-switch {
    display: inline-flex;
    box-sizing: content-box;
    align-items: center;
    border-radius: 999px;
    transition: background-color 0.2s;
}
.snake-switch.is-disabled {
    opacity: 0.55;
}
.snake-switch:focus-visible {
    outline: 2px solid var(--snake-color-primary, #06d290);
    outline-offset: 2px;
}
.snake-switch__thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 4px rgba(15, 30, 24, 0.18);
    transition: transform 0.2s;
}
</style>
