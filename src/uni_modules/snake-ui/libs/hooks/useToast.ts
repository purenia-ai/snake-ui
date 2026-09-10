import {
    SNAKE_TOAST_EVENT_HIDE,
    SNAKE_TOAST_EVENT_SHOW,
    SNAKE_TOAST_GLOBAL_EVENT_HIDE,
    SNAKE_TOAST_GLOBAL_EVENT_SHOW,
    getEventWithCurrentPage,
    type ToastPayload
} from '../config/toast';
import { emitter } from '../function/emitter';

export type UseToastShowOptions = ToastPayload;

export type UseToast = {
    /**
     * 显示 toast
     * - show('文本')
     * - show({ title, type, duration, ... })
     */
    show: (titleOrOptions: string | UseToastShowOptions) => void;
    /** 关闭 toast */
    close: () => void;
    /** 成功 */
    success: (titleOrOptions: string | UseToastShowOptions) => void;
    /** 错误 */
    error: (titleOrOptions: string | UseToastShowOptions) => void;
    /** 警告 */
    warning: (titleOrOptions: string | UseToastShowOptions) => void;
    /** 信息 */
    info: (titleOrOptions: string | UseToastShowOptions) => void;
    /** 加载中（默认常驻，需 close 关闭） */
    loading: (titleOrOptions: string | UseToastShowOptions) => void;
};

export type UseToastOptions = {
    /** 是否使用全局根部 <snake-toast global />，默认 true；为 false 时走页面级 <snake-toast /> */
    global?: boolean;
    /** 是否使用页面级 <snake-toast page /> 或某个页面的 <snake-toast page="pageId" /> */
    page?: boolean | string;
};

function normalize(titleOrOptions: string | UseToastShowOptions): UseToastShowOptions {
    if (typeof titleOrOptions === 'string') return { title: titleOrOptions };
    return titleOrOptions || {};
}

function getPage(optionsOrGlobal: UseToastOptions | boolean): string {
    if (typeof optionsOrGlobal === 'boolean') {
        return '';
    }
    if (optionsOrGlobal.page && typeof optionsOrGlobal.page === 'string' && optionsOrGlobal.page !== '') {
        return optionsOrGlobal.page;
    }
    return '';
}

/**
 * Toast 函数式调用
 * @description 需要页面/应用中至少存在一个 <snake-toast global /> 或 <snake-toast page /> 实例用于承接事件；不影响原 ref 调用方式。
 *
 * 支持两种调用方式：
 * - 应用级 useToast() / useToast(true) / useToast({ global: true })
 * - 页面级 useToast(false) / useToast({ page: true }) / useToast({ page: 'pageId' })（pageId 应和页面中 <snake-toast page="pageId" /> 的 page 属性一致）
 */
export function useToast(optionsOrGlobal: UseToastOptions | boolean = true): UseToast {
    const isGlobal = typeof optionsOrGlobal === 'boolean' ? optionsOrGlobal === true : !!optionsOrGlobal.global;
    const isPage = typeof optionsOrGlobal === 'boolean' ? optionsOrGlobal === false : !!optionsOrGlobal.page;
    const showEvent = isGlobal
        ? SNAKE_TOAST_GLOBAL_EVENT_SHOW
        : isPage
          ? getEventWithCurrentPage(SNAKE_TOAST_EVENT_SHOW, getPage(optionsOrGlobal))
          : '';
    const hideEvent = isGlobal
        ? SNAKE_TOAST_GLOBAL_EVENT_HIDE
        : isPage
          ? getEventWithCurrentPage(SNAKE_TOAST_EVENT_HIDE, getPage(optionsOrGlobal))
          : '';

    function emitShow(payload: UseToastShowOptions) {
        if (showEvent) {
            emitter.emit(showEvent, payload);
        }
    }

    function emitHide() {
        if (hideEvent) {
            emitter.emit(hideEvent, undefined);
        }
    }

    function show(titleOrOptions: string | UseToastShowOptions) {
        emitShow(normalize(titleOrOptions));
    }

    function close() {
        emitHide();
    }

    function withType(type: string, titleOrOptions: string | UseToastShowOptions) {
        const options = normalize(titleOrOptions);
        emitShow({ ...options, type });
    }

    return {
        show,
        close,
        success: (v: string | UseToastShowOptions) => withType('success', v),
        error: (v: string | UseToastShowOptions) => withType('error', v),
        warning: (v: string | UseToastShowOptions) => withType('warning', v),
        info: (v: string | UseToastShowOptions) => withType('info', v),
        loading: (v: string | UseToastShowOptions) => {
            const options = normalize(v);
            // loading 通常需要常驻，除非用户显式传 duration
            emitShow({ ...options, loading: true, duration: options.duration ?? 0 });
        }
    };
}
