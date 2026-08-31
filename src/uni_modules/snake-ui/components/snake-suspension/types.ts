/** SnakeSuspension 配置数据。 */
export interface SnakeSuspensionData {
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

/** SnakeSuspension 组件的公开属性。 */
export interface SnakeSuspensionProps {
    /** CMS 装修组件配置数据。 */
    datas?: SnakeSuspensionData;
    /** 页面或容器当前滚动距离。 */
    scrollTop?: number;
}
