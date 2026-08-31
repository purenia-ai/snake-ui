import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeNavbar 组件的公开属性。 */
export interface SnakeNavbarProps {
    /** 标题文本。 */
    title?: string;
    /** 组件高度。 */
    height?: UnitValue;
    /** back icon color 配置。 */
    backIconColor?: string;
    /** back icon name 配置。 */
    backIconName?: string;
    /** back icon size 配置。 */
    backIconSize?: UnitValue;
    /** back text 配置。 */
    backText?: string;
    /** back text style 配置。 */
    backTextStyle?: SnakeStyleValue;
    /** title width 配置。 */
    titleWidth?: UnitValue;
    /** title color 配置。 */
    titleColor?: string;
    /** 标题文字尺寸，数值按 rpx 处理。 */
    titleSize?: UnitValue;
    /** title bold 配置。 */
    titleBold?: boolean;
    /** is back 配置。 */
    isBack?: boolean;
    /** background 配置。 */
    background?: SnakeStyleValue;
    /** 是否使用固定定位。 */
    fixed?: boolean;
    /** immersive 配置。 */
    immersive?: boolean;
    /** 是否适配顶部安全区域。 */
    safeAreaInsetTop?: boolean;
    /** 是否显示底部边框。 */
    borderBottom?: boolean;
    /** 组件层级。 */
    zIndex?: UnitValue;
    /** custom back 配置。 */
    customBack?: (() => void) | null;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeNavbar 组件的事件契约。 */
export interface SnakeNavbarEmits {
    /** back 事件携带的参数。 */
    back: [event: unknown];
}
