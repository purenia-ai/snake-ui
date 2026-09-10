<script setup lang="ts">
/**
 * @component Slider
 * @description 通过轨道点击或触摸拖动选择数值，支持步长、数值气泡、边界值与自定义滑块。
 * @see /components/slider
 */

import { computed, getCurrentInstance, inject, onMounted, ref, watch } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { formItemKey } from '../../libs/internal/form-item';
import type { SliderEmits, SliderExpose, SliderProps } from './types';
defineOptions({ name: 'Slider', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = withDefaults(defineProps<SliderProps>(), {
    modelValue: 0,
    min: 0,
    max: 100,
    step: 1,
    height: 6,
    blockWidth: 30,
    activeColor: 'var(--snake-color-primary,#06D290)',
    inactiveColor: 'var(--snake-color-divider,#e4e7ed)',
    blockColor: '#fff',
    blockStyle: '',
    disabled: false,
    useSlot: false,
    showValue: false,
    valuePosition: 'top',
    showEdgeValue: false,
    customClass: '',
    customStyle: ''
});
const emit = defineEmits<SliderEmits>();
const formItem = inject(formItemKey, null);
const instance = getCurrentInstance();
const trackLeft = ref(0);
const trackWidth = ref(0);
const dragging = ref(false);
const minValue = computed(() => Number(props.min) || 0);
const maxValue = computed(() => Math.max(minValue.value, Number(props.max) || 0));
const stepValue = computed(() => Math.max(Number(props.step) || 1, Number.EPSILON));
function decimals(value: number) {
    const text = String(value);
    return text.includes('.') ? text.split('.')[1].length : 0;
}
function normalize(raw: unknown) {
    const number = Number(raw);
    const safe = Number.isFinite(number) ? number : minValue.value;
    const stepped = minValue.value + Math.round((safe - minValue.value) / stepValue.value) * stepValue.value;
    return Number(
        Math.max(minValue.value, Math.min(maxValue.value, stepped)).toFixed(
            Math.max(decimals(stepValue.value), decimals(minValue.value))
        )
    );
}
const current = ref(normalize(props.modelValue));
watch(
    () => props.modelValue,
    value => {
        if (!dragging.value) current.value = normalize(value);
    }
);
const percent = computed(() =>
    maxValue.value === minValue.value ? 0 : ((current.value - minValue.value) / (maxValue.value - minValue.value)) * 100
);
const rootStyle = computed(() => [
    { padding: `${addUnit((Number.parseFloat(String(props.blockWidth)) || 30) / 2, 'rpx')} 0` },
    props.customStyle
]);
const activeStyle = computed(() => ({ width: `${percent.value}%`, backgroundColor: props.activeColor }));
const blockStyleValue = computed(() => [
    {
        left: `${percent.value}%`,
        width: addUnit(props.blockWidth, 'rpx'),
        height: addUnit(props.blockWidth, 'rpx'),
        backgroundColor: props.blockColor
    },
    props.blockStyle
]);
async function update() {
    if (typeof uni === 'undefined') return;
    await new Promise<void>(resolve => {
        uni.createSelectorQuery()
            .in(instance?.proxy as any)
            .select('.snake-slider__track')
            .boundingClientRect((rect: any) => {
                if (rect) {
                    trackLeft.value = Number(rect.left) || 0;
                    trackWidth.value = Number(rect.width) || 0;
                }
            })
            .exec(() => resolve());
    });
}
function clientX(event: any) {
    return Number(
        event.touches?.[0]?.clientX ?? event.changedTouches?.[0]?.clientX ?? event.detail?.x ?? event.clientX
    );
}
function valueFromEvent(event: any) {
    const x = clientX(event);
    if (!Number.isFinite(x) || trackWidth.value <= 0) return current.value;
    return normalize(minValue.value + ((x - trackLeft.value) / trackWidth.value) * (maxValue.value - minValue.value));
}
function setFromEvent(event: any, moving = false) {
    const next = valueFromEvent(event);
    if (next === current.value) return;
    current.value = next;
    emit('update:modelValue', next);
    if (moving) emit('moving', next);
}
async function start(event: any) {
    if (props.disabled) return;
    if (!trackWidth.value) await update();
    dragging.value = true;
    setFromEvent(event);
    emit('start', current.value);
}
function move(event: any) {
    if (!dragging.value || props.disabled) return;
    setFromEvent(event, true);
}
function end(event: any) {
    if (!dragging.value || props.disabled) return;
    setFromEvent(event);
    dragging.value = false;
    emit('end', current.value);
    emit('change', current.value);
    void formItem?.notify('change');
}
async function tap(event: any) {
    if (props.disabled || dragging.value) return;
    if (!trackWidth.value) await update();
    setFromEvent(event);
    emit('change', current.value);
    void formItem?.notify('change');
}
function adjust(direction: -1 | 1) {
    if (props.disabled) return;
    const next = normalize(current.value + stepValue.value * direction);
    if (next === current.value) return;
    current.value = next;
    emit('update:modelValue', next);
    emit('change', next);
    void formItem?.notify('change');
}
onMounted(() => void update());
defineExpose<SliderExpose>({ update });
</script>
<template>
    <view
        class="snake-slider"
        :class="[customClass, { 'is-disabled': disabled }]"
        :style="rootStyle"
    >
        <text v-if="showEdgeValue" class="snake-slider__edge">{{ minValue }}</text>
        <view class="snake-slider__main"
            ><view
                class="snake-slider__track"
                :style="{ height: addUnit(height, 'rpx'), backgroundColor: inactiveColor }"
                role="slider"
                :aria-valuemin="minValue"
                :aria-valuemax="maxValue"
                :aria-valuenow="current"
                :aria-disabled="disabled"
                :tabindex="disabled ? -1 : 0"
                @click="tap"
                @keydown.left.prevent="adjust(-1)"
                @keydown.down.prevent="adjust(-1)"
                @keydown.right.prevent="adjust(1)"
                @keydown.up.prevent="adjust(1)"
                @touchstart.stop.prevent="start"
                @touchmove.stop.prevent="move"
                @touchend.stop.prevent="end"
                @touchcancel.stop.prevent="end"
                ><view class="snake-slider__active" :style="activeStyle" /><view
                    class="snake-slider__block"
                    :style="blockStyleValue"
                    ><slot v-if="useSlot || $slots.default" :value="current" /></view
                ><text
                    v-if="showValue"
                    class="snake-slider__value"
                    :class="`is-${valuePosition}`"
                    :style="{ left: `${percent}%` }"
                    >{{ current }}</text
                ></view
            ></view
        >
        <text v-if="showEdgeValue" class="snake-slider__edge">{{ maxValue }}</text>
    </view>
</template>
<style scoped>
.snake-slider {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 18rpx;
}
.snake-slider.is-disabled {
    opacity: 0.45;
}
.snake-slider__main {
    flex: 1;
    min-width: 0;
    padding: 28rpx 0;
}
.snake-slider__track {
    position: relative;
    border-radius: 999px;
}
.snake-slider__track:focus-visible {
    outline: 2px solid var(--snake-color-primary, #06d290);
    outline-offset: 8rpx;
}
.snake-slider__active {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: inherit;
}
.snake-slider__block {
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 2rpx 12rpx rgba(15, 30, 24, 0.2);
    transform: translate(-50%, -50%);
}
.snake-slider__value {
    position: absolute;
    padding: 4rpx 10rpx;
    border-radius: 8rpx;
    color: #fff;
    font-size: 20rpx;
    line-height: 1.2;
    background: rgba(15, 30, 24, 0.76);
    transform: translateX(-50%);
}
.snake-slider__value.is-top {
    bottom: 22rpx;
}
.snake-slider__value.is-bottom {
    top: 22rpx;
}
.snake-slider__edge {
    color: var(--snake-color-text-muted, #909399);
    font-size: 24rpx;
}
</style>
