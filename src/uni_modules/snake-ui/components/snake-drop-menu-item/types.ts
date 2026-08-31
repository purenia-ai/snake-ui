import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
/** SnakeDropMenuToggleContext 类型定义。 */
export interface SnakeDropMenuToggleContext {
    /** resolve 配置。 */
    resolve: (allow: boolean) => void;
}
/** SnakeDropMenuBeforeToggle 类型定义。 */
export type SnakeDropMenuBeforeToggle = (context: SnakeDropMenuToggleContext) => void;
/** SnakeDropMenu 可选项。 */
export interface SnakeDropMenuOption {
    /** 展示标签文本。 */
    label: string;
    /** 当前值。 */
    value: unknown;
    /** 是否禁用交互。 */
    disabled?: boolean;
}
/** SnakeDropMenuItem 组件的公开属性。 */
export interface SnakeDropMenuItemProps {
    /** 双向绑定的当前值。 */
    modelValue?: unknown;
    /** 标题文本。 */
    title?: string;
    /** options 配置。 */
    options?: SnakeDropMenuOption[];
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 组件高度。 */
    height?: UnitValue | 'auto';
    /** 是否显示组件。 */
    show?: boolean;
    /** before toggle 配置。 */
    beforeToggle?: SnakeDropMenuBeforeToggle;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeDropMenuItem 组件的事件契约。 */
export interface SnakeDropMenuItemEmits {
    /** update:modelValue 事件携带的参数。 */
    'update:modelValue': [value: unknown];
    /** change 事件携带的参数。 */
    change: [value: unknown];
    /** open 事件携带的参数。 */
    open: [];
    /** close 事件携带的参数。 */
    close: [];
}
