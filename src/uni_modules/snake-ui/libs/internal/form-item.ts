import type { InjectionKey, Ref } from 'vue';
import type { FormTrigger } from '../form';
import type { FormSize } from './form';

export interface FormItemContext {
    error: Ref<string>;
    errorVisible: Ref<boolean>;
    size: Ref<FormSize>;
    notify(trigger: FormTrigger): Promise<void>;
}

export const formItemKey: InjectionKey<FormItemContext> = Symbol('snake-form-item');
