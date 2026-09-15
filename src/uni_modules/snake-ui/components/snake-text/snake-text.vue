<template>
    <view
        v-if="show"
        class="snake-text"
        :class="[
            bold ? 'snake-text--bold' : '',
            block ? 'snake-text--block' : 'snake-text--inline',
            lines ? 'snake-text--ellipsis snake-text--block' : '',
            `snake-text--align-${align}`,
            customClass
        ]"
        :style="[textStyle, customStyle]"
        @click="onClick"
    >
        <!-- 前置图标 -->
        <view v-if="prefixIcon" class="snake-text__icon snake-text__prefix-icon">
            <snake-icon :name="prefixIcon" :custom-style="iconStyle" />
        </view>
        <!-- 价格模式 -->
        <text
            v-if="mode === 'price'"
            class="snake-text__price"
            :class="[type && `snake-text__value--${type}`]"
            :style="textValueStyle"
        >
            <slot>￥{{ displayValue }}</slot>
        </text>
        <!-- link 模式 -->
        <snake-link
            v-else-if="mode === 'link'"
            :text="String(displayValue)"
            :href="href"
            under-line
            :style="textValueStyle"
        />
        <!-- 开放能力模式 -->
        <template v-else-if="openType">
            <button
                class="snake-text__button snake-text__value"
                :class="[type && `snake-text__value--${type}`]"
                :style="textValueStyle"
                :open-type="openType"
                :lang="lang"
                :session-from="sessionFrom"
                :send-message-title="sendMessageTitle"
                :send-message-path="sendMessagePath"
                :send-message-img="sendMessageImg"
                :show-message-card="showMessageCard"
                :app-parameter="appParameter"
                @getuserinfo="onGetUserInfo"
                @contact="onContact"
                @getphonenumber="onGetPhoneNumber"
                @error="onError"
                @launchapp="onLaunchApp"
                @opensetting="onOpenSetting"
            >
                <slot>{{ displayValue }}</slot>
            </button>
        </template>
        <!-- 默认模式 -->
        <text v-else class="snake-text__value" :class="[type && `snake-text__value--${type}`]" :style="textValueStyle">
            <slot>{{ displayValue }}</slot>
        </text>
        <!-- 后缀图标 -->
        <view v-if="suffixIcon" class="snake-text__icon snake-text__suffix-icon">
            <snake-icon :name="suffixIcon" :custom-style="iconStyle" />
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Text
 * @description 文本，集成文本类常用功能：价格、手机号脱敏、姓名脱敏、日期格式化、超链接与拨打电话。
 * @see /components/text
 */

import { computed } from 'vue';
import { addUnit } from '../../libs/function/unit';
import { deepMerge } from '../../libs/function/deepMerge';
import { formatName, formatPrice } from '../../libs/function/format';
import { toStyle } from '../../libs/function/style';
import { timeFormat } from '../../libs/function/timeFormat';
import { test as testSuite } from '../../libs/function/test';
import Icon from '../snake-icon/snake-icon.vue';
import Link from '../snake-link/snake-link.vue';
import { textProps, type TextEmits } from './types';

defineOptions({ name: 'SnakeText', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(textProps);
const emit = defineEmits<TextEmits>();

// 是否 nvue 环境
const isNvue = computed(() => {
    let nvue = false;
    // #ifdef APP-NVUE
    nvue = true;
    // #endif
    return nvue;
});

// 处理显示的值
const displayValue = computed(() => {
    const { format, text, href, mode } = props;
    let value: unknown = text;
    if (typeof format === 'function') {
        value = format(value);
    }
    switch (mode) {
        case 'price':
            if (!/^\d+(\.\d+)?$/.test(String(value))) return value;
            value = formatPrice(value as string | number, 2);
            break;
        case 'phone':
            if (format === 'encrypt') {
                value = String(value).replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
            }
            break;
        case 'name':
            if (!testSuite.string(value)) return value;
            if (format === 'encrypt') {
                return formatName(String(value));
            }
            break;
        case 'date':
            if (testSuite.string(format) && !testSuite.empty(format)) {
                return timeFormat(value as string | number, format as string);
            }
            return timeFormat(value as string | number, 'yyyy-mm-dd');
        case 'link':
            if (!testSuite.url(href)) return value;
            break;
    }
    return value;
});

/** 根节点样式。 */
const textStyle = computed(() => {
    const style: Record<string, unknown> = {
        margin: typeof props.margin === 'number' ? `${props.margin}px` : props.margin,
        justifyContent: props.align === 'left' ? 'flex-start' : props.align === 'center' ? 'center' : 'flex-end'
    };
    return toStyle(style);
});

/** 文本值样式。 */
const textValueStyle = computed(() => {
    const style: Record<string, unknown> = {
        textDecoration: props.decoration,
        fontWeight: props.bold ? 'bold' : 'normal',
        wordWrap: props.wordWrap,
        fontSize: addUnit(props.size)
    };
    if (props.lines) {
        if (props.lines === 1) {
            style.display = 'block';
            style.overflow = 'hidden';
            style.textOverflow = 'ellipsis';
            style.whiteSpace = 'nowrap';
        } else {
            style.display = '-webkit-box';
            style['-webkit-box-orient'] = 'vertical';
            style.WebkitLineClamp = Number(props.lines);
            style.overflow = 'hidden';
        }
    }
    if (!props.type) style.color = props.color;
    if (isNvue.value && props.lines) style.lines = props.lines;
    if (props.lineHeight) style.lineHeight = addUnit(props.lineHeight);

    // 合并 textStyle，优先对象，其次字符串
    if (testSuite.object(props.textStyle)) {
        return toStyle(deepMerge(style, props.textStyle as Record<string, unknown>));
    }
    if (testSuite.string(props.textStyle)) {
        return toStyle(style, props.textStyle as string);
    }
    return toStyle(style);
});

/** 点击事件。 */
function onClick() {
    // 手机号模式且开启 call 时拨打电话
    if (props.call && props.mode === 'phone') {
        uni.makePhoneCall({
            phoneNumber: String(props.text)
        });
    }
    emit('click');
}
function onGetUserInfo(event: unknown) {
    emit('getuserinfo', (event as { detail?: unknown })?.detail);
}
function onContact(event: unknown) {
    emit('contact', (event as { detail?: unknown })?.detail);
}
function onGetPhoneNumber(event: unknown) {
    emit('getphonenumber', (event as { detail?: unknown })?.detail);
}
function onError(event: unknown) {
    emit('error', (event as { detail?: unknown })?.detail);
}
function onLaunchApp(event: unknown) {
    emit('launchapp', (event as { detail?: unknown })?.detail);
}
function onOpenSetting(event: unknown) {
    emit('opensetting', (event as { detail?: unknown })?.detail);
}
</script>

<style scoped>
.snake-text {
    display: flex;
    flex: 1;
    flex-wrap: nowrap;
    align-items: center;
    word-break: break-all;
}
.snake-text--bold {
    font-weight: bold;
}
.snake-text--inline {
    display: inline-flex;
}
.snake-text--inline .snake-text__value {
    display: inline-flex;
}
.snake-text--inline .snake-text__icon {
    display: inline-flex;
}
.snake-text--block {
    display: flex;
    width: 100%;
}
.snake-text--block .snake-text__value {
    display: flex;
}
.snake-text--block .snake-text__button {
    display: block;
    width: 100%;
}
.snake-text__price {
    font-size: 14px;
    color: var(--snake-color-text-secondary, #606266);
}
.snake-text__value {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    overflow: hidden;
    font-size: 14px;
    color: var(--snake-color-text-secondary, #606266);
    text-overflow: ellipsis;
}
.snake-text__value--primary {
    color: var(--snake-color-primary, #06d290);
}
.snake-text__value--warning {
    color: var(--snake-color-warning, #ff9900);
}
.snake-text__value--success {
    color: var(--snake-color-success, #19be6b);
}
.snake-text__value--info {
    color: var(--snake-color-info, #909399);
}
.snake-text__value--error {
    color: var(--snake-color-error, #fa3534);
}
.snake-text__value--main {
    color: var(--snake-color-text, #303133);
}
.snake-text__value--content {
    color: var(--snake-color-text-secondary, #606266);
}
.snake-text__value--tips {
    color: var(--snake-color-text-muted, #909399);
}
.snake-text__value--light {
    color: var(--snake-color-text-light, #c0c4cc);
}
.snake-text__button {
    padding: 0;
    margin: 0;
    background: none;
    border: none;
    line-height: inherit;
}
.snake-text__button::after {
    border: none;
}
</style>
