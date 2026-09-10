/** ListSwitching 组件的公开属性。 */
export interface ListSwitchingProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
}

/** ListSwitching 组件的事件契约。 */
export interface ListSwitchingEmits<Item extends Record<string, any> = Record<string, any>> {
    /** item-click 事件携带的参数。 */
    'item-click': [item: Item];
}
