import type { UnitValue } from '../../libs/function/unit';
import type { SnakeImageMode, SnakeStyleValue } from '../../types/global';

export interface SnakeLazyImageProps {
    src?: string;
    loadingImg?: string;
    errorImg?: string;
    threshold?: number;
    index?: number | string;
    mode?: SnakeImageMode;
    width?: UnitValue;
    height?: UnitValue | 'auto';
    radius?: UnitValue;
    fade?: boolean;
    duration?: number;
    customStyle?: SnakeStyleValue;
}

export interface SnakeLazyImageEmits {
    click: [event: unknown, index: number | string];
    load: [event: unknown, index: number | string];
    error: [event: unknown, index: number | string];
}
