export interface SnakeSuspensionData {
    uid?: string | number;
    src?: string;
    url?: string;
    right?: number;
    bottom?: number;
    width?: number;
    height?: number;
}

export interface SnakeSuspensionProps {
    datas?: SnakeSuspensionData;
    scrollTop?: number;
}
