import type { UnitValue } from '../../libs';
import type { SnakeStyleValue } from '../component-types';
export type SnakeNoticeBarMode = 'horizontal' | 'vertical';
export type SnakeNoticeBarDirection = 'row' | 'column';
export interface SnakeNoticeBarProps {
  list?: string[]; text?: string | string[]; type?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  mode?: SnakeNoticeBarMode; direction?: SnakeNoticeBarDirection; show?: boolean; autoplay?: boolean;
  volumeIcon?: boolean; volumeSize?: UnitValue; moreIcon?: boolean; closeIcon?: boolean;
  bgColor?: string; color?: string; fontSize?: UnitValue; duration?: number; speed?: number;
  isCircular?: boolean; playState?: 'play' | 'paused'; disableTouch?: boolean; borderRadius?: UnitValue;
  padding?: string; noListHidden?: boolean; customClass?: string; customStyle?: SnakeStyleValue;
}
export interface SnakeNoticeBarEmits { click: [index: number]; change: [index: number]; close: []; getMore: []; }
