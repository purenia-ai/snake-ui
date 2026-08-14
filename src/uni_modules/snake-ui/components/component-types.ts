import type { CSSProperties } from 'vue';

/** uni-app 组件可接受的行内样式值。 */
export type SnakeStyleValue = string | CSSProperties;

/** uni-app image 组件支持的常用裁剪模式。 */
export type SnakeImageMode =
  | 'scaleToFill'
  | 'aspectFit'
  | 'aspectFill'
  | 'widthFix'
  | 'heightFix'
  | 'top'
  | 'bottom'
  | 'center'
  | 'left'
  | 'right'
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right';
