<script setup lang="ts">
/**
 * @component CheckboxGroup
 * @description checkbox 父组件，管理一组 Checkbox 的数组值、最大选择数与布局。
 * @see /components/checkbox
 */

import { computed, inject } from 'vue';
import { useChildren } from '../../libs/hooks';
import { formItemKey } from '../snake-form-item/types';
import {
    CHECKBOX_GROUP_KEY,
    type CheckboxGroupContext,
    type CheckboxGroupEmits,
    type CheckboxGroupProps
} from './types';

/** Checkbox 子项在公开代理上的形态（defineExpose 暴露的 ref 已被解包）。 */
interface CheckboxChild {
    isChecked: boolean;
    isDisabled: boolean;
    value: string | number;
}

defineOptions({
    name: 'CheckboxGroup',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<CheckboxGroupProps>(), {
    customStyle: '',
    customClass: '',
    max: 999,
    disabled: false,
    name: '',
    labelDisabled: false,
    shape: 'square',
    activeColor: 'var(--snake-color-primary, #06D290)',
    size: '',
    width: 'auto',
    wrap: false,
    iconSize: ''
});

const emit = defineEmits<CheckboxGroupEmits>();
const formItem = inject(formItemKey, null);

// 使用组件关系 hooks 收集子 checkbox（自动注册 / 按 vnode 序排列），
// 选中态以 modelValue 为单一数据源，子项仅派生展示
const { children, linkChildren } = useChildren<CheckboxChild, CheckboxGroupContext>(CHECKBOX_GROUP_KEY);

const selectedValues = computed<(string | number)[]>(() => props.modelValue ?? []);

/**
 * 子项点击入口：在 modelValue 上增删自身值，统一做 max 校验与事件派发
 */
function toggleSelect(value: string | number) {
    if (props.disabled) return;
    let next: (string | number)[];
    if (selectedValues.value.includes(value)) {
        next = selectedValues.value.filter(item => item !== value);
    } else {
        if (props.max && selectedValues.value.length >= props.max) {
            uni.showToast({ title: `超过最大选择数量: ${props.max}`, icon: 'none' });
            return;
        }
        next = [...selectedValues.value, value];
    }
    emit('update:modelValue', next);
    emit('change', next);
    // 通知 snake-form-item 进行校验
    void formItem?.notify('change');
}

/**
 * 全选/全不选方法（禁用子项保持原状态）
 */
function setAllChecked(checked: boolean) {
    if (props.disabled) {
        console.warn('snake-checkbox-group 已禁用，无法操作');
        return;
    }
    const enabledValues = children.filter(child => !child.isDisabled).map(child => child.value);
    const next = checked ? enabledValues : selectedValues.value.filter(value => !enabledValues.includes(value));
    emit('update:modelValue', next);
    emit('change', next);
    void formItem?.notify('change');
}

/**
 * 获取选中的值
 */
function getSelectedValues() {
    return [...selectedValues.value];
}

/**
 * 验证选择是否超过最大数量
 */
function validateSelection() {
    if (props.max && selectedValues.value.length >= props.max) {
        uni.showToast({ title: `超过最大选择数量: ${props.max}`, icon: 'none' });
        return false;
    }
    return true;
}

// 向子 checkbox 提供上下文（props 实时联动 + 选中值增删入口）
linkChildren({ props, toggleSelect });

// 使用 defineExpose 暴露给外部
defineExpose({
    // props
    props,

    // 方法
    setAllChecked,
    getSelectedValues,
    validateSelection,

    // 计算属性
    selectedCount: computed(() => selectedValues.value.length),
    isFull: computed(() => Boolean(props.max) && selectedValues.value.length >= props.max),
    isEmpty: computed(() => selectedValues.value.length === 0),
    // 工具方法
    getChildrenCount: () => children.length
});
</script>
<template>
    <view class="snake-checkbox-group snake-checkbox-group--clearfix" :style="customStyle" :class="customClass"
        ><slot
    /></view>
</template>
<style scoped>
.snake-checkbox-group {
    /* #ifndef MP || APP-NVUE */
    display: inline-flex;
    flex-wrap: wrap;
    /* #endif */
}
/* MP 下子项以 float 布局时，容器需要清除浮动 */
.snake-checkbox-group--clearfix::after {
    content: '';
    display: block;
    overflow: hidden;
    clear: both;
}
</style>
