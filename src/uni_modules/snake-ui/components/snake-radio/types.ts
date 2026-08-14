import type { UnitValue } from '../../libs';
import type { SnakeStyleValue } from '../component-types';
import type { SnakeFormSize } from '../../libs/internal/form';
export interface SnakeRadioProps {
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
export interface SnakeRadioEmits {
    'update:modelValue': [value: boolean];
    change: [value: boolean, name: unknown];
    click: [event: unknown];
}
