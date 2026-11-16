<template>
    <view class="snake-textarea" :class="[customClass, rootClass]" :style="rootStyle" @click="onRootClick">
        <textarea
            class="snake-textarea__native"
            :value="innerValue"
            :placeholder="placeholder"
            :placeholder-class="placeholderClass"
            :placeholder-style="`color:${placeholderColor};${placeholderStyle}`"
            :maxlength="maxlength"
            :auto-height="autoHeight"
            :fixed="fixed"
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
            :show-confirm-bar="showConfirmBar"
            :disable-default-padding="disableDefaultPadding"
            :style="nativeStyle"
            @input="onInput"
            @focus="onFocus"
            @blur="onBlur"
            @confirm="onConfirm"
            @linechange="emit('linechange', $event)"
            @keyboardheightchange="emit('keyboardheightchange', $event)"
            @compositionstart="composing = true"
            @compositionend="onCompositionEnd"
        />
        <!-- 原生 textarea 被 disabled 时会吞掉点击（小程序端尤其明显），只读态用透明遮罩承接 -->
        <view v-if="readonly" class="snake-textarea__mask" @click.stop="onRootClick" />
        <text v-if="showCount" class="snake-textarea__count">{{ currentLength }}/{{ maxlength }}</text>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Textarea
 * @description 用于多行文本输入，支持固定或自适应高度、字数统计和 Form 校验联动。
 * @see /components/textarea
 */

import { computed, inject, nextTick, ref, watch } from 'vue';
import { getFieldSizeConfig } from '../../libs/function/fieldSize';
import { addUnit, unitToPx } from '../../libs/function/unit';
import { formItemKey } from '../snake-form-item/types';
import type { TextareaEmits, TextareaExpose, TextareaProps } from './types';

/** 容器上下内边距与边框之和（10 + 21 + 1×2），用于把 height 换算成原生控件高度。 */
const TEXTAREA_PADDING_Y = 33;
/** 原生控件的最小高度，避免极小 height 时彻底塌陷。 */
const TEXTAREA_NATIVE_MIN_HEIGHT = 24;

defineOptions({
    name: 'SnakeTextarea',
    options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' }
});
const props = withDefaults(defineProps<TextareaProps>(), {
    modelValue: '',
    placeholder: '请输入内容',
    placeholderStyle: '',
    placeholderClass: '',
    maxlength: 140,
    autoHeight: false,
    fixed: false,
    count: false,
    disabled: false,
    readonly: false,
    error: false,
    border: 'surround',
    color: 'var(--snake-color-text,#303133)',
    placeholderColor: 'var(--snake-color-text-light,#c0c4cc)',
    formatter: undefined,
    formatTrigger: 'input',
    trim: false,
    focus: false,
    cursor: -1,
    selectionStart: -1,
    selectionEnd: -1,
    confirmType: 'return',
    confirmHold: false,
    adjustPosition: true,
    holdKeyboard: false,
    cursorSpacing: 0,
    showConfirmBar: true,
    disableDefaultPadding: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<TextareaEmits>();
const formItem = inject(formItemKey, null);
/** 文本域内部值，也是唯一的渲染源；外部 modelValue 只做同步。 */
const innerValue = ref(String(props.modelValue ?? ''));
/** 是否处于聚焦态，用于边框高亮。 */
const focused = ref(false);
/** 输入法合成中：合成期间不派发 v-model，等 compositionend 再提交。 */
const composing = ref(false);
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

/** 尺寸由 props.size（缺省跟随 FormItem）决定，高度与字号来自同一张表。 */
const size = computed(() => props.size || formItem?.size.value || 'default');
const sizeConfig = computed(() => getFieldSizeConfig(size.value));
/** 禁用态：自身 disabled，或 FormItem/Form 下发的 disabled。 */
const isDisabled = computed(() => props.disabled || formItem?.disabled.value || false);
const isError = computed(() => props.error || Boolean(formItem?.errorVisible.value));
/** 只有配置了有效 maxlength 才显示字数统计。 */
const showCount = computed(() => props.count && Number(props.maxlength) > 0);
/** 字数按码点统计，emoji 与生僻字不再算两个。 */
const currentLength = computed(() => Array.from(innerValue.value).length);
const rootClass = computed(() => [
    `snake-textarea--${props.border}`,
    `snake-textarea--${size.value}`,
    { 'is-focused': focused.value, 'is-error': isError.value, 'is-disabled': isDisabled.value }
]);
/**
 * 高度：autoHeight 时交给内容撑开；显式传 height 时同时写 root 的 height/min-height
 * 与原生控件的 min-height，否则会被 size 档位的 min-height 顶掉（此前 height=60 永远显示 80）。
 */
const rootStyle = computed(() => [
    {
        height: props.autoHeight ? 'auto' : props.height ? addUnit(props.height) : undefined,
        minHeight: props.height ? addUnit(props.height) : undefined
    },
    props.customStyle
]);
/** 原生控件高度 = 目标高度 - 上下内边距，保证任何 height 都不会溢出容器。 */
const nativeStyle = computed(() => ({
    color: props.color,
    fontSize: props.fontSize ? addUnit(props.fontSize) : undefined,
    minHeight: props.height
        ? addUnit(Math.max(unitToPx(props.height) - TEXTAREA_PADDING_Y, TEXTAREA_NATIVE_MIN_HEIGHT))
        : undefined
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
 * 否则 modelValue 没变，uni 的 textarea 不会重绘，被过滤的字符会留在输入框里。
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

/** 清空内容；ref.clear() 复用。 */
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

/** 根节点点击：只读态由遮罩转发，禁用态不派发（对齐 uView 的 textareaClick 语义）。 */
function onRootClick(event: unknown) {
    if (isDisabled.value) return;
    emit('click', event);
}

const exposed: TextareaExpose = { focus, blur, clear };
defineExpose(exposed);
</script>

<style scoped>
.snake-textarea {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    min-height: var(--snake-textarea-height, 80px);
    padding: var(--snake-textarea-padding, 10px 11px 21px);
    border-radius: var(--snake-textarea-radius, var(--snake-radius-md, 6px));
    background-color: var(--snake-textarea-bg, transparent);
    transition: border-color 0.2s;
}
.snake-textarea--small {
    min-height: var(--snake-textarea-height-small, 64px);
}
.snake-textarea--large {
    min-height: var(--snake-textarea-height-large, 112px);
}
.snake-textarea--surround {
    border: 1px solid var(--snake-textarea-border-color, var(--snake-color-divider, #dcdfe6));
}
.snake-textarea--bottom {
    border-bottom: 1px solid var(--snake-textarea-border-color, var(--snake-color-divider, #dcdfe6));
    border-radius: 0;
}
.snake-textarea.is-focused {
    border-color: var(--snake-color-primary, #06d290);
}
.snake-textarea.is-error {
    border-color: var(--snake-color-error, #fa3534);
}
.snake-textarea.is-disabled {
    background: var(--snake-color-disabled-bg, #f5f7fa);
    opacity: 0.72;
}
.snake-textarea__native {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-height: var(--snake-textarea-native-height, 47px);
    font-size: var(--snake-textarea-font-size, 14px);
    line-height: 1.55;
}
.snake-textarea--small .snake-textarea__native {
    min-height: var(--snake-textarea-native-height-small, 31px);
    font-size: var(--snake-textarea-font-size-small, 13px);
}
.snake-textarea--large .snake-textarea__native {
    min-height: var(--snake-textarea-native-height-large, 79px);
    font-size: var(--snake-textarea-font-size-large, 16px);
}
.snake-textarea__mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    cursor: pointer;
}
.snake-textarea__count {
    position: absolute;
    right: 9px;
    bottom: 6px;
    z-index: 3;
    color: var(--snake-textarea-count-color, var(--snake-color-text-muted, #909399));
    font-size: 11px;
    line-height: 1;
}
</style>
