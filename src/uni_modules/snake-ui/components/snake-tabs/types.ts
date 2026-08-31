import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeTabItemObject 类型定义。 */
export interface SnakeTabItemObject extends Record<string, unknown> {
    /** 数据项名称或唯一标识。 */
    name?: unknown;
    /** 数量或徽标内容。 */
    count?: unknown;
    /** hidden 配置。 */
    hidden?: boolean;
    /** 是否禁用交互。 */
    disabled?: boolean;
}

/** SnakeTab 数据项。 */
export type SnakeTabItem = string | SnakeTabItemObject;

/** SnakeTabs 组件的公开属性。 */
export interface SnakeTabsProps {
    /** 用于渲染的数据列表。 */
    list?: SnakeTabItem[];
    /** 当前激活项索引。 */
    current?: number | string;
    /** 数据项名称或唯一标识。 */
    name?: string;
    /** 数量或徽标内容。 */
    count?: string;
    /** scrollable 配置。 */
    scrollable?: boolean;
    /** is scroll 配置。 */
    isScroll?: boolean;
    /** 组件高度。 */
    height?: UnitValue;
    /** 文字尺寸，数值按 rpx 处理。 */
    fontSize?: UnitValue;
    /** 动画持续时间。 */
    duration?: number | string;
    /** line color 配置。 */
    lineColor?: string;
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** bar width 配置。 */
    barWidth?: UnitValue;
    /** bar height 配置。 */
    barHeight?: UnitValue;
    /** 相邻项目之间的间距。 */
    gutter?: UnitValue;
    /** 背景颜色。 */
    bgColor?: string;
    /** offset 配置。 */
    offset?: [number, number];
    /** is dot 配置。 */
    isDot?: boolean;
    /** 是否使用粗体文字。 */
    bold?: boolean;
    /** 激活项目的自定义样式。 */
    activeItemStyle?: SnakeStyleValue;
    /** 是否显示激活指示条。 */
    showBar?: boolean;
    /** 激活指示条自定义样式。 */
    barStyle?: SnakeStyleValue;
    /** 单个项目的宽度。 */
    itemWidth?: UnitValue | 'auto';
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeTabsClick 事件详情。 */
export interface SnakeTabsClickDetail {
    /** 当前数据项索引。 */
    index: number;
    /** item 配置。 */
    item: SnakeTabItem;
}

/** SnakeTabs 组件的事件契约。 */
export interface SnakeTabsEmits {
    /** change 事件携带的参数。 */
    change: [index: number];
    /** click 事件携带的参数。 */
    click: [detail: SnakeTabsClickDetail];
}

/** SnakeTabs 组件实例公开的方法和状态。 */
export interface SnakeTabsExpose {
    /** init 方法。 */
    init: () => Promise<void>;
    /** scrollByIndex 方法。 */
    scrollByIndex: () => Promise<void>;
}
