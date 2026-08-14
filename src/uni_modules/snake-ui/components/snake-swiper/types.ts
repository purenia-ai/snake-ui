import type { UnitValue } from '../../libs';
import type { SnakeImageMode } from '../component-types';

export type SnakeSwiperItem = string | Record<string, unknown>;

export interface SnakeSwiperProps {
  list?: SnakeSwiperItem[];
  current?: number;
  height?: UnitValue;
  autoplay?: boolean;
  interval?: number;
  duration?: number;
  circular?: boolean;
  indicator?: boolean;
  name?: string;
  radius?: UnitValue;
  previousMargin?: string;
  nextMargin?: string;
  imgMode?: SnakeImageMode;
  showTitle?: boolean;
}

export interface SnakeSwiperChangeDetail {
  current: number;
}

export interface SnakeSwiperEmits {
  change: [detail: SnakeSwiperChangeDetail];
  click: [index: number];
}
