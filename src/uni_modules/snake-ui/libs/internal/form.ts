import type { InjectionKey, Ref } from 'vue';
import type { SnakeFormError, SnakeFormRules, SnakeFormTrigger } from '../form';
import type { SnakeStyleValue } from '../../types/global';

export type SnakeFormSize = 'small' | 'default' | 'large';
export type SnakeFormLabelPosition = 'left' | 'top';
export type SnakeFormLabelAlign = 'left' | 'center' | 'right';
export type SnakeFormErrorType = 'message' | 'border' | 'border-bottom' | 'none' | 'toast';

export interface SnakeFormField {
    prop: string;
    validate(trigger?: SnakeFormTrigger): Promise<SnakeFormError[]>;
    reset(): void;
    clear(): void;
}

export interface SnakeFormContext {
    model: Ref<Record<string, unknown>>;
    rules: Ref<SnakeFormRules>;
    size: Ref<SnakeFormSize>;
    errorType: Ref<SnakeFormErrorType[]>;
    borderBottom: Ref<boolean>;
    labelPosition: Ref<SnakeFormLabelPosition>;
    labelWidth: Ref<string | number>;
    labelAlign: Ref<SnakeFormLabelAlign>;
    labelStyle: Ref<SnakeStyleValue>;
    register(field: SnakeFormField): void;
    unregister(field: SnakeFormField): void;
}

export const snakeFormKey: InjectionKey<SnakeFormContext> = Symbol('snake-form');
