import type { SnakeStyleValue } from '../../types/global';

export type SnakePopupMode = 'center' | 'top' | 'right' | 'bottom' | 'left';
export type SnakePopupCloseIconPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface SnakePopupProps {
    modelValue?: boolean;
    show?: boolean;
    mode?: SnakePopupMode;
    bgColor?: string;
    zIndex?: number;
    duration?: number;
    round?: number | string | boolean;
    zoom?: boolean;
    closeable?: boolean;
    closeIcon?: string;
    closeIconColor?: string;
    closeIconSize?: number | string;
    closeIconPos?: SnakePopupCloseIconPosition;
    closeOnClickOverlay?: boolean;
    overlay?: boolean;
    overlayOpacity?: number;
    overlayStyle?: SnakeStyleValue;
    safeAreaInsetBottom?: boolean;
    safeAreaInsetTop?: boolean;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakePopupChangeDetail {
    show: boolean;
}

export interface SnakePopupEmits {
    'update:modelValue': [value: boolean];
    'update:show': [value: boolean];
    open: [];
    opened: [];
    close: [];
    closed: [];
    change: [detail: SnakePopupChangeDetail];
    'click-overlay': [event: unknown];
}

export interface SnakePopupExpose {
    open(): void;
    close(): void;
}
