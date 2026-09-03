<script setup lang="ts">
/**
 * @component SnakeForm
 * @description 管理表单模型、字段规则、错误状态、提交校验和重置。与 `FormItem` 及 Snake UI 输入控件组合使用。
 * @see /components/form
 */

import { computed, provide, ref, toRef, watch } from 'vue';
import { snakeFormKey, type SnakeFormField } from '../../libs/internal/form';
import type { SnakeFormEmits, SnakeFormExpose, SnakeFormProps, SnakeFormCallback } from './types';

defineOptions({ name: 'SnakeForm', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SnakeFormProps>(), {
    model: () => ({}),
    rules: () => ({}),
    errorType: () => ['message'],
    borderBottom: true,
    labelPosition: 'left',
    labelWidth: 160,
    labelAlign: 'left',
    labelStyle: '',
    size: 'default',
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SnakeFormEmits>();
const fields: SnakeFormField[] = [];
const rulesState = ref(props.rules);
const normalizedErrorType = computed(() => (Array.isArray(props.errorType) ? props.errorType : [props.errorType]));
watch(
    () => props.rules,
    value => {
        rulesState.value = value || {};
    },
    { deep: true }
);

function register(field: SnakeFormField) {
    if (!fields.includes(field)) fields.push(field);
}
function unregister(field: SnakeFormField) {
    const index = fields.indexOf(field);
    if (index >= 0) fields.splice(index, 1);
}
function selectFields(names?: string | string[]) {
    if (names == null) return [...fields];
    const list = Array.isArray(names) ? names : [names];
    return fields.filter(field => list.includes(field.prop));
}
async function collect(names?: string | string[]) {
    return (await Promise.all(selectFields(names).map(field => field.validate()))).flat();
}

/**
 * 校验全部字段并同时兼容 Promise 与回调两种调用方式。
 * 校验失败时拒绝 Promise，使调用方可以用 try/catch 阻止后续提交。
 */
async function validate(callback?: SnakeFormCallback): Promise<Record<string, unknown>> {
    const errors = await collect();
    const valid = errors.length === 0;
    callback?.(valid, errors);
    emit('validate', valid, errors);
    if (!valid) return Promise.reject(errors);
    return props.model;
}

/** 仅校验指定字段；结果仍通过统一的 validate 事件上报。 */
async function validateField(names: string | string[], callback?: SnakeFormCallback): Promise<void> {
    const errors = await collect(names);
    const valid = errors.length === 0;
    callback?.(valid, errors);
    emit('validate', valid, errors);
    if (!valid) return Promise.reject(errors);
}
function resetFields(names?: string | string[]) {
    selectFields(names).forEach(field => field.reset());
}
function clearValidate(names?: string | string[]) {
    selectFields(names).forEach(field => field.clear());
}
function setRules(rules: SnakeFormProps['rules']) {
    rulesState.value = rules || {};
}

provide(snakeFormKey, {
    model: toRef(props, 'model'),
    rules: rulesState,
    size: toRef(props, 'size'),
    errorType: normalizedErrorType,
    borderBottom: toRef(props, 'borderBottom'),
    labelPosition: toRef(props, 'labelPosition'),
    labelWidth: toRef(props, 'labelWidth'),
    labelAlign: toRef(props, 'labelAlign'),
    labelStyle: toRef(props, 'labelStyle'),
    register,
    unregister
});
defineExpose<SnakeFormExpose>({ validate, validateField, resetFields, clearValidate, setRules });
</script>

<template>
    <view class="snake-form" :class="customClass" :style="customStyle"><slot /></view>
</template>

<style scoped>
.snake-form {
    width: 100%;
}
</style>
