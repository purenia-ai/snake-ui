export interface SnakeDropMenuToggleContext {
  resolve: (allow: boolean) => void;
}

export type SnakeDropMenuBeforeToggle = (context: SnakeDropMenuToggleContext) => void;

export interface SnakeDropMenuItemProps {
  title?: string;
  beforeToggle?: SnakeDropMenuBeforeToggle;
}

export interface SnakeDropMenuItemEmits {
  close: [];
}
