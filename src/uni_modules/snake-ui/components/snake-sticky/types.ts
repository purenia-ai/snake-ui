import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** Sticky 组件的公开属性。 */
export interface StickyProps {
    /** 吸顶或定位的顶部偏移量，数值按 px（375 稿）处理，带 px 后缀时按 px 处理。 */
    offsetTop?: UnitValue;
    /** 自定义导航栏高度，单位 px。未传入时 H5 端自动让出 uni-app 内置导航栏 44px，其余端为 0；显式传 0 表示页面无导航栏。 */
    customNavHeight?: UnitValue;
    /** 组件层级。 */
    zIndex?: number;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 背景颜色。 */
    bgColor?: string;
    /** 页面或容器当前滚动距离，仅在不支持 IntersectionObserver 的环境下作为降级判定触发。 */
    scrollTop?: number;
    /** 当前数据项索引。 */
    index?: number | string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** StickyChange 事件详情。 */
export interface StickyChangeDetail {
    /** is fixed 配置。 */
    isFixed: boolean;
    /** 当前数据项索引。 */
    index: number | string;
}

/** Sticky 组件的事件契约。 */
export type StickyEmits = {
    /** fixed 事件携带的参数。 */
    fixed: [detail: StickyChangeDetail];
    /** unfixed 事件携带的参数。 */
    unfixed: [detail: StickyChangeDetail];
    /** change 事件携带的参数。 */
    change: [detail: StickyChangeDetail];
};

/** Sticky 组件实例公开的方法和状态。 */
export interface StickyExpose {
    /** update 方法。 */
    update(): Promise<void>;
}
