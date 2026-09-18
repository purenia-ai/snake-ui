/** GraphicNavigation 数据项。 */
export interface GraphicNavigationItem {
    /** 资源地址。 */
    src?: string;
    /** 展示文本。 */
    text?: string;
    /** 点击后跳转地址。 */
    url?: string;
}

/** GraphicNavigation 配置数据。 */
export interface GraphicNavigationData {
    /** img style 配置。 */
    imgStyle?: 0 | 1;
    /** image list 配置。 */
    imageList?: GraphicNavigationItem[];
    /** background color 配置。 */
    backgroundColor?: string;
    /** img margin 配置。 */
    imgMargin?: number;
    /** 圆角尺寸。 */
    borderRadius?: number;
    /** navigation type 配置。 */
    navigationType?: number;
    /** 文字颜色。 */
    textColor?: string;
    /** text size 配置。 */
    textSize?: number;
    /** text height 配置。 */
    textHeight?: number;
}

/** GraphicNavigation 组件的公开属性。 */
export interface GraphicNavigationProps {
    /** CMS 装修组件配置数据。 */
    datas?: GraphicNavigationData;
}

/** GraphicNavigation 点击入口时发出的事件。 */
export interface GraphicNavigationEmits {
    /** 被点击的入口及其下标。 */
    click: [payload: { item: GraphicNavigationItem; index: number }];
}
