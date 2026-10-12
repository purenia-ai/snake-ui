<template>
    <view class="snake-radio" :style="[radioStyle, customStyle]" :class="customClass">
        <view class="snake-radio__icon-wrap" @tap="toggle" :class="iconClass" :style="iconStyle">
            <snake-icon name="checkmark" :size="elIconSize" :color="iconColor" />
        </view>
        <view class="snake-radio__label" @tap="onClickLabel" :style="{ fontSize: labelFontSize }">
            <slot>{{ label }}</slot>
        </view>
    </view>
</template>
<script setup lang="ts">
/**
 * @component Radio
 * @description radio 单选框，通过 `name` 参与 RadioGroup 互斥选择。
 * @see /components/radio
 */

import { computed, inject } from 'vue';
import { useParent } from '../../libs/hooks';
import { RADIO_GROUP_KEY } from '../snake-radio-group/types';
import { addUnit } from '../../libs/function/unit';
import { formKey } from '../snake-form/types';
import Icon from '../snake-icon/snake-icon.vue';
import { radioProps } from './types';
import type { RadioEmits } from './types';

defineOptions({
    name: 'Radio',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = defineProps(radioProps);
const emit = defineEmits<RadioEmits>();

// 使用组件关系 hooks 获取父组件
const { parent: radioGroup } = useParent(RADIO_GROUP_KEY);
const form = inject(formKey, null);

// radio 的数据项标识符
const radioValue = computed(() => props.name);

// 父组件数据，供子组件使用（兼容没有父组件的场景，各字段回退为 null）
const parentData = computed(() => {
    const group = radioGroup.value;
    return {
        iconSize: group?.props.iconSize ?? null,
        labelDisabled: group?.props.labelDisabled ?? null,
        disabled: group?.props.disabled ?? null,
        shape: group?.props.shape ?? null,
        activeColor: group?.props.activeColor ?? null,
        size: group?.props.size ?? null,
        width: group?.props.width ?? null,
        value: group?.props.modelValue ?? null,
        wrap: group?.props.wrap ?? null
    };
});

// 根据 size 定义不同的配置
const sizeConfig = {
    small: { size: 28, fontSize: 24, iconSize: 16 },
    default: { size: 34, fontSize: 28, iconSize: 20 },
    large: { size: 40, fontSize: 32, iconSize: 24 }
};

// 获取实际使用的 size 值（优先级：props.size > snake-radio-group.size > snake-form.size）
const actualSize = computed(() => {
    if (props.size !== '') return String(props.size);
    if (radioGroup.value?.props.size) return String(radioGroup.value.props.size);
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

// 是否禁用，如果父组件 snake-radio-group 禁用的话，将会忽略子组件的配置
const elDisabled = computed(() =>
    props.disabled !== '' ? props.disabled : parentData.value.disabled !== null ? parentData.value.disabled : false
);

// 是否禁用 label 点击
const elLabelDisabled = computed(() =>
    props.labelDisabled !== ''
        ? props.labelDisabled
        : parentData.value.labelDisabled !== null
          ? parentData.value.labelDisabled
          : false
);

// 组件尺寸，对应 size 的值，默认值为 34rpx
const elSize = computed(() => currentSizeConfig.value.size);

// 组件的勾选图标的尺寸，默认 20
const elIconSize = computed(() => {
    if (props.iconSize) return props.iconSize;
    if (radioGroup.value?.props.iconSize) return radioGroup.value.props.iconSize;
    if (isInSizeConfig.value) return currentSizeConfig.value.iconSize;
    return 20;
});

// label 字体大小，默认 28
const labelFontSize = computed(() => {
    if (isInSizeConfig.value) return addUnit(currentSizeConfig.value.fontSize, 'rpx');
    return props.labelSize ? addUnit(props.labelSize, 'rpx') : '';
});

// 组件选中激活时的颜色
const elActiveColor = computed(() =>
    props.activeColor
        ? props.activeColor
        : parentData.value.activeColor
          ? parentData.value.activeColor
          : 'var(--snake-color-primary, #06D290)'
);

// 组件的形状
const elShape = computed(() =>
    props.shape ? props.shape : parentData.value.shape ? parentData.value.shape : 'circle'
);

// 设置 radio 的状态，要求 radio 的 name 等于 parent 的 value 时才为选中状态
const iconStyle = computed(() => {
    const style: Record<string, string> = {};
    if (elActiveColor.value && parentData.value.value == radioValue.value && !elDisabled.value) {
        style.borderColor = elActiveColor.value;
        style.backgroundColor = elActiveColor.value;
    }
    style.width = addUnit(elSize.value, 'rpx');
    style.height = addUnit(elSize.value, 'rpx');
    return style;
});

const iconColor = computed(() => (radioValue.value == parentData.value.value ? '#fff' : 'transparent'));

const iconClass = computed(() => {
    const classes: string[] = [];
    classes.push(`snake-radio__icon-wrap--${elShape.value}`);
    if (radioValue.value == parentData.value.value) classes.push('snake-radio__icon-wrap--checked');
    if (elDisabled.value) classes.push('snake-radio__icon-wrap--disabled');
    if (radioValue.value == parentData.value.value && elDisabled.value)
        classes.push('snake-radio__icon-wrap--disabled--checked');
    return classes.join(' ');
});

const radioStyle = computed(() => {
    const style: Record<string, string> = {};
    if (parentData.value.width) {
        style.width = addUnit(parentData.value.width, 'rpx');
        // #ifdef MP
        // 各家小程序因为它们特殊的编译结构，使用 float 布局
        style.float = 'left';
        // #endif
        // #ifndef MP
        // H5 和 APP 使用 flex 布局
        style.flex = `0 0 ${addUnit(parentData.value.width, 'rpx')}`;
        // #endif
    }
    if (parentData.value.wrap) {
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
    if (!elLabelDisabled.value && !elDisabled.value) {
        setRadioCheckedStatus();
    }
}

/**
 * 点击 icon
 */
function toggle() {
    if (!elDisabled.value) {
        setRadioCheckedStatus();
    }
}

/**
 * 发出事件
 * snake-radio 的 name 不等于父组件的 v-model 的值时(意味着未选中)，才发出事件，避免多次点击触发事件
 */
function emitEvent() {
    if (parentData.value.value != radioValue.value) emit('change', radioValue.value);
}

/**
 * 改变组件选中状态
 * 通过父组件 setValue 更新 v-model，父级变化后所有 radio 由 computed 重新计算选中状态
 */
function setRadioCheckedStatus() {
    emitEvent();
    radioGroup.value?.setValue(radioValue.value);
}
</script>
<style scoped>
.snake-radio {
    /* #ifndef APP-NVUE */
    display: inline-flex;
    /* #endif */
    align-items: center;
    overflow: hidden;
    user-select: none;
    line-height: 1.8;
}
.snake-radio__icon-wrap {
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
.snake-radio__icon-wrap--circle {
    border-radius: 100%;
}
.snake-radio__icon-wrap--square {
    border-radius: 3px;
}
.snake-radio__icon-wrap--checked {
    color: #fff;
    background-color: var(--snake-color-primary, #06d290);
    border-color: var(--snake-color-primary, #06d290);
}
.snake-radio__icon-wrap--disabled {
    background-color: var(--snake-color-disabled-bg, #f1f1f1);
    border-color: var(--snake-color-border, #dcdfe6);
}
.snake-radio__icon-wrap--disabled--checked {
    color: var(--snake-color-disabled-bg, #f1f1f1) !important;
}
.snake-radio__label {
    word-wrap: break-word;
    margin-left: 10rpx;
    margin-right: 24rpx;
    color: var(--snake-color-text, #303133);
    font-size: 30rpx;
}
</style>
