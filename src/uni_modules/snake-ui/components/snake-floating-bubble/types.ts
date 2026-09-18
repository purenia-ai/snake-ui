/** FloatingBubble 配置数据。 */
export interface FloatingBubbleData {
    /** uid 配置。 */
    uid?: string | number;
    /** 资源地址。 */
    src?: string;
    /** 点击后跳转地址。 */
    url?: string;
    /** right 配置。 */
    right?: number;
    /** bottom 配置。 */
    bottom?: number;
    /** 组件宽度。 */
    width?: number;
    /** 组件高度。 */
    height?: number;
}

/** FloatingBubble 组件的公开属性。 */
export interface FloatingBubbleProps {
    /** CMS 装修组件配置数据。 */
    datas?: FloatingBubbleData;
    /** 页面或容器当前滚动距离。 */
    scrollTop?: number;
    /** 插槽模式下底部定位偏移。 */
    bottom?: string;
    /** 插槽模式下容器背景。 */
    background?: string;
    /** 层级。 */
    zIndex?: number | string;
}

/** FloatingBubble 实例公开的操作。 */
export interface FloatingBubbleExpose {
    /** 重新打开已关闭的悬浮入口。 */
    reopen(): void;
}

/** FloatingBubble 点击入口时发出的事件。 */
export interface FloatingBubbleEmits {
    /** 用户点击悬浮入口。 */
    click: [];
}
