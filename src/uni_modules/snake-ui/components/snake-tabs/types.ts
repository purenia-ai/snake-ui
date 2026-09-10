import type { CSSProperties } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** Tabs 对象数据项。 */
export interface TabItem extends Record<string, unknown> {
    /** 默认标签字段。 */
    name?: string | number;
    /** 默认徽标字段。 */
    count?: string | number;
    /** 是否隐藏该标签。 */
    hidden?: boolean;
}

/** Tabs 组件的公开属性。 */
export interface TabsProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 是否允许横向拖动。 */
    isScroll?: boolean;
    /** 标签对象数组。 */
    list?: TabItem[];
    /** 当前激活索引。 */
    current?: number | string;
    /** 导航栏高度。 */
    height?: UnitValue;
    /** 标签字号。 */
    fontSize?: UnitValue;
    /** 动画时长，单位秒。 */
    duration?: number | string;
    /** 激活文字及滑块颜色。 */
    activeColor?: string;
    /** 未激活文字颜色。 */
    inactiveColor?: string;
    /** 滑块宽度。 */
    barWidth?: UnitValue;
    /** 滑块高度。 */
    barHeight?: UnitValue;
    /** 滚动模式标签左右内边距。 */
    gutter?: UnitValue;
    /** 导航栏背景色。 */
    bgColor?: string;
    /** 标签内容字段名。 */
    name?: string;
    /** 徽标内容字段名。 */
    count?: string;
    /** 徽标 top、right 偏移。 */
    offset?: [number, number];
    /** 是否显示圆点徽标。 */
    isDot?: boolean;
    /** 激活项是否加粗。 */
    bold?: boolean;
    /** 激活标签附加样式。 */
    activeItemStyle?: CSSProperties;
    /** 是否显示底部滑块。 */
    showBar?: boolean;
    /** 底部滑块附加样式。 */
    barStyle?: CSSProperties;
    /** 单个标签宽度。 */
    itemWidth?: UnitValue;
}

/** Tabs 组件事件。 */
export interface TabsEmits {
    /** 点击非当前标签时返回新索引。 */
    change: [index: number];
}

/** Tabs 暴露的方法。 */
export interface TabsExpose {
    /** 重新测量全部标签。 */
    init: () => Promise<void>;
    /** 执行标签点击逻辑。 */
    clickTab: (index: number) => void;
    /** 将当前标签居中并移动滑块。 */
    scrollByIndex: () => void;
}
