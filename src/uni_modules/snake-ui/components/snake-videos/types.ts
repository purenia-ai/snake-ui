/** Videos 组件的公开属性。 */
export interface VideosProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
    /** 页面或容器当前滚动距离。 */
    scrollTop?: number;
}
