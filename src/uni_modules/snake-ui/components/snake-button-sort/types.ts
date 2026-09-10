/** ButtonSortValue 类型定义。 */
export type ButtonSortValue = '' | 'asc' | 'desc';

/** ButtonSort 组件的公开属性。 */
export interface ButtonSortProps {
    /** 标题文本。 */
    title?: string;
    /** 标题颜色。 */
    titleColor?: string;
}

/** ButtonSortChange 事件详情。 */
export interface ButtonSortChangeDetail {
    /** 当前值。 */
    value: ButtonSortValue;
}

/** ButtonSort 组件的事件契约。 */
export interface ButtonSortEmits {
    /** change 事件携带的参数。 */
    change: [payload: ButtonSortChangeDetail];
}
