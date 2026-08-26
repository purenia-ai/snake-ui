import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormLabelAlign, SnakeFormLabelPosition, SnakeFormSize } from '../../libs/internal/form';
export interface SnakeFormItemProps {
    label?: string;
    prop?: string;
    required?: boolean;
    leftIcon?: string;
    rightIcon?: string;
    labelPosition?: SnakeFormLabelPosition;
    labelWidth?: UnitValue;
    labelAlign?: SnakeFormLabelAlign;
    labelStyle?: SnakeStyleValue;
    borderBottom?: boolean;
    size?: SnakeFormSize;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}
export interface SnakeFormItemExpose {
    validate(trigger?: 'change' | 'blur'): Promise<unknown[]>;
    resetField(): void;
    clearValidate(): void;
}
