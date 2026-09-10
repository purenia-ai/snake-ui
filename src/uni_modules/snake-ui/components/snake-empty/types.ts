import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** EmptyMode 类型定义。 */
export type EmptyMode =
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

/** Empty 组件的公开属性。 */
export interface EmptyProps {
    /** 是否显示组件。 */
    show?: boolean;
    /** 组件展示模式。 */
    mode?: EmptyMode;
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
    customStyle?: StyleValue;
}
