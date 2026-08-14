export type SnakeButtonSortValue = '' | 'asc' | 'desc';

export interface SnakeButtonSortProps {
  title?: string;
}

export interface SnakeButtonSortChangeDetail {
  value: SnakeButtonSortValue;
}

export interface SnakeButtonSortEmits {
  change: [payload: SnakeButtonSortChangeDetail];
}
