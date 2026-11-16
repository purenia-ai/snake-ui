<template>
    <view class="snake-search" :class="customClass" :style="[{ margin: margin }, customStyle]" @click="clickHandler">
        <view class="snake-search__content" :style="contentStyle">
            <view class="snake-search__icon">
                <slot name="left">
                    <snake-icon :size="15" :name="searchIcon" :color="searchIconColor || color" />
                </slot>
            </view>
            <input
                class="snake-search__input"
                :style="inputMergeStyle"
                confirm-type="search"
                :value="keyword"
                :focus="keyboardFocus"
                :disabled="disabled"
                :maxlength="maxlengthValue"
                :adjust-position="adjustPosition"
                :placeholder="placeholderText"
                :placeholder-style="`color: ${placeholderColor}`"
                :type="type"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="handleInput"
                @confirm="handleConfirm"
            />
            <view v-if="showClear" class="snake-search__clear" @click.stop="clear">
                <snake-icon name="close-circle-fill" :size="17" color="var(--snake-color-text-light, #c0c4cc)" />
            </view>
            <slot name="right" />
        </view>
        <view
            v-if="showAction"
            class="snake-search__action"
            :class="{ 'snake-search__action--visible': actionVisible }"
            @click.stop.prevent="custom"
        >
            <view class="snake-search__action-inner" :style="actionStyle">{{ actionTextValue }}</view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Search
 * @description 搜索框，集成了常用搜索框所需功能，支持圆形/方形、清除控件、右侧操作按钮与聚焦动画。
 * @see /components/search
 */

import { computed, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';
import type { StyleValue } from '../../types/global';
import { useLocale } from '../../libs/hooks/useLocale';
import { addUnit } from '../../libs/function/unit';
import { searchProps, type SearchEmits, type SearchExpose } from './types';

defineOptions({ name: 'SnakeSearch', options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(searchProps);
const emit = defineEmits<SearchEmits>();
const { t } = useLocale('search');

/** 输入框当前值，v-model 双向同步；也是唯一的数据源，程序化改 modelValue 不会回派事件。 */
const keyword = ref(props.modelValue);
/** 右侧操作按钮的展开状态，仅 animation 打开时决定显隐。 */
const show = ref(props.focus);
/** 组件层面的聚焦开关，绑定到原生 input 的 focus 属性，供 ref.focus() 复用。 */
const keyboardFocus = ref(props.focus);

// 外部改值只同步显示，不触发 input / change，避免业务在 @input 里发起重复请求。
watch(
    () => props.modelValue,
    nVal => {
        keyword.value = nVal;
    }
);

// focus 是「请求聚焦」的一次性属性：变为 true 时聚焦，变为 false 不做反向操作。
watch(
    () => props.focus,
    nVal => {
        if (nVal) focus();
    },
    { immediate: true }
);

const placeholderText = computed(() => props.placeholder || t('placeholder'));
const actionTextValue = computed(() => props.actionText || t('actionText'));
/** 右侧操作按钮是否可见：animation 打开时跟随聚焦状态展开。 */
const actionVisible = computed(() => (props.animation ? show.value : true));
/** 是否有内容就显示清除控件（不再依赖聚焦），禁用态隐藏。 */
const showClear = computed(() => props.clearabled && !props.disabled && !!keyword.value);
/** 输入框最大长度；-1 表示不限制，非法值一并归为 -1。 */
const maxlengthValue = computed(() => {
    const parsed = Number(props.maxlength);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : -1;
});
/** 输入框容器样式；border-box 保证配置边框后高度不增长。 */
const contentStyle = computed(() => ({
    backgroundColor: props.bgColor,
    borderRadius: props.shape === 'round' ? '50px' : '5px',
    border: props.borderColor ? `1px solid ${props.borderColor}` : 'none',
    height: addUnit(props.height)
}));
const inputMergeStyle = computed<StyleValue>(() => {
    const base: CSSProperties = {
        textAlign: props.inputAlign,
        color: props.color,
        backgroundColor: props.bgColor,
        pointerEvents: props.disabled ? 'none' : 'auto'
    };
    return [base, props.inputStyle];
});

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

/** 聚焦输入框；disabled 时不生效。 */
function focus() {
    if (props.disabled) return;
    keyboardFocus.value = true;
}

/** 失焦并收起键盘。 */
function blur() {
    keyboardFocus.value = false;
    hideKeyboard();
}

/** 清空输入，同步派发事件；与点击清除控件、ref.clear() 共用。 */
function clear() {
    keyword.value = '';
    emit('update:modelValue', '');
    emit('input', '');
    emit('change', '');
    emit('clear');
}

/** 读取输入类事件的 detail.value，跨端事件对象结构不同，统一按 unknown 收窄。 */
function readEventValue(event: unknown): string | undefined {
    const detail = (event as { detail?: { value?: string | number } } | null | undefined)?.detail;
    return detail && detail.value !== undefined ? String(detail.value) : undefined;
}

/** 用户输入，只有这里才派发 v-model 与 change。 */
function handleInput(event: unknown) {
    const value = readEventValue(event) ?? '';
    keyword.value = value;
    emit('update:modelValue', value);
    emit('input', value);
    emit('change', value);
}

/** 键盘确认搜索。 */
function handleConfirm(event: unknown) {
    emit('search', readEventValue(event) ?? keyword.value);
    hideKeyboard();
}

/** 点击右侧操作按钮。 */
function custom() {
    emit('custom', keyword.value);
    hideKeyboard();
}

/** 获取焦点。 */
function handleFocus() {
    show.value = true;
    emit('focus', keyword.value);
}

/** 失去焦点。清除控件不再依赖聚焦状态，无需延时隐藏。 */
function handleBlur() {
    show.value = false;
    keyboardFocus.value = false;
    emit('blur', keyword.value);
}

/** 点击搜索框，仅在禁用时发出事件，意味着想跳转真正的搜索页。 */
function clickHandler() {
    if (props.disabled) emit('click');
}

const exposed: SearchExpose = { focus, blur, clear };
defineExpose(exposed);
</script>

<style scoped>
.snake-search {
    display: flex;
    flex: 1;
    align-items: center;
}
.snake-search__content {
    display: flex;
    flex: 1;
    align-items: center;
    min-width: 0;
    box-sizing: border-box;
    padding: 0 9px;
}
.snake-search__icon {
    display: flex;
    flex: none;
    align-items: center;
}
.snake-search__input {
    flex: 1;
    min-width: 0;
    margin: 0 5px;
    font-size: 14px;
    line-height: 1;
}
.snake-search__clear {
    display: flex;
    flex: none;
    align-self: stretch;
    align-items: center;
    justify-content: center;
    width: 20px;
}
.snake-search__action {
    display: flex;
    flex: none;
    align-self: stretch;
    align-items: center;
    max-width: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    transition:
        max-width 0.3s ease,
        opacity 0.3s ease;
}
.snake-search__action--visible {
    max-width: var(--snake-search-action-max-width, 200px);
    opacity: 1;
    pointer-events: auto;
}
.snake-search__action-inner {
    box-sizing: border-box;
    flex: none;
    margin-left: 5px;
    padding: 0 6px;
    font-size: 14px;
    line-height: 1;
    color: var(--snake-color-text, #303133);
    text-align: center;
    white-space: nowrap;
}
</style>
