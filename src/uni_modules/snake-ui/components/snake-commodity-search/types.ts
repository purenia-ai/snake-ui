/** CommoditySearch 组件的公开属性。 */
export interface CommoditySearchProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
}

/** 输入框确认搜索时发出的事件。 */
export interface CommoditySearchEmits {
    /** 用户确认搜索时输入的关键词。 */
    search: [keyword: string];
}
