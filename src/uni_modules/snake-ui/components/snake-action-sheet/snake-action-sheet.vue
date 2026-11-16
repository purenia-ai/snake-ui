<template>
    <snake-popup
        :model-value="modelValue"
        mode="bottom"
        :round="round"
        :z-index="zIndex || undefined"
        :close-on-click-overlay="closeOnClickOverlay"
        :safe-area-inset-bottom="safeAreaInsetBottom"
        custom-class="snake-action-sheet"
        @update:model-value="onToggle"
        @close="emit('close')"
        @opened="emit('opened')"
    >
        <view class="snake-action-sheet__panel" :style="customStyle" :class="customClass">
            <view v-if="title || description" class="snake-action-sheet__header">
                <view v-if="title" class="snake-action-sheet__title">{{ title }}</view>
                <view v-if="description" class="snake-action-sheet__description">{{ description }}</view>
            </view>
            <slot name="action" :actions="actions">
                <view v-if="actions.length" class="snake-action-sheet__group">
                    <view
                        v-for="(action, index) in actions"
                        :key="`${action.name}-${index}`"
                        class="snake-action-sheet__item"
                        :class="{
                            'snake-action-sheet__item--disabled': action.disabled,
                            'snake-action-sheet__item--loading': action.loading
                        }"
                        :style="action.color ? { color: action.color } : undefined"
                        @click="onSelect(action, index)"
                    >
                        <slot name="action-item" :action="action" :index="index">
                            <view v-if="action.loading" class="snake-action-sheet__item-loading">
                                <snake-loading :size="16" inherit-color />
                            </view>
                            <snake-icon
                                v-else-if="action.icon"
                                :name="action.icon"
                                :size="16"
                                :margin-left="0"
                                :margin-right="6"
                                custom-class="snake-action-sheet__item-icon"
                            />
                            <view class="snake-action-sheet__item-text">
                                <view class="snake-action-sheet__item-name">{{ action.name }}</view>
                                <view v-if="action.subname" class="snake-action-sheet__item-subname">{{
                                    action.subname
                                }}</view>
                            </view>
                        </slot>
                    </view>
                </view>
            </slot>
            <view v-if="showCancel" class="snake-action-sheet__gap" />
            <view v-if="showCancel" class="snake-action-sheet__group">
                <view class="snake-action-sheet__item snake-action-sheet__item--cancel" @click="onCancel">
                    {{ resolvedCancelText }}
                </view>
            </view>
        </view>
    </snake-popup>
</template>

<script setup lang="ts">
/**
 * @component ActionSheet
 * @description 底部动作面板：以列表形式承载客服、分享、更多操作等低频动作，支持图标、说明、禁用与取消按钮。
 * @see /components/action-sheet
 */
import { computed } from 'vue';
import Popup from '../snake-popup/snake-popup.vue';
import Icon from '../snake-icon/snake-icon.vue';
import { translate } from '../../locale';
import { actionSheetProps, type ActionSheetAction, type ActionSheetEmits, type ActionSheetExpose } from './types';

defineOptions({
    name: 'SnakeActionSheet',
    options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' }
});

const props = defineProps(actionSheetProps);
const emit = defineEmits<ActionSheetEmits>();

/** 取消按钮文案：优先用属性，其次读语言包 common.cancel。 */
const resolvedCancelText = computed(() => props.cancelText || translate('common.cancel') || '取消');

function onToggle(value: boolean) {
    emit('update:modelValue', value);
}

function onSelect(action: ActionSheetAction, index: number) {
    if (action.disabled || action.loading) return;
    if (props.closeOnClickAction) emit('update:modelValue', false);
    emit('select', action, index);
}

function onCancel() {
    emit('update:modelValue', false);
    emit('cancel');
}

const exposed: ActionSheetExpose = {
    open: () => emit('update:modelValue', true),
    close: () => emit('update:modelValue', false)
};

defineExpose(exposed);
</script>

<style scoped>
.snake-action-sheet__panel {
    padding-bottom: 6px;
    background-color: var(--snake-action-sheet-panel-bg, var(--snake-color-background, #f6f6f6));
}

.snake-action-sheet__header {
    padding: 14px 16px 12px;
    background-color: var(--snake-action-sheet-bg, var(--snake-color-surface, #ffffff));
    text-align: center;
}

.snake-action-sheet__title {
    color: var(--snake-color-text, #303133);
    font-size: var(--snake-action-sheet-title-size, 15px);
    font-weight: 600;
    line-height: 1.4;
}

.snake-action-sheet__description {
    margin-top: 4px;
    color: var(--snake-color-text-muted, #909399);
    font-size: 12px;
    line-height: 1.5;
}

.snake-action-sheet__group {
    background-color: var(--snake-action-sheet-bg, var(--snake-color-surface, #ffffff));
}

.snake-action-sheet__item {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    min-height: var(--snake-action-sheet-item-height, 52px);
    padding: 10px 16px;
    background-color: var(--snake-action-sheet-bg, var(--snake-color-surface, #ffffff));
    color: var(--snake-color-text, #303133);
    font-size: var(--snake-action-sheet-font-size, 16px);
    line-height: 1.4;
    text-align: center;
}

.snake-action-sheet__item::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background-color: var(--snake-color-divider, #e4e7ed);
    transform: scaleY(0.5);
    transform-origin: 0 100%;
}

.snake-action-sheet__item:last-child::after {
    display: none;
}

.snake-action-sheet__item--cancel {
    color: var(--snake-color-text-secondary, #606266);
}

.snake-action-sheet__item--disabled {
    opacity: 0.4;
}

/* 加载态保留文字与完整不透明度：spinner 本身已表达「等待中」，再置灰会让人以为是禁用 */
.snake-action-sheet__item-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 6px;
    color: inherit;
}

.snake-action-sheet__item-text {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.snake-action-sheet__item-name {
    font-size: inherit;
    line-height: 1.4;
}

.snake-action-sheet__item-subname {
    margin-top: 2px;
    color: var(--snake-color-text-muted, #909399);
    font-size: 12px;
    line-height: 1.4;
}

.snake-action-sheet__item-icon {
    color: inherit;
}

.snake-action-sheet__gap {
    height: var(--snake-action-sheet-cancel-gap, 8px);
}
</style>
