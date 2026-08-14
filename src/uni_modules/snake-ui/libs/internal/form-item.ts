import type { InjectionKey, Ref } from 'vue';
import type { SnakeFormTrigger } from '../form';
import type { SnakeFormSize } from './form';

export interface SnakeFormItemContext {
    error: Ref<string>;
    errorVisible: Ref<boolean>;
    size: Ref<SnakeFormSize>;
    notify(trigger: SnakeFormTrigger): Promise<void>;
}

export const snakeFormItemKey: InjectionKey<SnakeFormItemContext> = Symbol('snake-form-item');
