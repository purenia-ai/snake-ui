import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

export type SnakeSubsectionMode = 'button' | 'subsection';

export interface SnakeSubsectionItem {
    name: string;
    disabled?: boolean;
}

export type SnakeSubsectionOption = string | SnakeSubsectionItem;

export interface SnakeSubsectionProps {
    list?: SnakeSubsectionOption[];
    current?: number | string;
    mode?: SnakeSubsectionMode;
    activeColor?: string;
    inactiveColor?: string;
    fontSize?: UnitValue;
    height?: UnitValue;
    animation?: boolean;
    bold?: boolean;
    bgColor?: string;
    buttonColor?: string;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakeSubsectionEmits {
    change: [index: number];
    'update:current': [index: number];
}
