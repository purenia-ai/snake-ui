/** PagePopupMode 类型定义。 */
export type PagePopupMode = 'bottom' | 'center';

/** PagePopup 配置数据。 */
export interface PagePopupData {
    /** popup mode 配置。 */
    popupMode?: PagePopupMode;
    /** 图片地址。 */
    image?: string;
    /** 点击后跳转地址。 */
    url?: string;
}

/** PagePopup 组件的公开属性。 */
export interface PagePopupProps {
    /** CMS 装修组件配置数据。 */
    datas?: PagePopupData;
    /** 组件挂载后是否立即打开弹窗。 */
    autoOpen?: boolean;
}

/** PagePopup 实例公开的操作。 */
export interface PagePopupExpose {
    /** 打开弹窗。 */
    open(): void;
    /** 关闭弹窗。 */
    close(): void;
}
