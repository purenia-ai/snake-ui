import type { SnakeStyleValue } from '../component-types';

export type SnakeNoticeBarMode = 'horizontal' | 'vertical';
export type SnakeNoticeBarDirection = 'row' | 'column';

export interface SnakeNoticeBarProps {
  list?: string[];
  text?: string | string[];
  mode?: SnakeNoticeBarMode;
  direction?: SnakeNoticeBarDirection;
  volumeIcon?: boolean;
  bgColor?: string;
  color?: string;
  duration?: number;
  customStyle?: SnakeStyleValue;
}

export interface SnakeNoticeBarEmits {
  click: [index: number];
  change: [index: number];
}
