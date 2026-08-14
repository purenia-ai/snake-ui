import type { UnitValue } from '../../libs';
import type { SnakeStyleValue } from '../component-types';

export interface SnakeStickyProps {
  offsetTop?: UnitValue;
  zIndex?: number;
  disabled?: boolean;
  bgColor?: string;
  customStyle?: SnakeStyleValue;
}
