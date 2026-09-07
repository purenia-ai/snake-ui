<script setup lang="ts">
/**
 * @component SnakeIcon
 * @description 与 uView Pro u-icon 行为一致的字体及图片图标组件。
 * @see /components/icon
 */
import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { toStyle } from '../../libs/function/style';
import { SnakeIconProps } from './types';

defineOptions({
    name: 'SnakeIcon',
    options: {
        addGlobalClass: true,
        // #ifndef MP-TOUTIAO
        virtualHost: true,
        // #endif
        styleIsolation: 'shared'
    }
});

const props = defineProps(SnakeIconProps);
const emit = defineEmits<{
    (event: 'click', index: string | number | unknown): void;
    (event: 'touchstart', index: string | number | unknown): void;
}>();
const themeTypes = ['primary', 'success', 'error', 'warning', 'info'];

const iconClass = computed(() => {
    let classes: string[] | string = [`${props.customPrefix}-${props.name}`];
    classes.push(props.customPrefix === 'sicon' ? 'snake-iconfont' : props.customPrefix);
    const color = props.showDecimalIcon ? props.inactiveColor : props.color;
    if (color && themeTypes.includes(color)) classes.push(`snake-icon__icon--${color}`);
    // #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
    classes = classes.join(' ');
    // #endif
    return classes;
});
const iconStyle = computed(() => {
    const style: Record<string, string> = {
        fontSize: props.size === 'inherit' ? 'inherit' : addUnit(props.size, 'rpx'),
        fontWeight: props.bold ? 'bold' : 'normal',
        top: addUnit(props.top, 'rpx')
    };
    const color = props.showDecimalIcon ? props.inactiveColor : props.color;
    if (color && !themeTypes.includes(color)) style.color = color;
    return style;
});
const isImg = computed(() => props.name.includes('/'));
const imgStyle = computed(() => ({
    width: addUnit(props.width || props.size, 'rpx'),
    height: addUnit(props.height || props.size, 'rpx')
}));
const decimalIconStyle = computed(() => {
    const style: Record<string, string> = {
        fontSize: props.size === 'inherit' ? 'inherit' : addUnit(props.size, 'rpx'),
        fontWeight: props.bold ? 'bold' : 'normal',
        top: addUnit(props.top, 'rpx'),
        width: `${props.percent}%`
    };
    if (props.color && !themeTypes.includes(props.color)) style.color = props.color;
    return style;
});
const decimalIconClass = computed(() => {
    let classes: string[] | string = [`${props.customPrefix}-${props.name}`];
    classes.push(props.customPrefix === 'sicon' ? 'snake-iconfont' : props.customPrefix);
    classes.push(props.color && themeTypes.includes(props.color) ? `snake-icon__icon--${props.color}` : 'snake-icon__icon--primary');
    // #ifdef MP-ALIPAY || MP-TOUTIAO || MP-BAIDU
    classes = classes.join(' ');
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

<template>
    <view :style="toStyle(customStyle)" class="snake-icon" :class="['snake-icon--' + labelPos, customClass]" @click="onClick">
        <image v-if="isImg" class="snake-icon__img" :src="name" :mode="imgMode" :style="imgStyle" />
        <text v-else class="snake-icon__icon" :class="iconClass" :style="toStyle(iconStyle)" :hover-class="hoverClass" @touchstart="onTouchstart">
            <text v-if="showDecimalIcon" class="snake-icon__decimal" :class="decimalIconClass" :style="toStyle(decimalIconStyle)" :hover-class="hoverClass" />
        </text>
        <text v-if="label !== ''" class="snake-icon__label" :style="labelStyle">{{ label }}</text>
    </view>
</template>

<style scoped>
@import '../../iconfont.css';

.snake-icon { display: inline-flex; align-items: center; }
.snake-icon--left { flex-direction: row-reverse; align-items: center; }
.snake-icon--right { flex-direction: row; align-items: center; }
.snake-icon--top { flex-direction: column-reverse; justify-content: center; }
.snake-icon--bottom { flex-direction: column; justify-content: center; }
.snake-icon__icon { position: relative; }
.snake-icon__icon--primary { color: var(--snake-color-primary, #06d290); }
.snake-icon__icon--success { color: var(--snake-color-success, #19be6b); }
.snake-icon__icon--error { color: var(--snake-color-error, #fa3534); }
.snake-icon__icon--warning { color: var(--snake-color-warning, #ff9900); }
.snake-icon__icon--info { color: var(--snake-color-info, #909399); }
.snake-icon__decimal { position: absolute; top: 0; left: 0; display: inline-block; overflow: hidden; }
.snake-icon__img { height: auto; will-change: transform; }
.snake-icon__label { line-height: 1; }
</style>
