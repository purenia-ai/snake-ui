<template>
    <view
        class="snake-checkbox-group snake-checkbox-group--clearfix"
        :class="[customClass, { 'is-disabled': elDisabled }]"
        :style="customStyle"
        role="group"
        :aria-disabled="elDisabled"
    >
        <slot />
    </view>
</template>
<script setup lang="ts">
/**
 * @component CheckboxGroup
 * @description checkbox 父组件，管理一组 Checkbox 的数组值、选择数量上下限与布局。
 * @see /components/checkbox
 */

import { computed, inject } from 'vue';
import { useChildren, useLocale } from '../../libs/hooks';
import { formItemKey } from '../snake-form-item/types';
import {
    CHECKBOX_GROUP_KEY,
    type CheckboxGroupContext,
    type CheckboxGroupEmits,
    type CheckboxGroupExpose,
    type CheckboxGroupProps,
    type CheckboxToggleAllOptions
} from './types';

/** Checkbox 子项在公开代理上的形态（defineExpose 暴露的 ref 已被解包）。 */
interface CheckboxChild {
    isChecked: boolean;
    isDisabled: boolean;
    isLocked: boolean;
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
    min: 0,
    disabled: false,
    labelDisabled: false,
    shape: 'square',
    placement: 'left',
    activeColor: 'var(--snake-color-primary, #06D290)',
    inactiveColor: '',
    size: '',
    width: 'auto',
    wrap: false,
    iconSize: '',
    labelSize: '',
    labelColor: '',
    border: false,
    maxText: '',
    minText: ''
});

const emit = defineEmits<CheckboxGroupEmits>();
const formItem = inject(formItemKey, null);
const { t } = useLocale('checkbox');
/** 合并 FormItem / Form 下发的禁用态，子项统一读取这个值。 */
const elDisabled = computed(() => props.disabled || formItem?.disabled.value || false);

// 使用组件关系 hooks 收集子 checkbox（自动注册 / 按 vnode 序排列），
// 选中态以 modelValue 为单一数据源，子项仅派生展示
const { children, linkChildren } = useChildren<CheckboxChild, CheckboxGroupContext>(CHECKBOX_GROUP_KEY);

const selectedValues = computed<(string | number)[]>(() => props.modelValue ?? []);

/** 数量上下限提示：优先用 props 覆盖文案，否则取语言包并替换 {n}。 */
function notifyLimit(kind: 'min' | 'max') {
    const limit = kind === 'max' ? props.max : props.min;
    const template = kind === 'max' ? props.maxText : props.minText;
    const fallbackKey = kind === 'max' ? 'maxText' : 'minText';
    const message = template ? template.replace('{n}', String(limit)) : t(fallbackKey, { n: limit });
    uni.showToast({ title: message, icon: 'none' });
}

/** 提交新值：v-model → change → 通知 form-item 校验，并返回提交的数组。 */
function commit(next: (string | number)[]) {
    emit('update:modelValue', next);
    emit('change', next);
    // 通知 snake-form-item 进行校验
    void formItem?.notify('change');
    return next;
}

/**
 * 子项点击入口：在 modelValue 上增删自身值，统一做 min/max 校验与事件派发
 */
function toggleSelect(value: string | number) {
    if (elDisabled.value) return;
    const selected = selectedValues.value;
    if (selected.includes(value)) {
        if (props.min && selected.length <= props.min) {
            notifyLimit('min');
            return;
        }
        commit(selected.filter(item => item !== value));
        return;
    }
    if (props.max && selected.length >= props.max) {
        notifyLimit('max');
        return;
    }
    commit([...selected, value]);
}

/**
 * 批量切换：不传参数时逐个取反，也可指定目标状态；结果始终受 min / max 约束
 */
function toggleAll(options?: boolean | CheckboxToggleAllOptions) {
    const config: CheckboxToggleAllOptions = typeof options === 'boolean' ? { checked: options } : (options ?? {});
    if (elDisabled.value) return [...selectedValues.value];

    const selected = selectedValues.value;
    const childValues = children.map(child => child.value);
    const targets = children.filter(child => !child.isDisabled).map(child => child.value);
    const wanted = (value: string | number) => {
        if (!targets.includes(value)) return selected.includes(value);
        return config.checked === undefined ? !selected.includes(value) : config.checked;
    };

    // 按子项顺序产出，未注册到本组的残留值排在后面保持原状
    const ordered = [...childValues, ...selected.filter(value => !childValues.includes(value))];
    let next = ordered.filter(value => wanted(value));

    // 已达 min 时保留原选中项，避免批量取消把数量压到下限以下
    if (props.min && next.length < props.min) {
        const restored = selected.filter(value => !next.includes(value)).slice(0, props.min - next.length);
        next = [...next, ...restored];
    }
    // 达到 max 时截断，优先保留不参与本次批量操作的值
    if (props.max && next.length > props.max) {
        const fixed = next.filter(value => !targets.includes(value));
        const candidates = next.filter(value => targets.includes(value));
        next = [...fixed, ...candidates.slice(0, Math.max(props.max - fixed.length, 0))];
    }
    return commit(next);
}

/**
 * 全选/全不选方法（禁用子项保持原状态）
 */
function setAllChecked(checked: boolean) {
    return toggleAll(checked);
}

/**
 * 获取选中的值
 */
function getSelectedValues() {
    return [...selectedValues.value];
}

/**
 * 当前是否还能继续选择：未被禁用且未达 max
 */
function validateSelection() {
    return !elDisabled.value && !(Boolean(props.max) && selectedValues.value.length >= Number(props.max));
}

// 向子 checkbox 提供上下文（props 实时联动 + 合并后的禁用态 + 选中值增删入口）
linkChildren({ props, disabled: elDisabled, toggleSelect });

// 使用 defineExpose 暴露给外部（公开代理上的 ref 会被 Vue 自动解包）
const exposed = {
    props,
    setAllChecked,
    toggleAll,
    getSelectedValues,
    validateSelection,
    selectedCount: computed(() => selectedValues.value.length),
    isFull: computed(() => Boolean(props.max) && selectedValues.value.length >= Number(props.max)),
    isEmpty: computed(() => selectedValues.value.length === 0),
    isMinReached: computed(() => Boolean(props.min) && selectedValues.value.length <= Number(props.min)),
    getChildrenCount: () => children.length
} as unknown as CheckboxGroupExpose;

defineExpose(exposed);
</script>
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
