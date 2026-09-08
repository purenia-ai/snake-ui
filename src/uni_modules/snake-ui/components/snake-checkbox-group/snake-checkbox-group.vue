<script setup lang="ts">
/**
 * @component SnakeCheckboxGroup
 * @description checkbox 父组件，管理一组 Checkbox 的数组值、最大选择数与布局。
 * @see /components/checkbox
 */

import { computed, inject, nextTick, onMounted, watch } from 'vue';
import { useDebounce, useParent } from '../../libs/hooks';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import type { SnakeCheckboxGroupEmits, SnakeCheckboxGroupProps } from './types';

defineOptions({
    name: 'SnakeCheckboxGroup',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<SnakeCheckboxGroupProps>(), {
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

const emit = defineEmits<SnakeCheckboxGroupEmits>();
const formItem = inject(snakeFormItemKey, null);

// 使用父组件 Hook
const { children, broadcast } = useParent('SnakeCheckboxGroup');

/**
 * 根据 modelValue 设置子组件状态
 */
function syncChildrenSelection() {
    if (!children || children.length === 0 || !props.modelValue) return;
    const modelValueSet = new Set(props.modelValue);
    children.forEach(child => {
        const exposed = child.getExposed?.();
        const childValue = exposed?.value;
        const shouldBeChecked = modelValueSet.has(childValue);
        const isCurrentlyChecked = exposed?.isChecked.value;

        if (shouldBeChecked !== isCurrentlyChecked) {
            exposed?.setChecked({ checked: shouldBeChecked });
        }
    });
}

/**
 * 监听 modelValue 变化，同步子组件状态
 */
watch(
    () => props.modelValue,
    () => {
        syncChildrenSelection();
    }
);

/**
 * 派发 change 事件和表单校验
 */
function collectAndEmit() {
    // 收集所有选中的 name
    const values: (string | number)[] = [];
    children.forEach(child => {
        const exposed = child.getExposed?.();
        if (exposed?.isChecked.value) {
            values.push(exposed?.value);
        }
    });
    emit('change', values);
    emit('update:modelValue', values);
    // 通知 snake-form-item 进行校验
    void formItem?.notify('change');
}

// debounce 合并同一轮多个子组件的状态通知
const emitEvent = useDebounce(collectAndEmit, 1);

/**
 * 全选/全不选方法
 */
function setAllChecked(checked: boolean) {
    if (props.disabled) {
        console.warn('snake-checkbox-group 已禁用，无法操作');
        return;
    }
    broadcast('setChecked', { checked });
}

/**
 * 获取选中的值
 */
function getSelectedValues() {
    return children
        .filter(child => child.getExposed?.()?.isChecked.value)
        .map(child => child.getExposed?.()?.name)
        .filter(Boolean);
}

/**
 * 验证选择是否超过最大数量
 */
function validateSelection() {
    const selectedCount = children.filter(child => child.getExposed?.()?.isChecked.value).length;
    if (props.max && selectedCount >= props.max) {
        uni.showToast({ title: `超过最大选择数量: ${props.max}`, icon: 'none' });
        return false;
    }
    return true;
}

onMounted(() => {
    nextTick(() => {
        syncChildrenSelection();
    });
});

// 使用 defineExpose 暴露给外部
defineExpose({
    // props
    props,

    // 方法
    emitEvent,
    setAllChecked,
    getSelectedValues,
    validateSelection,
    syncChildrenSelection,

    // 计算属性
    selectedCount: computed(() => children.filter(child => child.getExposed?.()?.isChecked.value).length),
    isFull: computed(() => {
        const selectedCount = children.filter(child => child.getExposed?.()?.isChecked.value).length;
        return Boolean(props.max) && selectedCount >= props.max;
    }),
    isEmpty: computed(() => children.filter(child => child.getExposed?.()?.isChecked.value).length === 0),
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
