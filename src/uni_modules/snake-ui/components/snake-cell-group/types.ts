import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** cellGroupProps 运行时属性及默认值。 */
export const cellGroupProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 分组标题。 */
    title: { type: String, default: '' },
    /** 是否显示分组上下边框。 */
    border: { type: Boolean, default: true },
    /** 分组标题的样式，对象形式，注意驼峰属性写法。 */
    titleStyle: { type: [Object, Array] as PropType<StyleValue>, default: () => ({}) }
} as const;

/** CellGroup 组件的公开属性。 */
export type CellGroupProps = ExtractPropTypes<typeof cellGroupProps>;
