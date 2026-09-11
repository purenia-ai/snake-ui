/** ActivityList 数据项。 */
export interface ActivityListItem extends Record<string, any> {
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

/** ActivityList 组件的公开属性。 */
export interface ActivityListProps {
    /** 用于渲染的数据列表。 */
    list?: ActivityListItem[];
    /** 当前激活项索引。 */
    current?: string | number;
}

/** ActivityList 组件的事件契约。 */
export type ActivityListEmits = {
    /** change 事件携带的参数。 */
    change: [item: ActivityListItem, index: number];
};
