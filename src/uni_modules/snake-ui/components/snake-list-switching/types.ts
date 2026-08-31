export interface SnakeListSwitchingProps<Data extends Record<string, any> = Record<string, any>> {
    datas?: Data;
}

export interface SnakeListSwitchingEmits<Item extends Record<string, any> = Record<string, any>> {
    'item-click': [item: Item];
}
