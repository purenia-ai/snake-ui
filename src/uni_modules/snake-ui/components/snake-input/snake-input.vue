<template>
    <view class="snake-input" :class="[customClass, rootClass]" :style="rootStyle" @click="onRootClick">
        <slot name="prefix"><snake-icon v-if="prefixIcon" :name="prefixIcon" class="snake-input__icon" /></slot>
        <input
            class="snake-input__native"
            :class="customInputClass"
            :value="innerValue"
            :type="type === 'password' ? 'text' : type"
            :password="actualPassword"
            :placeholder="placeholder"
            :placeholder-class="placeholderClass"
            :placeholder-style="`color:${placeholderColor};${placeholderStyle}`"
            :maxlength="maxlength"
            :disabled="isDisabled || readonly"
            :focus="keyboardFocus"
            :cursor="cursor"
            :selection-start="selectionStart"
            :selection-end="selectionEnd"
            :confirm-type="confirmType as any"
            :confirm-hold="confirmHold"
            :adjust-position="adjustPosition"
            :hold-keyboard="holdKeyboard"
            :cursor-spacing="cursorSpacing"
            :style="inputStyle"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @confirm="onConfirm"
            @keyboardheightchange="emit('keyboardheightchange', $event)"
            @compositionstart="composing = true"
            @compositionend="onCompositionEnd"
        />
        <!-- 原生 input 被 disabled 时会吞掉点击（小程序端尤其明显），只读态用透明遮罩承接 -->
        <view v-if="readonly" class="snake-input__mask" @click.stop="onRootClick" />
        <view v-if="showWordLimitText || showClear || showPasswordToggle" class="snake-input__actions">
            <text v-if="showWordLimitText" class="snake-input__count">{{ currentLength }}/{{ maxlength }}</text>
            <view v-if="showClear" class="snake-input__action" @click.stop="clear">
                <snake-icon name="close-circle-fill" :size="sizeConfig.iconSize" class="snake-input__action-icon" />
            </view>
            <view v-if="showPasswordToggle" class="snake-input__action" @click.stop="togglePassword">
                <snake-icon
                    :name="passwordVisible ? 'eye' : 'eye-off'"
                    :size="sizeConfig.iconSize"
                    class="snake-input__action-icon"
                />
            </view>
        </view>
        <slot name="suffix"><snake-icon v-if="suffixIcon" :name="suffixIcon" class="snake-input__icon" /></slot>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Input
 * @description 基于 uni-app input，支持清空、密码显示、格式化、前后插槽和 Form 校验联动。
 * @see /components/input
 */

import { computed, inject, nextTick, ref, watch } from 'vue';
import { getFieldSizeConfig } from '../../libs/function/fieldSize';
import { addUnit } from '../../libs/function/unit';
import { formItemKey } from '../snake-form-item/types';
import type { InputEmits, InputExpose, InputProps } from './types';

defineOptions({ name: 'SnakeInput', options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<InputProps>(), {
    modelValue: '',
    type: 'text',
    placeholder: '请输入内容',
    placeholderStyle: '',
    placeholderClass: '',
    customInputClass: '',
    maxlength: 140,
    clearable: false,
    clearTrigger: 'always',
    showPassword: false,
    showWordLimit: false,
    error: false,
    prefixIcon: '',
    suffixIcon: '',
    border: 'none',
    shape: 'square',
    color: 'var(--snake-color-text,#303133)',
    placeholderColor: 'var(--snake-color-text-light,#c0c4cc)',
    disabled: false,
    readonly: false,
    disabledColor: 'var(--snake-color-disabled-bg,#f5f7fa)',
    inputAlign: 'left',
    formatTrigger: 'input',
    trim: false,
    focus: false,
    cursor: -1,
    selectionStart: -1,
    selectionEnd: -1,
    confirmType: 'done',
    confirmHold: false,
    adjustPosition: true,
    holdKeyboard: false,
    cursorSpacing: 0,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<InputEmits>();
const formItem = inject(formItemKey, null);
/** 输入框内部值，也是唯一的渲染源；外部 modelValue 只做同步。 */
const innerValue = ref(String(props.modelValue ?? ''));
/** 是否处于聚焦态，仅供边框与 clearTrigger=focus 使用。 */
const focused = ref(false);
/** 输入法合成中：合成期间不派发 v-model，等 compositionend 再提交。 */
const composing = ref(false);
const passwordVisible = ref(false);
/** 绑定到原生 focus 属性，供 focus 属性与 ref.focus() 复用。 */
const keyboardFocus = ref(props.focus);
/** 本次聚焦开始时的值，失焦时用于判断 change 是否需要派发。 */
let valueAtFocus = '';

watch(
    () => props.modelValue,
    value => {
        const next = String(value ?? '');
        if (next !== innerValue.value) innerValue.value = next;
    }
);

// focus 是「请求聚焦」的一次性属性：变为 true 时聚焦，变为 false 不做反向操作。
watch(
    () => props.focus,
    value => {
        if (value) focus();
    },
    { immediate: true }
);

/** 尺寸由 props.size（缺省跟随 FormItem）决定，高度/字号/图标共用一张表。 */
const size = computed(() => props.size || formItem?.size.value || 'default');
const sizeConfig = computed(() => getFieldSizeConfig(size.value));
/** 禁用态：自身 disabled，或 FormItem/Form 下发的 disabled。 */
const isDisabled = computed(() => props.disabled || formItem?.disabled.value || false);
const actualPassword = computed(() => props.type === 'password' && !passwordVisible.value);
const isError = computed(() => props.error || Boolean(formItem?.errorVisible.value));
/** 有内容就显示清除控件；clearTrigger=focus 时退回「聚焦且有内容」。 */
const showClear = computed(() => {
    if (!props.clearable || isDisabled.value || props.readonly) return false;
    if (!innerValue.value.length) return false;
    return props.clearTrigger === 'always' || focused.value;
});
const showPasswordToggle = computed(() => props.showPassword && props.type === 'password' && !isDisabled.value);
const showWordLimitText = computed(
    () => props.showWordLimit && !isDisabled.value && !props.readonly && Number(props.maxlength) > -1
);
/** 字数按码点统计，emoji 与生僻字不再算两个。 */
const currentLength = computed(() => Array.from(innerValue.value).length);
const rootClass = computed(() => [
    `snake-input--${props.border}`,
    `snake-input--${props.shape}`,
    `snake-input--${size.value}`,
    { 'is-focused': focused.value, 'is-error': isError.value, 'is-disabled': isDisabled.value }
]);
const rootStyle = computed(() => [
    {
        backgroundColor: isDisabled.value ? props.disabledColor : undefined,
        minHeight: props.height ? addUnit(props.height) : undefined
    },
    props.customStyle
]);
/** 显式传 fontSize 时走内联，否则交给 CSS 按 size 档位取值。 */
const inputStyle = computed(() => ({
    color: props.color,
    fontSize: props.fontSize ? addUnit(props.fontSize) : undefined,
    textAlign: props.inputAlign
}));

/** 读取输入类事件的 detail.value，跨端事件对象结构不同，统一按 unknown 收窄。 */
function readEventValue(event: unknown): string | undefined {
    const detail = (event as { detail?: { value?: string | number } } | null | undefined)?.detail;
    return detail && detail.value !== undefined ? String(detail.value) : undefined;
}

/** 收起键盘，平台不支持时忽略。 */
function hideKeyboard() {
    try {
        // #ifdef H5 || MP
        uni.hideKeyboard();
        // #endif
    } catch {
        /* 平台不支持时忽略 */
    }
}

function format(value: string, trigger: 'input' | 'blur') {
    let next = props.trim && trigger === 'blur' ? value.trim() : value;
    if (props.formatter && props.formatTrigger === trigger) next = props.formatter(next);
    return next;
}

/**
 * 回写值：格式化砍掉字符（或 trim 后变化）时先同步原生值再异步改回，
 * 否则 modelValue 没变，uni-input 不会重绘，被过滤的字符会留在输入框里。
 */
function writeValue(raw: string, next: string) {
    if (next === innerValue.value && next === raw) return;
    if (next !== raw) {
        innerValue.value = raw;
        nextTick(() => {
            if (innerValue.value !== next) innerValue.value = next;
        });
        return;
    }
    innerValue.value = next;
}

/** 输入过程中的提交：每次按键都算一次输入事件。 */
function applyInput(raw: string) {
    const next = format(raw, 'input');
    writeValue(raw, next);
    emit('update:modelValue', next);
    emit('input', next);
    void formItem?.notify('change');
}

function onInput(event: unknown) {
    const raw = readEventValue(event) ?? '';
    if (composing.value) {
        // 合成期间只回写显示值，不派发事件
        innerValue.value = raw;
        return;
    }
    applyInput(raw);
}

function onCompositionEnd(event: unknown) {
    composing.value = false;
    applyInput(readEventValue(event) ?? innerValue.value);
}

function onFocus(event: unknown) {
    focused.value = true;
    valueAtFocus = innerValue.value;
    emit('focus', event);
}

function onBlur(event: unknown) {
    focused.value = false;
    // 合成被失焦打断时 compositionend 不会触发，这里兜底复位，避免后续输入被永久吞掉
    composing.value = false;
    const raw = readEventValue(event) ?? innerValue.value;
    const next = format(raw, 'blur');
    if (next !== innerValue.value) {
        writeValue(raw, next);
        emit('update:modelValue', next);
        emit('input', next);
    }
    // change 只在失焦且值确实变化时派发（与文档一致）
    if (next !== valueAtFocus) emit('change', next);
    emit('blur', event);
    void formItem?.notify('blur');
}

function onConfirm(event: unknown) {
    emit('confirm', readEventValue(event) ?? innerValue.value, event);
}

/** 清空输入；点击清除控件与 ref.clear() 共用。 */
function clear(event?: unknown) {
    (event as { stopPropagation?: () => void } | undefined)?.stopPropagation?.();
    const hadValue = innerValue.value !== '';
    innerValue.value = '';
    if (hadValue) {
        emit('update:modelValue', '');
        emit('input', '');
        emit('change', '');
        void formItem?.notify('change');
    }
    emit('clear');
}

function togglePassword() {
    passwordVisible.value = !passwordVisible.value;
}

/** 聚焦输入框；disabled / readonly 时不生效。 */
function focus() {
    if (isDisabled.value || props.readonly) return;
    keyboardFocus.value = true;
}

/** 失焦并收起键盘。 */
function blur() {
    keyboardFocus.value = false;
    hideKeyboard();
}

/** 根节点点击：只读态由遮罩转发，禁用态不派发（对齐 uView 的 inputClick 语义）。 */
function onRootClick(event: unknown) {
    if (isDisabled.value) return;
    emit('click', event);
}

const exposed: InputExpose = { focus, blur, clear };
defineExpose(exposed);
</script>

<style scoped>
.snake-input {
    /* 行高由档位变量统一给出，原生控件用同一个值定高，文本才会真正垂直居中 */
    --snake-input-current-height: var(--snake-input-height, 40px);
    position: relative;
    display: flex;
    box-sizing: border-box;
    width: 100%;
    min-height: var(--snake-input-current-height);
    align-items: center;
    gap: 6px;
    border-radius: var(--snake-input-radius, var(--snake-radius-md, 6px));
    background-color: var(--snake-input-bg, transparent);
    transition:
        border-color 0.2s,
        background-color 0.2s;
}
.snake-input--small {
    --snake-input-current-height: var(--snake-input-height-small, 32px);
}
.snake-input--large {
    --snake-input-current-height: var(--snake-input-height-large, 48px);
}
.snake-input--surround {
    padding: 0 11px;
    border: 1px solid var(--snake-input-border-color, var(--snake-color-divider, #dcdfe6));
}
.snake-input--bottom {
    border-bottom: 1px solid var(--snake-input-border-color, var(--snake-color-divider, #dcdfe6));
}
.snake-input--circle {
    border-radius: 999px;
}
.snake-input.is-focused {
    border-color: var(--snake-color-primary, #06d290);
}
.snake-input.is-error {
    border-color: var(--snake-color-error, #fa3534);
}
.snake-input.is-disabled {
    opacity: 0.72;
}
.snake-input__native {
    flex: 1;
    min-width: 0;
    /* uni 默认把 uni-input 定死在 1.4em（约 19.6px），内部文本盒只有 16px 且贴顶，
       在 40px 行里会偏上约 1.8px；这里按档位给出确定高度，文本才会落在行中心 */
    height: var(--snake-input-current-height);
    font-size: var(--snake-input-font-size, 14px);
}
.snake-input--small .snake-input__native {
    font-size: var(--snake-input-font-size-small, 13px);
}
.snake-input--large .snake-input__native {
    font-size: var(--snake-input-font-size-large, 16px);
}
.snake-input__icon,
.snake-input__action-icon {
    flex: none;
    color: var(--snake-input-icon-color, var(--snake-color-text-muted, #909399));
}
.snake-input__mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;
}
.snake-input__actions {
    display: flex;
    flex: none;
    align-self: stretch;
    align-items: center;
    gap: 2px;
}
.snake-input__count {
    flex: none;
    color: var(--snake-input-count-color, var(--snake-color-text-muted, #909399));
    font-size: 12px;
}
.snake-input__action {
    display: flex;
    flex: none;
    align-self: stretch;
    align-items: center;
    justify-content: center;
    width: 24px;
}
</style>
