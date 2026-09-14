import type { UnitValue } from '../../libs/function/unit';
import type { ImageMode, StyleValue } from '../../types/global';

/** Image 组件的公开属性。 */
export interface ImageProps {
    /** 资源地址。 */
    src?: string;
    /** 图片替代文本。 */
    alt?: string;
    /** 组件展示模式。 */
    mode?: ImageMode;
    /** 组件宽度。 */
    width?: UnitValue;
    /** 组件高度。 */
    height?: UnitValue | 'auto';
    /** 组件形状。 */
    shape?: 'square' | 'circle';
    /** 圆角尺寸。 */
    radius?: UnitValue;
    /** 是否开启视口懒加载；进入预加载范围后才设置真实图片地址。 */
    lazyLoad?: boolean;
    /** 视口懒加载的预加载距离。 */
    lazyThreshold?: number;
    /** show menu by longpress 配置。 */
    showMenuByLongpress?: boolean;
    /** webp 配置。 */
    webp?: boolean;
    /** fade 配置。 */
    fade?: boolean;
    /** 动画持续时间。 */
    duration?: number;
    /** 背景颜色。 */
    bgColor?: string;
    /** show loading 配置。 */
    showLoading?: boolean;
    /** loading icon 配置。 */
    loadingIcon?: string;
    /** 加载中显示的图片地址。 */
    loadingImg?: string;
    /** show error 配置。 */
    showError?: boolean;
    /** error icon 配置。 */
    errorIcon?: string;
    /** 加载失败显示的图片地址。 */
    errorImg?: string;
    /** preview 配置。 */
    preview?: boolean;
    /** preview urls 配置。 */
    previewUrls?: string[];
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** Image 组件的事件契约。 */
export type ImageEmits = {
    /** load 事件携带的参数。 */
    load: [event: unknown];
    /** error 事件携带的参数。 */
    error: [event: unknown];
    /** click 事件携带的参数。 */
    click: [event: unknown];
};
