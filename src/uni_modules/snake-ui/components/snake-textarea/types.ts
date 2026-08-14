import type { UnitValue } from '../../libs';
import type { SnakeStyleValue } from '../component-types';
import type { SnakeFormSize } from '../../libs/internal/form';
export interface SnakeTextareaProps {
    modelValue?: string | number;
    placeholder?: string;
    placeholderStyle?: string;
    maxlength?: number;
    height?: UnitValue;
    autoHeight?: boolean;
    fixed?: boolean;
    count?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    size?: SnakeFormSize;
    border?: 'none' | 'surround' | 'bottom';
    color?: string;
    placeholderColor?: string;
    fontSize?: UnitValue;
    focus?: boolean;
    cursor?: number;
    selectionStart?: number;
    selectionEnd?: number;
    confirmType?: string;
    confirmHold?: boolean;
    adjustPosition?: boolean;
    holdKeyboard?: boolean;
    cursorSpacing?: number;
    showConfirmBar?: boolean;
    customClass?: string;
    customStyle?: SnakeStyleValue;
}
export interface SnakeTextareaEmits {
    'update:modelValue': [value: string];
    input: [value: string];
    change: [value: string];
    focus: [event: unknown];
    blur: [event: unknown];
    confirm: [value: string, event: unknown];
    linechange: [event: unknown];
    keyboardheightchange: [event: unknown];
}
