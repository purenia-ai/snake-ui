<script setup lang="ts">
/**
 * @component SnakeRadioGroup
 * @description radio 父组件，管理一组 Radio 的互斥值、禁用状态与布局。
 * @see /components/radio
 */

import { inject } from 'vue';
import { useParent } from '../../libs/hooks';
import { snakeFormItemKey } from '../../libs/internal/form-item';
import type { SnakeRadioGroupEmits, SnakeRadioGroupProps } from './types';

defineOptions({
    name: 'SnakeRadioGroup',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<SnakeRadioGroupProps>(), {
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

const emit = defineEmits<SnakeRadioGroupEmits>();
const formItem = inject(snakeFormItemKey, null);

// 注册父组件上下文，供子组件 useChildren 链接
useParent('SnakeRadioGroup');

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

defineExpose({ props, getData, setValue });
</script>
<template>
    <view class="snake-radio-group snake-radio-group--clearfix" :style="customStyle" :class="customClass"><slot /></view>
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
