import {
    SNAKE_MODAL_EVENT_SHOW,
    SNAKE_MODAL_EVENT_HIDE,
    SNAKE_MODAL_EVENT_CLEAR_LOADING,
    SNAKE_MODAL_GLOBAL_EVENT_SHOW,
    SNAKE_MODAL_GLOBAL_EVENT_HIDE,
    SNAKE_MODAL_GLOBAL_EVENT_CLEAR_LOADING,
    getEventWithCurrentPage,
    type SnakeModalPayload
} from '../config/modal';
import { snakeEmitter } from '../function/emitter';

export type UseModalShowOptions = SnakeModalPayload;

export type UseModal = {
    /**
     * 显示 modal
     * - show('内容')
     * - show({ title, content, showCancelButton, ... })
     */
    show: (contentOrOptions: string | UseModalShowOptions) => void;
    /**
     * 显示 confirm 类型的 modal（带确认和取消按钮）
     * - confirm('内容')
     * - confirm({ title, content, onConfirm, onCancel })
     */
    confirm: (contentOrOptions: string | UseModalShowOptions) => void;
    /** 关闭 modal */
    close: () => void;
    /** 清除 loading 状态 */
    clearLoading: () => void;
};

export type UseModalOptions = {
    /** 是否使用全局根部 <snake-modal global /> */
    global?: boolean;
    /** 是否使用页面级 <snake-modal page /> 或某个页面的 <snake-modal page="pageId" /> */
    page?: boolean | string;
};

function normalize(contentOrOptions: string | UseModalShowOptions): UseModalShowOptions {
    if (typeof contentOrOptions === 'string') {
        return { content: contentOrOptions };
    }
    return contentOrOptions || {};
}

function getPage(optionsOrGlobal: UseModalOptions | boolean): string {
    if (typeof optionsOrGlobal === 'boolean') {
        return '';
    }
    if (optionsOrGlobal.page && typeof optionsOrGlobal.page === 'string' && optionsOrGlobal.page !== '') {
        return optionsOrGlobal.page;
    }
    return '';
}

/**
 * Modal 函数式调用
 * @description 需要页面/应用中至少存在一个 <snake-modal global /> 或 <snake-modal page /> 实例用于承接事件；不影响原 v-model 调用方式。
 *
 * 支持两种调用方式：
 * - 应用级 useModal() / useModal(true) / useModal({ global: true })
 * - 页面级 useModal(false) / useModal({ page: true }) / useModal({ page: 'pageId' })（pageId 应和页面中 <snake-modal page="pageId" /> 的 page 属性一致）
 */
export function useModal(optionsOrGlobal: UseModalOptions | boolean = true): UseModal {
    const isGlobal = typeof optionsOrGlobal === 'boolean' ? optionsOrGlobal === true : !!optionsOrGlobal.global;
    const isPage = typeof optionsOrGlobal === 'boolean' ? optionsOrGlobal === false : !!optionsOrGlobal.page;

    const showEvent = isGlobal
        ? SNAKE_MODAL_GLOBAL_EVENT_SHOW
        : isPage
          ? getEventWithCurrentPage(SNAKE_MODAL_EVENT_SHOW, getPage(optionsOrGlobal))
          : '';
    const hideEvent = isGlobal
        ? SNAKE_MODAL_GLOBAL_EVENT_HIDE
        : isPage
          ? getEventWithCurrentPage(SNAKE_MODAL_EVENT_HIDE, getPage(optionsOrGlobal))
          : '';
    const clearLoadingEvent = isGlobal
        ? SNAKE_MODAL_GLOBAL_EVENT_CLEAR_LOADING
        : isPage
          ? getEventWithCurrentPage(SNAKE_MODAL_EVENT_CLEAR_LOADING, getPage(optionsOrGlobal))
          : '';

    function emitShow(payload: UseModalShowOptions) {
        if (showEvent) {
            snakeEmitter.emit(showEvent, payload);
        }
    }

    function emitHide() {
        if (hideEvent) {
            snakeEmitter.emit(hideEvent, undefined);
        }
    }

    function emitClearLoading() {
        if (clearLoadingEvent) {
            snakeEmitter.emit(clearLoadingEvent, undefined);
        }
    }

    function show(contentOrOptions: string | UseModalShowOptions) {
        emitShow(normalize(contentOrOptions));
    }

    function confirm(contentOrOptions: string | UseModalShowOptions) {
        const options = normalize(contentOrOptions);
        emitShow({
            ...options,
            showCancelButton: options.showCancelButton ?? true,
            showConfirmButton: options.showConfirmButton ?? true
        });
    }

    function clearLoading() {
        emitClearLoading();
    }

    function close() {
        emitHide();
    }

    return {
        show,
        confirm,
        close,
        clearLoading
    };
}
