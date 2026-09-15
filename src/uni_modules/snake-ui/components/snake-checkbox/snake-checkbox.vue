<script setup lang="ts">
/**
 * @component Checkbox
 * @description checkbox 复选框，可独立 v-model 使用，也可放入 CheckboxGroup 参与多选。
 * @see /components/checkbox
 */

import { computed, inject } from 'vue';
import { useParent } from '../../libs/hooks';
import { addUnit } from '../../libs/function/unit';
import { CHECKBOX_GROUP_KEY } from '../snake-checkbox-group/types';
import { formKey } from '../snake-form/types';
import Icon from '../snake-icon/snake-icon.vue';
import { checkboxProps } from './types';
import type { CheckboxEmits } from './types';

defineOptions({
    name: 'Checkbox',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = defineProps(checkboxProps);
const emit = defineEmits<CheckboxEmits>();
// 使用组件关系 hooks 获取父组件
const { parent: checkboxGroup } = useParent(CHECKBOX_GROUP_KEY);
const form = inject(formKey, null);

// checkbox 的数据项标识符
const checkboxValue = computed(() => props.name);

// group 绑定了 modelValue 时由 group 托管选中态（单一数据源），否则回落子项自身 v-model
const groupManaged = computed(() => checkboxGroup.value !== null && checkboxGroup.value.props.modelValue !== undefined);

// 是否选中：托管模式从 group 的 modelValue 派生，独立模式读自身 v-model
const isChecked = computed(() => {
    if (groupManaged.value) {
        return (checkboxGroup.value?.props.modelValue ?? []).includes(checkboxValue.value);
    }
    return !!props.modelValue;
});

// 根据 size 定义不同的配置
const sizeConfig = {
    small: { size: 28, fontSize: 24, iconSize: 16 },
    default: { size: 34, fontSize: 28, iconSize: 20 },
    large: { size: 40, fontSize: 32, iconSize: 24 }
};

// 获取实际使用的 size 值（优先级：props.size > snake-checkbox-group.size > snake-form.size）
const actualSize = computed(() => {
    if (props.size !== '') return String(props.size);
    if (checkboxGroup.value?.props.size) return String(checkboxGroup.value.props.size);
    if (form?.size.value) return String(form.size.value);
    return 'default';
});

// 判断实际使用的 size 是否在预设配置中
const isInSizeConfig = computed(() => actualSize.value in sizeConfig);

// 获取预设 size（用于查找 sizeConfig 配置，如图标大小、高度等）
const presetSize = computed(() => {
    return (isInSizeConfig.value ? actualSize.value : 'default') as 'small' | 'default' | 'large';
});

// 获取当前尺寸配置
const currentSizeConfig = computed(() => sizeConfig[presetSize.value]);

// 是否禁用，如果父组件 snake-checkbox-group 禁用的话，将会忽略子组件的配置
const isDisabled = computed(() => {
    return props.disabled !== '' ? props.disabled : (checkboxGroup.value?.props.disabled ?? false);
});

// 是否禁用 label 点击
const isLabelDisabled = computed(() => {
    return props.labelDisabled !== '' ? props.labelDisabled : (checkboxGroup.value?.props.labelDisabled ?? false);
});

// 组件尺寸，对应 size 的值，默认值为 34rpx
const checkboxSize = computed(() => currentSizeConfig.value.size);

// 组件的勾选图标的尺寸，默认 20rpx
const checkboxIconSize = computed(() => {
    if (props.iconSize) return props.iconSize;
    if (checkboxGroup.value?.props.iconSize) return checkboxGroup.value.props.iconSize;
    if (isInSizeConfig.value) return currentSizeConfig.value.iconSize;
    return 20;
});

// label 字体大小，默认 28rpx
const labelFontSize = computed(() => {
    if (isInSizeConfig.value) return addUnit(currentSizeConfig.value.fontSize, 'rpx');
    return props.labelSize ? addUnit(props.labelSize, 'rpx') : '';
});

// 组件选中激活时的颜色
const elActiveColor = computed(() => {
    return props.activeColor
        ? props.activeColor
        : (checkboxGroup.value?.props.activeColor ?? 'var(--snake-color-primary, #06D290)');
});

// 组件的形状
const elShape = computed(() => {
    return props.shape ? props.shape : (checkboxGroup.value?.props.shape ?? 'square');
});

// 图标样式
const iconStyle = computed(() => {
    const style: Record<string, string> = {};
    if (elActiveColor.value && isChecked.value && !isDisabled.value) {
        style.borderColor = elActiveColor.value;
        style.backgroundColor = elActiveColor.value;
    }
    style.width = addUnit(checkboxSize.value, 'rpx');
    style.height = addUnit(checkboxSize.value, 'rpx');
    return style;
});

// checkbox 内部的勾选图标，如果选中状态，为白色，否则为透明色即可
const iconColor = computed(() => {
    return isChecked.value ? '#fff' : 'transparent';
});

const iconClass = computed(() => {
    const classes: string[] = [];
    classes.push(`snake-checkbox__icon-wrap--${elShape.value}`);
    if (isChecked.value) classes.push('snake-checkbox__icon-wrap--checked');
    if (isDisabled.value) classes.push('snake-checkbox__icon-wrap--disabled');
    if (isChecked.value && isDisabled.value) classes.push('snake-checkbox__icon-wrap--disabled--checked');
    return classes.join(' ');
});

const checkboxStyle = computed(() => {
    const style: Record<string, string> = {};
    if (checkboxGroup.value?.props.width) {
        style.width = checkboxGroup.value.props.width;
        // #ifdef MP
        // 各家小程序因为它们特殊的编译结构，使用 float 布局
        style.float = 'left';
        // #endif
        // #ifndef MP
        // H5 和 APP 使用 flex 布局
        style.flex = `0 0 ${checkboxGroup.value.props.width}`;
        // #endif
    }
    if (checkboxGroup.value?.props.wrap) {
        style.width = '100%';
        // #ifndef MP
        // H5 和 APP 使用 flex 布局，将宽度设置 100%，即可自动换行
        style.flex = '0 0 100%';
        // #endif
    }
    return style;
});

/**
 * 点击 label
 */
function onClickLabel() {
    if (!isLabelDisabled.value && !isDisabled.value) {
        setValue();
    }
}

/**
 * 点击 icon
 */
function toggle() {
    if (!isDisabled.value) {
        setValue();
    }
}

/**
 * 点击切换选中态：托管模式交给 group 统一判定（max 校验与事件派发），独立模式更新自身 v-model
 */
function setValue() {
    if (groupManaged.value) {
        checkboxGroup.value?.toggleSelect(checkboxValue.value);
        return;
    }
    const next = !isChecked.value;
    emit('update:modelValue', next);
    emit('change', next);
}

defineExpose({
    isChecked,
    isDisabled,
    value: checkboxValue,
    props
});
</script>
<template>
    <view class="snake-checkbox" :style="[checkboxStyle, customStyle]" :class="customClass">
        <view class="snake-checkbox__icon-wrap" @tap="toggle" :class="iconClass" :style="iconStyle">
            <snake-icon name="checkmark" :size="checkboxIconSize" :color="iconColor" />
        </view>
        <view class="snake-checkbox__label" @tap="onClickLabel" :style="{ fontSize: labelFontSize }">
            <slot>{{ label }}</slot>
        </view>
    </view>
</template>
<style scoped>
.snake-checkbox {
    /* #ifndef APP-NVUE */
    display: inline-flex;
    /* #endif */
    align-items: center;
    overflow: hidden;
    user-select: none;
    line-height: 1.8;
}
.snake-checkbox__icon-wrap {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 42rpx;
    height: 42rpx;
    color: transparent;
    text-align: center;
    transition-property: color, border-color, background-color;
    font-size: 20px;
    border: 1px solid var(--snake-color-border, #dcdfe6);
    transition-duration: 0.2s;
    /* #ifdef MP-TOUTIAO */
    /* 头条小程序兼容性问题，需要设置行高为 0，否则图标偏下 */
    line-height: 0;
    /* #endif */
}
.snake-checkbox__icon-wrap--circle {
    border-radius: 100%;
}
.snake-checkbox__icon-wrap--square {
    border-radius: 6rpx;
}
.snake-checkbox__icon-wrap--checked {
    color: #fff;
    background-color: var(--snake-color-primary, #06d290);
    border-color: var(--snake-color-primary, #06d290);
}
.snake-checkbox__icon-wrap--disabled {
    background-color: var(--snake-color-disabled-bg, #f1f1f1);
    border-color: var(--snake-color-border, #dcdfe6);
}
.snake-checkbox__icon-wrap--disabled--checked {
    color: var(--snake-color-disabled-bg, #f1f1f1) !important;
}
.snake-checkbox__label {
    word-wrap: break-word;
    margin-left: 10rpx;
    margin-right: 24rpx;
    color: var(--snake-color-text, #303133);
    font-size: 30rpx;
}
</style>
