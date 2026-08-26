<script setup lang="ts">
import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import type { SnakeSubsectionEmits, SnakeSubsectionItem, SnakeSubsectionOption, SnakeSubsectionProps } from './types';

defineOptions({
    name: 'SnakeSubsection',
    options: {
        virtualHost: true,
        styleIsolation: 'shared'
    }
});

const props = withDefaults(defineProps<SnakeSubsectionProps>(), {
    list: () => [],
    current: 0,
    mode: 'button',
    activeColor: 'var(--snake-color-primary, #06d290)',
    inactiveColor: 'var(--snake-color-text-secondary, #606266)',
    fontSize: 28,
    height: 70,
    animation: true,
    bold: true,
    bgColor: 'var(--snake-color-surface-muted, #f4f6f5)',
    buttonColor: 'var(--snake-color-surface, #ffffff)',
    customClass: '',
    customStyle: ''
});

const emit = defineEmits<SnakeSubsectionEmits>();

const activeIndex = computed(() => {
    if (!props.list.length) return 0;
    return Math.max(0, Math.min(props.list.length - 1, Number(props.current) || 0));
});

const rootStyle = computed(() => [
    {
        height: addUnit(props.height, 'rpx'),
        padding: props.mode === 'button' ? '6rpx' : '0',
        borderColor: props.mode === 'subsection' ? props.activeColor : 'transparent',
        backgroundColor: props.mode === 'button' ? props.bgColor : 'transparent'
    },
    props.customStyle
]);

const sliderStyle = computed(() => {
    const count = Math.max(props.list.length, 1);
    return {
        left: props.mode === 'button' ? '6rpx' : '0',
        width: props.mode === 'button' ? `calc((100% - 12rpx) / ${count})` : `${100 / count}%`,
        top: props.mode === 'button' ? '6rpx' : '0',
        bottom: props.mode === 'button' ? '6rpx' : '0',
        backgroundColor: props.mode === 'button' ? props.buttonColor : props.activeColor,
        borderRadius: props.mode === 'button' ? '8rpx' : sliderRadius.value,
        transform: `translateX(${activeIndex.value * 100}%)`,
        transitionDuration: props.animation ? '0.3s' : '0s'
    };
});

const sliderRadius = computed(() => {
    if (props.list.length <= 1) return '8rpx';
    if (activeIndex.value === 0) return '8rpx 0 0 8rpx';
    if (activeIndex.value === props.list.length - 1) return '0 8rpx 8rpx 0';
    return '0';
});

function optionName(option: SnakeSubsectionOption): string {
    return typeof option === 'string' ? option : option.name;
}

function isDisabled(option: SnakeSubsectionOption): boolean {
    return typeof option === 'object' && Boolean((option as SnakeSubsectionItem).disabled);
}

function itemStyle(option: SnakeSubsectionOption, index: number) {
    const selected = index === activeIndex.value;
    return {
        color:
            props.mode === 'subsection' && selected
                ? 'var(--snake-color-white, #ffffff)'
                : selected
                  ? props.activeColor
                  : props.inactiveColor,
        borderColor: props.mode === 'subsection' ? props.activeColor : 'transparent',
        fontSize: addUnit(props.fontSize, 'rpx'),
        fontWeight: selected && props.bold ? '600' : '400',
        opacity: isDisabled(option) ? 0.45 : 1
    };
}

function select(option: SnakeSubsectionOption, index: number) {
    if (isDisabled(option) || index === activeIndex.value) return;
    emit('update:current', index);
    emit('change', index);
}
</script>

<template>
    <view
        :class="['snake-subsection', `snake-subsection--${mode}`, customClass]"
        :style="[$snakeThemeStyle, rootStyle]"
    >
        <view v-if="list.length" class="snake-subsection__slider" :style="sliderStyle" />
        <view
            v-for="(option, index) in list"
            :key="index"
            class="snake-subsection__item"
            :class="{ 'is-disabled': isDisabled(option) }"
            :style="itemStyle(option, index)"
            @click="select(option, index)"
        >
            <text class="snake-subsection__text">{{ optionName(option) }}</text>
        </view>
    </view>
</template>

<style scoped>
.snake-subsection {
    position: relative;
    box-sizing: border-box;
    display: flex;
    width: 100%;
    align-items: stretch;
    overflow: hidden;
    border: 1rpx solid transparent;
    border-radius: 10rpx;
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
    padding: 0 8rpx;
    border-right: 1rpx solid transparent;
    line-height: 1.2;
    text-align: center;
    transition:
        color 0.3s ease,
        opacity 0.2s ease;
}

.snake-subsection--subsection .snake-subsection__item:not(:last-child) {
    border-right-color: var(--snake-color-primary, #06d290);
}

.snake-subsection__item.is-disabled {
    cursor: not-allowed;
}

.snake-subsection__text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
