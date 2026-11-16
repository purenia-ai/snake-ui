import type { ComponentPublicInstance, InjectionKey, Ref } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 折叠面板的展开值：手风琴模式为单值，否则为数组。 */
export type CollapseValue = string | number | (string | number)[];

/** snake-collapse 运行时属性。 */
export const collapseProps = {
    /** 展开项，手风琴模式为单值，否则为数组。 */ modelValue: {
        type: [String, Number, Array] as PropType<CollapseValue>,
        default: ''
    },
    /** 是否手风琴模式，同时只展开一项。 */ accordion: { type: Boolean, default: false },
    /** 是否显示分割线。 */ border: { type: Boolean, default: true },
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' }
} as const;

/** snake-collapse 解析后的属性。 */
export type CollapseResolvedProps = ExtractPropTypes<typeof collapseProps>;

/** snake-collapse 对外属性。 */
export interface CollapseProps {
    /** 展开项。 */ modelValue?: CollapseValue;
    /** 是否手风琴模式。 */ accordion?: boolean;
    /** 是否显示分割线。 */ border?: boolean;
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
}

/** snake-collapse 事件。 */
export type CollapseEmits = {
    /** 展开值变化。 */ 'update:modelValue': [value: CollapseValue];
    /** 展开值变化后派发。 */ change: [value: CollapseValue];
};

/** 折叠面板向下提供的上下文。 */
export interface CollapseContext {
    /** 判断某项是否展开。 */ isActive(name: string | number): boolean;
    /** 切换某项的展开态。 */ toggle(name: string | number): void;
    /** 是否手风琴模式。 */ accordion: Ref<boolean>;
    /** 是否显示分割线。 */ border: Ref<boolean>;
}

/** 折叠面板上下文注入键。 */
export const collapseContextKey: InjectionKey<CollapseContext> = Symbol('snakeCollapse');

/** 折叠子项在父级上下文中的公开形态。 */
export type CollapseChild = ComponentPublicInstance;
