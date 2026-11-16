import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** snake-collapse-item 运行时属性。 */
export const collapseItemProps = {
    /** 唯一标识，缺省使用子项序号。 */ name: { type: [String, Number] as PropType<string | number>, default: '' },
    /** 标题。 */ title: { type: String, default: '' },
    /** 是否禁用。 */ disabled: { type: Boolean, default: false },
    /** 标题左侧图标名。 */ icon: { type: String, default: '' },
    /** 展开动画时长，单位毫秒。 */ duration: { type: Number, default: 250 },
    /** 是否显示分割线。 */ border: { type: Boolean, default: true },
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' }
} as const;

/** snake-collapse-item 解析后的属性。 */
export type CollapseItemResolvedProps = ExtractPropTypes<typeof collapseItemProps>;

/** snake-collapse-item 对外属性。 */
export interface CollapseItemProps {
    /** 唯一标识。 */ name?: string | number;
    /** 标题。 */ title?: string;
    /** 是否禁用。 */ disabled?: boolean;
    /** 标题左侧图标名。 */ icon?: string;
    /** 展开动画时长，单位毫秒。 */ duration?: number;
    /** 是否显示分割线。 */ border?: boolean;
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
}
