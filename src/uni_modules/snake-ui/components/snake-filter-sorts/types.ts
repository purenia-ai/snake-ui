import type { StyleValue } from '../../types/global';

/** Filter 可选项。 */
export interface FilterOption extends Record<string, unknown> {
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** 当前值。 */
    value?: string | number;
    /** selected 配置。 */
    selected?: boolean;
}

/** FilterGroup 类型定义。 */
export interface FilterGroup extends Record<string, unknown> {
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** 当前值。 */
    value?: string;
    /** 组件类型或展示模式。 */
    type?: string;
    /** 用于渲染的数据列表。 */
    list?: FilterOption[];
}

/** FilterSorts 配置数据。 */
export interface FilterSortsData extends Record<string, unknown> {
    /** top filter 配置。 */
    topFilter?: FilterGroup[];
    /** main filter 配置。 */
    mainFilter?: FilterGroup[];
    /** brand filter 配置。 */
    brandFilter?: Record<string, FilterOption[]>;
}

/** FilterSorts 组件的公开属性。 */
export interface FilterSortsProps<Filters extends FilterSortsData = FilterSortsData> {
    /** 筛选项配置数据。 */
    filters?: Filters;
    /** default filter 配置。 */
    defaultFilter?: Record<string, any>;
    /** 背景颜色。 */
    bgColor?: string;
    /** sort 配置。 */
    sort?: string;
    /** show tabs 配置。 */
    showTabs?: boolean;
    /** goods list length 配置。 */
    goodsListLength?: number;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** FilterSorts 组件的事件契约。 */
export type FilterSortsEmits = {
    /** change 事件携带的参数。 */
    change: [params: Record<string, string | number | boolean>];
};
