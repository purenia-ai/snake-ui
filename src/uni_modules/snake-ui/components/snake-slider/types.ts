import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
export type SnakeSliderValuePosition = 'top' | 'bottom';
export interface SnakeSliderProps {
    modelValue?: number | string;
    min?: number | string;
    max?: number | string;
    step?: number | string;
    height?: UnitValue;
    blockWidth?: UnitValue;
    activeColor?: string;
    inactiveColor?: string;
    blockColor?: string;
    blockStyle?: SnakeStyleValue;
    disabled?: boolean;
    useSlot?: boolean;
    showValue?: boolean;
    valuePosition?: SnakeSliderValuePosition;
    showEdgeValue?: boolean;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}
export interface SnakeSliderEmits {
    'update:modelValue': [value: number];
    change: [value: number];
    start: [value: number];
    moving: [value: number];
    end: [value: number];
}
export interface SnakeSliderExpose {
    update(): Promise<void>;
}
