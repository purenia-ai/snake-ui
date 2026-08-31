export interface SnakeGraphicNavigationItem {
    src?: string;
    text?: string;
    url?: string;
}

export interface SnakeGraphicNavigationData {
    imgStyle?: 0 | 1;
    imageList?: SnakeGraphicNavigationItem[];
    backgroundColor?: string;
    imgMargin?: number;
    borderRadius?: number;
    navigationType?: number;
    textColor?: string;
    textSize?: number;
    textHeight?: number;
}

export interface SnakeGraphicNavigationProps {
    datas?: SnakeGraphicNavigationData;
}
