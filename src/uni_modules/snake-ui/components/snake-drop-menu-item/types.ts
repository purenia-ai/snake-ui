import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
/** DropMenuToggleContext 类型定义。 */
export interface DropMenuToggleContext {
    /** resolve 配置。 */
    resolve: (allow: boolean) => void;
}
/** DropMenuBeforeToggle 类型定义。 */
export type DropMenuBeforeToggle = (context: DropMenuToggleContext) => void;
/** DropMenu 可选项。 */
export interface DropMenuOption {
    /** 展示标签文本。 */
    label: string;
    /** 当前值。 */
    value: unknown;
    /** 是否禁用交互。 */
    disabled?: boolean;
}
/** DropMenuItem 组件的公开属性。 */
export interface DropMenuItemProps {
    /** 双向绑定的当前值。 */
    modelValue?: unknown;
    /** 标题文本。 */
    title?: string;
    /** options 配置。 */
    options?: DropMenuOption[];
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 组件高度。 */
    height?: UnitValue | 'auto';
    /** 是否显示组件。 */
    show?: boolean;
    /** before toggle 配置。 */
    beforeToggle?: DropMenuBeforeToggle;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}
/** DropMenuItem 组件的事件契约。 */
export type DropMenuItemEmits = {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: unknown];
    /** change 事件携带的参数。 */
    change: [value: unknown];
    /** open 事件携带的参数。 */
    open: [];
    /** close 事件携带的参数。 */
    close: [];
};
