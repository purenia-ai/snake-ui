<template>
    <view
        :style="toStyle(customStyle)"
        class="snake-icon"
        :class="['snake-icon--' + labelPos, customClass]"
        @click="onClick"
    >
        <image v-if="isImg" class="snake-icon__img" :src="props.name" :mode="imgMode" :style="imgStyle" />
        <text
            v-else
            class="snake-icon__icon"
            :class="iconClass"
            :style="toStyle(iconStyle)"
            :hover-class="hoverClass"
            @touchstart="onTouchstart"
        >
            <text
                v-if="showDecimalIcon"
                class="snake-icon__decimal"
                :class="decimalIconClass"
                :style="toStyle(decimalIconStyle)"
                :hover-class="hoverClass"
            />
        </text>
        <text v-if="label !== ''" class="snake-icon__label" :style="labelStyle">
            {{ label }}
        </text>
    </view>
</template>

<script lang="ts">
export default {
    name: 'snake-icon',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
};
</script>

<script setup lang="ts">
/**
 * @component Icon
 * @description 支持字体图标、图片图标、标签和百分比裁切效果的图标组件。
 * @see /components/icon
 */
import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { toStyle } from '../../libs/function/style';
import { IconProps } from './types';

const emit = defineEmits<{
    (event: 'click', index: string | number | unknown): void;
    (event: 'touchstart', index: string | number | unknown): void;
}>();

const props = defineProps(IconProps);
const themeTypes = ['primary', 'success', 'error', 'warning', 'info'];

const iconClass = computed(() => {
    let classes: string[] | string = [];
    classes.push(`${props.customPrefix}-${props.name}`);
    classes.push(props.customPrefix === 'sicon' ? 'snake-iconfont' : props.customPrefix);

    if (props.showDecimalIcon && props.inactiveColor && themeTypes.includes(props.inactiveColor)) {
        classes.push(`snake-icon__icon--${props.inactiveColor}`);
    } else if (props.color && themeTypes.includes(props.color)) {
        classes.push(`snake-icon__icon--${props.color}`);
    }

    // #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
    classes = (classes as string[]).join(' ');
    // #endif
    return classes;
});

const iconStyle = computed(() => {
    const style: Record<string, string> = {
        fontSize: props.size === 'inherit' ? 'inherit' : addUnit(props.size, 'rpx'),
        fontWeight: props.bold ? 'bold' : 'normal',
        top: addUnit(props.top, 'rpx')
    };

    if (props.showDecimalIcon && props.inactiveColor && !themeTypes.includes(props.inactiveColor)) {
        style.color = props.inactiveColor;
    } else if (props.color && !themeTypes.includes(props.color)) {
        style.color = props.color;
    }

    return style;
});

const isImg = computed(() => props.name.includes('/'));

const imgStyle = computed(() => ({
    width: props.width ? addUnit(props.width, 'rpx') : addUnit(props.size, 'rpx'),
    height: props.height ? addUnit(props.height, 'rpx') : addUnit(props.size, 'rpx')
}));

const decimalIconStyle = computed(() => {
    const style: Record<string, string> = {
        fontSize: props.size === 'inherit' ? 'inherit' : addUnit(props.size, 'rpx'),
        fontWeight: props.bold ? 'bold' : 'normal',
        top: addUnit(props.top, 'rpx'),
        width: `${props.percent}%`
    };

    if (props.color && !themeTypes.includes(props.color)) {
        style.color = props.color;
    }

    return style;
});

const decimalIconClass = computed(() => {
    let classes: string[] | string = [];
    classes.push(`${props.customPrefix}-${props.name}`);
    classes.push(props.customPrefix === 'sicon' ? 'snake-iconfont' : props.customPrefix);
    classes.push(
        props.color && themeTypes.includes(props.color)
            ? `snake-icon__icon--${props.color}`
            : 'snake-icon__icon--primary'
    );

    // #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
    classes = (classes as string[]).join(' ');
    // #endif
    return classes;
});

const labelStyle = computed(() => ({
    color: props.labelColor,
    fontSize: addUnit(props.labelSize, 'rpx'),
    marginLeft: props.labelPos === 'right' ? addUnit(props.space || props.marginLeft, 'rpx') : 0,
    marginTop: props.labelPos === 'bottom' ? addUnit(props.space || props.marginTop, 'rpx') : 0,
    marginRight: props.labelPos === 'left' ? addUnit(props.space || props.marginRight, 'rpx') : 0,
    marginBottom: props.labelPos === 'top' ? addUnit(props.space || props.marginBottom, 'rpx') : 0
}));

function onClick(event: unknown) {
    emit('click', props.index || event);
}

function onTouchstart(event: unknown) {
    emit('touchstart', props.index || event);
}
</script>

<style scoped lang="scss">
@import '../../iconfont.css';

.snake-icon {
    display: inline-flex;
    align-items: center;

    &--left {
        flex-direction: row-reverse;
        align-items: center;
    }

    &--right {
        flex-direction: row;
        align-items: center;
    }

    &--top {
        flex-direction: column-reverse;
        justify-content: center;
    }

    &--bottom {
        flex-direction: column;
        justify-content: center;
    }

    &__icon {
        position: relative;

        &--primary {
            color: var(--snake-color-primary, #06d290);
        }

        &--success {
            color: var(--snake-color-success, #19be6b);
        }

        &--error {
            color: var(--snake-color-error, #fa3534);
        }

        &--warning {
            color: var(--snake-color-warning, #ff9900);
        }

        &--info {
            color: var(--snake-color-info, #909399);
        }
    }

    &__decimal {
        position: absolute;
        top: 0;
        left: 0;
        display: inline-block;
        overflow: hidden;
    }

    &__img {
        height: auto;
        will-change: transform;
    }

    &__label {
        line-height: 1;
    }
}
</style>
