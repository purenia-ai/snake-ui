/** SnakeButtonSortValue 类型定义。 */
export type SnakeButtonSortValue = '' | 'asc' | 'desc';

/** SnakeButtonSort 组件的公开属性。 */
export interface SnakeButtonSortProps {
    /** 标题文本。 */
    title?: string;
    /** 标题颜色。 */
    titleColor?: string;
}

/** SnakeButtonSortChange 事件详情。 */
export interface SnakeButtonSortChangeDetail {
    /** 当前值。 */
    value: SnakeButtonSortValue;
}

/** SnakeButtonSort 组件的事件契约。 */
export interface SnakeButtonSortEmits {
    /** change 事件携带的参数。 */
    change: [payload: SnakeButtonSortChangeDetail];
}
