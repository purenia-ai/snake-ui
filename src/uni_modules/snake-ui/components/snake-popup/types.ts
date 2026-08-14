export type SnakePopupMode = 'center' | 'top' | 'right' | 'bottom' | 'left';

export interface SnakePopupProps {
  modelValue?: boolean;
  mode?: SnakePopupMode;
  bgColor?: string;
  zIndex?: number;
  closeOnClickOverlay?: boolean;
  safeAreaInsetBottom?: boolean;
}

export interface SnakePopupChangeDetail {
  show: boolean;
}

export interface SnakePopupEmits {
  'update:modelValue': [value: boolean];
  open: [];
  close: [];
  change: [detail: SnakePopupChangeDetail];
}
