import type { InjectionKey, Ref } from 'vue';
import type { SnakeFormSize } from './form';
import type { UnitValue } from '../unit';

export interface SnakeRadioGroupContext {
    modelValue: Ref<unknown>;
    disabled: Ref<boolean>;
    size: Ref<SnakeFormSize>;
    activeColor: Ref<string>;
    inactiveColor: Ref<string>;
  iconSize: Ref<UnitValue>;
  labelSize: Ref<UnitValue>;
    shape: Ref<'square' | 'circle'>;
    select(name: unknown): void;
}
export const snakeRadioGroupKey: InjectionKey<SnakeRadioGroupContext> = Symbol('snake-radio-group');
