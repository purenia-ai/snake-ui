/** SnakePagePopupMode 类型定义。 */
export type SnakePagePopupMode = 'bottom' | 'center';

/** SnakePagePopup 配置数据。 */
export interface SnakePagePopupData {
    /** popup mode 配置。 */
    popupMode?: SnakePagePopupMode;
    /** 图片地址。 */
    image?: string;
    /** 点击后跳转地址。 */
    url?: string;
}

/** SnakePagePopup 组件的公开属性。 */
export interface SnakePagePopupProps {
    /** CMS 装修组件配置数据。 */
    datas?: SnakePagePopupData;
}
