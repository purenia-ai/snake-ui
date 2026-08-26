import type { UnitValue } from '../../libs/function/unit';
import type { SnakeImageMode, SnakeStyleValue } from '../../types/global';
export type SnakeSwiperItem = string | Record<string, unknown>;
export type SnakeSwiperIndicatorMode = 'round' | 'dot' | 'line' | 'number';
export type SnakeSwiperIndicatorPosition = 'topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight';
export interface SnakeSwiperProps {
  list?: SnakeSwiperItem[]; current?: number | string; height?: UnitValue; autoplay?: boolean; interval?: number;
  duration?: number; circular?: boolean; indicator?: boolean | Record<string, unknown>; mode?: SnakeSwiperIndicatorMode;
  indicatorPos?: SnakeSwiperIndicatorPosition; indicatorColor?: string; indicatorActiveColor?: string;
  name?: string; radius?: UnitValue; borderRadius?: UnitValue; previousMargin?: string; nextMargin?: string;
  effect3d?: boolean; effect3dPreviousMargin?: UnitValue; imgMode?: SnakeImageMode; showTitle?: boolean; title?: boolean;
  titleStyle?: SnakeStyleValue; bgColor?: string; customClass?: string; customStyle?: SnakeStyleValue;
}
export interface SnakeSwiperChangeDetail { current: number; source?: string; }
export interface SnakeSwiperEmits { change: [detail: SnakeSwiperChangeDetail]; click: [index: number, item: SnakeSwiperItem]; animationfinish: [detail: SnakeSwiperChangeDetail]; }
