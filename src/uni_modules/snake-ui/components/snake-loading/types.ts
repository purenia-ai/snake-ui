import type { StyleValue } from '../../types/global';

/** Available loading animations. */
export type LoadingType = 'circular' | 'spinner' | 'dots' | 'wave';
/** Relative placement of the loading text. */
export type LoadingDirection = 'horizontal' | 'vertical';

/** Public props for SnakeLoading. */
export interface LoadingProps {
    /** Whether the component is rendered. */
    show?: boolean;
    /** Loading animation type. */
    type?: LoadingType;
    /** Loading indicator color. */
    color?: string;
    /** Loading indicator size. */
    size?: number | string;
    /** Fallback text for the default slot. */
    text?: string;
    /** Text color. */
    textColor?: string;
    /** Text size. */
    textSize?: number | string;
    /** Indicator and text layout direction. */
    direction?: LoadingDirection;
    /** Whether to inherit the parent color. */
    inheritColor?: boolean;
    /** Animation duration in milliseconds. */
    duration?: number;
    /** Root element class name. */
    customClass?: string;
    /** Root element inline style. */
    customStyle?: StyleValue;
}
