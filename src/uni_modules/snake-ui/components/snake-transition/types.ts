import type { SnakeStyleValue } from '../component-types';

export type SnakeTransitionPreset =
    | 'fade'
    | 'fade-up'
    | 'fade-down'
    | 'fade-left'
    | 'fade-right'
    | 'slide-up'
    | 'slide-down'
    | 'slide-left'
    | 'slide-right'
    | 'zoom-in'
    | 'zoom-out';

export interface SnakeTransitionDuration {
    enter?: number;
    leave?: number;
}

export interface SnakeTransitionProps {
    show?: boolean;
    name?: SnakeTransitionPreset;
    duration?: number | SnakeTransitionDuration;
    timingFunction?: string;
    delay?: number;
    appear?: boolean;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakeTransitionEmits {
    'before-enter': [];
    enter: [];
    'after-enter': [];
    'enter-cancelled': [];
    'before-leave': [];
    leave: [];
    'after-leave': [];
    'leave-cancelled': [];
    click: [event: unknown];
}
