import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeSticky 组件的公开属性。 */
export interface SnakeStickyProps {
    /** 吸顶或定位的顶部偏移量。 */
    offsetTop?: UnitValue;
    /** custom nav height 配置。 */
    customNavHeight?: UnitValue;
    /** 组件层级。 */
    zIndex?: number;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 背景颜色。 */
    bgColor?: string;
    /** 页面或容器当前滚动距离。 */
    scrollTop?: number;
    /** 当前数据项索引。 */
    index?: number | string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeStickyChange 事件详情。 */
export interface SnakeStickyChangeDetail {
    /** is fixed 配置。 */
    isFixed: boolean;
    /** 当前数据项索引。 */
    index: number | string;
}

/** SnakeSticky 组件的事件契约。 */
export interface SnakeStickyEmits {
    /** fixed 事件携带的参数。 */
    fixed: [detail: SnakeStickyChangeDetail];
    /** unfixed 事件携带的参数。 */
    unfixed: [detail: SnakeStickyChangeDetail];
    /** change 事件携带的参数。 */
    change: [detail: SnakeStickyChangeDetail];
}

/** SnakeSticky 组件实例公开的方法和状态。 */
export interface SnakeStickyExpose {
    /** update 方法。 */
    update(): Promise<void>;
}
