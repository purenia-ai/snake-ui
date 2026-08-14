import type { InjectionKey, Ref } from 'vue';

export interface SnakeIndexListContext {
  activeIndex: Ref<number>;
  anchorId(index: number): string;
}

export const snakeIndexListKey: InjectionKey<SnakeIndexListContext> = Symbol('snake-index-list');
