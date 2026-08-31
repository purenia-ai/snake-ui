/** SnakeListSwitching 组件的公开属性。 */
export interface SnakeListSwitchingProps<Data extends Record<string, any> = Record<string, any>> {
    /** CMS 装修组件配置数据。 */
    datas?: Data;
}

/** SnakeListSwitching 组件的事件契约。 */
export interface SnakeListSwitchingEmits<Item extends Record<string, any> = Record<string, any>> {
    /** item-click 事件携带的参数。 */
    'item-click': [item: Item];
}
