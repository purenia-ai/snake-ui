/** 热区项(与装修编辑器 sanke-editor 产出的 hotzoneList 元素一致) */
export interface SnakeHotzoneItem {
    id?: string;
    /** 热区顶部偏移,百分比 0-100 */
    top?: number;
    /** 热区左侧偏移,百分比 0-100 */
    left?: number;
    /** 热区宽度,百分比 0-100 */
    width?: number;
    /** 热区高度,百分比 0-100 */
    height?: number;
    /** 链接类型:10=内部链接 11=外部链接 */
    httpType?: number;
    /** 跳转链接 */
    http?: string;
}
