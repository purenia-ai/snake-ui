import type { InjectionKey, Ref } from 'vue';

export interface SnakeDropMenuContext {
  activeItem: Ref<symbol | null>;
  open(item: symbol): void;
  close(): void;
}

export const snakeDropMenuKey: InjectionKey<SnakeDropMenuContext> = Symbol('snake-drop-menu');
