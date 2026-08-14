import type { SnakeImageMode } from '../component-types';

export interface SnakeLazyImageProps {
  src?: string;
  loadingImg?: string;
  errorImg?: string;
  threshold?: number;
  index?: number | string;
  mode?: SnakeImageMode;
}

export interface SnakeLazyImageEmits {
  click: [event: unknown];
  load: [event: unknown];
  error: [event: unknown];
}
