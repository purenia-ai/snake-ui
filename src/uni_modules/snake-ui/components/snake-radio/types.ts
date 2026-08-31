import type { ExtractPropTypes, PropType } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormSize } from '../../libs/internal/form';

export const snakeRadioProps = {
    modelValue: { type: Boolean, default: false },
    name: null as unknown as PropType<unknown>,
    label: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    labelDisabled: { type: Boolean, default: false },
    shape: String as PropType<'square' | 'circle'>,
    size: String as PropType<SnakeFormSize>,
    activeColor: String,
    inactiveColor: String,
    iconColor: { type: String, default: '#fff' },
    iconSize: [String, Number] as PropType<UnitValue>,
    labelSize: [String, Number] as PropType<UnitValue>,
    customClass: { type: String, default: '' },
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: '' }
} as const;

export type SnakeRadioResolvedProps = ExtractPropTypes<typeof snakeRadioProps>;

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
