import type { UnitValue } from '../../libs';
import type { SnakeStyleValue } from '../component-types';

export type SnakeEmptyMode = 'data' | 'list' | 'search' | 'page' | 'order' | 'coupon' | 'favor' | 'permission' | 'history' | 'message' | 'wifi' | 'address' | 'car';

export interface SnakeEmptyProps {
  show?: boolean;
  mode?: SnakeEmptyMode;
  src?: string;
  icon?: string;
  iconColor?: string;
  iconSize?: UnitValue;
  text?: string;
  color?: string;
  textColor?: string;
  fontSize?: UnitValue;
  marginTop?: UnitValue;
  customClass?: string;
  customStyle?: SnakeStyleValue;
}
