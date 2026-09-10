/**
 * snake-modal 函数式调用约定（事件名 + 载荷类型）。
 * @description
 * - useModal() 通过 emitter 派发事件
 * - <snake-modal global /> / <snake-modal page /> 通过 emitter 监听并转调自身 show/hide
 *
 * 该模块放在 libs 层（而非 components），是为了让 `useModal` 组合式函数与
 * `snake-modal` 组件共享同一套事件名与载荷，同时保持「libs 不反向依赖 components」的分层约束。
 */

// 普通（页面级）modal 事件
export const SNAKE_MODAL_EVENT_SHOW = 'snake-ui:modal:show:';
export const SNAKE_MODAL_EVENT_HIDE = 'snake-ui:modal:hide:';
export const SNAKE_MODAL_EVENT_CLEAR_LOADING = 'snake-ui:modal:clear-loading:';

// 全局（App 根部）modal 事件，供 useModal() 使用
export const SNAKE_MODAL_GLOBAL_EVENT_SHOW = 'snake-ui:modal:global:show';
export const SNAKE_MODAL_GLOBAL_EVENT_HIDE = 'snake-ui:modal:global:hide';
export const SNAKE_MODAL_GLOBAL_EVENT_CLEAR_LOADING = 'snake-ui:modal:global:clear-loading';

/** 根据当前页面（或显式 pageId）拼接事件名。 */
export function getEventWithCurrentPage(event: string, page?: string | boolean): string {
    if (page && typeof page === 'string' && page !== '') {
        return event + page;
    }
    return event + getCurrentPage();
}

/** 获取当前页面路由。 */
function getCurrentPage(): string {
    try {
        const pages = getCurrentPages();
        const currentPage = pages[pages.length - 1].route as string;
        return currentPage || '';
    } catch {
        return '';
    }
}

/**
 * snake-modal 函数式调用载荷类型。
 * @description 与 `snake-modal` 组件的 props 一一对应（除 modelValue 外），额外支持确认/取消回调。
 */
export interface ModalPayload {
    /** 标题。 */
    title?: string;
    /** 内容。 */
    content?: string;
    /** 是否显示标题。 */
    showTitle?: boolean;
    /** 是否显示确认按钮。 */
    showConfirmButton?: boolean;
    /** 是否显示取消按钮。 */
    showCancelButton?: boolean;
    /** 确认按钮文案。 */
    confirmText?: string;
    /** 取消按钮文案。 */
    cancelText?: string;
    /** 确认按钮颜色。 */
    confirmColor?: string;
    /** 取消文字颜色。 */
    cancelColor?: string;
    /** 弹窗圆角值，单位 rpx。 */
    borderRadius?: number | string;
    /** 弹窗宽度，单位 rpx。 */
    width?: number | string;
    /** 层级 z-index。 */
    zIndex?: number | string;
    /** 是否开启缩放效果。 */
    zoom?: boolean;
    /** 是否异步关闭，只对确定按钮有效。 */
    asyncClose?: boolean;
    /** 是否允许点击遮罩关闭。 */
    maskCloseAble?: boolean;
    /** 往上偏移的值，避免和键盘重合。 */
    negativeTop?: number | string;
    /** 根节点自定义样式。 */
    customStyle?: string | Record<string, any> | unknown[];
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 标题样式。 */
    titleStyle?: Record<string, any>;
    /** 内容样式。 */
    contentStyle?: Record<string, any>;
    /** 取消按钮样式。 */
    cancelStyle?: Record<string, any>;
    /** 确定按钮样式。 */
    confirmStyle?: Record<string, any>;
    /** 确认回调。 */
    onConfirm?: () => void;
    /** 取消回调。 */
    onCancel?: () => void;
}
