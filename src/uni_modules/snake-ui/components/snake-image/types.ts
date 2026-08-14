import type { UnitValue } from '../../libs';
import type { SnakeImageMode, SnakeStyleValue } from '../component-types';

export interface SnakeImageProps {
  src?: string;
  mode?: SnakeImageMode;
  width?: UnitValue;
  height?: UnitValue | 'auto';
  radius?: UnitValue;
  lazyLoad?: boolean;
  showError?: boolean;
  errorIcon?: string;
  customStyle?: SnakeStyleValue;
}

export interface SnakeImageEmits {
  load: [event: unknown];
  error: [event: unknown];
  click: [event: unknown];
}
