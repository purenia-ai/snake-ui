import type { SnakeStyleValue } from '../component-types';

export type SnakeButtonType =
  | 'default'
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | (string & {});

export interface SnakeButtonProps {
  type?: SnakeButtonType;
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  customStyle?: SnakeStyleValue;
}

export interface SnakeButtonEmits {
  click: [event: unknown];
}
