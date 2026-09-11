import type { InjectionKey, Ref } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
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
    /** 组件高度。 */
    height?: UnitValue;
    /** 是否显示底部边框。 */
    borderBottom?: boolean;
    /** 标题文字尺寸，数值按 rpx 处理。 */
    titleSize?: UnitValue;
    /** menu icon 配置。 */
    menuIcon?: string;
    /** menu icon size 配置。 */
    menuIconSize?: UnitValue;
    /** 组件层级。 */
    zIndex?: number;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** DropMenu 组件的事件契约。 */
export interface DropMenuEmits {
    /** open 事件携带的参数。 */
    open: [index: number];
    /** close 事件携带的参数。 */
    close: [index: number];
}
/** DropMenu 组件实例公开的方法和状态。 */
export interface DropMenuExpose {
    /** updateDropMenuRect 方法。 */
    updateDropMenuRect(): Promise<void>;
    /** colseAll 方法。 */
    colseAll(): void;
    /** close 方法。 */
    close(): void;
    /** open 方法。 */
    open(index: number): void;
    /** highlight 方法。 */
    highlight(index?: number): void;
}

/** DropMenu 向 DropMenuItem 注入的配对上下文。 */
export interface DropMenuContext {
    /** 当前展开项的标识，null 表示全部收起。 */
    activeItem: Ref<symbol | null>;
    /** 键盘导航高亮的选项下标。 */
    highlighted: Ref<number | undefined>;
    /** 菜单栏距页面顶部的偏移。 */
    menuTop: Ref<number>;
    /** 激活状态颜色。 */
    activeColor: Ref<string>;
    /** 未激活状态颜色。 */
    inactiveColor: Ref<string>;
    /** 标题文字尺寸。 */
    titleSize: Ref<string | number | null | undefined>;
    /** 标题右侧图标名。 */
    menuIcon: Ref<string>;
    /** 标题右侧图标尺寸。 */
    menuIconSize: Ref<string | number | null | undefined>;
    /** 面板动画时长。 */
    duration: Ref<number>;
    /** 点击遮罩是否关闭。 */
    closeOnClickMask: Ref<boolean>;
    /** 再次点击已展开标题是否关闭。 */
    closeOnClickSelf: Ref<boolean>;
    /** 组件层级。 */
    zIndex: Ref<number>;
    /** 注册一个菜单项并返回其下标。 */
    register(item: symbol): number;
    /** 注销一个菜单项。 */
    unregister(item: symbol): void;
    /** 查询菜单项下标。 */
    indexOf(item: symbol): number;
    /** 展开指定菜单项。 */
    open(item: symbol): void;
    /** 收起全部菜单项。 */
    close(): void;
    /** 重新测量菜单栏位置。 */
    updateRect(): Promise<void>;
}

/** DropMenu ↔ DropMenuItem 配对注入键。 */
export const dropMenuKey: InjectionKey<DropMenuContext> = Symbol('snake-drop-menu');
