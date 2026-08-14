import type { UnitValue } from '../../libs';
import type { SnakeImageMode, SnakeStyleValue } from '../component-types';

export interface SnakeImageProps {
    src?: string;
    mode?: SnakeImageMode;
    width?: UnitValue;
    height?: UnitValue | 'auto';
    shape?: 'square' | 'circle';
    radius?: UnitValue;
    lazyLoad?: boolean;
    showMenuByLongpress?: boolean;
    webp?: boolean;
    fade?: boolean;
    duration?: number;
    bgColor?: string;
    showLoading?: boolean;
    loadingIcon?: string;
    showError?: boolean;
    errorIcon?: string;
    preview?: boolean;
    previewUrls?: string[];
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakeImageEmits {
    load: [event: unknown];
    error: [event: unknown];
    click: [event: unknown];
}
