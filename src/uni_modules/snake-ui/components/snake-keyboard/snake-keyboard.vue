<template>
    <view
        class="snake-keyboard"
        :class="customClass"
        :style="customStyle"
        :aria-disabled="isDisabled ? 'true' : 'false'"
    >
        <snake-popup
            v-model="popupValue"
            mode="bottom"
            :round="round"
            :close-on-click-overlay="closeOnClickOverlay"
            :safe-area-inset-bottom="safeAreaInsetBottom"
            :root-portal="rootPortal"
            :z-index="popupZIndex"
            @opened="emit('open')"
            @closed="onClosed"
        >
            <view class="snake-keyboard__panel">
                <view v-if="hasHeader" class="snake-keyboard__header">
                    <view class="snake-keyboard__title">{{ title }}</view>
                    <view
                        v-if="showHeaderConfirm"
                        class="snake-keyboard__confirm"
                        role="button"
                        tabindex="0"
                        :aria-label="confirmTextValue"
                        hover-class="snake-keyboard__confirm--hover"
                        :hover-stay-time="120"
                        @click="handleConfirm"
                        @keydown.enter.prevent="handleConfirm"
                    >
                        {{ confirmTextValue }}
                    </view>
                </view>
                <view class="snake-keyboard__body" :class="{ 'snake-keyboard__body--car': isCar }">
                    <view class="snake-keyboard__grid" :class="{ 'snake-keyboard__grid--car': isCar }">
                        <view
                            v-for="(key, index) in keys"
                            :key="`${key.type}-${key.text}-${index}`"
                            class="snake-keyboard__cell"
                            :class="{ 'snake-keyboard__cell--wider': key.wider }"
                        >
                            <view
                                class="snake-keyboard__key"
                                :class="keyClass(key)"
                                role="button"
                                tabindex="0"
                                :aria-label="keyLabel(key)"
                                hover-class="snake-keyboard__key--hover"
                                :hover-stay-time="100"
                                @click="onKeyClick(key)"
                                @touchstart="onKeyTouchStart(key)"
                                @touchend="onKeyTouchEnd"
                                @touchcancel="onKeyTouchEnd"
                                @keydown.enter.prevent="onKeyClick(key)"
                            >
                                <snake-icon v-if="key.type === 'delete' && !deleteText" name="backspace" :size="20" />
                                <snake-icon v-else-if="key.type === 'close'" name="arrow-down" :size="18" />
                                <text v-else class="snake-keyboard__text">{{ key.text }}</text>
                            </view>
                        </view>
                    </view>
                    <view v-if="hasSidebar" class="snake-keyboard__sidebar">
                        <view
                            v-if="showDeleteKey"
                            class="snake-keyboard__side"
                            role="button"
                            tabindex="0"
                            :aria-label="deleteLabelValue"
                            hover-class="snake-keyboard__side--hover"
                            :hover-stay-time="100"
                            @click="onDeleteClick"
                            @touchstart="startDeleteHold"
                            @touchend="stopDeleteHold"
                            @touchcancel="stopDeleteHold"
                            @keydown.enter.prevent="onDeleteClick"
                        >
                            <snake-icon v-if="!deleteText" name="backspace" :size="22" />
                            <text v-else class="snake-keyboard__side-text">{{ deleteText }}</text>
                        </view>
                        <view
                            v-if="showConfirmKey"
                            class="snake-keyboard__side snake-keyboard__side--primary"
                            :class="{ 'snake-keyboard__side--stacked': showDeleteKey }"
                            role="button"
                            tabindex="0"
                            :aria-label="confirmTextValue"
                            hover-class="snake-keyboard__side--hover"
                            :hover-stay-time="120"
                            @click="handleConfirm"
                            @keydown.enter.prevent="handleConfirm"
                        >
                            <text class="snake-keyboard__side-text">{{ confirmTextValue }}</text>
                        </view>
                    </view>
                </view>
            </view>
        </snake-popup>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Keyboard
 * @description 底部虚拟键盘，内置数字、金额与身份证三种按键组合，支持随机顺序、长按连续删除与右侧大键形态。
 * @see /components/keyboard
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue';
import zIndex from '../../libs/config/zIndex';
import { useLocale } from '../../libs/hooks/useLocale';
import { CAR_KEYBOARD_AREAS, CAR_KEYBOARD_KEYS } from './constants';
import {
    KEYBOARD_DELETE_HOLD_DELAY,
    KEYBOARD_DELETE_REPEAT_INTERVAL,
    keyboardProps,
    type CarKeyboardLang,
    type KeyboardEmits,
    type KeyboardExpose,
    type KeyboardKey
} from './types';

defineOptions({ name: 'SnakeKeyboard', options: { virtualHost: true, styleIsolation: 'shared' } });
const props = defineProps(keyboardProps);
const emit = defineEmits<KeyboardEmits>();
const { t } = useLocale('keyboard');

/** 数字键基序，随机开关打开时每次打开重新洗牌。 */
const BASE_DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
/** 洗牌种子：打开时自增，让 keys 重新计算一次随机顺序。 */
const shuffleSeed = ref(0);
/** 车牌键盘的非受控语言，传入 carLang 时以 prop 为准。 */
const internalCarLang = ref<CarKeyboardLang>('zh');
/** 长按删除的启动定时器。 */
let holdTimer: ReturnType<typeof setTimeout> | null = null;
/** 长按删除的连发定时器。 */
let repeatTimer: ReturnType<typeof setInterval> | null = null;
/** 长按已经触发过连续删除时为 true，用来吞掉松手后补发的 click。 */
let holdFired = false;

const popupZIndex = computed(() => Number(props.zIndex) || zIndex.popup);
const isDisabled = computed(() => props.disabled);
const popupValue = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
});

const confirmTextValue = computed(() => props.confirmText || t('confirmText'));
const deleteLabelValue = computed(() => props.deleteText || t('deleteText'));
const closeLabelValue = computed(() => t('closeText'));

const showHeaderConfirm = computed(() => props.mode !== 'custom' && props.showConfirm);
const isCar = computed(() => props.mode === 'car');
const carLangValue = computed<CarKeyboardLang>(() => props.carLang ?? internalCarLang.value);
const hasHeader = computed(() => !!props.title || showHeaderConfirm.value);
const hasSidebar = computed(() => props.mode === 'custom' && (props.showDeleteKey || props.showConfirm));
const showConfirmKey = computed(() => hasSidebar.value && props.showConfirm);

/** 输入值最大长度，达到上限后不再追加。 */
const maxlengthValue = computed(() => {
    const value = Number(props.maxlength);
    return Number.isFinite(value) && value >= 0 ? value : Infinity;
});

/**
 * 生成当前形态的按键序列。
 * - `default`：9 个数字 + 额外键（无则收起键）+ 0 + 删除键，固定 12 格。
 * - `custom`：9 个数字 + 加宽的 0 + 额外键，删除与确认移到右侧大键。
 * - `car`：10 列网格，前 30 个按键 + 中英切换键（占两列）+ 余下按键 + 删除键（占两列）。
 */
const keys = computed<KeyboardKey[]>(() => {
    void shuffleSeed.value;
    if (props.mode === 'car') return buildCarKeys(carLangValue.value);
    const digits = props.randomKeyOrder ? shuffle([...BASE_DIGITS]) : [...BASE_DIGITS];
    const list: KeyboardKey[] = digits.map(text => ({ text, type: 'input' as const, wider: false }));
    const extra = props.extraKey;
    if (props.mode === 'custom') {
        list.push({ text: '0', type: 'input', wider: true });
        if (extra) list.push({ text: extra, type: 'extra', wider: false });
        return list;
    }
    list.push(extra ? { text: extra, type: 'extra', wider: false } : { text: '', type: 'close', wider: false });
    // 删除键不在时让 0 占两列，末行不会只剩一个单元格
    list.push({ text: '0', type: 'input', wider: !props.showDeleteKey });
    if (props.showDeleteKey) list.push({ text: '', type: 'delete', wider: false });
    return list;
});

/** 车牌键盘按键：省份页与字母页各 36 / 34 个按键，中英切换键与删除键各占两列。 */
function buildCarKeys(lang: CarKeyboardLang): KeyboardKey[] {
    const source = lang === 'zh' ? CAR_KEYBOARD_AREAS : CAR_KEYBOARD_KEYS;
    const list: KeyboardKey[] = source.slice(0, 30).map(text => ({ text, type: 'input' as const, wider: false }));
    list.push({ text: lang === 'zh' ? 'ABC' : '省份', type: 'carLang', wider: true });
    list.push(...source.slice(30).map(text => ({ text, type: 'input' as const, wider: false })));
    if (props.showDeleteKey) list.push({ text: '', type: 'delete', wider: true });
    return list;
}

/** 切换车牌语言：传入 carLang 时走受控事件，否则改内部状态。 */
function setCarLang(next: CarKeyboardLang): void {
    if (props.carLang) {
        emit('update:carLang', next);
        return;
    }
    internalCarLang.value = next;
}

/** Fisher-Yates 洗牌，返回新数组。 */
function shuffle(list: string[]): string[] {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

/** 按键组合类名：只有功能键（收起/删除/中英）压一档底色，额外键与数字键同色。 */
function keyClass(key: KeyboardKey): string[] {
    return key.type === 'input' ? [] : [`snake-keyboard__key--${key.type}`];
}

/** 按键无障碍文案：图标键取语言包，其余取键值。 */
function keyLabel(key: KeyboardKey): string {
    if (key.type === 'delete') return deleteLabelValue.value;
    if (key.type === 'close') return closeLabelValue.value;
    return key.text;
}

/** 派发一次删除：先通知事件，再交出裁剪后的值；车牌自动模式下删空回到省份页。 */
function emitDelete(): void {
    emit('delete');
    if (!props.modelValue) return;
    const next = props.modelValue.slice(0, -1);
    emit('update:modelValue', next);
    if (isCar.value && props.autoSwitchLang && !props.carLang && next.length === 0) setCarLang('zh');
}

/** 追加一个字符，达到 maxlength 后忽略；车牌自动模式下输完首位省份切到字母页。 */
function appendKey(text: string): void {
    if (props.modelValue.length >= maxlengthValue.value) return;
    const wasEmpty = props.modelValue.length === 0;
    emit('input', text);
    emit('update:modelValue', props.modelValue + text);
    if (isCar.value && wasEmpty && props.autoSwitchLang && !props.carLang) setCarLang('en');
}

function stopDeleteHold(): void {
    if (holdTimer) {
        clearTimeout(holdTimer);
        holdTimer = null;
    }
    if (repeatTimer) {
        clearInterval(repeatTimer);
        repeatTimer = null;
    }
}

/** 开始长按删除：短暂停顿后连发，松开由 stopDeleteHold 收尾。 */
function startDeleteHold(): void {
    if (isDisabled.value) return;
    stopDeleteHold();
    holdFired = false;
    holdTimer = setTimeout(() => {
        holdTimer = null;
        holdFired = true;
        emitDelete();
        repeatTimer = setInterval(emitDelete, KEYBOARD_DELETE_REPEAT_INTERVAL);
    }, KEYBOARD_DELETE_HOLD_DELAY);
}

/** 删除键点击：长按已经连发过时只吞掉这次 click，避免停下后再多删一位。 */
function onDeleteClick(): void {
    if (isDisabled.value) return;
    if (holdFired) {
        holdFired = false;
        return;
    }
    emitDelete();
}

/** 格子按键点击：删除键走连发通道，数字与额外键追加值，收起键关闭键盘，中英键切页。 */
function onKeyClick(key: KeyboardKey): void {
    if (isDisabled.value) return;
    if (key.type === 'delete') {
        onDeleteClick();
        return;
    }
    if (key.type === 'close') {
        close();
        return;
    }
    if (key.type === 'carLang') {
        setCarLang(carLangValue.value === 'zh' ? 'en' : 'zh');
        return;
    }
    appendKey(key.text);
}

function onKeyTouchStart(key: KeyboardKey): void {
    if (key.type === 'delete') startDeleteHold();
}

function onKeyTouchEnd(): void {
    stopDeleteHold();
}

/** 确认：先派发当前值再关闭。 */
function handleConfirm(): void {
    if (isDisabled.value) return;
    emit('confirm', props.modelValue);
    close();
}

function onClosed(): void {
    stopDeleteHold();
    holdFired = false;
    emit('close');
}

/** 打开键盘，需要绑定 visible 才能生效。 */
function open(): void {
    if (isDisabled.value || props.visible) return;
    shuffleSeed.value += 1;
    emit('update:visible', true);
}

/** 关闭键盘。 */
function close(): void {
    stopDeleteHold();
    emit('update:visible', false);
}

watch(
    () => props.visible,
    value => {
        if (value) {
            shuffleSeed.value += 1;
            return;
        }
        stopDeleteHold();
    }
);

// 禁用态不允许被外部打开
watch(isDisabled, value => {
    if (value && props.visible) emit('update:visible', false);
});

onBeforeUnmount(stopDeleteHold);

defineExpose<KeyboardExpose>({ open, close });
</script>

<style scoped>
.snake-keyboard__panel {
    overflow: hidden;
    width: 100%;
    background-color: var(--snake-keyboard-panel-bg, var(--snake-color-surface-muted, #f1f1f1));
}
.snake-keyboard__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: var(--snake-keyboard-toolbar-height, 44px);
}
.snake-keyboard__header::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    border-bottom: 1px solid var(--snake-keyboard-divider-color, var(--snake-color-divider, #e4e7ed));
    transform: scaleY(0.5);
}
.snake-keyboard__title {
    max-width: 60%;
    overflow: hidden;
    font-size: var(--snake-keyboard-title-font-size, 15px);
    font-weight: var(--snake-keyboard-title-font-weight, 600);
    color: var(--snake-keyboard-title-color, var(--snake-color-text, #303133));
    text-overflow: ellipsis;
    white-space: nowrap;
}
.snake-keyboard__confirm {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding: 0 var(--snake-keyboard-toolbar-padding-x, 16px);
    font-size: var(--snake-keyboard-confirm-font-size, 16px);
    color: var(--snake-keyboard-confirm-color, var(--snake-color-primary, #06d290));
}
.snake-keyboard__confirm--hover {
    opacity: 0.6;
}
/* 键盘区靠「左内边距 + 每格右下内边距」撑出等间距，小程序端不依赖 flex gap */
.snake-keyboard__body {
    display: flex;
    padding: var(--snake-keyboard-padding-top, 8px) 0 0 var(--snake-keyboard-gap, 6px);
}
.snake-keyboard__grid {
    display: flex;
    flex: 3;
    flex-wrap: wrap;
}
/* 车牌键盘：10 列网格，按键更窄，间距、高度与字号同步收紧 */
.snake-keyboard__body--car {
    padding-left: var(--snake-keyboard-car-gap, 4px);
}
.snake-keyboard__grid--car .snake-keyboard__cell {
    flex-basis: 10%;
    padding: 0 var(--snake-keyboard-car-gap, 4px) var(--snake-keyboard-car-gap, 4px) 0;
}
.snake-keyboard__grid--car .snake-keyboard__cell--wider {
    flex-basis: 20%;
}
.snake-keyboard__grid--car .snake-keyboard__key {
    height: var(--snake-keyboard-car-key-height, 48px);
}
.snake-keyboard__grid--car .snake-keyboard__text {
    font-size: var(--snake-keyboard-car-key-font-size, 18px);
}
.snake-keyboard__cell {
    box-sizing: border-box;
    flex: 0 0 33.3333%;
    padding: 0 var(--snake-keyboard-gap, 6px) var(--snake-keyboard-gap, 6px) 0;
}
.snake-keyboard__cell--wider {
    flex-basis: 66.6666%;
}
.snake-keyboard__key {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    height: var(--snake-keyboard-key-height, 56px);
    color: var(--snake-keyboard-key-color, var(--snake-color-text, #303133));
    background-color: var(--snake-keyboard-key-bg, var(--snake-color-surface, #ffffff));
    border-radius: var(--snake-keyboard-key-radius, var(--snake-radius-base, 6px));
}
.snake-keyboard__text {
    font-size: var(--snake-keyboard-key-font-size, 26px);
    font-weight: var(--snake-keyboard-key-font-weight, 500);
    line-height: 1;
}
/* 只有「功能键」压一档灰：收起、删除、中英切换。
   额外键（. / X）是字符键，和数字键同底色，否则金额键盘里会冒出一个小灰块 */
.snake-keyboard__key--delete,
.snake-keyboard__key--close,
.snake-keyboard__key--carLang {
    color: var(--snake-keyboard-function-color, var(--snake-color-text-secondary, #606266));
    background-color: var(--snake-keyboard-function-bg, var(--snake-color-border, #dcdfe6));
}
/* 按下反馈放在功能键之后：同权重时后写的规则生效，功能键也能变色。
   用中性灰而不是品牌色浅调：按键是常规输入控件，按下只是「被按住」的状态提示 */
.snake-keyboard__key--hover {
    background-color: var(--snake-keyboard-key-hover-bg, var(--snake-color-divider, #e4e7ed));
}
.snake-keyboard__sidebar {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0 var(--snake-keyboard-gap, 6px) var(--snake-keyboard-gap, 6px) 0;
}
.snake-keyboard__side {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    color: var(--snake-keyboard-function-color, var(--snake-color-text-secondary, #606266));
    /* 右侧删除大键占 1/3 宽 × 半块高，填功能键那档灰会变成面板里最重的一块，跟数字键同底色 */
    background-color: var(--snake-keyboard-side-bg, var(--snake-color-surface, #ffffff));
    border-radius: var(--snake-keyboard-key-radius, var(--snake-radius-base, 6px));
}
/* 用显式类而不是相邻选择器给第二个大键留缝，WXSS 对兄弟选择器支持不稳定 */
.snake-keyboard__side--stacked {
    margin-top: var(--snake-keyboard-gap, 6px);
}
.snake-keyboard__side--primary {
    color: var(--snake-keyboard-primary-color, var(--snake-color-primary-ink, #ffffff));
    background-color: var(--snake-keyboard-primary-bg, var(--snake-color-primary, #06d290));
}
.snake-keyboard__side--hover {
    opacity: 0.8;
}
.snake-keyboard__side-text {
    font-size: var(--snake-keyboard-side-font-size, 16px);
    font-weight: var(--snake-keyboard-side-font-weight, 500);
    line-height: 1;
}
</style>
