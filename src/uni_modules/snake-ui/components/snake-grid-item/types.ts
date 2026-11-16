import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** snake-grid-item 运行时属性。 */
export const gridItemProps = {
    /** 文案。 */ text: { type: String, default: '' },
    /** 图标名，透传 snake-icon。 */ icon: { type: String, default: '' },
    /** 图标颜色。 */ iconColor: { type: String, default: '' },
    /** 图标尺寸，缺省 24px（375 稿）。 */ iconSize: {
        type: [Number, String] as PropType<number | string>,
        default: ''
    },
    /** 右上角角标内容，透传 snake-badge。 */ badge: {
        type: [Number, String] as PropType<number | string>,
        default: ''
    },
    /** 是否禁用。 */ disabled: { type: Boolean, default: false },
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' }
} as const;

/** snake-grid-item 解析后的属性。 */
export type GridItemResolvedProps = ExtractPropTypes<typeof gridItemProps>;

/** snake-grid-item 对外属性。 */
export interface GridItemProps {
    /** 文案。 */ text?: string;
    /** 图标名。 */ icon?: string;
    /** 图标颜色。 */ iconColor?: string;
    /** 图标尺寸。 */ iconSize?: number | string;
    /** 右上角角标内容。 */ badge?: number | string;
    /** 是否禁用。 */ disabled?: boolean;
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
}

/** snake-grid-item 事件。 */
export type GridItemEmits = {
    /** 点击格子，返回序号与原始事件。 */ click: [index: number, event: unknown];
};
