/**
 * snake-toast 函数式调用约定（事件名 + 载荷类型）。
 * @description
 * - useToast() 通过 snakeEmitter 派发事件
 * - <snake-toast global /> / <snake-toast page /> 通过 snakeEmitter 监听并转调自身 show/hide
 *
 * 该模块放在 libs 层（而非 components），是为了让 `useToast` 组合式函数与
 * `snake-toast` 组件共享同一套事件名与载荷，同时保持「libs 不反向依赖 components」的分层约束。
 */

// 普通（页面级）toast 事件
export const SNAKE_TOAST_EVENT_SHOW = 'snake-ui:toast:show:';
export const SNAKE_TOAST_EVENT_HIDE = 'snake-ui:toast:hide:';

// 全局（App 根部）toast 事件，供 useToast() 使用
export const SNAKE_TOAST_GLOBAL_EVENT_SHOW = 'snake-ui:toast:global:show';
export const SNAKE_TOAST_GLOBAL_EVENT_HIDE = 'snake-ui:toast:global:hide';

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
 * snake-toast 函数式调用载荷类型。
 * @description 与 `snake-toast` 组件的 props 对应（除 modelValue 外），`title` 兼容 `show('文本')` 的字符串形式。
 */
export interface SnakeToastPayload {
    /** 提示文本。 */
    title?: string;
    /** 提示类型，success/error/warning/info/primary/''（默认空，深色底白字）。 */
    type?: string;
    /** 显示时长，单位 ms；设为 0 或空表示常驻，需手动 close。 */
    duration?: number;
    /** 是否显示图标。 */
    icon?: boolean;
    /** 显示位置，center/top/bottom。 */
    position?: string;
    /** 是否以 loading 形式常驻展示。 */
    loading?: boolean;
    /** 根节点自定义样式。 */
    customStyle?: string | Record<string, any> | unknown[];
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 层级 z-index。 */
    zIndex?: number | string;
    /** 倒计时结束后的回调。 */
    callback?: (() => void) | null;
    /** 倒计时结束后是否返回上一页。 */
    back?: boolean;
    /** 倒计时结束后跳转是否为 tab 页面。 */
    isTab?: boolean;
    /** 倒计时结束后跳转的 url。 */
    url?: string;
    /** 跳转参数对象。 */
    params?: Record<string, any>;
}
