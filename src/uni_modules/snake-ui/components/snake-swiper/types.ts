import type { UnitValue } from '../../libs/function/unit';
import type { SnakeImageMode, SnakeStyleValue } from '../../types/global';
/** SnakeSwiper 数据项。 */
export type SnakeSwiperItem = string | Record<string, unknown>;
/** SnakeSwiperIndicatorMode 类型定义。 */
export type SnakeSwiperIndicatorMode = 'round' | 'dot' | 'line' | 'number';
/** SnakeSwiperIndicatorPosition 类型定义。 */
export type SnakeSwiperIndicatorPosition =
    'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
/** SnakeSwiper 组件的公开属性。 */
export interface SnakeSwiperProps {
    /** 用于渲染的数据列表。 */
    list?: SnakeSwiperItem[];
    /** 当前激活项索引。 */
    current?: number | string;
    /** 组件高度。 */
    height?: UnitValue;
    /** 是否自动播放。 */
    autoplay?: boolean;
    /** interval 配置。 */
    interval?: number;
    /** 动画持续时间。 */
    duration?: number;
    /** circular 配置。 */
    circular?: boolean;
    /** indicator 配置。 */
    indicator?: boolean | Record<string, unknown>;
    /** 组件展示模式。 */
    mode?: SnakeSwiperIndicatorMode;
    /** indicator pos 配置。 */
    indicatorPos?: SnakeSwiperIndicatorPosition;
    /** indicator color 配置。 */
    indicatorColor?: string;
    /** indicator active color 配置。 */
    indicatorActiveColor?: string;
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** 圆角尺寸。 */
    radius?: UnitValue;
    /** 圆角尺寸。 */
    borderRadius?: UnitValue;
    /** previous margin 配置。 */
    previousMargin?: string;
    /** next margin 配置。 */
    nextMargin?: string;
    /** effect3d 配置。 */
    effect3d?: boolean;
    /** effect3d previous margin 配置。 */
    effect3dPreviousMargin?: UnitValue;
    /** 图片裁剪与缩放模式。 */
    imgMode?: SnakeImageMode;
    /** show title 配置。 */
    showTitle?: boolean;
    /** 标题文本。 */
    title?: boolean;
    /** title style 配置。 */
    titleStyle?: SnakeStyleValue;
    /** 背景颜色。 */
    bgColor?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeSwiperChange 事件详情。 */
export interface SnakeSwiperChangeDetail {
    /** 当前激活项索引。 */
    current: number;
    /** source 配置。 */
    source?: string;
}
/** SnakeSwiper 组件的事件契约。 */
export interface SnakeSwiperEmits {
    /** change 事件携带的参数。 */
    change: [detail: SnakeSwiperChangeDetail];
    /** click 事件携带的参数。 */
    click: [index: number, item: SnakeSwiperItem];
    /** animationfinish 事件携带的参数。 */
    animationfinish: [detail: SnakeSwiperChangeDetail];
}
