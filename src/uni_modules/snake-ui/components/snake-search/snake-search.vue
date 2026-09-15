<template>
    <view class="snake-search" :class="customClass" :style="[{ margin: margin }, customStyle]" @click="clickHandler">
        <view
            class="snake-search__content"
            :style="{
                backgroundColor: bgColor,
                borderRadius: shape === 'round' ? '100rpx' : '10rpx',
                border: borderStyle,
                height: `${height}rpx`
            }"
        >
            <view class="snake-search__icon">
                <snake-icon :size="30" :name="searchIcon" :color="searchIconColor || color" />
            </view>
            <input
                confirm-type="search"
                :value="modelValue"
                :focus="focus"
                :maxlength="Number(maxlength)"
                :adjust-position="adjustPosition"
                :placeholder="placeholderText"
                :placeholder-style="`color: ${placeholderColor}`"
                class="snake-search__input"
                type="text"
                :style="[
                    {
                        textAlign: inputAlign,
                        color: color,
                        backgroundColor: bgColor,
                        pointerEvents: disabled ? 'none' : 'auto'
                    },
                    inputStyle
                ]"
                @blur="blur"
                @confirm="search"
                @input="inputChange"
                @focus="getFocus"
            />
            <view v-if="keyword && clearabled && focused" class="snake-search__clear" @click="clear">
                <snake-icon name="close-circle-fill" size="34" color="var(--snake-color-text-light, #c0c4cc)" />
            </view>
        </view>
        <view
            :style="[actionStyle]"
            class="snake-search__action"
            :class="{ 'snake-search__action--active': showActionBtn || show }"
            @click.stop.prevent="custom"
        >
            {{ actionTextValue }}
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Search
 * @description 搜索框，集成了常用搜索框所需功能，支持圆形/方形、清除控件、右侧操作按钮与聚焦动画。
 * @see /components/search
 */

import { computed, nextTick, ref, watch } from 'vue';
import { useLocale } from '../../libs/hooks/useLocale';
import Icon from '../snake-icon/snake-icon.vue';
import { searchProps, type SearchEmits } from './types';

defineOptions({ name: 'SnakeSearch', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(searchProps);
const emit = defineEmits<SearchEmits>();
const { t } = useLocale('search');

// 输入框当前值，v-model 双向同步
const keyword = ref(props.modelValue);
// 控制右侧操作按钮动画展开
const show = ref(false);
// 输入框是否处于聚焦中，聚焦时才显示清除控件
const focused = ref(props.focus);

watch(
    () => props.modelValue,
    nVal => {
        keyword.value = nVal;
    }
);
watch(keyword, nVal => {
    emit('update:modelValue', nVal);
    emit('input', nVal);
    emit('change', nVal);
});

const placeholderText = computed(() => props.placeholder || t('placeholder'));
const actionTextValue = computed(() => props.actionText || t('actionText'));
/** 未开启动画时始终显示操作按钮。 */
const showActionBtn = computed(() => {
    if (!props.animation && props.showAction) return true;
    return false;
});
/** 边框样式。 */
const borderStyle = computed(() => {
    if (props.borderColor) return `1px solid ${props.borderColor}`;
    return 'none';
});

/** 输入事件，同步输入框内容。 */
function inputChange(event: { detail: unknown }) {
    const detail = event.detail as { value?: string | number };
    keyword.value = String(detail?.value ?? '');
}
/** 清空输入，延后发出事件避免父组件读取到更新前的值。 */
function clear() {
    keyword.value = '';
    nextTick(() => {
        emit('clear');
    });
}
/** 确定搜索。 */
function search(event: { detail: unknown }) {
    const detail = event.detail as { value?: string | number };
    emit('search', String(detail?.value ?? ''));
    try {
        // #ifdef H5 || MP
        uni.hideKeyboard();
        // #endif
    } catch {
        /* 平台不支持时忽略 */
    }
}
/** 点击右侧操作按钮。 */
function custom() {
    emit('custom', keyword.value);
    try {
        // #ifdef H5 || MP
        uni.hideKeyboard();
        // #endif
    } catch {
        /* 平台不支持时忽略 */
    }
}
/** 获取焦点。 */
function getFocus() {
    focused.value = true;
    if (props.animation && props.showAction) show.value = true;
    emit('focus', keyword.value);
}
/** 失去焦点，延时隐藏清除图标避免清除点击被 blur 抢先吞掉。 */
function blur() {
    setTimeout(() => {
        focused.value = false;
    }, 100);
    show.value = false;
    emit('blur', keyword.value);
}
/** 点击搜索框，仅在禁用时发出事件，意味着想跳转真正的搜索页。 */
function clickHandler() {
    if (props.disabled) emit('click');
}
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
    padding: 0 18rpx;
}
.snake-search__icon {
    display: flex;
    align-items: center;
}
.snake-search__input {
    flex: 1;
    margin: 0 10rpx;
    font-size: 28rpx;
    line-height: 1;
    color: var(--snake-color-text-muted, #909399);
}
.snake-search__clear {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40rpx;
    height: 100%;
    border-radius: 50%;
}
.snake-search__action {
    overflow: hidden;
    width: 0;
    font-size: 28rpx;
    color: var(--snake-color-text, #303133);
    text-align: center;
    white-space: nowrap;
    transition: all 0.3s;
}
.snake-search__action--active {
    width: 100rpx;
    margin-left: 10rpx;
}
</style>
