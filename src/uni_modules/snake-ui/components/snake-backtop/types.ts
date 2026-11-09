import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** Backtop 按钮形状。 */
export type BacktopShape = 'circle' | 'square';

/** Backtop 组件的公开属性。 */
export interface BacktopProps {
    /** 页面滚动距离，取页面 onPageScroll 的 scrollTop，超过 top 时显示按钮。 */
    scrollTop: number;
    /** 显示阈值，滚动距离超过该值显示按钮，数值按 px（375 稿）处理。 */
    top?: UnitValue;
    /** 距屏幕底部的距离，数值按 px（375 稿）处理。 */
    bottom?: UnitValue;
    /** 距屏幕右侧的距离，数值按 px（375 稿）处理。 */
    right?: UnitValue;
    /** 按钮形状，圆形在图标模式下为正圆。 */
    shape?: BacktopShape;
    /** 图标名或图片地址，规则与 Icon 的 name 一致。 */
    icon?: string;
    /** 图标尺寸，数值按 px（375 稿）处理。 */
    iconSize?: UnitValue;
    /** 图标颜色。 */
    iconColor?: string;
    /** 图标下方文字，为空时不渲染。 */
    text?: string;
    /** 回到顶部的滚动时长，单位 ms。 */
    duration?: number;
    /** 按钮层级。 */
    zIndex?: number;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** Backtop 组件的事件契约。 */
export type BacktopEmits = {
    /** 点击按钮时触发，早于页面滚动。 */
    click: [event: unknown];
};
