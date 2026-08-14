<script setup lang="ts">
import type { DemoControl, DemoValue } from './demo-config';

defineProps<{ controls: DemoControl[]; values: Record<string, DemoValue> }>();
const emit = defineEmits<{ change: [key: string, value: DemoValue] }>();

function eventValue(event: unknown): unknown {
    return (event as { detail?: { value?: unknown } })?.detail?.value;
}

function updateSwitch(control: DemoControl, event: unknown) {
    emit('change', control.key, Boolean(eventValue(event)));
}

function updateSlider(control: DemoControl, event: unknown) {
    emit('change', control.key, Number(eventValue(event)));
}

function updateInput(control: DemoControl, event: unknown) {
    emit('change', control.key, String(eventValue(event) ?? ''));
}
</script>

<template>
    <view class="demo-controls">
        <view v-for="control in controls" :key="control.key" class="demo-control">
            <view class="demo-control__head">
                <text class="demo-control__label">{{ control.label }}</text>
                <text v-if="control.type === 'slider'" class="demo-control__value"
                    >{{ values[control.key] }}{{ control.unit }}</text
                >
            </view>

            <view v-if="control.type === 'select'" class="demo-control__options">
                <view
                    v-for="option in control.options"
                    :key="String(option.value)"
                    :class="['demo-option', { 'demo-option--active': values[control.key] === option.value }]"
                    @click="emit('change', control.key, option.value)"
                    >{{ option.label }}</view
                >
            </view>

            <switch
                v-else-if="control.type === 'switch'"
                class="demo-control__switch"
                color="#06d290"
                :checked="Boolean(values[control.key])"
                @change="updateSwitch(control, $event)"
            />

            <slider
                v-else-if="control.type === 'slider'"
                class="demo-control__slider"
                active-color="#06d290"
                background-color="#dce9e2"
                :value="Number(values[control.key])"
                :min="control.min"
                :max="control.max"
                :step="control.step"
                :show-value="false"
                @changing="updateSlider(control, $event)"
                @change="updateSlider(control, $event)"
            />

            <input
                v-else
                class="demo-control__input"
                :value="String(values[control.key] ?? '')"
                :placeholder="control.placeholder || `请输入${control.label}`"
                @input="updateInput(control, $event)"
            />
        </view>
    </view>
</template>

<style lang="scss" scoped>
@import './theme.scss';

.demo-controls {
    margin: -4px 0;
}
.demo-control {
    position: relative;
    min-height: 44px;
    padding: 16px 0;
    border-bottom: 1px solid $snake-border;
}
.demo-control:last-child {
    border-bottom: 0;
}
.demo-control__head {
    display: flex;
    min-height: 24px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}
.demo-control__label {
    color: $snake-text-main;
    font-size: 14px;
    font-weight: 600;
}
.demo-control__value {
    color: $snake-primary-dark;
    font-size: 12px;
    font-weight: 600;
}
.demo-control__options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
}
.demo-option {
    box-sizing: border-box;
    min-width: 68px;
    min-height: 40px;
    padding: 10px 12px;
    border: 1px solid $snake-border;
    border-radius: 5px;
    background: $snake-bg-card;
    color: $snake-text-sub;
    font-size: 12px;
    text-align: center;
}
.demo-option--active {
    border-color: $snake-primary;
    background: $snake-primary-soft;
    color: $snake-primary-dark;
    font-weight: 600;
}
.demo-control__switch {
    position: absolute;
    top: 12px;
    right: 0;
    transform: scale(0.78);
    transform-origin: right center;
}
.demo-control__slider {
    margin: 10px -6px -5px;
}
.demo-control__input {
    box-sizing: border-box;
    width: 100%;
    height: 44px;
    margin-top: 12px;
    padding: 0 12px;
    border: 1px solid $snake-border-strong;
    border-radius: 5px;
    background: $snake-bg-card;
    color: $snake-text-main;
    font-size: 13px;
}
</style>
