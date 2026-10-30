import type { StyleValue } from '../../types/global';

/** PopupMode 类型定义。 */
export type PopupMode = 'center' | 'top' | 'right' | 'bottom' | 'left';
/** PopupCloseIconPosition 类型定义。 */
export type PopupCloseIconPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/** Popup 组件的公开属性。 */
export interface PopupProps {
    /** 双向绑定的当前值。 */
    modelValue?: boolean;
    /** 是否显示组件。 */
    show?: boolean;
    /** 组件展示模式。 */
    mode?: PopupMode;
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
    closeIconPos?: PopupCloseIconPosition;
    /** 点击遮罩时是否关闭组件。 */
    closeOnClickOverlay?: boolean;
    /** 是否显示遮罩层。 */
    overlay?: boolean;
    /** 是否以嵌入模式渲染：根与面板回到文档流随内容撑高，不固定、不裁剪、不遮挡页面。 */
    embedded?: boolean;
    /** 是否将弹层传送到页面根节点渲染，避免被祖先的 transform、overflow 裁剪。 */
    rootPortal?: boolean;
    /** 遮罩层透明度。 */
    overlayOpacity?: number;
    /** 是否阻止遮罩区域的触摸滚动。 */
    lockScroll?: boolean;
    /** 遮罩层自定义样式。 */
    overlayStyle?: StyleValue;
    /** 是否适配底部安全区域。 */
    safeAreaInsetBottom?: boolean;
    /** 是否适配顶部安全区域。 */
    safeAreaInsetTop?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** PopupChange 事件详情。 */
export interface PopupChangeDetail {
    /** 是否显示组件。 */
    show: boolean;
}

/** Popup 组件的事件契约。 */
export type PopupEmits = {
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
    /** 弹层进出场各阶段事件：enter 前后、leave 前后。 */
    'before-enter': [];
    /** 进入动画开始。 */
    enter: [];
    /** 离场动画开始前。 */
    'before-leave': [];
    /** 离场动画开始。 */
    leave: [];
    /** change 事件携带的参数。 */
    change: [detail: PopupChangeDetail];
    /** click-overlay 事件携带的参数。 */
    'click-overlay': [event: unknown];
};

/** Popup 组件实例公开的方法和状态。 */
export interface PopupExpose {
    /** open 方法。 */
    open(): void;
    /** close 方法。 */
    close(): void;
}
