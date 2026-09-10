import type { UnitValue } from '../../libs/function/unit';
import type { ImageMode, StyleValue } from '../../types/global';
/** Swiper 数据项。 */
export type SwiperItem = string | Record<string, unknown>;
/** SwiperIndicatorMode 类型定义。 */
export type SwiperIndicatorMode = 'round' | 'dot' | 'line' | 'number';
/** SwiperIndicatorPosition 类型定义。 */
export type SwiperIndicatorPosition =
    'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
/** Swiper 组件的公开属性。 */
export interface SwiperProps {
    /** 用于渲染的数据列表。 */
    list?: SwiperItem[];
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
    mode?: SwiperIndicatorMode;
    /** indicator pos 配置。 */
    indicatorPos?: SwiperIndicatorPosition;
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
    imgMode?: ImageMode;
    /** show title 配置。 */
    showTitle?: boolean;
    /** 标题文本。 */
    title?: boolean;
    /** title style 配置。 */
    titleStyle?: StyleValue;
    /** 背景颜色。 */
    bgColor?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** SwiperChange 事件详情。 */
export interface SwiperChangeDetail {
    /** 当前激活项索引。 */
    current: number;
    /** source 配置。 */
    source?: string;
}
/** Swiper 组件的事件契约。 */
export interface SwiperEmits {
    /** change 事件携带的参数。 */
    change: [detail: SwiperChangeDetail];
    /** click 事件携带的参数。 */
    click: [index: number, item: SwiperItem];
    /** animationfinish 事件携带的参数。 */
    animationfinish: [detail: SwiperChangeDetail];
}
