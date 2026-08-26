import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormSize } from '../../libs/internal/form';
export type SnakeSwitchValue = boolean | string | number;
export interface SnakeSwitchProps {
    modelValue?: SnakeSwitchValue;
    activeValue?: SnakeSwitchValue;
    inactiveValue?: SnakeSwitchValue;
    loading?: boolean;
    disabled?: boolean;
    size?: UnitValue | SnakeFormSize;
    activeColor?: string;
    inactiveColor?: string;
    space?: UnitValue;
    vibrateShort?: boolean;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}
export interface SnakeSwitchEmits {
    'update:modelValue': [value: SnakeSwitchValue];
    change: [value: SnakeSwitchValue];
    click: [event: unknown];
}
