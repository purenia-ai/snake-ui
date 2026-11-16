<template>
    <view class="snake-tag" :class="rootClass" :style="customStyle" @click="onClick">
        <view v-if="icon || $slots.icon" class="snake-tag__icon-wrap">
            <slot name="icon">
                <snake-icon
                    :name="icon"
                    :size="iconSize"
                    :margin-left="0"
                    :margin-right="0"
                    custom-class="snake-tag__icon"
                />
            </slot>
        </view>
        <view class="snake-tag__text">
            <slot>{{ text }}</slot>
        </view>
        <view v-if="closable" class="snake-tag__close" @click.stop="onClose">
            <snake-icon
                name="close"
                :size="iconSize"
                :margin-left="0"
                :margin-right="0"
                custom-class="snake-tag__close-icon"
            />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Tag
 * @description 标签：商品属性、状态标记与筛选结果的行内标记，支持主题、尺寸、镂空与可关闭。
 * @see /components/tag
 */
import { computed } from 'vue';
import Icon from '../snake-icon/snake-icon.vue';
import { tagProps, type TagEmits } from './types';

defineOptions({ name: 'SnakeTag', options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(tagProps);
const emit = defineEmits<TagEmits>();

/** 图标尺寸跟随档位：12 / 11 / 10 / 9，与字号同步递减。 */
const TAG_ICON_SIZE: Record<string, number> = { default: 12, medium: 11, small: 10, mini: 9 };
const iconSize = computed(() => TAG_ICON_SIZE[props.size] ?? 12);

/**
 * customStyle 是否指定了背景色。镂空态的描边就是它的轮廓，不参与。
 * 实心态此时把描边取透明，避免自定义底色上留一条主题色细边（与 snake-button 的修法一致）。
 */
const hasCustomBackground = computed(() => {
    if (props.plain) return false;
    const style = props.customStyle;
    if (!style) return false;
    if (typeof style === 'string') return /(?:^|;)\s*background(-?color)?\s*:/i.test(style);
    const source = style as Record<string, unknown>;
    return Boolean(source.backgroundColor ?? source.background);
});

const rootClass = computed(() => [
    `snake-tag--${props.type}`,
    `snake-tag--${props.size}`,
    {
        'snake-tag--plain': props.plain,
        'snake-tag--round': props.round,
        'snake-tag--hairline': props.plain && props.hairLine,
        'snake-tag--closable': props.closable,
        'snake-tag--filled': hasCustomBackground
    },
    props.customClass
]);

function onClick(event: unknown) {
    emit('click', event);
}

function onClose() {
    emit('close');
}
</script>

<style scoped>
.snake-tag {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    max-width: 100%;
    height: var(--snake-tag-height, 24px);
    padding: 0 var(--snake-tag-padding-x, 8px);
    border: 1px solid var(--snake-tag-border-color, transparent);
    border-radius: var(--snake-tag-radius, 4px);
    background-color: var(--snake-tag-bg, var(--snake-color-surface-muted, #f1f1f1));
    color: var(--snake-tag-color, var(--snake-color-text-secondary, #606266));
    font-size: var(--snake-tag-font-size, 12px);
    /* 不能用 1：文字区 overflow: hidden 会把带下伸部的西文（g/j/p）裁掉，固定高度下 1.2 不改变标签尺寸 */
    line-height: 1.2;
    vertical-align: middle;
}

.snake-tag__text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.snake-tag__icon-wrap {
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    margin-right: 2px;
    color: inherit;
}

.snake-tag__icon {
    color: inherit;
}

.snake-tag__close {
    position: relative;
    display: flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    margin-left: 2px;
    color: inherit;
    opacity: 0.7;
}

/* 关闭图标只有 9~12px，用伪元素把点击热区扩到 18px 左右，且不改变标签自身尺寸 */
.snake-tag__close::after {
    content: '';
    position: absolute;
    top: -4px;
    right: -4px;
    bottom: -4px;
    left: -2px;
}

.snake-tag__close-icon {
    color: inherit;
}

.snake-tag--medium {
    --snake-tag-height: 20px;
    --snake-tag-padding-x: 6px;
    --snake-tag-font-size: 11px;
}

.snake-tag--small {
    --snake-tag-height: 18px;
    --snake-tag-padding-x: 6px;
    --snake-tag-font-size: 10px;
}

.snake-tag--mini {
    --snake-tag-height: 16px;
    --snake-tag-padding-x: 4px;
    --snake-tag-font-size: 10px;
}

.snake-tag--round {
    --snake-tag-radius: 999px;
}

.snake-tag--default {
    --snake-tag-bg: var(--snake-color-surface-muted, #f1f1f1);
    --snake-tag-color: var(--snake-color-text-secondary, #606266);
    --snake-tag-border-color: var(--snake-color-border, #dcdfe6);
}

.snake-tag--primary {
    --snake-tag-bg: var(--snake-color-primary, #06d290);
    --snake-tag-color: var(--snake-color-white, #ffffff);
    --snake-tag-border-color: var(--snake-color-primary, #06d290);
}

.snake-tag--success {
    --snake-tag-bg: var(--snake-color-success, #19be6b);
    --snake-tag-color: var(--snake-color-white, #ffffff);
    --snake-tag-border-color: var(--snake-color-success, #19be6b);
}

.snake-tag--warning {
    --snake-tag-bg: var(--snake-color-warning, #ff9900);
    --snake-tag-color: var(--snake-color-white, #ffffff);
    --snake-tag-border-color: var(--snake-color-warning, #ff9900);
}

.snake-tag--error {
    --snake-tag-bg: var(--snake-color-error, #fa3534);
    --snake-tag-color: var(--snake-color-white, #ffffff);
    --snake-tag-border-color: var(--snake-color-error, #fa3534);
}

.snake-tag--info {
    --snake-tag-bg: var(--snake-color-info, #909399);
    --snake-tag-color: var(--snake-color-white, #ffffff);
    --snake-tag-border-color: var(--snake-color-info, #909399);
}

/* 镂空态：浅色底 + 主题色文字与描边，选择器优先级高于上面的实心态 */
.snake-tag--plain.snake-tag--default {
    --snake-tag-bg: var(--snake-color-surface, #ffffff);
    --snake-tag-color: var(--snake-color-text-secondary, #606266);
    --snake-tag-border-color: var(--snake-color-border, #dcdfe6);
}

.snake-tag--plain.snake-tag--primary {
    --snake-tag-bg: var(--snake-color-primary-light, #06d2901a);
    --snake-tag-color: var(--snake-color-primary, #06d290);
    --snake-tag-border-color: var(--snake-color-primary, #06d290);
}

.snake-tag--plain.snake-tag--success {
    --snake-tag-bg: var(--snake-color-success-light, #dbf1e1);
    --snake-tag-color: var(--snake-color-success, #19be6b);
    --snake-tag-border-color: var(--snake-color-success, #19be6b);
}

.snake-tag--plain.snake-tag--warning {
    --snake-tag-bg: var(--snake-color-warning-light, #fdf6ec);
    --snake-tag-color: var(--snake-color-warning, #ff9900);
    --snake-tag-border-color: var(--snake-color-warning, #ff9900);
}

.snake-tag--plain.snake-tag--error {
    --snake-tag-bg: var(--snake-color-error-light, #fef0f0);
    --snake-tag-color: var(--snake-color-error, #fa3534);
    --snake-tag-border-color: var(--snake-color-error, #fa3534);
}

.snake-tag--plain.snake-tag--info {
    --snake-tag-bg: var(--snake-color-info-light, #f4f4f5);
    --snake-tag-color: var(--snake-color-info, #909399);
    --snake-tag-border-color: var(--snake-color-info, #909399);
}

/* 半像素描边：根节点描边让位，改由缩放 50% 的伪元素绘制，避免 1px 在 2 倍屏上发虚 */
.snake-tag--hairline {
    border-color: transparent;
}

.snake-tag--hairline::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    width: 199.8%;
    height: 199.7%;
    border: 1px solid var(--snake-tag-border-color, transparent);
    /* 伪元素放大 2 倍再缩小一半，圆角必须同步 ×2，因此改圆角只能走 --snake-tag-radius，
       直接写 customStyle 的 border-radius 会让描边和底色对不上 */
    border-radius: calc(var(--snake-tag-radius, 4px) * 2);
    transform: scale(0.5);
    transform-origin: 0 0;
    pointer-events: none;
}

/* customStyle 指定了背景色的实心态：描边取透明，避免自定义底色上留一条主题色细边。
   必须放在所有主题/镂空规则之后，靠源码顺序覆盖 --snake-tag-border-color */
.snake-tag--filled {
    --snake-tag-border-color: transparent;
}
</style>
