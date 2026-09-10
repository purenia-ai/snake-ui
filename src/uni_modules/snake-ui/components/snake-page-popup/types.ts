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
}
