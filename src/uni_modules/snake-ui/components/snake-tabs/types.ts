import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

export interface SnakeTabItemObject extends Record<string, unknown> {
    name?: unknown;
    count?: unknown;
    hidden?: boolean;
    disabled?: boolean;
}

export type SnakeTabItem = string | SnakeTabItemObject;

export interface SnakeTabsProps {
    list?: SnakeTabItem[];
    current?: number | string;
    name?: string;
    count?: string;
    scrollable?: boolean;
    isScroll?: boolean;
    height?: UnitValue;
    fontSize?: UnitValue;
    duration?: number | string;
    lineColor?: string;
    activeColor?: string;
    inactiveColor?: string;
    barWidth?: UnitValue;
    barHeight?: UnitValue;
    gutter?: UnitValue;
    bgColor?: string;
    offset?: [number, number];
    isDot?: boolean;
    bold?: boolean;
    activeItemStyle?: SnakeStyleValue;
    showBar?: boolean;
    barStyle?: SnakeStyleValue;
    itemWidth?: UnitValue | 'auto';
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakeTabsClickDetail {
    index: number;
    item: SnakeTabItem;
}

export interface SnakeTabsEmits {
    change: [index: number];
    click: [detail: SnakeTabsClickDetail];
}
