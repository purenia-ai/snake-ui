import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 标签主题类型。 */
export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | (string & {});
/** 标签尺寸。 */
export type TagSize = 'default' | 'medium' | 'small' | 'mini';

/** snake-tag 运行时属性。 */
export const tagProps = {
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' },
    /** 标签文本，被默认插槽覆盖。 */ text: { type: String, default: '' },
    /** 主题类型。 */ type: { type: String as PropType<TagType>, default: 'default' },
    /** 尺寸。 */ size: { type: String as PropType<TagSize>, default: 'default' },
    /** 是否为镂空样式：浅色底 + 主题色文字与描边。 */ plain: { type: Boolean, default: false },
    /** 是否为全圆角。 */ round: { type: Boolean, default: false },
    /** 是否显示关闭图标。 */ closable: { type: Boolean, default: false },
    /** 左侧图标名，透传 snake-icon。 */ icon: { type: String, default: '' },
    /** 镂空态的 1px 描边是否按半像素渲染。 */ hairLine: { type: Boolean, default: true }
} as const;

/** snake-tag 解析后的属性。 */
export type TagResolvedProps = ExtractPropTypes<typeof tagProps>;

/** snake-tag 对外属性。 */
export interface TagProps {
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
    /** 标签文本。 */ text?: string;
    /** 主题类型。 */ type?: TagType;
    /** 尺寸。 */ size?: TagSize;
    /** 是否为镂空样式。 */ plain?: boolean;
    /** 是否为全圆角。 */ round?: boolean;
    /** 是否显示关闭图标。 */ closable?: boolean;
    /** 左侧图标名。 */ icon?: string;
    /** 镂空态的描边是否按半像素渲染。 */ hairLine?: boolean;
}

/** snake-tag 事件。 */
export type TagEmits = {
    /** 点击标签。 */ click: [event: unknown];
    /** 点击关闭图标。 */ close: [];
};
