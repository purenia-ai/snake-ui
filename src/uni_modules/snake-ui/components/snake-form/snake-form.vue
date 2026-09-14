<script setup lang="ts">
/**
 * @component Form
 * @description 管理表单数据、校验规则与字段实例。
 * @see /components/form
 */

import { computed, provide, ref, toRef } from 'vue';
import { toast } from '../../libs/function/toast';
import { formKey } from './types';
import type { FormCallback, FormError, FormProps, FormRules } from './types';

defineOptions({ name: 'SnakeForm', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<FormProps>(), {
    model: () => ({}),
    rules: () => ({}),
    errorType: () => ['message', 'toast'],
    borderBottom: true,
    labelPosition: 'left',
    labelWidth: 90,
    labelAlign: 'left',
    labelStyle: () => ({}),
    size: 'default',
    customClass: '',
    customStyle: ''
});

interface FormField {
    prop: string;
    validation(trigger?: string, callback?: (message: string) => void): void;
    resetField(): void;
}

const fields = ref<FormField[]>([]);
const rules = ref<FormRules>(props.rules);
const model = computed(() => props.model);

function setRules(newRules: FormRules) {
    rules.value = newRules;
}

function addField(field: FormField) {
    if (!fields.value.includes(field)) fields.value.push(field);
}

function removeField(field: Pick<FormField, 'prop'>) {
    fields.value = fields.value.filter(item => item.prop !== field.prop);
}

function resetFields() {
    fields.value.forEach(field => field.resetField?.());
}

function runValidation(targetFields: FormField[], callback?: FormCallback, showToast = false): Promise<boolean> {
    return new Promise(resolve => {
        let valid = true;
        let count = 0;
        const errors: FormError[] = [];
        if (targetFields.length === 0) {
            resolve(true);
            callback?.(true, []);
            return;
        }
        targetFields.forEach(field => {
            field.validation('', message => {
                if (message) {
                    valid = false;
                    errors.push({ prop: field.prop, message });
                }
                if (++count !== targetFields.length) return;
                resolve(valid);
                if (showToast && !props.errorType.includes('none') && props.errorType.includes('toast') && errors.length > 0) {
                    toast(errors[0].message);
                }
                callback?.(valid, errors);
            });
        });
    });
}

function validate(callback?: FormCallback): Promise<boolean> {
    return runValidation(fields.value, callback, true);
}

function validateField(prop: string | string[], callback?: FormCallback): Promise<boolean> {
    const names = Array.isArray(prop) ? prop : [prop];
    return runValidation(
        fields.value.filter(field => names.includes(field.prop)),
        callback
    );
}

// Snake 输入控件通过注入读取表单尺寸和错误配置；字段生命周期由公开方法驱动。
provide(formKey, {
    model: toRef(props, 'model'),
    rules,
    size: toRef(props, 'size'),
    errorType: toRef(props, 'errorType'),
    borderBottom: toRef(props, 'borderBottom'),
    labelPosition: toRef(props, 'labelPosition'),
    labelWidth: toRef(props, 'labelWidth'),
    labelAlign: toRef(props, 'labelAlign'),
    labelStyle: toRef(props, 'labelStyle'),
    register: field => addField(field as unknown as FormField),
    unregister: field => removeField(field)
});

defineExpose({ setRules, resetFields, validate, validateField, addField, removeField, fields, rules, props, model });
</script>

<template>
    <view class="snake-form" :class="customClass" :style="customStyle"><slot /></view>
</template>

<style scoped>
.snake-form {
    width: 100%;
}
</style>
