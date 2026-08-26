import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

export type SnakeLoadmoreStatus = 'loadmore' | 'loading' | 'nomore';
export interface SnakeLoadmoreText { loadmore?: string; loading?: string; nomore?: string; }
export interface SnakeLoadmoreProps {
  status?: SnakeLoadmoreStatus;
  loadText?: string | SnakeLoadmoreText;
  loadingText?: string;
  nomoreText?: string;
  bgColor?: string;
  icon?: boolean;
  iconType?: 'circle' | 'flower' | 'spinner';
  iconColor?: string;
  isDot?: boolean;
  color?: string;
  fontSize?: UnitValue;
  marginTop?: UnitValue;
  marginBottom?: UnitValue;
  customClass?: string;
  customStyle?: SnakeStyleValue;
}
export interface SnakeLoadmoreEmits { loadmore: []; click: [status: SnakeLoadmoreStatus]; }
