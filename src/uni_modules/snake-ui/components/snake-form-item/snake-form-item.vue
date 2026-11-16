<template>
    <view
        class="snake-form-item"
        :class="[
            `snake-form-item--${presetSize}`,
            {
                'snake-form-item--border-bottom': elBorderBottom,
                'snake-form-item--border-bottom-error': validateState === 'error' && showError('border-bottom'),
                'snake-form-item--border-error': validateState === 'error' && showError('border'),
                'snake-form-item--label-top': elLabelPosition === 'top',
                'is-disabled': elDisabled
            },
            customClass
        ]"
        :style="customStyle"
    >
        <view class="snake-form-item__body" :class="`snake-form-item__body--${elLabelPosition}`">
            <view class="snake-form-item__left" :style="{ width: labelWidth, flex: `0 0 ${labelWidth}` }">
                <view
                    v-if="required || leftIcon || label || $slots.label || $slots.leftIcon"
                    class="snake-form-item__left-content"
                >
                    <view v-if="leftIcon || $slots.leftIcon" class="snake-form-item__left-icon">
                        <slot name="leftIcon">
                            <snake-icon
                                :name="leftIcon"
                                :size="currentIconSize"
                                :custom-prefix="leftIconPrefix"
                                :custom-style="leftIconStyle"
                            />
                        </slot>
                    </view>
                    <view class="snake-form-item__label" :style="labelStyle">
                        <!-- 必填星号与标签同属一个 flex 行，随对齐方式一起移动，不再用绝对定位偏移 -->
                        <text
                            v-if="showAsterisk && asteriskAtStart"
                            class="snake-form-item__asterisk"
                            aria-hidden="true"
                            >*</text
                        >
                        <slot name="label">{{ label }}</slot>
                        <text
                            v-if="showAsterisk && !asteriskAtStart"
                            class="snake-form-item__asterisk snake-form-item__asterisk--end"
                            aria-hidden="true"
                            >*</text
                        >
                    </view>
                </view>
            </view>
            <view class="snake-form-item__right">
                <view class="snake-form-item__content">
                    <view class="snake-form-item__slot"><slot /></view>
                    <view v-if="$slots.right || $slots.rightIcon || rightIcon" class="snake-form-item__right-icon">
                        <slot name="rightIcon">
                            <snake-icon
                                v-if="rightIcon"
                                :name="rightIcon"
                                :size="currentIconSize"
                                :custom-prefix="rightIconPrefix"
                                :custom-style="rightIconStyle"
                            />
                        </slot>
                        <slot name="right" />
                    </view>
                </view>
            </view>
        </view>
        <view
            v-if="validateState === 'error' && showError('message')"
            class="snake-form-item__message"
            :style="messageStyle"
        >
            {{ validateMessage }}
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component FormItem
 * @description 表单字段容器，负责布局、尺寸、禁用态和校验状态。
 * @see /components/form
 */

import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, useSlots } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { cloneFormValue, getPathValue, setPathValue, type FormRule, type FormTrigger } from '../../libs/form';
import Schema from '../../libs/form/async-validator.min';
import {
    DEFAULT_VALIDATE_TRIGGERS,
    formKey,
    normalizeValidateTriggers,
    type FormField,
    type FormValidateTrigger
} from '../snake-form/types';
import { formItemKey } from './types';
import type { FormItemProps } from './types';

Schema.warning = () => {};

defineOptions({ name: 'FormItem', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<FormItemProps>(), {
    customStyle: '',
    customClass: '',
    label: '',
    prop: '',
    borderBottom: '',
    labelPosition: '',
    labelWidth: '',
    labelStyle: () => ({}),
    labelAlign: '',
    rightIcon: '',
    leftIcon: '',
    leftIconPrefix: 'sicon',
    rightIconPrefix: 'sicon',
    leftIconStyle: () => ({}),
    rightIconStyle: () => ({}),
    required: false,
    asteriskPosition: '',
    hideAsterisk: '',
    disabled: '',
    validateTrigger: '',
    size: ''
});

const slots = useSlots();
const form = inject(formKey, null);

const initialValue = ref<unknown>('');
const validateState = ref<'success' | 'error' | 'validating' | ''>('');
const validateMessage = ref('');
let validationVersion = 0;

const sizeConfig = {
    small: { fontSize: 12, iconSize: 14, messageSize: 10 },
    default: { fontSize: 14, iconSize: 16, messageSize: 12 },
    large: { fontSize: 16, iconSize: 18, messageSize: 14 }
} as const;

const actualSize = computed(() => {
    if (props.size !== '') return String(props.size);
    return String(form?.size.value || 'default');
});
const presetSize = computed(() =>
    actualSize.value in sizeConfig ? (actualSize.value as keyof typeof sizeConfig) : 'default'
);
const currentSizeConfig = computed(() => sizeConfig[presetSize.value]);
/** 预设尺寸的字号交给 CSS 按档位取值，只有自定义数值才走内联样式。 */
const customLabelFontSize = computed(() => (actualSize.value in sizeConfig ? '' : addUnit(actualSize.value)));
const currentIconSize = computed(() => currentSizeConfig.value.iconSize);
const errorType = computed(() => form?.errorType.value || ['message']);
const showError = (type: string) => !errorType.value.includes('none') && errorType.value.includes(type);
// Controls only need error state when the form explicitly requests an input border.
const errorVisible = computed(() => validateState.value === 'error' && showError('border'));
/** 禁用态：本项优先，未设置（空字符串）时继承 Form。 */
const elDisabled = computed(() => (props.disabled === '' ? Boolean(form?.disabled.value) : Boolean(props.disabled)));
/** 实际生效的校验时机，字符串与数组都接受。 */
const validateTriggers = computed<FormValidateTrigger[]>(() => {
    if (props.validateTrigger === '') return form?.validateTrigger.value ?? DEFAULT_VALIDATE_TRIGGERS;
    return normalizeValidateTriggers(props.validateTrigger);
});
const elAsteriskPosition = computed(() => props.asteriskPosition || form?.asteriskPosition.value || 'start');
const showAsterisk = computed(() => {
    if (!props.required) return false;
    const hidden = props.hideAsterisk === '' ? Boolean(form?.hideAsterisk.value) : Boolean(props.hideAsterisk);
    return !hidden;
});
const asteriskAtStart = computed(() => elAsteriskPosition.value !== 'end');

const elLabelWidth = computed(() => {
    if (props.labelWidth !== '' && props.labelWidth !== 0) return props.labelWidth;
    return form?.labelWidth.value || 45;
});
const elLabelStyle = computed(() =>
    Object.keys(props.labelStyle).length ? props.labelStyle : form?.labelStyle.value || {}
);
const elLabelPosition = computed(() => props.labelPosition || form?.labelPosition.value || 'left');
const elLabelAlign = computed(() => props.labelAlign || form?.labelAlign.value || 'left');
const elBorderBottom = computed(() =>
    props.borderBottom !== '' ? props.borderBottom : (form?.borderBottom.value ?? false)
);
const labelWidth = computed(() =>
    elLabelPosition.value === 'left'
        ? (props.label === 'true' || props.label === '') && !slots.label
            ? 'auto'
            : addUnit(elLabelWidth.value)
        : '100%'
);
const labelStyle = computed(() => [
    elLabelStyle.value,
    customLabelFontSize.value ? { fontSize: customLabelFontSize.value } : undefined,
    {
        justifyContent:
            elLabelAlign.value === 'left' ? 'flex-start' : elLabelAlign.value === 'center' ? 'center' : 'flex-end'
    }
]);
/** 错误文案与标签左对齐，标签为插槽时同样留出缩进。 */
const messageStyle = computed(() => ({
    paddingLeft: elLabelPosition.value === 'left' && (props.label || slots.label) ? addUnit(elLabelWidth.value) : '0'
}));

function getRules(): FormRule[] {
    const allRules = form?.rules.value || {};
    const dynamicPath = props.prop
        .replace(/\[(\d+)\]/g, '.$1')
        .replace(/(?:^|\.)(\d+)(?=\.|$)/g, '.defaultField.fields');
    const fieldRules = allRules[props.prop] || getPathValue(allRules, dynamicPath);
    return ([] as FormRule[]).concat((fieldRules || []) as FormRule | FormRule[]);
}

function getFilteredRules(trigger = ''): FormRule[] {
    const rules = getRules();
    if (!trigger) return rules;
    return rules.filter(rule => rule.trigger && ([] as string[]).concat(rule.trigger).includes(trigger));
}

function validation(trigger = '', callback: (message: string) => void = () => {}) {
    const rules = getFilteredRules(trigger);
    if (!rules.length) {
        // 没有命中该时机的规则：撤掉上一次留下的提示，避免确认型控件（select / switch）留下过期红字
        if (trigger && validateState.value === 'error') clearValidation();
        callback('');
        return;
    }
    const version = ++validationVersion;
    validateState.value = 'validating';
    const value = getPathValue(form?.model.value, props.prop);
    const validator = new Schema({ [props.prop]: rules });
    void validator.validate({ [props.prop]: value }, { firstFields: true }, errors => {
        if (version !== validationVersion) {
            callback(validateMessage.value);
            return;
        }
        validateState.value = errors ? 'error' : 'success';
        validateMessage.value = errors?.[0]?.message || '';
        callback(validateMessage.value);
    });
}

/** 只清校验状态，不跑规则；切换/输入时用来撤掉过期提示。 */
function clearValidation() {
    validationVersion += 1;
    validateState.value = '';
    validateMessage.value = '';
}

function onFormBlur() {
    validation('blur');
}
function onFormChange() {
    validation('change');
}
function resetField() {
    validationVersion += 1;
    const model = form?.model.value;
    if (model && props.prop) {
        setPathValue(model, props.prop, cloneFormValue(initialValue.value));
    }
    validateState.value = '';
    validateMessage.value = '';
}

const exposedField: FormField = { validation, resetField, prop: props.prop };
onMounted(() => {
    nextTick(() => {
        if (!props.prop) return;
        form?.register(exposedField);
        initialValue.value = cloneFormValue(getPathValue(form?.model.value, props.prop));
    });
});
onBeforeUnmount(() => {
    validationVersion += 1;
    if (!props.prop) return;
    form?.unregister(exposedField);
});

function notify(trigger: FormTrigger): Promise<void> {
    const enabled = validateTriggers.value.includes(trigger);
    return nextTick().then(
        () =>
            new Promise(resolve => {
                // 未启用的时机不跑规则，但要撤掉上一次留下的错误提示
                if (!enabled) {
                    if (validateState.value === 'error') clearValidation();
                    resolve();
                    return;
                }
                validation(trigger, () => resolve());
            })
    );
}
provide(formItemKey, {
    error: validateMessage,
    errorVisible,
    size: computed(() => presetSize.value),
    disabled: elDisabled,
    notify
});
defineExpose({ validation, resetField, onFormBlur, onFormChange });
</script>

<style scoped>
.snake-form-item {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    padding: var(--snake-form-item-padding, 10px 0);
    color: var(--snake-form-label-color, var(--snake-color-text, #303133));
    font-size: var(--snake-form-label-font-size, 14px);
}
.snake-form-item--small {
    font-size: var(--snake-form-label-font-size-small, 12px);
}
.snake-form-item--large {
    font-size: var(--snake-form-label-font-size-large, 16px);
}
.snake-form-item--border-bottom {
    border-bottom: 1px solid var(--snake-form-border-color, var(--snake-color-divider, #e4e7ed));
}
.snake-form-item--border-bottom-error {
    border-color: var(--snake-form-error-color, var(--snake-color-error, #fa3534));
}
.snake-form-item--border-error :deep(.snake-input--surround),
.snake-form-item--border-error :deep(.snake-textarea--surround) {
    border-color: var(--snake-form-error-color, var(--snake-color-error, #fa3534)) !important;
}
.snake-form-item__body,
.snake-form-item__left,
.snake-form-item__left-content,
.snake-form-item__label,
.snake-form-item__right,
.snake-form-item__content,
.snake-form-item__slot,
.snake-form-item__right-icon {
    display: flex;
}
.snake-form-item__body--top {
    flex-direction: column;
}
.snake-form-item__left,
.snake-form-item__left-content,
.snake-form-item__label,
.snake-form-item__content,
.snake-form-item__slot,
.snake-form-item__right-icon {
    align-items: center;
}
.snake-form-item__left-content,
.snake-form-item__label,
.snake-form-item__right,
.snake-form-item__content,
.snake-form-item__slot {
    flex: 1;
}
.snake-form-item__content {
    min-width: 0;
}
.snake-form-item__left-content {
    position: relative;
    padding-right: var(--snake-form-label-gap, 5px);
}
.snake-form-item--label-top .snake-form-item__left {
    margin-bottom: var(--snake-form-label-gap, 5px);
}
.snake-form-item__asterisk {
    flex: none;
    margin-right: 2px;
    color: var(--snake-form-asterisk-color, var(--snake-color-error, #fa3534));
    line-height: 1;
}
.snake-form-item__asterisk--end {
    margin-right: 0;
    margin-left: 2px;
}
.snake-form-item__left-icon {
    display: flex;
    flex: none;
    align-items: center;
    margin-right: 4px;
}
.snake-form-item__right-icon {
    margin-left: 5px;
    color: var(--snake-form-right-icon-color, var(--snake-color-text-light, #c0c4cc));
    font-size: 15px;
}
.snake-form-item__message {
    margin-top: 6px;
    color: var(--snake-form-message-color, var(--snake-color-error, #fa3534));
    font-size: var(--snake-form-message-font-size, 12px);
    line-height: 1.5;
}
.snake-form-item--small .snake-form-item__message {
    font-size: var(--snake-form-message-font-size-small, 10px);
}
.snake-form-item--large .snake-form-item__message {
    font-size: var(--snake-form-message-font-size-large, 14px);
}
</style>
