/** CustomModule 组件的公开属性。 */
export interface CustomModuleProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
}

/** CustomModuleSlots 类型定义。 */
export interface CustomModuleSlots {
    /** default 配置。 */
    default?: () => unknown;
}
