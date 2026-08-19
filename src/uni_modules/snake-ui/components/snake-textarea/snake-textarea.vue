<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { addUnit } from '../../libs';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import type { SnakeTextareaEmits, SnakeTextareaProps } from './types';

defineOptions({ name: 'SnakeTextarea', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeTextareaProps>(), {
    modelValue: '',
    placeholder: '请输入内容',
    placeholderStyle: '',
    maxlength: 140,
    height: 120,
    autoHeight: false,
    fixed: false,
    count: false,
    disabled: false,
    readonly: false,
    border: 'surround',
    color: 'var(--snake-color-text,#303133)',
    placeholderColor: 'var(--snake-color-text-light,#c0c4cc)',
    fontSize: 14,
    focus: false,
    cursor: -1,
    selectionStart: -1,
    selectionEnd: -1,
    confirmType: 'return',
    confirmHold: false,
    adjustPosition: true,
    holdKeyboard: false,
    cursorSpacing: 0,
    showConfirmBar: true,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeTextareaEmits>();
const formItem = inject(snakeFormItemKey, null);
const innerValue = ref(String(props.modelValue ?? ''));
const focused = ref(false);
watch(
    () => props.modelValue,
    value => {
        const next = String(value ?? '');
        if (next !== innerValue.value) innerValue.value = next;
    }
);
const size = computed(() => props.size || formItem?.size.value || 'default');
const rootClass = computed(() => [
    `snake-textarea--${props.border}`,
    `snake-textarea--${size.value}`,
    { 'is-focused': focused.value, 'is-error': Boolean(formItem?.errorVisible.value), 'is-disabled': props.disabled }
]);
const rootStyle = computed(() => [
    { height: props.autoHeight ? 'auto' : addUnit(props.height, 'rpx') },
    props.customStyle
]);
function update(value: string) {
    innerValue.value = value;
    emit('update:modelValue', value);
    emit('input', value);
}
function onInput(event: any) {
    update(String(event.detail?.value ?? ''));
    void formItem?.notify('change');
}
function onBlur(event: any) {
    focused.value = false;
    const value = String(event.detail?.value ?? innerValue.value);
    update(value);
    emit('change', value);
    emit('blur', event);
    void formItem?.notify('blur');
}
</script>

<template>
    <view class="snake-textarea" :class="[customClass, rootClass]" :style="[$snakeThemeStyle, rootStyle]">
        <textarea
            class="snake-textarea__native"
            :value="innerValue"
            :placeholder="placeholder"
            :placeholder-style="`color:${placeholderColor};${placeholderStyle}`"
            :maxlength="maxlength"
            :auto-height="autoHeight"
            :fixed="fixed"
            :disabled="disabled || readonly"
            :focus="focus"
            :cursor="cursor"
            :selection-start="selectionStart"
            :selection-end="selectionEnd"
            :confirm-type="confirmType as any"
            :confirm-hold="confirmHold"
            :adjust-position="adjustPosition"
            :hold-keyboard="holdKeyboard"
            :cursor-spacing="cursorSpacing"
            :show-confirm-bar="showConfirmBar"
            :style="{ color, fontSize: addUnit(fontSize, 'rpx') }"
            @input="onInput"
            @focus="
                focused = true;
                emit('focus', $event);
            "
            @blur="onBlur"
            @confirm="emit('confirm', String($event.detail?.value ?? innerValue), $event)"
            @linechange="emit('linechange', $event)"
            @keyboardheightchange="emit('keyboardheightchange', $event)"
        />
        <text v-if="count && maxlength > 0" class="snake-textarea__count">{{ innerValue.length }}/{{ maxlength }}</text>
    </view>
</template>

<style scoped>
.snake-textarea {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-height: 160rpx;
    padding: 20rpx 22rpx 42rpx;
    border-radius: var(--snake-radius-md, 12rpx);
    transition: border-color 0.2s;
}
.snake-textarea--surround {
    border: 1px solid var(--snake-color-divider, #dcdfe6);
}
.snake-textarea--bottom {
    border-bottom: 1px solid var(--snake-color-divider, #dcdfe6);
    border-radius: 0;
}
.snake-textarea.is-focused {
    border-color: var(--snake-color-primary, #06D290);
}
.snake-textarea.is-error {
    border-color: var(--snake-color-error, #ef4444);
}
.snake-textarea.is-disabled {
    background: var(--snake-color-disabled-bg, #f5f7fa);
    opacity: 0.72;
}
.snake-textarea__native {
    width: 100%;
    height: 100%;
    min-height: 120rpx;
    line-height: 1.55;
}
.snake-textarea__count {
    position: absolute;
    right: 18rpx;
    bottom: 12rpx;
    color: var(--snake-color-text-muted, #909399);
    font-size: 22rpx;
}
</style>
