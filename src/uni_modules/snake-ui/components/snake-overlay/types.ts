import type { SnakeStyleValue } from '../component-types';

export interface SnakeOverlayProps {
  modelValue?: boolean;
  opacity?: number;
  zIndex?: number;
  duration?: number;
  customStyle?: SnakeStyleValue;
}

export interface SnakeOverlayEmits {
  'update:modelValue': [value: boolean];
  click: [event: unknown];
}
