import type { UnitValue } from '../../libs/function/unit';
import type { SnakeImageMode, SnakeStyleValue } from '../../types/global';

export interface SnakeIconProps {
    name?: string;
    color?: string;
    size?: UnitValue;
    bold?: boolean;
    index?: number | string;
    label?: number | string;
    labelPos?: 'left' | 'right' | 'top' | 'bottom';
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
