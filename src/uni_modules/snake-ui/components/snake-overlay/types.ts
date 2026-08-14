import type { SnakeStyleValue } from '../component-types';

export interface SnakeOverlayProps {
    modelValue?: boolean;
    show?: boolean;
    opacity?: number;
    zIndex?: number;
    duration?: number;
    lockScroll?: boolean;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakeOverlayEmits {
    'update:modelValue': [value: boolean];
    'update:show': [value: boolean];
    click: [event: unknown];
    opened: [];
    closed: [];
}
