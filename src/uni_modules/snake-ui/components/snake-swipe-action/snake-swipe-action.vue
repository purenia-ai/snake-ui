<template>
    <view
        class="snake-swipe-action"
        :class="customClass"
        :style="customStyle"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @touchcancel="handleTouchCancel"
    >
        <view class="snake-swipe-action__wrapper" :style="wrapperStyle">
            <view class="snake-swipe-action__side snake-swipe-action__side--left" @click.stop="handleSideClick">
                <slot name="left" :close="closeSide">
                    <view
                        v-for="(button, index) in leftActions"
                        :key="`${button.text}-${index}`"
                        class="snake-swipe-action__button"
                        :class="{
                            'snake-swipe-action__button--disabled': button.disabled,
                            'snake-swipe-action__button--icon': button.icon
                        }"
                        :style="buttonStyle(button)"
                        @click.stop="handleButtonClick(button, 'left', index)"
                    >
                        <snake-icon
                            v-if="button.icon"
                            :name="button.icon"
                            size="inherit"
                            custom-class="snake-swipe-action__button-icon"
                        />
                        <text class="snake-swipe-action__button-text">{{ button.text }}</text>
                    </view>
                </slot>
            </view>
            <view class="snake-swipe-action__content" @click="handleContentClick">
                <slot />
            </view>
            <view class="snake-swipe-action__side snake-swipe-action__side--right" @click.stop="handleSideClick">
                <slot name="actions" :close="closeSide">
                    <view
                        v-for="(button, index) in actions"
                        :key="`${button.text}-${index}`"
                        class="snake-swipe-action__button"
                        :class="{
                            'snake-swipe-action__button--disabled': button.disabled,
                            'snake-swipe-action__button--icon': button.icon
                        }"
                        :style="buttonStyle(button)"
                        @click.stop="handleButtonClick(button, 'right', index)"
                    >
                        <snake-icon
                            v-if="button.icon"
                            :name="button.icon"
                            size="inherit"
                            custom-class="snake-swipe-action__button-icon"
                        />
                        <text class="snake-swipe-action__button-text">{{ button.text }}</text>
                    </view>
                </slot>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
/**
 * @component SwipeAction
 * @description 滑动操作：列表项左滑露出右侧按钮、右滑露出左侧按钮（删除、收藏、取消订单），方向锁定后接管手势，纵向手势仍交给页面滚动。
 * @see /components/swipe-action
 */
import { computed, getCurrentInstance, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useTouch } from '../../libs/hooks';
import { getRect } from '../../libs/function';
import { closeOtherOpened, registerOpened, unregisterOpened } from './registry';
import {
    swipeActionProps,
    type SwipeActionBeforeClose,
    type SwipeActionEmits,
    type SwipeActionExpose,
    type SwipeActionItem,
    type SwipeActionReason,
    type SwipeActionSide,
    type SwipeActionStatus,
    type SwipeActionType
} from './types';

defineOptions({
    name: 'SnakeSwipeAction',
    options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' }
});

const props = defineProps(swipeActionProps);
const emit = defineEmits<SwipeActionEmits>();

const instance = getCurrentInstance();
const { state, onTouchStart, onTouchMove, onTouchEnd } = useTouch();

/** 当前位移：正数露出左侧按钮，负数露出右侧按钮。 */
const offset = ref(0);
/** 是否处于手指拖动中（拖动时关闭过渡）。 */
const dragging = ref(false);
/** 手势起点对应的位移。越界时会被重设，避免回拉出现死区。 */
let startOffset = 0;
/** 已停留的状态：与 offset 解耦，避免拖动中途被当成状态变化。 */
let settledSide: SwipeActionStatus = 'close';
/** 测量得到的按钮区宽度，插槽自定义按钮据此取值。 */
const measuredLeft = ref(0);
const measuredRight = ref(0);

const actionsWidth = computed(() => props.actions.length * props.buttonWidth);
const leftActionsWidth = computed(() => props.leftActions.length * props.buttonWidth);
/** 左侧按钮区宽度：优先用实测值，查不到时退回 props 推导值。 */
const leftWidth = computed(() => measuredLeft.value || leftActionsWidth.value);
/** 右侧按钮区宽度：优先用实测值，查不到时退回 props 推导值。 */
const rightWidth = computed(() => measuredRight.value || actionsWidth.value);

const semanticColor: Record<SwipeActionType, string> = {
    primary: 'var(--snake-color-primary, #06D290)',
    success: 'var(--snake-color-success, #19BE6B)',
    warning: 'var(--snake-color-warning, #FF9900)',
    error: 'var(--snake-color-error, #FA3534)',
    info: 'var(--snake-color-info, #909399)'
};

const wrapperStyle = computed(() => ({
    transform: `translate3d(${offset.value}px, 0, 0)`,
    transition: dragging.value ? 'none' : `transform ${props.duration}ms cubic-bezier(0.18, 0.89, 0.32, 1)`
}));

function buttonStyle(button: SwipeActionItem) {
    return {
        width: `${props.buttonWidth}px`,
        backgroundColor: button.color || semanticColor[button.type || 'primary'],
        color: button.textColor || '#ffffff'
    };
}

/** 重新测量左右按钮区宽度：插槽自定义按钮的宽度由内容决定，只能实测。 */
async function refresh(): Promise<void> {
    if (!instance) return;
    const [left, right] = await Promise.all([
        getRect('.snake-swipe-action__side--left', instance),
        getRect('.snake-swipe-action__side--right', instance)
    ]);
    measuredLeft.value = left.width || 0;
    measuredRight.value = right.width || 0;
    // 按钮增减后重新对齐已停留的位移，避免停在过期宽度上
    if (settledSide !== 'close') snapTo(settledSide);
}

function snapTo(side: SwipeActionSide) {
    offset.value = side === 'left' ? leftWidth.value : -rightWidth.value;
}

/** 定位到目标侧并派发状态变化，已在目标侧时只做位移对齐。 */
function moveTo(side: SwipeActionSide) {
    const changed = settledSide !== side;
    settledSide = side;
    snapTo(side);
    registerOpened(collapse);
    if (!changed) return;
    emit('update:modelValue', side);
    emit('open', side);
}

/** 收起：只做位移与状态回收，不经拦截器（同组互斥自动收起时使用）。 */
function collapse() {
    const from = settledSide;
    settledSide = 'close';
    unregisterOpened(collapse);
    // 拖动中途被收起时 offset 还不是 0，必须显式归位
    if (offset.value !== 0) offset.value = 0;
    if (from === 'close') return;
    emit('update:modelValue', 'close');
    emit('close', from);
}

async function allowClose(reason: SwipeActionReason, position: SwipeActionSide): Promise<boolean> {
    const hook: SwipeActionBeforeClose | undefined = props.beforeClose;
    if (!hook) return true;
    try {
        // 必须明确放行：同步返回 true、异步 resolve(true)；其余一律保持展开
        return (await hook(reason, position)) === true;
    } catch {
        // 拦截器抛错按"不同意关闭"处理，避免误关
        return false;
    }
}

/** 收起并经过拦截器；被拦截时回到原位。 */
async function close(reason: SwipeActionReason = 'value') {
    if (props.disabled) return;
    const from = settledSide;
    if (from === 'close') return;
    if (!(await allowClose(reason, from))) {
        // 拦截失败：手势中途就弹回展开位置
        if (dragging.value) dragging.value = false;
        snapTo(from);
        return;
    }
    collapse();
}

function open(side?: SwipeActionSide) {
    if (props.disabled) return;
    const target: SwipeActionSide = side || (rightWidth.value > 0 ? 'right' : 'left');
    if (target === 'left' ? !leftWidth.value : !rightWidth.value) return;
    if (props.autoClose) closeOtherOpened(collapse);
    moveTo(target);
}

function handleTouchStart(event: unknown) {
    if (props.disabled || (!rightWidth.value && !leftWidth.value)) return;
    // 按住任意一行即收起同组其他已展开项：等到松手才收会出现两项同时展开的一瞬
    if (props.autoClose) closeOtherOpened(collapse);
    // 插槽内容可能在运行时变化，手势开始前刷新一次宽度（用缓存值响应本次手势）
    void refresh();
    startOffset = Math.min(leftWidth.value, Math.max(-rightWidth.value, offset.value));
    dragging.value = true;
    onTouchStart(event);
}

function handleTouchMove(event: unknown) {
    if (!dragging.value) return;
    onTouchMove(event);
    // 只有判定为横向后才阻止默认行为：纵向手势必须放行给页面滚动，不能靠模板上的 .prevent 一刀切
    if (state.direction !== 'horizontal') return;
    const source = event as { preventDefault?: () => void } | null;
    if (source && typeof source.preventDefault === 'function') source.preventDefault();
    const raw = startOffset + state.deltaX;
    const clamped = Math.min(leftWidth.value, Math.max(-rightWidth.value, raw));
    // 越界时重设手势原点：否则手指拖出边界再回拉，画面会卡住不动（死区）
    if (clamped !== raw) startOffset = clamped - state.deltaX;
    offset.value = clamped;
}

function handleTouchEnd() {
    if (!dragging.value) return;
    dragging.value = false;
    onTouchEnd();
    const current: SwipeActionStatus = offset.value < 0 ? 'right' : offset.value > 0 ? 'left' : 'close';
    if (current === 'close') {
        // 回到原位：本来就没展开时直接回弹，不派发事件
        collapse();
        return;
    }
    const width = current === 'left' ? leftWidth.value : rightWidth.value;
    const limit = Math.min(props.threshold > 0 ? props.threshold : width / 2, width);
    if (Math.abs(offset.value) >= limit) {
        // 同组其他项已在 gesture 开始时收起，这里只做停留
        moveTo(current);
        return;
    }
    // 停在阈值以内：展开态回弹走拦截器，收起态直接归位
    if (settledSide === 'close') collapse();
    else void close('swipe');
}

function handleTouchCancel() {
    if (!dragging.value) return;
    dragging.value = false;
    onTouchEnd();
    if (settledSide === 'close') collapse();
    else snapTo(settledSide);
}

function handleButtonClick(button: SwipeActionItem, side: SwipeActionSide, index: number) {
    if (button.disabled) return;
    emit('click', button, side, index);
    if (button.autoClose !== false) void close('click');
}

/** 点击按钮区空白处：插槽自定义按钮未自行收起时兜底收起。 */
function handleSideClick() {
    if (settledSide !== 'close') void close('click');
}

/** 展开态点击内容区先收起，避免误触进详情页。 */
function handleContentClick(event: unknown) {
    if (settledSide === 'close') {
        emit('contentClick');
        return;
    }
    const source = event as { stopPropagation?: () => void } | null;
    if (source && typeof source.stopPropagation === 'function') source.stopPropagation();
    void close('click');
}

function applyModelValue(value: SwipeActionStatus) {
    if (props.disabled) return;
    if (value === 'close') {
        if (settledSide !== 'close') void close('value');
        return;
    }
    if (settledSide !== value) open(value);
}

watch(
    () => props.modelValue,
    value => applyModelValue(value)
);

watch(
    () => [props.actions.length, props.leftActions.length, props.buttonWidth],
    () => {
        void nextTick(refresh);
    }
);

// 展开态被置为禁用时立即收起，否则手势被禁用后再也收不回来
watch(
    () => props.disabled,
    value => {
        if (value && settledSide !== 'close') collapse();
    }
);

/** 首次测量补测的定时器，卸载时清理。 */
let retryTimer: ReturnType<typeof setTimeout> | undefined;

onMounted(async () => {
    await refresh();
    applyModelValue(props.modelValue);
    // 首次测量可能早于布局完成，宽度为 0 时补测一次
    if (!measuredLeft.value && !measuredRight.value) {
        retryTimer = setTimeout(() => void refresh(), 100);
    }
});

onUnmounted(() => {
    if (retryTimer) clearTimeout(retryTimer);
    unregisterOpened(collapse);
});

/** 供插槽作用域调用的收起方法。 */
function closeSide() {
    void close('click');
}

const exposed: SwipeActionExpose = {
    open: (side?: SwipeActionSide) => open(side),
    close: () => void close('value'),
    refresh
};
defineExpose(exposed);
</script>

<style scoped>
.snake-swipe-action {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
}

.snake-swipe-action__wrapper {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    will-change: transform;
}

.snake-swipe-action__side {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: row;
}

.snake-swipe-action__side--left {
    left: 0;
    transform: translate3d(-100%, 0, 0);
}

.snake-swipe-action__side--right {
    right: 0;
    transform: translate3d(100%, 0, 0);
}

.snake-swipe-action__content {
    position: relative;
    z-index: 1;
    box-sizing: border-box;
    width: 100%;
    background-color: var(--snake-swipe-action-bg, transparent);
}

.snake-swipe-action__button {
    display: flex;
    flex: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0 4px;
    font-size: var(--snake-swipe-action-font-size, 14px);
    line-height: 1.3;
    text-align: center;
}

.snake-swipe-action__button--disabled {
    opacity: 0.5;
}

.snake-swipe-action__button-icon {
    color: inherit;
    font-size: var(--snake-swipe-action-icon-size, 16px);
}

.snake-swipe-action__button-text {
    overflow-wrap: break-word;
    font-size: inherit;
}

.snake-swipe-action__button--icon .snake-swipe-action__button-text {
    margin-top: 2px;
}
</style>
