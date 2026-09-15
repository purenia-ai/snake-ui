<template>
    <view class="snake-input" :class="[customClass, rootClass]" :style="rootStyle" @click="emit('click', $event)">
        <slot name="prefix"><snake-icon v-if="prefixIcon" :name="prefixIcon" class="snake-input__icon" /></slot>
        <input
            class="snake-input__native"
            :value="innerValue"
            :type="type === 'password' ? 'text' : type"
            :password="actualPassword"
            :placeholder="placeholder"
            :placeholder-style="`color:${placeholderColor};${placeholderStyle}`"
            :maxlength="maxlength"
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
            :style="inputStyle"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @confirm="confirm"
            @keyboardheightchange="emit('keyboardheightchange', $event)"
            @compositionstart="composing = true"
            @compositionend="onCompositionEnd"
        />
        <snake-icon v-if="showClear" name="close-circle-fill" class="snake-input__action" @click="clear" />
        <snake-icon
            v-if="showPassword && (type === 'password' || password)"
            :name="passwordVisible ? 'eye' : 'eye-off'"
            class="snake-input__action"
            @click="passwordVisible = !passwordVisible"
        />
        <slot name="suffix"><snake-icon v-if="suffixIcon" :name="suffixIcon" class="snake-input__icon" /></slot>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Input
 * @description 基于 uni-app input，支持清空、密码显示、格式化、前后插槽和 Form 校验联动。
 * @see /components/input
 */

import { computed, inject, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { formItemKey } from '../snake-form-item/types';
import Icon from '../snake-icon/snake-icon.vue';
import type { InputEmits, InputProps } from './types';

defineOptions({ name: 'SnakeInput', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<InputProps>(), {
    modelValue: '',
    type: 'text',
    password: false,
    placeholder: '请输入内容',
    placeholderStyle: '',
    maxlength: 140,
    clearable: false,
    showPassword: false,
    prefixIcon: '',
    suffixIcon: '',
    border: 'none',
    shape: 'square',
    color: 'var(--snake-color-text,#303133)',
    placeholderColor: 'var(--snake-color-text-light,#c0c4cc)',
    disabled: false,
    readonly: false,
    disabledColor: 'var(--snake-color-disabled-bg,#f5f7fa)',
    fontSize: 28,
    inputAlign: 'left',
    formatTrigger: 'input',
    trim: false,
    focus: false,
    cursor: -1,
    selectionStart: -1,
    selectionEnd: -1,
    confirmType: 'done',
    confirmHold: false,
    adjustPosition: true,
    holdKeyboard: false,
    cursorSpacing: 0,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<InputEmits>();
const formItem = inject(formItemKey, null);
const focused = ref(false);
const composing = ref(false);
const passwordVisible = ref(false);
const innerValue = ref(String(props.modelValue ?? ''));
watch(
    () => props.modelValue,
    value => {
        const next = String(value ?? '');
        if (next !== innerValue.value) innerValue.value = next;
    }
);
const size = computed(() => props.size || formItem?.size.value || 'default');
const actualPassword = computed(() => (props.type === 'password' || props.password) && !passwordVisible.value);
const showClear = computed(
    () => props.clearable && !props.disabled && !props.readonly && focused.value && innerValue.value.length > 0
);
const rootClass = computed(() => [
    `snake-input--${props.border}`,
    `snake-input--${props.shape}`,
    `snake-input--${size.value}`,
    { 'is-focused': focused.value, 'is-error': Boolean(formItem?.errorVisible.value), 'is-disabled': props.disabled }
]);
const rootStyle = computed(() => [
    { backgroundColor: props.disabled ? props.disabledColor : undefined },
    props.customStyle
]);
const inputStyle = computed(() => ({
    color: props.color,
    fontSize: addUnit(props.fontSize, 'rpx'),
    textAlign: props.inputAlign
}));
function format(value: string, trigger: 'input' | 'blur') {
    let next = props.trim && trigger === 'blur' ? value.trim() : value;
    if (props.formatter && props.formatTrigger === trigger) next = props.formatter(next);
    return next;
}
function commit(value: string, trigger: 'input' | 'blur') {
    const next = format(value, trigger);
    innerValue.value = next;
    emit('update:modelValue', next);
    emit('input', next);
    return next;
}
function onInput(event: any) {
    const value = String(event.detail?.value ?? '');
    if (composing.value) {
        innerValue.value = value;
        return;
    }
    commit(value, 'input');
    void formItem?.notify('change');
}
function onCompositionEnd(event: any) {
    composing.value = false;
    commit(String(event.detail?.value ?? innerValue.value), 'input');
    void formItem?.notify('change');
}
function onFocus(event: unknown) {
    focused.value = true;
    emit('focus', event);
}
function onBlur(event: any) {
    focused.value = false;
    const next = commit(String(event.detail?.value ?? innerValue.value), 'blur');
    emit('change', next);
    emit('blur', event);
    void formItem?.notify('blur');
}
function clear(event: any) {
    event?.stopPropagation?.();
    innerValue.value = '';
    emit('update:modelValue', '');
    emit('input', '');
    emit('change', '');
    emit('clear');
    void formItem?.notify('change');
}
function confirm(event: any) {
    emit('confirm', String(event.detail?.value ?? innerValue.value), event);
}
</script>

<style scoped>
.snake-input {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    align-items: center;
    gap: 12rpx;
    transition:
        border-color 0.2s,
        background-color 0.2s;
}
.snake-input--surround {
    min-height: 80rpx;
    padding: 0 22rpx;
    border: 1px solid var(--snake-color-divider, #dcdfe6);
}
.snake-input--bottom {
    min-height: 76rpx;
    border-bottom: 1px solid var(--snake-color-divider, #dcdfe6);
}
.snake-input--circle {
    border-radius: 999px;
}
.snake-input--square {
    border-radius: var(--snake-radius-md, 12rpx);
}
.snake-input--small {
    min-height: 64rpx;
}
.snake-input--large {
    min-height: 92rpx;
}
.snake-input.is-focused {
    border-color: var(--snake-color-primary, #06d290);
}
.snake-input.is-error {
    border-color: var(--snake-color-error, #fa3534);
}
.snake-input.is-disabled {
    opacity: 0.72;
}
.snake-input__native {
    flex: 1;
    min-width: 0;
    height: 100%;
}
.snake-input__icon,
.snake-input__action {
    flex: none;
    color: var(--snake-color-text-muted, #909399);
}
</style>
