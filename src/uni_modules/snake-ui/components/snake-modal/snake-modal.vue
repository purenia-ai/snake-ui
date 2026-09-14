<template>
    <snake-popup
        v-model="popupValue"
        mode="center"
        :zoom="effectiveConfig.zoom"
        :z-index="uZIndex"
        :close-on-click-overlay="effectiveConfig.maskCloseAble"
        :custom-style="popupStyle"
        :custom-class="effectiveConfig.customClass"
        @close="popupClose">
        <view class="snake-modal" :style="toStyle(effectiveConfig.customStyle)">
            <view v-if="effectiveConfig.showTitle" class="snake-modal__title snake-modal__line-1" :style="toStyle(effectiveConfig.titleStyle)">
                {{ effectiveConfig.title }}
            </view>
            <view class="snake-modal__content">
                <view v-if="slots.default" :style="toStyle(effectiveConfig.contentStyle)">
                    <slot />
                </view>
                <view v-else class="snake-modal__content__message" :style="toStyle(effectiveConfig.contentStyle)">
                    <text>{{ effectiveConfig.content }}</text>
                </view>
            </view>
            <view v-if="effectiveConfig.showCancelButton || effectiveConfig.showConfirmButton" class="snake-modal__footer">
                <view
                    v-if="effectiveConfig.showCancelButton"
                    :hover-stay-time="100"
                    hover-class="snake-modal__btn--hover"
                    class="snake-modal__footer__button"
                    :style="toStyle(cancelBtnStyle)"
                    @tap="cancel">
                    {{ effectiveConfig.cancelText }}
                </view>
                <view
                    v-if="effectiveConfig.showConfirmButton || slots['confirm-button']"
                    :class="['snake-modal__footer__button', effectiveConfig.showCancelButton ? 'snake-modal__footer__button--border-left' : '']"
                    :hover-stay-time="100"
                    :hover-class="effectiveConfig.asyncClose ? 'none' : 'snake-modal__btn--hover'"
                    :style="toStyle(confirmBtnStyle)"
                    @tap="confirm">
                    <slot v-if="slots['confirm-button']" name="confirm-button"></slot>
                    <template v-else>
                        <snake-loading v-if="loading" type="circular" :size="20" :color="effectiveConfig.confirmColor"></snake-loading>
                        <template v-else>{{ effectiveConfig.confirmText }}</template>
                    </template>
                </view>
            </view>
        </view>
    </snake-popup>
</template>

<script setup lang="ts">
/**
 * @component Modal
 * @description 弹出模态框，支持声明式 v-model 与函数式 useModal() 调用，用于消息提示、消息确认及页面内交互。
 * @see /components/modal
 */

import { computed, onBeforeUnmount, onMounted, ref, useSlots, watch } from 'vue';
import { onPageHide, onPageShow } from '@dcloudio/uni-app';
import zIndex from '../../libs/config/zIndex';
import { addUnit } from '../../libs/function/unit';
import { toStyle } from '../../libs/function/style';
import { useLocale } from '../../libs/hooks/useLocale';
import { emitter } from '../../libs/function/emitter';
import Popup from '../snake-popup/snake-popup.vue';
import SnakeLoading from '../snake-loading/snake-loading.vue';
import { modalProps } from './types';
import type { ModalEmits } from './types';
import {
    SNAKE_MODAL_EVENT_CLEAR_LOADING,
    SNAKE_MODAL_EVENT_HIDE,
    SNAKE_MODAL_EVENT_SHOW,
    SNAKE_MODAL_GLOBAL_EVENT_CLEAR_LOADING,
    SNAKE_MODAL_GLOBAL_EVENT_HIDE,
    SNAKE_MODAL_GLOBAL_EVENT_SHOW,
    getEventWithCurrentPage,
    type ModalPayload
} from '../../libs/config/modal';

defineOptions({ name: 'Modal', options: { addGlobalClass: true, virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(modalProps);
const emit = defineEmits<ModalEmits>();
const slots = useSlots();

const { t } = useLocale('modal');

// 是否已经初始化事件监听
const isInit = ref(false);
// 确认按钮是否正在加载中
const loading = ref(false);
const isGlobal = computed(() => !!props.global);
const isPage = computed(() => !!props.page);
const showEvent = computed(() =>
    isGlobal.value ? SNAKE_MODAL_GLOBAL_EVENT_SHOW : isPage.value ? getEventWithCurrentPage(SNAKE_MODAL_EVENT_SHOW, props.page) : ''
);
const hideEvent = computed(() =>
    isGlobal.value ? SNAKE_MODAL_GLOBAL_EVENT_HIDE : isPage.value ? getEventWithCurrentPage(SNAKE_MODAL_EVENT_HIDE, props.page) : ''
);
const clearLoadingEvent = computed(() =>
    isGlobal.value ? SNAKE_MODAL_GLOBAL_EVENT_CLEAR_LOADING : isPage.value ? getEventWithCurrentPage(SNAKE_MODAL_EVENT_CLEAR_LOADING, props.page) : ''
);

// 存储用户传入的回调函数
let userOnConfirm: (() => void) | null = null;
let userOnCancel: (() => void) | null = null;

// 需要与 effectiveConfig 合并的 props 键名列表（用于函数式调用）
const MERGE_PROPS_KEYS = [
    'title',
    'content',
    'showTitle',
    'showConfirmButton',
    'showCancelButton',
    'confirmText',
    'cancelText',
    'confirmColor',
    'cancelColor',
    'confirmStyle',
    'cancelStyle',
    'titleStyle',
    'contentStyle',
    'asyncClose',
    'borderRadius',
    'width',
    'zoom',
    'maskCloseAble',
    'negativeTop',
    'zIndex',
    'customStyle',
    'customClass'
] as const;

// 函数式调用时的临时配置
const tempConfig = ref<Partial<ModalPayload>>({});

// 函数式调用时的内部显示状态（用于 global/page 模式）
const internalShow = ref(false);

// 国际化计算属性
const getTitle = computed(() => props.title || t('title'));
const getConfirmText = computed(() => props.confirmText || t('confirmText'));
const getCancelText = computed(() => props.cancelText || t('cancelText'));

// 有效的配置（函数式调用时合并 tempConfig 和 props，v-model 时使用 props）
const effectiveConfig = computed(() => {
    if (Object.keys(tempConfig.value).length > 0) {
        const result: Record<string, any> = {};
        for (const key of MERGE_PROPS_KEYS) {
            result[key] = (tempConfig.value as Record<string, any>)[key] ?? (props as Record<string, any>)[key];
        }
        result.zIndex = tempConfig.value.zIndex ?? props.zIndex ?? zIndex.popup;
        result.title = result.title || t('title');
        result.confirmText = result.confirmText || t('confirmText');
        result.cancelText = result.cancelText || t('cancelText');
        return result;
    }
    return {
        ...props,
        title: getTitle.value,
        confirmText: getConfirmText.value,
        cancelText: getCancelText.value
    };
});

// 取消按钮样式
const cancelBtnStyle = computed(() => Object.assign({ color: effectiveConfig.value.cancelColor }, effectiveConfig.value.cancelStyle));
// 确认按钮样式
const confirmBtnStyle = computed(() => Object.assign({ color: effectiveConfig.value.confirmColor }, effectiveConfig.value.confirmStyle));
// 弹窗层级
const uZIndex = computed(() => Number(effectiveConfig.value.zIndex || zIndex.popup));
// 弹窗自定义样式（宽度 / 圆角 / 键盘避让）
const popupStyle = computed(() => {
    const style: Record<string, string> = {
        width: addUnit(effectiveConfig.value.width, 'rpx'),
        borderRadius: addUnit(effectiveConfig.value.borderRadius, 'rpx')
    };
    if (effectiveConfig.value.negativeTop) {
        style.marginTop = `-${addUnit(effectiveConfig.value.negativeTop, 'rpx')}`;
    }
    return style;
});
// 是否使用内部状态控制显示（global/page 模式）
const useInternalShow = computed(() => isGlobal.value || isPage.value);
// 最终显示状态
const finalShow = computed(() => {
    if (useInternalShow.value) {
        return internalShow.value;
    }
    return props.modelValue;
});
// snake-popup 绑定的值
const popupValue = computed({
    get: () => finalShow.value,
    set: (val: boolean) => {
        if (useInternalShow.value) {
            internalShow.value = val;
        } else {
            emit('update:modelValue', val);
        }
    }
});

// 异步关闭时，外部修改 v-model 为 false 后重置 loading，避免下次打开状态混乱
watch(
    () => popupValue.value,
    n => {
        if (n === true) loading.value = false;
    }
);

/**
 * 确认按钮点击事件
 */
function confirm() {
    const onConfirm = userOnConfirm;
    if (effectiveConfig.value.asyncClose) {
        loading.value = true;
    } else {
        popupValue.value = false;
        // 延迟重置配置，避免闪屏
        setTimeout(() => resetTempConfig(), 300);
    }
    emit('confirm');
    onConfirm?.();
}

/**
 * 取消按钮点击事件
 */
function cancel() {
    const onCancel = userOnCancel;
    // 延迟重置配置，避免闪屏
    setTimeout(() => resetTempConfig(), 300);
    emit('cancel');
    popupValue.value = false;
    onCancel?.();
    // 避免确认按钮文字恢复成默认值后 modal 还没消失
    setTimeout(() => {
        loading.value = false;
    }, 300);
}

/**
 * 点击遮罩关闭 modal
 */
function popupClose() {
    popupValue.value = false;
    resetTempConfig();
}

/**
 * 清除加载中的状态
 */
function clearLoading() {
    loading.value = false;
}

/**
 * 函数式调用显示 modal
 */
function onServiceShow(payload: ModalPayload) {
    userOnConfirm = payload.onConfirm ?? null;
    userOnCancel = payload.onCancel ?? null;

    // 只保存用户传入的配置（过滤掉回调）
    const config = { ...payload };
    delete config.onConfirm;
    delete config.onCancel;
    tempConfig.value = config;

    internalShow.value = true;
}

/**
 * 函数式调用关闭 modal
 */
function onServiceHide() {
    internalShow.value = false;
    resetTempConfig();
}

/**
 * 重置临时配置
 */
function resetTempConfig() {
    tempConfig.value = {};
    userOnConfirm = null;
    userOnCancel = null;
}

// 开始监听事件
function startListeners() {
    if (isInit.value) {
        return;
    }
    isInit.value = true;
    if (showEvent.value) {
        emitter.on(showEvent.value, onServiceShow);
    }
    if (hideEvent.value) {
        emitter.on(hideEvent.value, onServiceHide);
    }
    if (clearLoadingEvent.value) {
        emitter.on(clearLoadingEvent.value, clearLoading);
    }
}

// 停止监听事件
function stopListeners() {
    if (!isInit.value) {
        return;
    }
    isInit.value = false;
    if (showEvent.value) {
        emitter.off(showEvent.value, onServiceShow);
    }
    if (hideEvent.value) {
        emitter.off(hideEvent.value, onServiceHide);
    }
    if (clearLoadingEvent.value) {
        emitter.off(clearLoadingEvent.value, clearLoading);
    }
}

onPageShow(() => {
    startListeners();
});

onPageHide(() => {
    stopListeners();
});

onMounted(() => {
    startListeners();
});

onBeforeUnmount(() => {
    stopListeners();
});

defineExpose({
    clearLoading
});
</script>

<style scoped lang="scss">
.snake-modal {
    height: auto;
    overflow: hidden;
    font-size: 32rpx;
    background-color: var(--snake-color-surface, #fff);

    &__btn--hover {
        background-color: rgb(230, 230, 230);
    }

    &__line-1 {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    &__title {
        padding-top: 48rpx;
        font-weight: 500;
        text-align: center;
        color: var(--snake-color-text, #303133);
    }

    &__content {
        &__message {
            padding: 48rpx;
            font-size: 30rpx;
            text-align: center;
            color: var(--snake-color-text-secondary, #909399);
        }
    }

    &__footer {
        display: flex;
        border-top: 1rpx solid var(--snake-color-border, #f6f6f6);

        &__button {
            flex: 1;
            height: 100rpx;
            line-height: 100rpx;
            font-size: 32rpx;
            box-sizing: border-box;
            cursor: pointer;
            text-align: center;
            border-radius: 4rpx;

            &--border-left {
                border-left: 1rpx solid var(--snake-color-border, #f6f6f6);
            }
        }
    }
}
</style>
