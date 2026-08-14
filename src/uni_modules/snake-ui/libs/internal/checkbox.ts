import type { InjectionKey, Ref } from 'vue';
import type { SnakeFormSize } from './form';
import type { UnitValue } from '../unit';

export type SnakeChoiceDirection = 'row' | 'column';
export interface SnakeCheckboxGroupContext {
    modelValue: Ref<unknown[]>;
    disabled: Ref<boolean>;
    max: Ref<number>;
    size: Ref<SnakeFormSize>;
    activeColor: Ref<string>;
    inactiveColor: Ref<string>;
  iconSize: Ref<UnitValue>;
  labelSize: Ref<UnitValue>;
    shape: Ref<'square' | 'circle'>;
    toggle(name: unknown, checked: boolean): void;
}
export const snakeCheckboxGroupKey: InjectionKey<SnakeCheckboxGroupContext> = Symbol('snake-checkbox-group');
