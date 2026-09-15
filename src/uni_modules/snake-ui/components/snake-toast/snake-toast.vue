<template>
    <view
        class="snake-toast"
        :class="[
            isShow ? 'snake-show' : '',
            'snake-type-' + (tmpConfig.type || 'default'),
            'snake-position-' + tmpConfig.position,
            customClass
        ]"
        :style="toStyle({ zIndex: uZIndex }, customStyle as string | Record<string, any>)"
    >
        <view class="snake-toast__icon-wrap">
            <!-- loading 类型走独立的加载动画组件 -->
            <snake-loading
                v-if="tmpConfig.loading"
                type="circular"
                color="currentColor"
                custom-style="margin-right: 16rpx;"
            ></snake-loading>
            <!-- 其它类型仍然使用图标 -->
            <snake-icon
                v-else-if="tmpConfig.icon && iconName"
                :name="iconName"
                :size="20"
                color="currentColor"
                custom-style="margin-right: 10rpx;"
            ></snake-icon>
        </view>
        <text class="snake-toast__text">{{ tmpConfig.title }}</text>
    </view>
</template>

<script setup lang="ts">
/**
 * @component Toast
 * @description 消息提示，支持声明式 ref 调用与函数式 useToast() 调用，用于成功、错误、警告、加载等轻提示。
 * @see /components/toast
 */

import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { onPageHide, onPageShow } from '@dcloudio/uni-app';
import zIndex from '../../libs/config/zIndex';
import { toStyle } from '../../libs/function/style';
import { deepMerge } from '../../libs/function/deepMerge';
import { type2icon } from '../../libs/function/type2icon';
import { route } from '../../libs/function/route';
import { emitter } from '../../libs/function/emitter';
import SnakeLoading from '../snake-loading/snake-loading.vue';
import Icon from '../snake-icon/snake-icon.vue';
import { toastProps } from './types';
import type { ToastExpose } from './types';
import {
    SNAKE_TOAST_EVENT_HIDE,
    SNAKE_TOAST_EVENT_SHOW,
    SNAKE_TOAST_GLOBAL_EVENT_HIDE,
    SNAKE_TOAST_GLOBAL_EVENT_SHOW,
    getEventWithCurrentPage,
    type ToastPayload
} from '../../libs/config/toast';

defineOptions({ name: 'Toast', options: { virtualHost: true, styleIsolation: 'shared' } });

const props = defineProps(toastProps);

// 是否已经初始化事件监听
const isInit = ref(false);
// 是否显示 toast
const isShow = ref(false);
// 定时器
let timer: ReturnType<typeof setTimeout> | null = null;

// 内置配置
const config = computed(() => ({
    zIndex: props.zIndex,
    type: props.type,
    duration: props.duration,
    icon: props.icon,
    position: props.position,
    callback: props.callback,
    back: props.back,
    isTab: props.isTab,
    url: props.url,
    params: props.params,
    loading: props.loading,
    title: ''
}));

// 合并后的临时配置
const tmpConfig = ref<Record<string, any>>({ ...config.value });

/**
 * 只有不为空，并且 type 为 error|warning|success|info 时，才显示图标
 */
const iconName = computed(() => {
    if (['error', 'warning', 'success', 'info'].indexOf(tmpConfig.value.type) >= 0 && tmpConfig.value.icon) {
        return type2icon(tmpConfig.value.type);
    }
    return '';
});

// 显示时的层级
const uZIndex = computed(() => props.zIndex || zIndex.toast);

/**
 * 显示 toast，由父组件通过 ref.show(options) 形式调用
 * @description 当 duration 为 0 或不传时，表示不自动关闭，需要手动调用 hide/close 方法关闭
 */
function show(options: Record<string, any>) {
    // 不将结果合并到 config 变量，避免多次调用 toast 时前后的配置造成混乱
    tmpConfig.value = deepMerge(config.value, options);
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    isShow.value = true;
    // duration 为 0、undefined 或小于等于 0 时，表示不自动关闭，需要手动调用 hide/close
    if (tmpConfig.value.duration > 0) {
        timer = setTimeout(() => {
            isShow.value = false;
            clearTimeout(timer!);
            timer = null;
            if (typeof tmpConfig.value.callback === 'function') {
                tmpConfig.value.callback();
            }
            timeEnd();
        }, tmpConfig.value.duration);
    }
}

/**
 * 隐藏 toast，由父组件通过 ref.hide() 形式调用
 */
function hide() {
    isShow.value = false;
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
}

/**
 * 倒计时结束后，进行跳转等操作
 */
function timeEnd() {
    if (tmpConfig.value.url) {
        const url = tmpConfig.value.url.startsWith('/') ? tmpConfig.value.url : '/' + tmpConfig.value.url;
        if (tmpConfig.value.isTab) {
            uni.switchTab({ url });
        } else {
            route({ type: 'navigateTo', url, params: tmpConfig.value.params });
        }
    } else if (tmpConfig.value.back) {
        route({ type: 'back' });
    }
}

/**
 * 函数式调用支持：
 * - useToast() 内部通过 emitter 派发「全局」事件，仅由 App 根部的 <snake-toast global /> 承接
 * - 页面级 <snake-toast page /> 监听「页面级」事件
 * - 不影响原有 ref.show()/ref.hide() 使用方式
 */
function onServiceShow(payload: ToastPayload) {
    show(payload || {});
}

function onServiceHide() {
    hide();
}

// 是否为 App 根部的“全局 toast”
const isGlobal = computed(() => !!props.global);
// 是否为页面级 toast
const isPage = computed(() => !!props.page);

// 显示事件
const showEvent = computed(() =>
    isGlobal.value
        ? SNAKE_TOAST_GLOBAL_EVENT_SHOW
        : isPage.value
          ? getEventWithCurrentPage(SNAKE_TOAST_EVENT_SHOW, props.page)
          : ''
);

// 隐藏事件
const hideEvent = computed(() =>
    isGlobal.value
        ? SNAKE_TOAST_GLOBAL_EVENT_HIDE
        : isPage.value
          ? getEventWithCurrentPage(SNAKE_TOAST_EVENT_HIDE, props.page)
          : ''
);

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

defineExpose<ToastExpose>({
    show,
    hide,
    close: hide
});
</script>

<style scoped lang="scss">
.snake-toast {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30rpx 40rpx;
    font-size: 28rpx;
    text-align: center;
    color: var(--snake-color-white, #ffffff);
    background: var(--snake-color-text, #303133);
    border-radius: 8rpx;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s;
}

.snake-toast.snake-show {
    opacity: 1;
}

.snake-toast__icon-wrap {
    display: flex;
    align-items: center;
}

.snake-toast__text {
    word-break: break-all;
}

.snake-position-center {
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /* #ifndef APP-NVUE */
    max-width: 70%;
    /* #endif */
}

.snake-position-top {
    left: 50%;
    top: 20%;
    transform: translate(-50%, -50%);
}

.snake-position-bottom {
    left: 50%;
    bottom: 20%;
    transform: translate(-50%, -50%);
}

.snake-type-primary {
    color: var(--snake-color-primary, #06d290);
    background-color: var(--snake-color-primary-light, rgba(6, 210, 144, 0.1));
    border: 1px solid var(--snake-color-primary-light, rgba(6, 210, 144, 0.1));
}

.snake-type-success {
    color: var(--snake-color-success, #06d290);
    background-color: var(--snake-color-success-light, rgba(6, 210, 144, 0.1));
    border: 1px solid var(--snake-color-success-light, rgba(6, 210, 144, 0.1));
}

.snake-type-error {
    color: var(--snake-color-error, #fa3534);
    background-color: var(--snake-color-error-light, #fef0f0);
    border: 1px solid var(--snake-color-error-light, #fef0f0);
}

.snake-type-warning {
    color: var(--snake-color-warning, #ff9900);
    background-color: var(--snake-color-warning-light, #fdf6ec);
    border: 1px solid var(--snake-color-warning-light, #fdf6ec);
}

.snake-type-info {
    color: var(--snake-color-info, #909399);
    background-color: var(--snake-color-info-light, #f4f4f5);
    border: 1px solid var(--snake-color-info-light, #f4f4f5);
}

.snake-type-default {
    color: var(--snake-color-white, #ffffff);
    background-color: var(--snake-color-text, #303133);
}
</style>
