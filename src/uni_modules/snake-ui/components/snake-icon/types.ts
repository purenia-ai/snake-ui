import type { UnitValue } from '../../libs/function/unit';
import type { SnakeImageMode, SnakeStyleValue } from '../../types/global';

/** SnakeIcon 组件的公开属性。 */
export interface SnakeIconProps {
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** 内容颜色。 */
    color?: string;
    /** 组件尺寸。 */
    size?: UnitValue;
    /** 是否使用粗体文字。 */
    bold?: boolean;
    /** 当前数据项索引。 */
    index?: number | string;
    /** 展示标签文本。 */
    label?: number | string;
    /** label pos 配置。 */
    labelPos?: 'left' | 'right' | 'top' | 'bottom';
    /** label color 配置。 */
    labelColor?: string;
    /** 标签文字尺寸，数值按 rpx 处理。 */
    labelSize?: UnitValue;
    /** space 配置。 */
    space?: UnitValue;
    /** custom prefix 配置。 */
    customPrefix?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 按下组件时应用的类名。 */
    hoverClass?: string;
    /** 图片裁剪与缩放模式。 */
    imgMode?: SnakeImageMode;
    /** 组件宽度。 */
    width?: UnitValue;
    /** 组件高度。 */
    height?: UnitValue;
    /** top 配置。 */
    top?: UnitValue;
    /** stop 配置。 */
    stop?: boolean;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeIcon 组件的事件契约。 */
export interface SnakeIconEmits {
    /** click 事件携带的参数。 */
    click: [event: unknown, index: number | string];
}
