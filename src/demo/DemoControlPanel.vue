<script setup lang="ts">
import type { DemoControl, DemoValue } from './demo-config';

defineProps<{ controls: DemoControl[]; values: Record<string, DemoValue> }>();
const emit = defineEmits<{ change: [key: string, value: DemoValue] }>();
</script>

<template>
    <view class="demo-controls">
        <view v-for="control in controls" :key="control.key" class="demo-control">
            <view class="demo-control__head">
                <text class="demo-control__label">{{ control.label }}</text>
                <text v-if="control.type === 'slider'" class="demo-control__value"
                    >{{ values[control.key] }}{{ control.unit }}</text
                >
                <snake-switch
                    v-else-if="control.type === 'switch'"
                    :model-value="Boolean(values[control.key])"
                    :size="22"
                    @update:model-value="emit('change', control.key, Boolean($event))"
                />
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

            <snake-slider
                v-else-if="control.type === 'slider'"
                class="demo-control__slider"
                :model-value="Number(values[control.key])"
                :min="control.min"
                :max="control.max"
                :step="control.step"
                @update:model-value="emit('change', control.key, Number($event))"
            />

            <view v-else class="demo-control__input">
                <snake-input
                    :model-value="String(values[control.key] ?? '')"
                    :placeholder="control.placeholder || `请输入${control.label}`"
                    @update:model-value="emit('change', control.key, String($event ?? ''))"
                />
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
@import './theme.scss';

.demo-controls {
    margin: -8rpx 0;
}
.demo-control {
    padding: 28rpx 0;
    border-bottom: 1rpx solid var(--snake-color-divider);
}
.demo-control:last-child {
    border-bottom: 0;
}
.demo-control__head {
    display: flex;
    min-height: 48rpx;
    align-items: center;
    justify-content: space-between;
    gap: 24rpx;
}
.demo-control__label {
    position: relative;
    padding-left: 20rpx;
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 600;
    line-height: 1.2;
}
.demo-control__label::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 8rpx;
    height: 26rpx;
    border-radius: 4rpx;
    background: var(--snake-color-primary);
    transform: translateY(-50%);
}
.demo-control__value {
    color: var(--snake-demo-accent-text);
    font-size: 24rpx;
    font-weight: 600;
}
.demo-control__options {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;
    margin-top: 24rpx;
}
.demo-option {
    box-sizing: border-box;
    min-width: 128rpx;
    min-height: 64rpx;
    padding: 14rpx 28rpx;
    border: 1rpx solid transparent;
    border-radius: 999rpx;
    background: var(--snake-color-surface-muted);
    color: var(--snake-color-text-secondary);
    font-size: 24rpx;
    text-align: center;
    transition:
        color 0.2s ease,
        background-color 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;
}
.demo-option--active {
    border-color: rgba(var(--snake-color-primary-rgb), 0.5);
    background: var(--snake-color-primary-light);
    color: var(--snake-demo-accent-text);
    font-weight: 600;
    box-shadow: 0 4rpx 12rpx rgba(var(--snake-color-primary-rgb), 0.18);
}
.demo-control__slider {
    margin-top: 20rpx;
}
.demo-control__input {
    margin-top: 20rpx;
}
</style>
