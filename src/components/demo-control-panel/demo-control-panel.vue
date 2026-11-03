<template>
    <view class="demo-controls">
        <view v-for="control in controls" :key="control.key" class="demo-control">
            <view class="demo-control__head">
                <text class="demo-control__label">{{ control.label }}</text>
                <text v-if="control.type === 'slider'" class="demo-control__value">
                    {{ values[control.key] }}{{ control.unit }}
                </text>
                <snake-switch
                    v-else-if="control.type === 'switch'"
                    :model-value="Boolean(values[control.key])"
                    :size="28"
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

<script setup lang="ts">
import type { DemoControl, DemoValue } from '../../common/demo-types';
import { useDemoLocale } from '../../common/demo-i18n';

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

<style lang="scss" scoped>
@import '../../common/demo.scss';

.demo-controls {
    margin: 0;
}
.demo-control {
    padding: 15px 4px;
    border-bottom: 1px solid var(--snake-color-divider);
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
    color: var(--snake-color-text);
    font-size: 14px;
    font-weight: 500;
    line-height: 1.2;
}
.demo-control__value {
    color: var(--snake-demo-accent-text);
    font-size: 12px;
    font-weight: 600;
}
.demo-control__options {
    margin-top: 10px;
}
.demo-control__slider {
    margin-top: 10px;
}
.demo-control__input {
    margin-top: 10px;
}
</style>
