import type { ComponentPublicInstance, ComputedRef, ExtractPropTypes, InjectionKey, PropType } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { AvatarShape } from '../snake-avatar/types';

/** 叠层层级方向：哪一端压在上面。 */
export type AvatarCascading = 'last-on-top' | 'first-on-top';

/** snake-avatar-group 运行时属性。 */
export const avatarGroupProps = {
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: () => ({}) },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 统一尺寸，下发给未显式指定的子项。 */
    size: { type: [String, Number] as PropType<UnitValue>, default: undefined },
    /** 统一形状，下发给未显式指定的子项。 */
    shape: { type: String as PropType<AvatarShape>, default: undefined },
    /** 最多显示几个头像，不传或非正数时不折叠。 */
    maxCount: { type: Number, default: undefined },
    /** 真实总数：只渲染部分子项时用于算出剩余量。 */
    total: { type: Number, default: undefined },
    /** 折叠头像的文本，不传时按 `+N` 生成。 */
    collapseText: { type: String, default: '' },
    /** 相邻头像的重叠距离，不传时按尺寸的四分之一计算。 */
    overlap: { type: [String, Number] as PropType<UnitValue>, default: undefined },
    /** 叠层层级方向。 */
    cascading: { type: String as PropType<AvatarCascading>, default: 'last-on-top' }
} as const;

/** snake-avatar-group 解析后的属性。 */
export type AvatarGroupResolvedProps = ExtractPropTypes<typeof avatarGroupProps>;

/** snake-avatar-group 对外属性。 */
export interface AvatarGroupProps {
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 统一尺寸。 */
    size?: UnitValue;
    /** 统一形状。 */
    shape?: AvatarShape;
    /** 最多显示几个头像。 */
    maxCount?: number;
    /** 真实总数。 */
    total?: number;
    /** 折叠头像文本。 */
    collapseText?: string;
    /** 相邻头像的重叠距离。 */
    overlap?: UnitValue;
    /** 叠层层级方向。 */
    cascading?: AvatarCascading;
}

/** 组内子项：头像不向组暴露业务方法，注册表只用于计数与序号。 */
export type AvatarGroupChild = ComponentPublicInstance;

/** snake-avatar-group 向子头像提供的配对上下文（useChildren / useParent 通道）。 */
export interface AvatarGroupContext {
    /** 父组件的响应式 props 对象，子项直接读取即可保持联动。 */
    props: AvatarGroupProps;
    /** 折叠基线：子项 index 大于等于该值时不应渲染。 */
    visibleCount: ComputedRef<number>;
    /** 相邻头像重叠距离（已归一为带单位的字符串）。 */
    overlap: ComputedRef<string>;
}

/** 头像组上下文注入键。 */
export const AVATAR_GROUP_KEY: InjectionKey<AvatarGroupContext> = Symbol('snake-avatar-group');
