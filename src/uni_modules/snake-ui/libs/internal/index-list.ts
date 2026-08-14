import type { InjectionKey, Ref } from 'vue';
export interface SnakeIndexListContext {
  activeIndex: Ref<number>; sticky: Ref<boolean>; offsetTop: Ref<string | number | null | undefined>; zIndex: Ref<number>;
  anchorId(index: string | number): string;
}
export const snakeIndexListKey: InjectionKey<SnakeIndexListContext> = Symbol('snake-index-list');
