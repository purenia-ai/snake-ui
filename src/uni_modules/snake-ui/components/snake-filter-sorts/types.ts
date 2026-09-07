import type { SnakeStyleValue } from '../../types/global';

/** SnakeFilter 可选项。 */
export interface SnakeFilterOption extends Record<string, unknown> {
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** 当前值。 */
    value?: string | number;
    /** selected 配置。 */
    selected?: boolean;
}

/** SnakeFilterGroup 类型定义。 */
export interface SnakeFilterGroup extends Record<string, unknown> {
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** 当前值。 */
    value?: string;
    /** 组件类型或展示模式。 */
    type?: string;
    /** 用于渲染的数据列表。 */
    list?: SnakeFilterOption[];
}

/** SnakeFilterSorts 配置数据。 */
export interface SnakeFilterSortsData extends Record<string, unknown> {
    /** top filter 配置。 */
    topFilter?: SnakeFilterGroup[];
    /** main filter 配置。 */
    mainFilter?: SnakeFilterGroup[];
    /** brand filter 配置。 */
    brandFilter?: Record<string, SnakeFilterOption[]>;
}

/** SnakeFilterSorts 组件的公开属性。 */
export interface SnakeFilterSortsProps<Filters extends SnakeFilterSortsData = SnakeFilterSortsData> {
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
    customStyle?: SnakeStyleValue;
    /** @deprecated 弹层索引列表已使用独立容器滚动，此属性仅为兼容旧调用保留。 */
    scrollTop?: number;
}

/** SnakeFilterSorts 组件的事件契约。 */
export interface SnakeFilterSortsEmits {
    /** change 事件携带的参数。 */
    change: [params: Record<string, string | number | boolean>];
}
