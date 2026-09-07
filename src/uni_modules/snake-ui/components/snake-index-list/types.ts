import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
/** SnakeIndexValue 类型定义。 */
export type SnakeIndexValue = string | number;
/** SnakeIndexList 组件的公开属性。 */
export interface SnakeIndexListProps {
    /** index list 配置。 */
    indexList?: SnakeIndexValue[];
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
    railStyle?: SnakeStyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeIndexListChange 事件详情。 */
export interface SnakeIndexListChangeDetail {
    /** 当前数据项索引。 */
    index: number;
    /** 当前值。 */
    value: SnakeIndexValue;
}
/** SnakeIndexList 组件的事件契约。 */
export interface SnakeIndexListEmits {
    /** select 事件携带的参数。 */
    select: [value: SnakeIndexValue];
    /** change 事件携带的参数。 */
    change: [detail: SnakeIndexListChangeDetail];
}
/** SnakeIndexList 组件实例公开的方法和状态。 */
export interface SnakeIndexListExpose {
    /** scrollTo 方法。 */
    scrollTo(index: number | SnakeIndexValue): void;
    /** update 方法。 */
    update(): Promise<void>;
}
