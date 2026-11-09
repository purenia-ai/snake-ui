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

            <view
                v-if="control.type === 'select' && (control.options?.length ?? 0) > 3"
                class="demo-control__options demo-control__chips"
            >
                <view
                    v-for="option in control.options"
                    :key="String(option.value)"
                    class="demo-control__chip"
                    :class="{ 'demo-control__chip--active': String(values[control.key]) === String(option.value) }"
                    @click="emit('change', control.key, option.value)"
                >
                    <text class="demo-control__chip-label">{{ option.label }}</text>
                </view>
            </view>

            <snake-subsection
                v-else-if="control.type === 'select'"
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
                    :placeholder="control.placeholder ? text(control.placeholder) : `${text('请输入')}${control.label}`"
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
/* 选项多于 4 个时改成可换行的标签栅格，避免英文标签被压缩成省略号 */
.demo-control__chips {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 6px;
}
.demo-control__chip {
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    border: 1px solid var(--snake-color-divider);
    border-radius: 7px;
    background: var(--snake-color-surface);
}
.demo-control__chip--active {
    border-color: var(--snake-color-primary);
    background: var(--snake-color-primary);
}
.demo-control__chip-label {
    display: block;
    max-width: 100%;
    overflow: hidden;
    color: var(--snake-color-text-secondary);
    font-size: 12px;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.demo-control__chip--active .demo-control__chip-label {
    color: var(--snake-color-primary-ink);
    font-weight: 600;
}
.demo-control__slider {
    margin-top: 10px;
}
.demo-control__input {
    margin-top: 10px;
}
</style>
