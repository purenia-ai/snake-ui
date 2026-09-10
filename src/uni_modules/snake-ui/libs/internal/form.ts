import type { InjectionKey, Ref } from 'vue';
import type { FormError, FormRules, FormTrigger } from '../form';
import type { StyleValue } from '../../types/global';

export type FormSize = 'small' | 'default' | 'large';
export type FormLabelPosition = 'left' | 'top';
export type FormLabelAlign = 'left' | 'center' | 'right';
export type FormErrorType = 'message' | 'border' | 'border-bottom' | 'none' | 'toast';

export interface FormField {
    prop: string;
    validate(trigger?: FormTrigger): Promise<FormError[]>;
    reset(): void;
    clear(): void;
}

export interface FormContext {
    model: Ref<Record<string, unknown>>;
    rules: Ref<FormRules>;
    size: Ref<FormSize>;
    errorType: Ref<FormErrorType[]>;
    borderBottom: Ref<boolean>;
    labelPosition: Ref<FormLabelPosition>;
    labelWidth: Ref<string | number>;
    labelAlign: Ref<FormLabelAlign>;
    labelStyle: Ref<StyleValue>;
    register(field: FormField): void;
    unregister(field: FormField): void;
}

export const formKey: InjectionKey<FormContext> = Symbol('snake-form');
