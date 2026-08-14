import type { CSSProperties } from 'vue';
import type { SnakeStyleValue } from '../component-types';

export type SnakeTabItem = string | Record<string, unknown>;

export interface SnakeTabsProps {
  list?: SnakeTabItem[];
  current?: number;
  name?: string;
  lineColor?: string;
  activeColor?: string;
  inactiveColor?: string;
  fontSize?: string | number;
  activeItemStyle?: SnakeStyleValue;
  barStyle?: CSSProperties;
  bgColor?: string;
  scrollable?: boolean;
}

export interface SnakeTabsClickDetail {
  index: number;
  item: SnakeTabItem;
}

export interface SnakeTabsEmits {
  change: [index: number];
  click: [detail: SnakeTabsClickDetail];
}
