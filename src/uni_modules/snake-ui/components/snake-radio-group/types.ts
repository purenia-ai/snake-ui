import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeChoiceDirection } from '../../libs/internal/checkbox';
import type { SnakeFormSize } from '../../libs/internal/form';
export interface SnakeRadioGroupProps {
    modelValue?: unknown;
    disabled?: boolean;
    direction?: SnakeChoiceDirection;
    placement?: SnakeChoiceDirection;
    size?: SnakeFormSize;
    activeColor?: string;
    inactiveColor?: string;
    iconSize?: UnitValue;
    labelSize?: UnitValue;
    shape?: 'square' | 'circle';
    customClass?: string;
    customStyle?: SnakeStyleValue;
}
export interface SnakeRadioGroupEmits {
    'update:modelValue': [value: unknown];
    change: [value: unknown];
}
