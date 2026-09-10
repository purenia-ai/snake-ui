import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
/** IndexValue 类型定义。 */
export type IndexValue = string | number;
/** IndexList 组件的公开属性。 */
export interface IndexListProps {
    /** index list 配置。 */
    indexList?: IndexValue[];
    /** 页面当前滚动距离，由页面的 onPageScroll 事件传入。 */
    scrollTop?: number | string;
    /** 组件层级。 */
    zIndex?: number;
    /** sticky 配置。 */
    sticky?: boolean;
    /** 吸顶或定位的顶部偏移量。 */
    offsetTop?: UnitValue;
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** rail style 配置。 */
    railStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** IndexListChange 事件详情。 */
export interface IndexListChangeDetail {
    /** 当前数据项索引。 */
    index: number;
    /** 当前值。 */
    value: IndexValue;
}
/** IndexList 组件的事件契约。 */
export interface IndexListEmits {
    /** select 事件携带的参数。 */
    select: [value: IndexValue];
    /** change 事件携带的参数。 */
    change: [detail: IndexListChangeDetail];
}
/** IndexList 组件实例公开的方法和状态。 */
export interface IndexListExpose {
    /** scrollTo 方法。 */
    scrollTo(index: number | IndexValue): void;
    /** update 方法。 */
    update(): Promise<void>;
}
