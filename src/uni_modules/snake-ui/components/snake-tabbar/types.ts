import type { StyleValue } from '../../types/global';

/** Tabbar 导航项。 */
export interface TabbarItem {
    /** 导航项唯一标识。 */
    key: string | number;
    /** 展示文字。 */
    text: string;
    /** 图标名称。 */
    icon?: string;
    /** 是否禁用。 */
    disabled?: boolean;
    /** 徽标文字或数字。 */
    badge?: string | number;
}

/** Tabbar 组件的公开属性。 */
export interface TabbarProps {
    /** 导航项列表。 */
    items?: TabbarItem[];
    /** 当前激活项 key。 */
    current?: string | number;
    /** 是否固定在底部。 */
    fixed?: boolean;
    /** 是否预留底部安全区。 */
    safeAreaInsetBottom?: boolean;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 激活颜色。 */
    activeColor?: string;
    /** 未激活颜色。 */
    inactiveColor?: string;
    /** 导航栏高度，单位 rpx。 */
    height?: string | number;
    /** 层级。 */
    zIndex?: number;
}

/** Tabbar 组件事件。 */
export interface TabbarEmits {
    /** 点击导航项时返回 key 和完整项。 */
    change: [key: string | number, item: TabbarItem];
}
