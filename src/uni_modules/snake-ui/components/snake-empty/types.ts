import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeEmptyMode 类型定义。 */
export type SnakeEmptyMode =
    | 'data'
    | 'list'
    | 'search'
    | 'page'
    | 'order'
    | 'coupon'
    | 'favor'
    | 'permission'
    | 'history'
    | 'message'
    | 'wifi'
    | 'address'
    | 'car';

/** SnakeEmpty 组件的公开属性。 */
export interface SnakeEmptyProps {
    /** 是否显示组件。 */
    show?: boolean;
    /** 组件展示模式。 */
    mode?: SnakeEmptyMode;
    /** 资源地址。 */
    src?: string;
    /** 图标名称。 */
    icon?: string;
    /** 图标颜色。 */
    iconColor?: string;
    /** 图标尺寸，数值按 rpx 处理。 */
    iconSize?: UnitValue;
    /** 展示文本。 */
    text?: string;
    /** 内容颜色。 */
    color?: string;
    /** 文字颜色。 */
    textColor?: string;
    /** 文字尺寸，数值按 rpx 处理。 */
    fontSize?: UnitValue;
    /** 组件顶部外边距。 */
    marginTop?: UnitValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
