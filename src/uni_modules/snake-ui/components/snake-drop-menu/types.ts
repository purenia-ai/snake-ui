import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
/** DropMenu 组件的公开属性。 */
export interface DropMenuProps {
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** close on click mask 配置。 */
    closeOnClickMask?: boolean;
    /** close on click self 配置。 */
    closeOnClickSelf?: boolean;
    /** 动画持续时间。 */
    duration?: number;
    /** 组件高度。 */
    height?: UnitValue;
    /** 是否显示底部边框。 */
    borderBottom?: boolean;
    /** 标题文字尺寸，数值按 rpx 处理。 */
    titleSize?: UnitValue;
    /** menu icon 配置。 */
    menuIcon?: string;
    /** menu icon size 配置。 */
    menuIconSize?: UnitValue;
    /** 组件层级。 */
    zIndex?: number;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** DropMenu 组件的事件契约。 */
export interface DropMenuEmits {
    /** open 事件携带的参数。 */
    open: [index: number];
    /** close 事件携带的参数。 */
    close: [index: number];
}
/** DropMenu 组件实例公开的方法和状态。 */
export interface DropMenuExpose {
    /** updateDropMenuRect 方法。 */
    updateDropMenuRect(): Promise<void>;
    /** colseAll 方法。 */
    colseAll(): void;
    /** close 方法。 */
    close(): void;
    /** open 方法。 */
    open(index: number): void;
    /** highlight 方法。 */
    highlight(index?: number): void;
}
