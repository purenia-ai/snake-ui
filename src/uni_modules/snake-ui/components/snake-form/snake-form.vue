<template>
    <view class="snake-form" :class="customClass" :style="customStyle"><slot /></view>
</template>

<script setup lang="ts">
/**
 * @component Form
 * @description 管理表单数据、校验规则与字段实例。
 * @see /components/form
 */

import { computed, provide, ref, toRef } from 'vue';
import { toast } from '../../libs/function/toast';
import { formKey, normalizeValidateTriggers } from './types';
import type { FormCallback, FormError, FormField, FormProps, FormRules, FormValidateTrigger } from './types';

defineOptions({ name: 'SnakeForm', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<FormProps>(), {
    model: () => ({}),
    rules: () => ({}),
    errorType: () => ['message', 'toast'],
    borderBottom: true,
    labelPosition: 'left',
    labelWidth: 45,
    labelAlign: 'left',
    labelStyle: () => ({}),
    asteriskPosition: 'start',
    hideAsterisk: false,
    size: 'default',
    disabled: false,
    validateTrigger: () => ['change', 'blur'],
    customClass: '',
    customStyle: ''
});

const fields = ref<FormField[]>([]);
const rules = ref<FormRules>(props.rules);
const model = computed(() => props.model);
/** 触发时机归一化为数组，字符串与数组两种写法都能用。 */
const validateTrigger = computed<FormValidateTrigger[]>(() => normalizeValidateTriggers(props.validateTrigger));

function setRules(newRules: FormRules) {
    rules.value = newRules;
}

function addField(field: FormField) {
    if (fields.value.includes(field)) return;
    fields.value.push(field);
}

/**
 * 注销字段：按实例引用移除。
 * 旧实现按 prop 过滤，会让同名字段（比如 v-for 里的临时项）互相误删。
 */
function removeField(field: FormField) {
    fields.value = fields.value.filter(item => item !== field);
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
                if (
                    showToast &&
                    !props.errorType.includes('none') &&
                    props.errorType.includes('toast') &&
                    errors.length > 0
                ) {
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

// Snake 输入控件通过注入读取表单尺寸、禁用态和错误配置；字段生命周期由公开方法驱动。
provide(formKey, {
    model: toRef(props, 'model'),
    rules,
    size: toRef(props, 'size'),
    disabled: toRef(props, 'disabled'),
    validateTrigger,
    errorType: toRef(props, 'errorType'),
    borderBottom: toRef(props, 'borderBottom'),
    labelPosition: toRef(props, 'labelPosition'),
    labelWidth: toRef(props, 'labelWidth'),
    labelAlign: toRef(props, 'labelAlign'),
    labelStyle: toRef(props, 'labelStyle'),
    asteriskPosition: toRef(props, 'asteriskPosition'),
    hideAsterisk: toRef(props, 'hideAsterisk'),
    register: field => addField(field),
    unregister: field => removeField(field)
});

defineExpose({ setRules, resetFields, validate, validateField, addField, removeField, fields, rules, props, model });
</script>

<style scoped>
.snake-form {
    width: 100%;
}
</style>
