import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeLoadmoreStatus 类型定义。 */
export type SnakeLoadmoreStatus = 'loadmore' | 'loading' | 'nomore';
/** SnakeLoadmoreText 类型定义。 */
export interface SnakeLoadmoreText {
    /** loadmore 配置。 */
    loadmore?: string;
    /** 是否显示加载状态。 */
    loading?: string;
    /** nomore 配置。 */
    nomore?: string;
}
/** SnakeLoadmore 组件的公开属性。 */
export interface SnakeLoadmoreProps {
    /** 当前状态。 */
    status?: SnakeLoadmoreStatus;
    /** load text 配置。 */
    loadText?: string | SnakeLoadmoreText;
    /** 加载状态下显示的文本。 */
    loadingText?: string;
    /** nomore text 配置。 */
    nomoreText?: string;
    /** 背景颜色。 */
    bgColor?: string;
    /** 图标名称。 */
    icon?: boolean;
    /** icon type 配置。 */
    iconType?: 'circle' | 'flower' | 'spinner';
    /** 图标颜色。 */
    iconColor?: string;
    /** is dot 配置。 */
    isDot?: boolean;
    /** 内容颜色。 */
    color?: string;
    /** 文字尺寸，数值按 rpx 处理。 */
    fontSize?: UnitValue;
    /** 组件顶部外边距。 */
    marginTop?: UnitValue;
    /** margin bottom 配置。 */
    marginBottom?: UnitValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeLoadmore 组件的事件契约。 */
export interface SnakeLoadmoreEmits {
    /** loadmore 事件携带的参数。 */
    loadmore: [];
    /** click 事件携带的参数。 */
    click: [status: SnakeLoadmoreStatus];
}
