import type { SnakeStyleValue } from '../../types/global';

/** SnakePopupMode 类型定义。 */
export type SnakePopupMode = 'center' | 'top' | 'right' | 'bottom' | 'left';
/** SnakePopupCloseIconPosition 类型定义。 */
export type SnakePopupCloseIconPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** SnakePopup 组件的公开属性。 */
export interface SnakePopupProps {
    /** 双向绑定的当前值。 */
    modelValue?: boolean;
    /** 是否显示组件。 */
    show?: boolean;
    /** 组件展示模式。 */
    mode?: SnakePopupMode;
    /** 背景颜色。 */
    bgColor?: string;
    /** 组件层级。 */
    zIndex?: number;
    /** 动画持续时间。 */
    duration?: number;
    /** 是否显示为圆角样式。 */
    round?: number | string | boolean;
    /** zoom 配置。 */
    zoom?: boolean;
    /** 是否显示关闭按钮。 */
    closeable?: boolean;
    /** 关闭按钮图标名称。 */
    closeIcon?: string;
    /** 关闭按钮图标颜色。 */
    closeIconColor?: string;
    /** 关闭按钮图标尺寸。 */
    closeIconSize?: number | string;
    /** 关闭按钮所在位置。 */
    closeIconPos?: SnakePopupCloseIconPosition;
    /** 点击遮罩时是否关闭组件。 */
    closeOnClickOverlay?: boolean;
    /** 是否显示遮罩层。 */
    overlay?: boolean;
    /** 遮罩层透明度。 */
    overlayOpacity?: number;
    /** 是否阻止遮罩区域的触摸滚动。 */
    lockScroll?: boolean;
    /** 遮罩层自定义样式。 */
    overlayStyle?: SnakeStyleValue;
    /** 是否适配底部安全区域。 */
    safeAreaInsetBottom?: boolean;
    /** 是否适配顶部安全区域。 */
    safeAreaInsetTop?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakePopupChange 事件详情。 */
export interface SnakePopupChangeDetail {
    /** 是否显示组件。 */
    show: boolean;
}

/** SnakePopup 组件的事件契约。 */
export interface SnakePopupEmits {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: boolean];
    /** update:show 事件携带的参数。 */
    'update:show': [value: boolean];
    /** open 事件携带的参数。 */
    open: [];
    /** opened 事件携带的参数。 */
    opened: [];
    /** close 事件携带的参数。 */
    close: [];
    /** closed 事件携带的参数。 */
    closed: [];
    /** change 事件携带的参数。 */
    change: [detail: SnakePopupChangeDetail];
    /** click-overlay 事件携带的参数。 */
    'click-overlay': [event: unknown];
}

/** SnakePopup 组件实例公开的方法和状态。 */
export interface SnakePopupExpose {
    /** open 方法。 */
    open(): void;
    /** close 方法。 */
    close(): void;
}
