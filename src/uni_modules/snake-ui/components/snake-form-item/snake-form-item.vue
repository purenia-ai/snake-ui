<script setup lang="ts">
/**
 * @component FormItem
 * @description 表单字段容器，布局、尺寸和校验行为与 uView Pro FormItem 对齐。
 * @see /components/form
 */

import { computed, inject, nextTick, onBeforeUnmount, onMounted, provide, ref, useSlots } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { getPathValue, type FormRule, type FormTrigger } from '../../libs/form';
import Schema from '../../libs/form/async-validator.min';
import { formKey } from '../../libs/internal/form';
import { formItemKey } from '../../libs/internal/form-item';
import Icon from '../snake-icon/snake-icon.vue';
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
    size: ''
});

const slots = useSlots();
const form = inject(formKey, null);

const initialValue = ref<unknown>('');
const validateState = ref<'success' | 'error' | 'validating' | ''>('');
const validateMessage = ref('');

const sizeConfig = {
    small: { fontSize: 24, iconSize: 28, messageSize: 20 },
    default: { fontSize: 28, iconSize: 32, messageSize: 24 },
    large: { fontSize: 32, iconSize: 36, messageSize: 28 }
} as const;

const actualSize = computed(() => {
    if (props.size !== '') return String(props.size);
    return String(form?.size.value || 'default');
});
const presetSize = computed(() =>
    actualSize.value in sizeConfig ? (actualSize.value as keyof typeof sizeConfig) : 'default'
);
const currentSizeConfig = computed(() => sizeConfig[presetSize.value]);
const actualFontSize = computed(() =>
    addUnit(actualSize.value in sizeConfig ? currentSizeConfig.value.fontSize : actualSize.value, 'rpx')
);
const currentIconSize = computed(() => currentSizeConfig.value.iconSize);
const errorType = computed(() => form?.errorType.value || ['message']);
const showError = (type: string) => !errorType.value.includes('none') && errorType.value.includes(type);
const errorVisible = computed(() => validateState.value === 'error' && !errorType.value.includes('none'));

const elLabelWidth = computed(() => {
    if (props.labelWidth !== '' && props.labelWidth !== 0) return props.labelWidth;
    return form?.labelWidth.value || 90;
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
            : addUnit(elLabelWidth.value, 'rpx')
        : '100%'
);

function getRules(): FormRule[] {
    const allRules = form?.rules.value || {};
    const dynamicPath = props.prop.replace(/(\.|^)(\d+)\./, '.defaultField.fields.');
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
        callback('');
        return;
    }
    validateState.value = 'validating';
    const value = getPathValue(form?.model.value, props.prop);
    const validator = new Schema({ [props.prop]: rules });
    void validator.validate({ [props.prop]: value }, { firstFields: true }, errors => {
        validateState.value = errors ? 'error' : 'success';
        validateMessage.value = errors?.[0]?.message || '';
        callback(validateMessage.value);
    });
}

function onFormBlur() {
    validation('blur');
}
function onFormChange() {
    validation('change');
}
function resetField() {
    const model = form?.model.value;
    if (model && props.prop) {
        const parts = props.prop.split('.');
        let owner: any = model;
        for (let index = 0; index < parts.length - 1; index += 1) owner = owner?.[parts[index]];
        if (owner) owner[parts[parts.length - 1]] = initialValue.value;
    }
    setTimeout(() => {
        validateState.value = 'success';
        validateMessage.value = '';
    }, 50);
}

const exposedField = { validation, resetField, prop: props.prop };
onMounted(() => {
    nextTick(() => {
        if (!props.prop) return;
        form?.register(exposedField as any);
        initialValue.value = getPathValue(form?.model.value, props.prop);
    });
});
onBeforeUnmount(() => {
    if (!props.prop) return;
    form?.unregister(exposedField as any);
});

function notify(trigger: FormTrigger): Promise<void> {
    return new Promise(resolve => validation(trigger, () => resolve()));
}
provide(formItemKey, {
    error: validateMessage,
    errorVisible,
    size: computed(() => presetSize.value),
    notify
});
defineExpose({ validation, resetField, onFormBlur, onFormChange });
</script>

<template>
    <view
        class="snake-form-item"
        :class="[
            {
                'snake-form-item--border-bottom': elBorderBottom,
                'snake-form-item--border-bottom-error': validateState === 'error' && showError('border-bottom'),
                'snake-form-item--border-error': validateState === 'error' && showError('border')
            },
            customClass
        ]"
        :style="customStyle"
    >
        <view class="snake-form-item__body" :style="{ flexDirection: elLabelPosition === 'left' ? 'row' : 'column' }">
            <view
                class="snake-form-item__left"
                :style="{
                    width: labelWidth,
                    flex: `0 0 ${labelWidth}`,
                    marginBottom: elLabelPosition === 'left' ? 0 : '10rpx'
                }"
            >
                <view
                    v-if="required || leftIcon || label || $slots.label || $slots.leftIcon"
                    class="snake-form-item__left-content"
                >
                    <text v-if="required" class="snake-form-item__required">*</text>
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
                    <view
                        class="snake-form-item__label"
                        :style="[
                            elLabelStyle,
                            { fontSize: actualFontSize },
                            {
                                justifyContent:
                                    elLabelAlign === 'left'
                                        ? 'flex-start'
                                        : elLabelAlign === 'center'
                                          ? 'center'
                                          : 'flex-end'
                            }
                        ]"
                    >
                        <slot name="label">{{ label }}</slot>
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
            :style="{
                paddingLeft: elLabelPosition === 'left' && label ? addUnit(elLabelWidth, 'rpx') : '0',
                fontSize: addUnit(currentSizeConfig.messageSize, 'rpx'),
                lineHeight: addUnit(currentSizeConfig.messageSize, 'rpx')
            }"
        >
            {{ validateMessage }}
        </view>
    </view>
</template>

<style scoped>
.snake-form-item {
    display: flex;
    box-sizing: border-box;
    flex-direction: column;
    padding: 20rpx 0;
    color: var(--snake-color-text, #303133);
    font-size: 28rpx;
}
.snake-form-item--border-bottom {
    border-bottom: 1px solid var(--snake-color-divider, #e4e7ed);
}
.snake-form-item--border-bottom-error {
    border-color: var(--snake-color-error, #fa3534);
}
.snake-form-item--border-error :deep(.snake-input--surround),
.snake-form-item--border-error :deep(.snake-textarea--surround) {
    border-color: var(--snake-color-error, #fa3534) !important;
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
.snake-form-item__left-content {
    position: relative;
    padding-right: 10rpx;
}
.snake-form-item__required {
    position: absolute;
    left: -16rpx;
    padding-top: 6rpx;
    color: var(--snake-color-error, #fa3534);
    vertical-align: middle;
}
.snake-form-item__left-icon {
    display: flex;
    align-items: center;
    margin-right: 8rpx;
}
.snake-form-item__right-icon {
    margin-left: 10rpx;
    color: var(--snake-color-text-light, #c0c4cc);
    font-size: 30rpx;
}
.snake-form-item__message {
    margin-top: 12rpx;
    color: var(--snake-color-error, #fa3534);
}
</style>
