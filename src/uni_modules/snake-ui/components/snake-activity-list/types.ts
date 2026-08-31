export interface SnakeActivityListItem extends Record<string, any> {
    id: string | number;
    name?: string;
    subtitle?: string;
    squareImage?: string;
    startTime?: number;
    endTime?: number;
}

export interface SnakeActivityListProps {
    list?: SnakeActivityListItem[];
    current?: string | number;
}

export interface SnakeActivityListEmits {
    change: [item: SnakeActivityListItem, index: number];
}
