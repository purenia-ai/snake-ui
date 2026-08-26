import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
export interface SnakeDropMenuProps {
  activeColor?: string; inactiveColor?: string; closeOnClickMask?: boolean; closeOnClickSelf?: boolean;
  duration?: number; height?: UnitValue; borderBottom?: boolean; titleSize?: UnitValue; menuIcon?: string;
  menuIconSize?: UnitValue; zIndex?: number; customClass?: string; customStyle?: SnakeStyleValue;
}
export interface SnakeDropMenuEmits { open: [index: number]; close: [index: number]; }
export interface SnakeDropMenuExpose { updateDropMenuRect(): Promise<void>; colseAll(): void; close(): void; open(index: number): void; highlight(index?: number): void; }
