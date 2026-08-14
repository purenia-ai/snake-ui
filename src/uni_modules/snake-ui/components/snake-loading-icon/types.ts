import type { SnakeStyleValue } from '../component-types';

export type SnakeLoadingIconMode = 'circle' | 'spinner';

export interface SnakeLoadingIconProps {
    show?: boolean;
    mode?: SnakeLoadingIconMode;
    color?: string;
    inactiveColor?: string;
    size?: number | string;
    text?: string;
    textColor?: string;
    textSize?: number | string;
    vertical?: boolean;
    timingFunction?: string;
    duration?: number;
    customStyle?: SnakeStyleValue;
}
