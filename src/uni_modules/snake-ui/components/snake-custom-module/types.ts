export interface SnakeCustomModuleProps<Data extends Record<string, any> = Record<string, any>> {
    datas?: Data;
}

export interface SnakeCustomModuleSlots {
    default?: () => unknown;
}
