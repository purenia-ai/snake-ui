import type { InjectionKey, Ref } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { DropMenuItemProps } from '../snake-drop-menu-item/types';
/** DropMenu 组件的公开属性。 */
export interface DropMenuProps {
    /** 激活状态颜色。 */
    activeColor?: string;
    /** 未激活状态颜色。 */
    inactiveColor?: string;
    /** close on click mask 配置。 */
    closeOnClickMask?: boolean;
    /** close on click self 配置。 */
    closeOnClickSelf?: boolean;
    /** 动画持续时间。 */
    duration?: number;
    /** 标题菜单栏高度（默认 40，px 375 稿）。 */
    height?: UnitValue;
    /** 是否显示底部边框。 */
    borderBottom?: boolean;
    /** 标题文字尺寸，数值按 px（375 稿）处理。 */
    titleSize?: UnitValue;
    /** 标题右侧图标名称。 */
    menuIcon?: string;
    /** 标题右侧图标尺寸，数值按 px（375 稿）处理。 */
    menuIconSize?: UnitValue;
    /** 组件层级。 */
    zIndex?: number;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** DropMenu 组件的事件契约。 */
export type DropMenuEmits = {
    /** open 事件携带的参数。 */
    open: [index: number];
    /** close 事件携带的参数。 */
    close: [index: number];
};
/** DropMenu 组件实例公开的方法和状态。 */
export interface DropMenuExpose {
    /** updateDropMenuRect 方法。 */
    updateDropMenuRect(): Promise<void>;
    /** close 方法。 */
    close(): void;
    /** open 方法。 */
    open(index: number): void;
    /** highlight 方法。 */
    highlight(index?: number): void;
}

/** 父组件登记的一个菜单项：id 配对，props 为子组件的响应式属性对象。 */
export interface DropMenuRegistration {
    /** 菜单项配对标识。 */
    id: symbol;
    /** 子组件响应式属性（标题、选项、禁用等），供父组件渲染标题栏。 */
    props: DropMenuItemProps;
}

/** DropMenu 向 DropMenuItem 注入的配对上下文。 */
export interface DropMenuContext {
    /** 当前展开项的标识，null 表示全部收起。 */
    activeItem: Ref<symbol | null>;
    /** 标题栏底部距页面顶部的偏移（视口坐标系，不含 H5 导航栏高度）。 */
    offset: Ref<number>;
    /** 面板动画时长。 */
    duration: Ref<number>;
    /** 组件层级。 */
    zIndex: Ref<number>;
    /** 登记一个菜单项。 */
    register(id: symbol, props: DropMenuItemProps): void;
    /** 注销一个菜单项。 */
    unregister(id: symbol): void;
    /** 收起全部菜单项。 */
    close(): void;
}

/** DropMenu ↔ DropMenuItem 配对注入键。 */
export const dropMenuKey: InjectionKey<DropMenuContext> = Symbol('snake-drop-menu');
