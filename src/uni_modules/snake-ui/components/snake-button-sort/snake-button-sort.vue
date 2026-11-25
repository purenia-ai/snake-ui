<template>
    <view
        class="snake-sort"
        :class="[{ 'is-active': isActive }, customClass]"
        :style="rootStyle"
        role="button"
        :aria-pressed="isActive"
        tabindex="0"
        @click="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent="toggle"
    >
        <text class="snake-sort__label" :class="{ 'is-active': isActive }" :style="labelStyle">{{ title }}</text>
        <view class="snake-sort__arrows" aria-hidden="true">
            <view class="snake-sort__arrow-up" :class="{ 'is-active': value === 'asc' }" />
            <view class="snake-sort__arrow-down" :class="{ 'is-active': value === 'desc' }" />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component ButtonSort
 * @description 用于在默认、升序和降序状态之间循环切换。
 * @see /components/button-sort
 */

import { computed, ref } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { ButtonSortEmits, ButtonSortProps, ButtonSortValue } from './types';

defineOptions({ name: 'snake-button-sort', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = withDefaults(defineProps<ButtonSortProps>(), {
    title: '',
    titleColor: '',
    activeColor: '',
    fontSize: 13,
    allowReset: true,
    descFirst: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<ButtonSortEmits>();

/**
 * 受控优先 + 内部兜底：传了 `modelValue` 就只认父级（v-model），
 * 没传时组件自己记状态，兼容原来「只监听 change」的用法。
 */
const innerValue = ref<ButtonSortValue>('');
const value = computed<ButtonSortValue>(() => props.modelValue ?? innerValue.value);
const isActive = computed(() => value.value !== '');

/**
 * 下一次要切到的状态。
 * 未排序时先进入哪个方向由 `descFirst` 决定；能否回到未排序由 `allowReset` 决定，
 * 关闭后就是升序/降序两态来回点。
 */
function nextValue(current: ButtonSortValue): ButtonSortValue {
    if (current === '') return props.descFirst ? 'desc' : 'asc';
    if (!props.allowReset) return current === 'asc' ? 'desc' : 'asc';
    return current === 'asc' ? 'desc' : '';
}

function toggle() {
    const next = nextValue(value.value);
    // 受控时父级不回写就不动，符合受控语义；未受控时落到内部状态。
    if (props.modelValue === undefined) innerValue.value = next;
    emit('update:modelValue', next);
    emit('change', { value: next });
}

// 激活色用自定义属性下发，箭头与标题共用；留空会让 var() 回退链失效，所以只在下发时定义。
const rootStyle = computed(() => [
    props.activeColor ? { '--snake-sort-active': props.activeColor } : {},
    props.customStyle
]);

// 排序中由激活色统一接管，避免 titleColor 与激活色两个来源互相打架。
const labelStyle = computed(() => ({
    ...(props.titleColor && !isActive.value ? { color: props.titleColor } : {}),
    fontSize: addUnit(props.fontSize)
}));
</script>

<style scoped>
.snake-sort {
    display: flex;
    flex: 1;
    /* 放进排序栏时撑满整行高：兄弟列整列可点，这里不该只剩一行文字可点 */
    align-self: stretch;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 0;
    padding: 0;
    cursor: pointer;
    font-size: 13px;
    line-height: 1;
    color: var(--snake-color-text, #26273a);
}
.snake-sort__label.is-active {
    color: var(--snake-sort-active, var(--snake-color-primary, #06d290));
    font-weight: 500;
}
.snake-sort__arrows {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.snake-sort__arrow-up,
.snake-sort__arrow-down {
    width: 0;
    height: 0;
    border: 5px solid transparent;
    border-radius: 1px;
    transition: border-color 0.2s;
}
.snake-sort__arrow-up {
    border-bottom-color: var(--snake-color-text-muted, #888891);
}
.snake-sort__arrow-down {
    margin-top: 2px;
    border-top-color: var(--snake-color-text-muted, #888891);
}
.snake-sort__arrow-up.is-active {
    border-bottom-color: var(--snake-sort-active, var(--snake-color-primary, #06d290));
}
.snake-sort__arrow-down.is-active {
    border-top-color: var(--snake-sort-active, var(--snake-color-primary, #06d290));
}
</style>
