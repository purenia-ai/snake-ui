<template>
    <view
        :class="['snake-subsection', `snake-subsection--${mode}`, { 'is-disabled': disabled }, customClass]"
        :style="rootStyle"
        role="radiogroup"
        :aria-disabled="disabled"
    >
        <view v-if="list.length" class="snake-subsection__slider" :style="sliderStyle" />
        <view
            v-for="(option, index) in list"
            :key="index"
            class="snake-subsection__item"
            :class="{ 'is-disabled': isItemDisabled(option) }"
            :style="itemStyle(option, index)"
            role="radio"
            :aria-checked="index === activeIndex"
            :aria-disabled="isItemDisabled(option)"
            :tabindex="isItemDisabled(option) ? -1 : index === activeIndex ? 0 : -1"
            @click="select(option, index)"
            @keydown.left.prevent="selectAdjacent(index, -1)"
            @keydown.right.prevent="selectAdjacent(index, 1)"
        >
            <text class="snake-subsection__text">{{ optionName(option) }}</text>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Subsection
 * @description 用于在少量互斥选项之间快速切换，提供胶囊滑块与描边分段两种模式。
 * @see /components/subsection
 */

import { computed, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { SubsectionEmits, SubsectionItem, SubsectionOption, SubsectionProps } from './types';

defineOptions({
    name: 'Subsection',
    options: {
        virtualHost: true,
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<SubsectionProps>(), {
    list: () => [],
    current: 0,
    mode: 'button',
    activeColor: 'var(--snake-color-primary, #06d290)',
    inactiveColor: 'var(--snake-color-text-secondary, #606266)',
    fontSize: 15,
    height: 35,
    animation: true,
    bold: true,
    bgColor: 'var(--snake-color-surface-muted, #f4f6f5)',
    buttonColor: 'var(--snake-color-surface, #ffffff)',
    vibrateShort: false,
    disabled: false,
    customClass: '',
    customStyle: ''
});

const emit = defineEmits<SubsectionEmits>();

/** 越界与非法值统一夹到有效区间，避免 current 传错时滑块跑到容器外。 */
function normalizeIndex(value: number | string): number {
    if (!props.list.length) return 0;
    return Math.max(0, Math.min(props.list.length - 1, Number(value) || 0));
}

/**
 * 选中态内部兜底：父级更新 `current` 时以 prop 为准，
 * 父级只用 `:current` 而不监听事件时，点击也能真正切过去。
 */
const innerIndex = ref(normalizeIndex(props.current));

watch(
    () => [props.current, props.list.length],
    () => {
        innerIndex.value = normalizeIndex(props.current);
    }
);

const activeIndex = computed(() => innerIndex.value);

const rootStyle = computed(() => [
    {
        height: addUnit(props.height),
        padding: props.mode === 'button' ? '3px' : '0',
        // 胶囊滑块模式没有描边：把常驻的 1px 透明占位边框收掉，内容区才和描边模式一样高
        borderWidth: props.mode === 'subsection' ? '1px' : '0',
        borderColor: props.mode === 'subsection' ? props.activeColor : 'transparent',
        backgroundColor: props.mode === 'button' ? props.bgColor : 'transparent'
    },
    props.customStyle
]);

const sliderStyle = computed(() => {
    const count = Math.max(props.list.length, 1);
    return {
        left: props.mode === 'button' ? '3px' : '0',
        width: props.mode === 'button' ? `calc((100% - 6px) / ${count})` : `${100 / count}%`,
        top: props.mode === 'button' ? '3px' : '0',
        bottom: props.mode === 'button' ? '3px' : '0',
        backgroundColor: props.mode === 'button' ? props.buttonColor : props.activeColor,
        borderRadius: props.mode === 'button' ? '4px' : sliderRadius.value,
        transform: `translateX(${activeIndex.value * 100}%)`,
        transitionDuration: props.animation ? '0.3s' : '0s'
    };
});

const sliderRadius = computed(() => {
    if (props.list.length <= 1) return '4px';
    if (activeIndex.value === 0) return '4px 0 0 4px';
    if (activeIndex.value === props.list.length - 1) return '0 4px 4px 0';
    return '0';
});

function optionName(option: SubsectionOption): string {
    return typeof option === 'string' ? option : option.name;
}

function isOptionDisabled(option: SubsectionOption): boolean {
    return typeof option === 'object' && Boolean((option as SubsectionItem).disabled);
}

/** 整组禁用或单项禁用都会拦掉交互。 */
function isItemDisabled(option: SubsectionOption): boolean {
    return props.disabled || isOptionDisabled(option);
}

function itemStyle(option: SubsectionOption, index: number) {
    const selected = index === activeIndex.value;
    return {
        // 描边分段模式用 activeColor 做底色，选中项与按钮、标签一样用白字。
        color:
            props.mode === 'subsection' && selected
                ? 'var(--snake-color-white, #ffffff)'
                : selected
                  ? props.activeColor
                  : props.inactiveColor,
        // 内联样式优先级高于样式表，末项必须显式保持透明，
        // 否则分段模式下最后一项会多出一条右边框。
        borderRightColor:
            props.mode === 'subsection' && index < props.list.length - 1 ? props.activeColor : 'transparent',
        fontSize: addUnit(props.fontSize),
        fontWeight: selected && props.bold ? '600' : '400',
        opacity: isItemDisabled(option) ? 0.45 : 1
    };
}

function select(option: SubsectionOption, index: number) {
    if (isItemDisabled(option) || index === activeIndex.value) return;
    // 先落到内部状态再通知：父级不更新 current 时点击也有反馈，父级更新时以 prop 为准。
    innerIndex.value = index;
    emit('update:current', index);
    emit('change', index);
    vibrate();
}

/** 切换时的短震动是可选的轻反馈，平台不支持时静默，不影响选中。 */
function vibrate(): void {
    if (!props.vibrateShort) return;
    // #ifndef H5
    uni.vibrateShort({ fail: () => {} });
    // #endif
}

function selectAdjacent(index: number, direction: -1 | 1) {
    if (props.disabled) return;
    for (let offset = 1; offset <= props.list.length; offset += 1) {
        const target = (index + direction * offset + props.list.length) % props.list.length;
        const option = props.list[target];
        if (option && !isItemDisabled(option)) {
            select(option, target);
            return;
        }
    }
}
</script>

<style scoped>
.snake-subsection {
    position: relative;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    align-items: stretch;
    overflow: hidden;
    border: 1px solid transparent;
    border-radius: 5px;
}

.snake-subsection__slider {
    position: absolute;
    z-index: 0;
    transition-property: transform, background-color, border-radius;
    transition-timing-function: ease;
}

.snake-subsection__item {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    display: flex;
    flex: 1;
    min-width: 0;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    border-right: 1px solid transparent;
    line-height: 1.2;
    text-align: center;
    transition:
        color 0.3s ease,
        opacity 0.2s ease;
}

.snake-subsection.is-disabled,
.snake-subsection__item.is-disabled {
    cursor: not-allowed;
}

.snake-subsection__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
