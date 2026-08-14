import type { UnitValue } from '../../libs';
import type { SnakeStyleValue } from '../component-types';

export interface SnakeIconProps {
  name?: string;
  color?: string;
  size?: UnitValue;
  bold?: boolean;
  customStyle?: SnakeStyleValue;
}

export interface SnakeIconEmits {
  click: [event: unknown];
}
