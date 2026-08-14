import type { SnakeStyleValue } from '../component-types';

export type SnakeLoadmoreStatus = 'loadmore' | 'loading' | 'nomore';

export interface SnakeLoadmoreProps {
  status?: SnakeLoadmoreStatus;
  loadText?: string;
  loadingText?: string;
  nomoreText?: string;
  bgColor?: string;
  marginBottom?: string | number;
  customStyle?: SnakeStyleValue;
}
