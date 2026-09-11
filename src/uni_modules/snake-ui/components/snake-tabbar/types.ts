import type { StyleValue } from '../../types/global';

/** Tabbar 导航项。 */
export interface TabbarItem {
    /** 导航项唯一标识。 */
    key?: string | number;
    /** 展示文字。 */
    text?: string;
    /** 图标名称。 */
    icon?: string;
    /** 未选中时的图标名称。 */
    iconPath?: string;
    /** 选中时的图标名称。 */
    selectedIconPath?: string;
    /** 图标字体前缀；`true` 使用 `custom-icon`，字符串直接作为前缀。 */
    customIcon?: boolean | string;
    /** 页面路径；提供后会根据当前页面自动确定激活状态。 */
    pagePath?: string;
    /** 是否作为中间凸起按钮显示。 */
    midButton?: boolean;
    /** 单项宽度；设置任意一项后，其余未设置项自动填充剩余空间。 */
    width?: string | number;
    /** 单项图标尺寸。 */
    iconSize?: string | number;
    /** 单项文字尺寸。 */
    textSize?: string | number;
    /** 单项图标和文字间距。 */
    gap?: string | number;
    /** 角标数量。 */
    count?: string | number;
    /** 是否显示点状角标。 */
    isDot?: boolean;
    /** 是否禁用。 */
    disabled?: boolean;
    /** 徽标文字或数字。 */
    badge?: string | number;
}

/** Tabbar 组件的公开属性。 */
export interface TabbarProps {
    /** 导航项列表。 */
    items?: TabbarItem[];
    /** 备用导航项列表；未传 `items` 时使用。 */
    list?: TabbarItem[];
    /** 当前激活项 key。 */
    current?: string | number;
    /** 通过 v-model 绑定的激活项索引。 */
    modelValue?: string | number;
    /** 是否显示 tabbar。 */
    show?: boolean;
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
    /** tabbar 背景色。 */
    bgColor?: string;
    /** 是否展示顶部边框。 */
    borderTop?: boolean;
    /** 是否在挂载后隐藏原生 tabBar；默认开启。非原生 tabBar 页面会安全忽略。 */
    hideTabBar?: boolean;
    /** 切换前的拦截器；返回 `true` 或 resolve 的 Promise 才会继续切换。 */
    beforeSwitch?: (index: number) => boolean | Promise<unknown>;
    /** 是否启用中间凸起按钮。 */
    midButton?: boolean;
    /** 常规图标尺寸。 */
    iconSize?: string | number;
    /** 中间凸起按钮图标尺寸。 */
    midButtonSize?: string | number;
    /** 常规文字尺寸。 */
    textSize?: string | number;
    /** 图标和文字间距。 */
    gap?: string | number;
    /** 导航栏高度，单位 rpx。 */
    height?: string | number;
    /** 层级。 */
    zIndex?: number;
}

/** Tabbar 组件事件。 */
export type TabbarEmits = {
    /** 点击导航项时返回 key 和完整项。 */
    change: [key: string | number, item: TabbarItem];
    /** 更新 v-model 激活项索引。 */
    'update:modelValue': [value: string | number];
};
