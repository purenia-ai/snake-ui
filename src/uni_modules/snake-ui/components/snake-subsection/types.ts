import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** SubsectionMode 类型定义。 */
export type SubsectionMode = 'button' | 'subsection';

/** Subsection 数据项。 */
export interface SubsectionItem {
    /** 数据项名称或唯一标识。 */
    name: string;
    /** 是否禁用交互。 */
    disabled?: boolean;
}

/** Subsection 可选项。 */
export type SubsectionOption = string | SubsectionItem;

/** Subsection 组件的公开属性。 */
export interface SubsectionProps {
    /** 用于渲染的数据列表。 */
    list?: SubsectionOption[];
    /** 当前激活项索引。 */
    current?: number | string;
    /** 组件展示模式。 */
    mode?: SubsectionMode;
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** 文字尺寸，数值按 rpx 处理。 */
    fontSize?: UnitValue;
    /** 组件高度。 */
    height?: UnitValue;
    /** animation 配置。 */
    animation?: boolean;
    /** 是否使用粗体文字。 */
    bold?: boolean;
    /** 背景颜色。 */
    bgColor?: string;
    /** button color 配置。 */
    buttonColor?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** Subsection 组件的事件契约。 */
export interface SubsectionEmits {
    /** change 事件携带的参数。 */
    change: [index: number];
    /** update:current 事件携带的参数。 */
    'update:current': [index: number];
}
