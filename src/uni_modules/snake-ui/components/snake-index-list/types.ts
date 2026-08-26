import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
export type SnakeIndexValue = string | number;
export interface SnakeIndexListProps { indexList?: SnakeIndexValue[]; scrollTop?: number | string; zIndex?: number; sticky?: boolean; offsetTop?: UnitValue; activeColor?: string; inactiveColor?: string; railStyle?: SnakeStyleValue; customClass?: string; customStyle?: SnakeStyleValue; }
export interface SnakeIndexListChangeDetail { index: number; value: SnakeIndexValue; }
export interface SnakeIndexListEmits { select: [value: SnakeIndexValue]; change: [detail: SnakeIndexListChangeDetail]; }
export interface SnakeIndexListExpose { scrollTo(index: number | SnakeIndexValue): void; update(): Promise<void>; }
