import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormError, SnakeFormRules } from '../../libs/form';
import type {
    SnakeFormErrorType,
    SnakeFormLabelAlign,
    SnakeFormLabelPosition,
    SnakeFormSize
} from '../../libs/internal/form';

export interface SnakeFormProps {
    model?: Record<string, unknown>;
    rules?: SnakeFormRules;
    errorType?: SnakeFormErrorType | SnakeFormErrorType[];
    borderBottom?: boolean;
    labelPosition?: SnakeFormLabelPosition;
    labelWidth?: string | number;
    labelAlign?: SnakeFormLabelAlign;
    labelStyle?: SnakeStyleValue;
    size?: SnakeFormSize;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}
export type SnakeFormCallback = (valid: boolean, errors: SnakeFormError[]) => void;
export interface SnakeFormExpose {
    validate(callback?: SnakeFormCallback): Promise<Record<string, unknown>>;
    validateField(props: string | string[], callback?: SnakeFormCallback): Promise<void>;
    resetFields(props?: string | string[]): void;
    clearValidate(props?: string | string[]): void;
    setRules(rules: SnakeFormRules): void;
}
export interface SnakeFormEmits {
    validate: [valid: boolean, errors: SnakeFormError[]];
}
export type { SnakeFormError, SnakeFormRule, SnakeFormRules, SnakeFormTrigger } from '../../libs/form';
