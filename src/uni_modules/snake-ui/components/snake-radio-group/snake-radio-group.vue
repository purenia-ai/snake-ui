<script setup lang="ts">
/**
 * @component RadioGroup
 * @description radio 父组件，管理一组 Radio 的互斥值、禁用状态与布局。
 * @see /components/radio
 */

import { inject } from 'vue';
import { useChildren } from '../../libs/hooks';
import { RADIO_GROUP_KEY } from './types';
import { formItemKey } from '../snake-form-item/types';
import type { RadioGroupEmits, RadioGroupProps } from './types';

defineOptions({
    name: 'RadioGroup',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<RadioGroupProps>(), {
    customStyle: '',
    customClass: '',
    disabled: false,
    modelValue: '',
    activeColor: 'var(--snake-color-primary, #06D290)',
    size: '',
    labelDisabled: false,
    shape: 'circle',
    iconSize: '',
    width: 'auto',
    wrap: false
});

const emit = defineEmits<RadioGroupEmits>();
const formItem = inject(formItemKey, null);

// 收集子 radio 并注册父组件上下文（linkChildren 的调用在 setValue 定义之后）
const { linkChildren } = useChildren(RADIO_GROUP_KEY);

/**
 * 父组件数据，供子组件使用
 */
function getData() {
    return {
        iconSize: props.iconSize,
        labelDisabled: props.labelDisabled,
        disabled: props.disabled,
        shape: props.shape,
        activeColor: props.activeColor,
        size: props.size,
        width: props.width,
        wrap: props.wrap,
        value: props.modelValue
    };
}

/**
 * 设置选中值
 * @param val 选中的 radio 的 name 值
 */
function setValue(val: string | number) {
    // 通过 emit 事件，设置父组件通过 v-model 双向绑定的值
    emit('update:modelValue', val);
    emit('change', val);
    // 通知 snake-form-item 进行校验
    void formItem?.notify('change');
}

// 向子 radio 提供上下文：props（含 modelValue）实时联动 + 选中值入口
linkChildren({ props, setValue });

defineExpose({ props, getData, setValue });
</script>
<template>
    <view class="snake-radio-group snake-radio-group--clearfix" :style="customStyle" :class="customClass">
        <slot />
    </view>
</template>
<style scoped>
.snake-radio-group {
    /* #ifndef MP || APP-NVUE */
    display: inline-flex;
    flex-wrap: wrap;
    /* #endif */
}
/* MP 下子项以 float 布局时，容器需要清除浮动 */
.snake-radio-group--clearfix::after {
    content: '';
    display: block;
    overflow: hidden;
    clear: both;
}
</style>
