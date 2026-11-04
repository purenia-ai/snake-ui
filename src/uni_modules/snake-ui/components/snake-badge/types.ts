import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** Badge 组件的公开属性。 */
export interface BadgeProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 徽标内容：数字或文本。 */
    value?: number | string;
    /** 最大值，超过显示 max+。 */
    max?: number;
    /** 是否显示为圆点（忽略内容）。 */
    isDot?: boolean;
    /** value 为 0 时是否仍显示。 */
    showZero?: boolean;
    /** 是否强制隐藏徽标（包裹内容的插槽照常渲染）。 */
    hidden?: boolean;
    /** 相对角点的垂直偏移，正值向下。 */
    top?: UnitValue;
    /** 相对角点的水平偏移，正值向左。 */
    right?: UnitValue;
    /** 徽标背景色。 */
    bgColor?: string;
    /** 徽标文字颜色。 */
    color?: string;
}
