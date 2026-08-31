/** SnakeActivityList 数据项。 */
export interface SnakeActivityListItem extends Record<string, any> {
    /** 数据唯一标识。 */
    id: string | number;
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** subtitle 配置。 */
    subtitle?: string;
    /** square image 配置。 */
    squareImage?: string;
    /** start time 配置。 */
    startTime?: number;
    /** end time 配置。 */
    endTime?: number;
}

/** SnakeActivityList 组件的公开属性。 */
export interface SnakeActivityListProps {
    /** 用于渲染的数据列表。 */
    list?: SnakeActivityListItem[];
    /** 当前激活项索引。 */
    current?: string | number;
}

/** SnakeActivityList 组件的事件契约。 */
export interface SnakeActivityListEmits {
    /** change 事件携带的参数。 */
    change: [item: SnakeActivityListItem, index: number];
}
