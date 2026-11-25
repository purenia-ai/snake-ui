import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';

/** ButtonSortValue 类型定义。 */
export type ButtonSortValue = '' | 'asc' | 'desc';

/** ButtonSort 组件的公开属性。 */
export interface ButtonSortProps {
    /** 当前排序状态；不传则由组件自己维护，传入后以父级为准（v-model）。 */
    modelValue?: ButtonSortValue;
    /** 标题文本。 */
    title?: string;
    /** 未排序时的标题颜色；排序中由 activeColor 接管。 */
    titleColor?: string;
    /** 排序中的标题与箭头颜色，不传则用主题绿。 */
    activeColor?: string;
    /** 标题字号，数值按 px（375 稿）处理。 */
    fontSize?: UnitValue;
    /** 是否允许回到未排序：开启后按升序 → 降序 → 未排序循环，关闭后只在升序与降序之间切换。 */
    allowReset?: boolean;
    /** 是否优先切换为降序：开启后首次点击直接进入降序。 */
    descFirst?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** ButtonSortChange 事件详情。 */
export interface ButtonSortChangeDetail {
    /** 当前值。 */
    value: ButtonSortValue;
}

/** ButtonSort 组件的事件契约。 */
export type ButtonSortEmits = {
    /** 排序状态变化时同步 v-model。 */
    'update:modelValue': [value: ButtonSortValue];
    /** change 事件携带的参数。 */
    change: [payload: ButtonSortChangeDetail];
};
