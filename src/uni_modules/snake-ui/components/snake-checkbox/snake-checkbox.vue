<template>
    <view
        class="snake-checkbox"
        :class="[customClass, rootClass]"
        :style="[checkboxStyle, customStyle]"
        :role="'checkbox'"
        :aria-checked="indeterminate ? 'mixed' : isChecked"
        :aria-disabled="isDisabled"
        :tabindex="isDisabled ? -1 : 0"
        hover-class="snake-checkbox--pressed"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
    >
        <view class="snake-checkbox__icon-wrap" @tap="toggle" :class="iconClass" :style="iconStyle">
            <snake-icon v-if="indeterminate" name="minus" :size="checkboxIconSize" :color="iconColor" />
            <snake-icon v-else name="checkmark" :size="checkboxIconSize" :color="iconColor" />
        </view>
        <view class="snake-checkbox__label" @tap="onClickLabel" :style="labelStyle">
            <slot>{{ label }}</slot>
        </view>
    </view>
</template>
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
import type { CheckboxEmits, CheckboxExpose } from './types';

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
// 使用组件关系 hooks 获取父组件（index 用于判断分组内是否为最后一项，决定分隔线）
const { parent: checkboxGroup, index } = useParent(CHECKBOX_GROUP_KEY);
const form = inject(formKey, null);

// checkbox 的数据项标识符
const checkboxValue = computed(() => props.name);

// 父组件 props，供子组件读取级联配置（无父组件时为 undefined）
const groupProps = computed(() => checkboxGroup.value?.props);

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
    small: { size: 14, fontSize: 12, iconSize: 8 },
    default: { size: 17, fontSize: 14, iconSize: 10 },
    large: { size: 20, fontSize: 16, iconSize: 12 }
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

// 非预设时按数值解析：自定义数值直接决定盒子尺寸，勾号与字号按默认档比例推导
const customSize = computed(() => {
    if (isInSizeConfig.value) return 0;
    const numeric = Number.parseFloat(actualSize.value);
    return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
});

// 获取当前尺寸配置
const currentSizeConfig = computed(() => sizeConfig[presetSize.value]);

// 是否禁用，如果父组件 snake-checkbox-group 禁用的话，将会忽略子组件的配置
const isDisabled = computed(() => {
    if (props.disabled !== '') return Boolean(props.disabled);
    // 优先取 group 合并后的禁用态（含 Form / FormItem 下发），再退回 Form 自身
    if (checkboxGroup.value?.disabled?.value) return true;
    return Boolean(checkboxGroup.value?.props.disabled || form?.disabled.value);
});

// 数量上下限锁定：达 max 的未选项不可再选，达 min 的已选项不可取消（仅 group 托管时生效）
const isLocked = computed(() => {
    const group = groupProps.value;
    if (!groupManaged.value || !group) return false;
    const selectedCount = (group.modelValue ?? []).length;
    if (isChecked.value) return Boolean(group.min) && selectedCount <= Number(group.min);
    return Boolean(group.max) && selectedCount >= Number(group.max);
});

// 是否禁用 label 点击
const isLabelDisabled = computed(() => {
    return props.labelDisabled !== '' ? props.labelDisabled : (checkboxGroup.value?.props.labelDisabled ?? false);
});

// 组件尺寸，对应 size 的值，默认值为 17px
const checkboxSize = computed(() => customSize.value || currentSizeConfig.value.size);

// 组件的勾选图标的尺寸，默认按盒子比例推导
const checkboxIconSize = computed(() => {
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
const elActiveColor = computed(() => {
    return props.activeColor
        ? props.activeColor
        : (groupProps.value?.activeColor ?? 'var(--snake-color-primary, #06D290)');
});

// 未选中边框颜色
const elInactiveColor = computed(() => {
    return props.inactiveColor ? props.inactiveColor : (groupProps.value?.inactiveColor ?? '');
});

// 标签文字颜色
const elLabelColor = computed(() => {
    return props.labelColor ? props.labelColor : (groupProps.value?.labelColor ?? '');
});

// 勾选指示器位置
const elPlacement = computed(() => {
    return props.placement ? props.placement : (groupProps.value?.placement ?? 'left');
});

// 组件的形状
const elShape = computed(() => {
    return props.shape ? props.shape : (groupProps.value?.shape ?? 'square');
});

// 半选与选中共用强调色，避免半选态在视觉上被当成未选
const isEmphasized = computed(() => isChecked.value || props.indeterminate);

// 图标样式
const iconStyle = computed(() => {
    const style: Record<string, string> = {};
    if (!isDisabled.value) {
        if (isEmphasized.value) {
            style.borderColor = elActiveColor.value;
            style.backgroundColor = elActiveColor.value;
        } else if (elInactiveColor.value) {
            style.borderColor = elInactiveColor.value;
        }
    }
    style.width = addUnit(checkboxSize.value);
    style.height = addUnit(checkboxSize.value);
    return style;
});

// checkbox 内部的勾选图标，如果选中状态，为白色，否则为透明色即可
const iconColor = computed(() => {
    return isEmphasized.value ? '#fff' : 'transparent';
});

const iconClass = computed(() => {
    const classes: string[] = [];
    classes.push(`snake-checkbox__icon-wrap--${elShape.value}`);
    if (isEmphasized.value) classes.push('snake-checkbox__icon-wrap--checked');
    if (isDisabled.value) classes.push('snake-checkbox__icon-wrap--disabled');
    if (isEmphasized.value && isDisabled.value) classes.push('snake-checkbox__icon-wrap--disabled--checked');
    return classes.join(' ');
});

// 是否绘制行分隔线：单项显式设置优先，分组设置时最后一项不画
const showBorder = computed(() => {
    if (props.border !== '') return Boolean(props.border);
    if (!groupProps.value?.border) return false;
    const total = checkboxGroup.value?.children?.length ?? 0;
    return !(total > 0 && index.value === total - 1);
});

// 根节点类名：位置、分隔线、禁用与数量锁定
const rootClass = computed(() => {
    const classes: string[] = [];
    if (elPlacement.value === 'right') classes.push('snake-checkbox--right');
    if (showBorder.value) classes.push('snake-checkbox--border');
    if (isDisabled.value) classes.push('snake-checkbox--disabled');
    if (isLocked.value) classes.push('snake-checkbox--locked');
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

const checkboxStyle = computed(() => {
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

/**
 * 公开代理上的 ref 会被 Vue 自动解包，因此按解包后的形态声明暴露接口。
 */
const exposed = { isChecked, isDisabled, isLocked, value: checkboxValue, props } as unknown as CheckboxExpose;

defineExpose(exposed);
</script>
<style scoped>
.snake-checkbox {
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
.snake-checkbox--right {
    flex-direction: row-reverse;
    justify-content: space-between;
}
.snake-checkbox--right .snake-checkbox__label {
    margin-left: 0;
    margin-right: 5px;
}
.snake-checkbox--border {
    width: 100%;
    padding: 8px 0;
    border-bottom: 1px solid var(--snake-color-divider, #e4e7ed);
}
.snake-checkbox__icon-wrap {
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
.snake-checkbox--pressed .snake-checkbox__icon-wrap {
    transform: scale(0.9);
}
.snake-checkbox__icon-wrap--circle {
    border-radius: 100%;
}
.snake-checkbox__icon-wrap--square {
    border-radius: 3px;
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
    margin-left: 5px;
    margin-right: 12px;
    color: var(--snake-color-text, #303133);
    font-size: 15px;
}
.snake-checkbox--disabled .snake-checkbox__label {
    color: var(--snake-color-text-muted, #909399);
}
.snake-checkbox--locked .snake-checkbox__label {
    color: var(--snake-color-text-muted, #909399);
}
.snake-checkbox--locked .snake-checkbox__icon-wrap {
    opacity: 0.5;
}
</style>
