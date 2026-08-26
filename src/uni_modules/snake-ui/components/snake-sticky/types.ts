import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

export interface SnakeStickyProps {
    offsetTop?: UnitValue;
    customNavHeight?: UnitValue;
    zIndex?: number;
    disabled?: boolean;
    bgColor?: string;
    scrollTop?: number;
    index?: number | string;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}

export interface SnakeStickyChangeDetail {
    isFixed: boolean;
    index: number | string;
}

export interface SnakeStickyEmits {
    fixed: [detail: SnakeStickyChangeDetail];
    unfixed: [detail: SnakeStickyChangeDetail];
    change: [detail: SnakeStickyChangeDetail];
}

export interface SnakeStickyExpose {
    update(): Promise<void>;
}
