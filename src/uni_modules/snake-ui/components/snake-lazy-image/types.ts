import type { UnitValue } from '../../libs/function/unit';
import type { ImageMode, StyleValue } from '../../types/global';

/** LazyImage 组件的公开属性。 */
export interface LazyImageProps {
    /** 资源地址。 */
    src?: string;
    /** 进入视口前显示的占位图片地址，不触发真实图片加载事件。 */
    loadingImg?: string;
    /** 真实图片加载失败后显示的回退图片地址。 */
    errorImg?: string;
    /** threshold 配置。 */
    threshold?: number;
    /** 当前数据项索引。 */
    index?: number | string;
    /** 组件展示模式。 */
    mode?: ImageMode;
    /** 组件宽度。 */
    width?: UnitValue;
    /** 组件高度。 */
    height?: UnitValue | 'auto';
    /** 圆角尺寸。 */
    radius?: UnitValue;
    /** fade 配置。 */
    fade?: boolean;
    /** 动画持续时间。 */
    duration?: number;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** LazyImage 组件的事件契约。 */
export type LazyImageEmits = {
    /** click 事件携带的参数。 */
    click: [event: unknown, index: number | string];
    /** load 事件携带的参数。 */
    load: [event: unknown, index: number | string];
    /** error 事件携带的参数。 */
    error: [event: unknown, index: number | string];
};
