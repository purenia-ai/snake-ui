import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormSize } from '../../libs/internal/form';
export interface SnakeCheckboxProps {
    modelValue?: boolean;
    name?: unknown;
    label?: string;
    disabled?: boolean;
    labelDisabled?: boolean;
    shape?: 'square' | 'circle';
    size?: SnakeFormSize;
    activeColor?: string;
    inactiveColor?: string;
    iconColor?: string;
    iconSize?: UnitValue;
    labelSize?: UnitValue;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}
export interface SnakeCheckboxEmits {
    'update:modelValue': [value: boolean];
    change: [value: boolean, name: unknown];
    click: [event: unknown];
}
