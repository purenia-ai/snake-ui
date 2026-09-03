<script setup lang="ts">
/**
 * @component SnakeFormItem
 * @description 连接标签、模型字段、输入控件和校验结果。推荐放在 `Form` 内，也可以作为普通布局容器使用。
 * @see /components/form-item
 */

import { computed, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { cloneFormValue, getPathValue, setPathValue, validateFormValue, type SnakeFormTrigger } from '../../libs/form';
import { snakeFormKey, type SnakeFormField } from '../../libs/internal/form';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import SnakeIcon from '../snake-icon/snake-icon.vue';
import type { SnakeFormItemExpose, SnakeFormItemProps } from './types';

defineOptions({ name: 'SnakeFormItem', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeFormItemProps>(), {
    label: '',
    prop: '',
    required: false,
    leftIcon: '',
    rightIcon: '',
    customClass: '',
    customStyle: ''
});
const form = inject(snakeFormKey);
const error = ref('');
const initialValue = ref<unknown>();
const runId = ref(0);
const size = computed(() => props.size || form?.size.value || 'default');
const rules = computed(() => form?.rules.value[props.prop] || []);
const isRequired = computed(
    () => props.required || (Array.isArray(rules.value) ? rules.value : [rules.value]).some(rule => rule?.required)
);
const labelPosition = computed(() => props.labelPosition || form?.labelPosition.value || 'left');
const labelWidth = computed(() => props.labelWidth ?? form?.labelWidth.value ?? 160);
const labelAlign = computed(() => props.labelAlign || form?.labelAlign.value || 'left');
const borderBottom = computed(() => props.borderBottom ?? form?.borderBottom.value ?? true);
const errorTypes = computed(() => form?.errorType.value || ['message']);
const errorVisible = computed(() => Boolean(error.value) && !errorTypes.value.includes('none'));
const itemClass = computed(() => ({
    'snake-form-item--top': labelPosition.value === 'top',
    'snake-form-item--border': borderBottom.value,
    'snake-form-item--error-border':
        errorVisible.value && (errorTypes.value.includes('border') || errorTypes.value.includes('border-bottom'))
}));
const mergedLabelStyle = computed(() => [
    { width: labelPosition.value === 'left' ? addUnit(labelWidth.value, 'rpx') : '100%', textAlign: labelAlign.value },
    form?.labelStyle.value,
    props.labelStyle
]);

/**
 * 执行当前字段校验。
 * runId 用于丢弃较早完成的异步规则结果，避免旧错误覆盖用户的新输入。
 */
async function validate(trigger?: SnakeFormTrigger) {
    if (!form || !props.prop) return [];
    const current = ++runId.value;
    const errors = await validateFormValue(
        props.prop,
        getPathValue(form.model.value, props.prop),
        rules.value,
        trigger
    );
    if (current === runId.value) error.value = errors[0]?.message || '';
    return errors;
}
function clearValidate() {
    runId.value += 1;
    error.value = '';
}
function resetField() {
    if (form && props.prop) setPathValue(form.model.value, props.prop, cloneFormValue(initialValue.value));
    clearValidate();
}
async function notify(trigger: SnakeFormTrigger) {
    await validate(trigger);
}
const field: SnakeFormField = { prop: props.prop, validate, reset: resetField, clear: clearValidate };
onMounted(() => {
    if (form && props.prop) {
        initialValue.value = cloneFormValue(getPathValue(form.model.value, props.prop));
        form.register(field);
    }
});
onBeforeUnmount(() => form?.unregister(field));
provide(snakeFormItemKey, { error, errorVisible, size, notify });
defineExpose<SnakeFormItemExpose>({ validate, resetField, clearValidate });
</script>

<template>
    <view class="snake-form-item" :class="[customClass, itemClass]" :style="customStyle">
        <view v-if="label || $slots.label" class="snake-form-item__label" :style="mergedLabelStyle"
            ><text v-if="isRequired" class="snake-form-item__required">*</text
            ><snake-icon v-if="leftIcon" :name="leftIcon" class="snake-form-item__left-icon" /><slot name="label"
                ><text>{{ label }}</text></slot
            ></view
        >
        <view class="snake-form-item__body"
            ><view class="snake-form-item__content"
                ><slot name="left" /><slot /><slot name="right"
                    ><snake-icon v-if="rightIcon" :name="rightIcon" /></slot></view
            ><text
                v-if="error && errorTypes.includes('message') && !errorTypes.includes('none')"
                class="snake-form-item__error"
                >{{ error }}</text
            ></view
        >
    </view>
</template>

<style scoped>
.snake-form-item {
    display: flex;
    box-sizing: border-box;
    min-height: 96rpx;
    align-items: flex-start;
    padding: 0 24rpx;
    background: var(--snake-color-surface, #fff);
}
.snake-form-item--top {
    flex-direction: column;
    padding-top: 20rpx;
}
.snake-form-item--border {
    border-bottom: 1px solid var(--snake-color-divider, #e4e7ed);
}
.snake-form-item--error-border {
    border-color: var(--snake-color-error, #FE0832);
}
.snake-form-item__label {
    display: flex;
    flex: none;
    box-sizing: border-box;
    min-height: 96rpx;
    align-items: center;
    padding-right: 20rpx;
    color: var(--snake-color-text, #303133);
    font-size: 28rpx;
    white-space: nowrap;
}
.snake-form-item--top .snake-form-item__label {
    min-height: auto;
    padding-bottom: 12rpx;
}
.snake-form-item__required {
    margin-right: 6rpx;
    color: var(--snake-color-error, #FE0832);
}
.snake-form-item__left-icon {
    margin-right: 8rpx;
}
.snake-form-item__body {
    flex: 1;
    min-width: 0;
    padding: 18rpx 0;
}
.snake-form-item__content {
    display: flex;
    min-height: 60rpx;
    align-items: center;
}
.snake-form-item__error {
    display: block;
    padding-top: 6rpx;
    color: var(--snake-color-error, #FE0832);
    font-size: 24rpx;
    line-height: 1.4;
}
</style>
