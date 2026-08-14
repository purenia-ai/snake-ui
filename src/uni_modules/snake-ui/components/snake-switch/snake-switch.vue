<script setup lang="ts">
import { computed, inject } from 'vue';
import { addUnit } from '../../libs';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import SnakeLoadingIcon from '../snake-loading-icon/snake-loading-icon.vue';
import type { SnakeSwitchEmits, SnakeSwitchProps } from './types';
defineOptions({ name: 'SnakeSwitch', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeSwitchProps>(), {
    modelValue: false,
    activeValue: true,
    inactiveValue: false,
    loading: false,
    disabled: false,
    activeColor: 'var(--snake-color-primary,#00a86f)',
    inactiveColor: 'var(--snake-color-border,#dcdfe6)',
    space: 2,
    vibrateShort: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeSwitchEmits>();
const formItem = inject(snakeFormItemKey, null);
const checked = computed(() => Object.is(props.modelValue, props.activeValue));
const resolvedSize = computed(() => {
    const size = props.size || formItem?.size.value || 24;
    return size === 'small' ? 20 : size === 'large' ? 28 : size === 'default' ? 24 : size;
});
const numericSize = computed(() => Number.parseFloat(String(resolvedSize.value)) || 24);
const numericSpace = computed(() => Number.parseFloat(String(props.space)) || 0);
const trackStyle = computed(() => ({
    width: addUnit(numericSize.value * 1.8, 'rpx'),
    height: addUnit(resolvedSize.value, 'rpx'),
    padding: addUnit(props.space, 'rpx'),
    backgroundColor: checked.value ? props.activeColor : props.inactiveColor
}));
const thumbStyle = computed(() => ({
    width: addUnit(numericSize.value - numericSpace.value * 2, 'rpx'),
    height: addUnit(numericSize.value - numericSpace.value * 2, 'rpx'),
    transform: checked.value ? `translateX(${addUnit(numericSize.value * 0.8, 'rpx')})` : 'translateX(0)'
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
<template>
    <view
        class="snake-switch"
        :class="[customClass, { 'is-disabled': disabled || loading }]"
        :style="[$snakeThemeStyle, trackStyle, customStyle]"
        role="switch"
        :aria-checked="checked"
        @click="toggle"
        ><view class="snake-switch__thumb" :style="thumbStyle"
            ><snake-loading-icon
                v-if="loading"
                :size="numericSize * 0.55"
                :color="checked ? activeColor : '#909399'" /></view
    ></view>
</template>
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
.snake-switch__thumb {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2rpx 8rpx rgba(15, 30, 24, 0.18);
    transition: transform 0.2s;
}
</style>
