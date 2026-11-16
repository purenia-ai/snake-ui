<template>
    <view
        class="snake-radio"
        :class="[customClass, rootClass]"
        :style="[radioStyle, customStyle]"
        :role="'radio'"
        :aria-checked="isChecked"
        :aria-disabled="elDisabled"
        :tabindex="elDisabled ? -1 : 0"
        hover-class="snake-radio--pressed"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
    >
        <view class="snake-radio__icon-wrap" @tap="toggle" :class="iconClass" :style="iconStyle">
            <snake-icon name="checkmark" :size="elIconSize" :color="iconColor" />
        </view>
        <view class="snake-radio__label" @tap="onClickLabel" :style="labelStyle">
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
import type { RadioEmits, RadioExpose } from './types';

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

// 使用组件关系 hooks 获取父组件（index 用于判断分组内是否为最后一项，决定分隔线）
const { parent: radioGroup, index } = useParent(RADIO_GROUP_KEY);
const form = inject(formKey, null);

// radio 的数据项标识符
const radioValue = computed(() => props.name);

// 父组件 props，供子组件读取级联配置（无父组件时为 undefined）
const groupProps = computed(() => radioGroup.value?.props);

// 根据 size 定义不同的配置
const sizeConfig = {
    small: { size: 14, fontSize: 12, iconSize: 8 },
    default: { size: 17, fontSize: 14, iconSize: 10 },
    large: { size: 20, fontSize: 16, iconSize: 12 }
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

// 非预设时按数值解析：自定义数值直接决定盒子尺寸，勾号与字号按默认档比例推导
const customSize = computed(() => {
    if (isInSizeConfig.value) return 0;
    const numeric = Number.parseFloat(actualSize.value);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
});

// 获取当前尺寸配置
const currentSizeConfig = computed(() => sizeConfig[presetSize.value]);

// 是否选中，要求 radio 的 name 等于 parent 的 modelValue
const isChecked = computed(() => groupProps.value?.modelValue == radioValue.value);

// 是否禁用，如果父组件 snake-radio-group 禁用的话，将会忽略子组件的配置
const elDisabled = computed(() => {
    if (props.disabled !== '') return Boolean(props.disabled);
    // 优先取 group 合并后的禁用态（含 Form / FormItem 下发），再退回 Form 自身
    if (radioGroup.value?.disabled?.value) return true;
    return Boolean(groupProps.value?.disabled || form?.disabled.value);
});

// 是否禁用 label 点击
const elLabelDisabled = computed(() =>
    props.labelDisabled !== '' ? props.labelDisabled : (groupProps.value?.labelDisabled ?? false)
);

// 组件尺寸，对应 size 的值，默认值为 17px
const elSize = computed(() => customSize.value || currentSizeConfig.value.size);

// 组件的勾选图标的尺寸，默认按盒子比例推导
const elIconSize = computed(() => {
    if (props.iconSize) return props.iconSize;
    if (groupProps.value?.iconSize) return groupProps.value.iconSize;
    return customSize.value ? Math.round(customSize.value * 0.588) : currentSizeConfig.value.iconSize;
});

// label 字体大小，默认按 size 预设（自定义数值时等比推导）
const labelFontSize = computed(() => {
    const explicit = props.labelSize || groupProps.value?.labelSize;
    if (explicit) return addUnit(explicit);
    return addUnit(customSize.value ? Math.round(customSize.value * 0.823) : currentSizeConfig.value.fontSize);
});

// 组件选中激活时的颜色
const elActiveColor = computed(() =>
    props.activeColor ? props.activeColor : (groupProps.value?.activeColor ?? 'var(--snake-color-primary, #06D290)')
);

// 未选中边框颜色
const elInactiveColor = computed(() =>
    props.inactiveColor ? props.inactiveColor : (groupProps.value?.inactiveColor ?? '')
);

// 标签文字颜色
const elLabelColor = computed(() => (props.labelColor ? props.labelColor : (groupProps.value?.labelColor ?? '')));

// 勾选指示器位置
const elPlacement = computed(() => (props.placement ? props.placement : (groupProps.value?.placement ?? 'left')));

// 组件的形状
const elShape = computed(() => (props.shape ? props.shape : (groupProps.value?.shape ?? 'circle')));

const iconStyle = computed(() => {
    const style: Record<string, string> = {};
    if (!elDisabled.value) {
        if (isChecked.value) {
            style.borderColor = elActiveColor.value;
            style.backgroundColor = elActiveColor.value;
        } else if (elInactiveColor.value) {
            style.borderColor = elInactiveColor.value;
        }
    }
    style.width = addUnit(elSize.value);
    style.height = addUnit(elSize.value);
    return style;
});

const iconColor = computed(() => (isChecked.value ? '#fff' : 'transparent'));

const iconClass = computed(() => {
    const classes: string[] = [];
    classes.push(`snake-radio__icon-wrap--${elShape.value}`);
    if (isChecked.value) classes.push('snake-radio__icon-wrap--checked');
    if (elDisabled.value) classes.push('snake-radio__icon-wrap--disabled');
    if (isChecked.value && elDisabled.value) classes.push('snake-radio__icon-wrap--disabled--checked');
    return classes.join(' ');
});

// 是否绘制行分隔线：单项显式设置优先，分组设置时最后一项不画
const showBorder = computed(() => {
    if (props.border !== '') return Boolean(props.border);
    if (!groupProps.value?.border) return false;
    const total = radioGroup.value?.children?.length ?? 0;
    return !(total > 0 && index.value === total - 1);
});

// 根节点类名：位置、分隔线与禁用
const rootClass = computed(() => {
    const classes: string[] = [];
    if (elPlacement.value === 'right') classes.push('snake-radio--right');
    if (showBorder.value) classes.push('snake-radio--border');
    if (elDisabled.value) classes.push('snake-radio--disabled');
    return classes.join(' ');
});

const labelStyle = computed(() => {
    const style: Record<string, string> = { fontSize: labelFontSize.value };
    if (elLabelColor.value) style.color = elLabelColor.value;
    return style;
});

// 显式占宽：`auto` 表示不设置宽度，交给 flex / inline 自然排版
const groupWidth = computed(() => {
    const width = groupProps.value?.width;
    return width && width !== 'auto' ? width : '';
});

const radioStyle = computed(() => {
    const style: Record<string, string> = {};
    if (groupWidth.value) {
        style.width = addUnit(groupWidth.value);
        // #ifdef MP
        // 各家小程序因为它们特殊的编译结构，使用 float 布局
        style.float = 'left';
        // #endif
        // #ifndef MP
        // H5 和 APP 使用 flex 布局
        style.flex = `0 0 ${addUnit(groupWidth.value)}`;
        // #endif
    }
    if (groupProps.value?.wrap) {
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
    if (groupProps.value?.modelValue != radioValue.value) emit('change', radioValue.value);
}

/**
 * 改变组件选中状态
 * 通过父组件 setValue 更新 v-model，父级变化后所有 radio 由 computed 重新计算选中状态
 */
function setRadioCheckedStatus() {
    emitEvent();
    radioGroup.value?.setValue(radioValue.value);
}

// 公开代理上的 ref 会被 Vue 自动解包，因此按解包后的形态声明暴露接口
const exposed = { isChecked, isDisabled: elDisabled, value: radioValue, props } as unknown as RadioExpose;

defineExpose(exposed);
</script>
<style scoped>
.snake-radio {
    /* #ifndef APP-NVUE */
    display: inline-flex;
    /* #endif */
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    user-select: none;
    line-height: 1.8;
}
/* 指示器在右：模板顺序为图标/文字，反向排列后即为「文字左、勾选右」 */
.snake-radio--right {
    flex-direction: row-reverse;
    justify-content: space-between;
}
.snake-radio--right .snake-radio__label {
    margin-left: 0;
    margin-right: 5px;
}
.snake-radio--border {
    width: 100%;
    padding: 8px 0;
    border-bottom: 1px solid var(--snake-color-divider, #e4e7ed);
}
.snake-radio__icon-wrap {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 21px;
    height: 21px;
    color: transparent;
    text-align: center;
    transition-property: color, border-color, background-color, transform;
    font-size: 20px;
    border: 1px solid var(--snake-color-border, #dcdfe6);
    transition-duration: 0.2s;
    /* #ifdef MP-TOUTIAO */
    /* 头条小程序兼容性问题，需要设置行高为 0，否则图标偏下 */
    line-height: 0;
    /* #endif */
}
.snake-radio--pressed .snake-radio__icon-wrap {
    transform: scale(0.9);
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
    margin-left: 5px;
    margin-right: 12px;
    color: var(--snake-color-text, #303133);
    font-size: 15px;
}
.snake-radio--disabled .snake-radio__label {
    color: var(--snake-color-text-muted, #909399);
}
</style>
