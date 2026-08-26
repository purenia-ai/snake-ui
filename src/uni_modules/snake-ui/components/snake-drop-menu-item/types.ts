import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
export interface SnakeDropMenuToggleContext { resolve: (allow: boolean) => void; }
export type SnakeDropMenuBeforeToggle = (context: SnakeDropMenuToggleContext) => void;
export interface SnakeDropMenuOption { label: string; value: unknown; disabled?: boolean; }
export interface SnakeDropMenuItemProps { modelValue?: unknown; title?: string; options?: SnakeDropMenuOption[]; disabled?: boolean; height?: UnitValue | 'auto'; show?: boolean; beforeToggle?: SnakeDropMenuBeforeToggle; customStyle?: SnakeStyleValue; }
export interface SnakeDropMenuItemEmits { 'update:modelValue': [value: unknown]; change: [value: unknown]; open: []; close: []; }
