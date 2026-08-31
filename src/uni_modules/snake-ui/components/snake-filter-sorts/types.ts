import type { SnakeStyleValue } from '../../types/global';

export interface SnakeFilterOption extends Record<string, unknown> {
    name?: string;
    value?: string | number;
    selected?: boolean;
}

export interface SnakeFilterGroup extends Record<string, unknown> {
    name?: string;
    value?: string;
    type?: string;
    list?: SnakeFilterOption[];
}

export interface SnakeFilterSortsData extends Record<string, unknown> {
    topFilter?: SnakeFilterGroup[];
    mainFilter?: SnakeFilterGroup[];
    brandFilter?: Record<string, SnakeFilterOption[]>;
}

export interface SnakeFilterSortsProps<Filters extends SnakeFilterSortsData = SnakeFilterSortsData> {
    filters?: Filters;
    defaultFilter?: Record<string, any>;
    bgColor?: string;
    sort?: string;
    showTabs?: boolean;
    goodsListLength?: number;
    customStyle?: SnakeStyleValue;
    scrollTop?: number;
}

export interface SnakeFilterSortsEmits {
    change: [params: Record<string, string | number | boolean>];
}
