import type { SnakeStyleValue } from '../component-types';

export interface SnakeDropMenuProps {
  customStyle?: SnakeStyleValue;
}

export interface SnakeDropMenuExpose {
  updateDropMenuRect: () => void;
  /** 保留历史拼写以兼容已有调用。 */
  colseAll: () => void;
}
