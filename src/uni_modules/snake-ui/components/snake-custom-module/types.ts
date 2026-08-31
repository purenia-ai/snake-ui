/** SnakeCustomModule 组件的公开属性。 */
export interface SnakeCustomModuleProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
}

/** SnakeCustomModuleSlots 类型定义。 */
export interface SnakeCustomModuleSlots {
    /** default 配置。 */
    default?: () => unknown;
}
