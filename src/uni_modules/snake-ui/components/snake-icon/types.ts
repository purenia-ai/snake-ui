import type { UnitValue } from '../../libs';
import type { SnakeImageMode, SnakeStyleValue } from '../component-types';

export interface SnakeIconProps {
    name?: string;
    color?: string;
    size?: UnitValue;
    bold?: boolean;
    index?: number | string;
    label?: number | string;
    labelPos?: 'right' | 'bottom';
    labelColor?: string;
    labelSize?: UnitValue;
    space?: UnitValue;
    customPrefix?: string;
    customClass?: string;
    hoverClass?: string;
    imgMode?: SnakeImageMode;
    width?: UnitValue;
    height?: UnitValue;
    top?: UnitValue;
    stop?: boolean;
    customStyle?: SnakeStyleValue;
}

export interface SnakeIconEmits {
    click: [event: unknown, index: number | string];
}
