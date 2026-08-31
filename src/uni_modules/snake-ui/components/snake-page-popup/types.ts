export type SnakePagePopupMode = 'bottom' | 'center';

export interface SnakePagePopupData {
    popupMode?: SnakePagePopupMode;
    image?: string;
    url?: string;
}

export interface SnakePagePopupProps {
    datas?: SnakePagePopupData;
}
