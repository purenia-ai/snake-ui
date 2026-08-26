<script setup lang="ts">
import type { DemoControl, DemoValue } from './demo-config';
import { useDemoLocale } from './demo-i18n';

const props = defineProps<{ controls: DemoControl[]; values: Record<string, DemoValue> }>();
const emit = defineEmits<{ change: [key: string, value: DemoValue] }>();
const { text } = useDemoLocale();

function selectedIndex(control: DemoControl): number {
    return Math.max(0, control.options?.findIndex(option => option.value === props.values[control.key]) ?? 0);
}

function selectOption(control: DemoControl, index: number) {
    const option = control.options?.[index];
    if (option) emit('change', control.key, option.value);
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
                <snake-switch
                    v-else-if="control.type === 'switch'"
                    :model-value="Boolean(values[control.key])"
                    :size="56"
                    @update:model-value="emit('change', control.key, Boolean($event))"
                />
            </view>

            <snake-subsection
                v-if="control.type === 'select'"
                class="demo-control__options"
                :list="control.options?.map(option => option.label)"
                :current="selectedIndex(control)"
                @change="selectOption(control, $event)"
            />

            <snake-slider
                v-else-if="control.type === 'slider'"
                class="demo-control__slider"
                :model-value="Number(values[control.key])"
                :min="control.min"
                :max="control.max"
                :step="control.step"
                @update:model-value="emit('change', control.key, Number($event))"
            />

            <view v-else-if="control.type === 'input'" class="demo-control__input">
                <snake-input
                    :model-value="String(values[control.key] ?? '')"
                    :placeholder="control.placeholder || `${text('请输入')}${control.label}`"
                    @update:model-value="emit('change', control.key, String($event ?? ''))"
                />
            </view>
        </view>
    </view>
</template>

<style lang="scss" scoped>
@import './theme.scss';

.demo-controls {
    margin: 0;
}
.demo-control {
    padding: 30rpx 8rpx;
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
    color: var(--snake-color-text);
    font-size: 28rpx;
    font-weight: 500;
    line-height: 1.2;
}
.demo-control__value {
    color: var(--snake-demo-accent-text);
    font-size: 24rpx;
    font-weight: 600;
}
.demo-control__options {
    margin-top: 20rpx;
}
.demo-control__slider {
    margin-top: 20rpx;
}
.demo-control__input {
    margin-top: 20rpx;
}
</style>
