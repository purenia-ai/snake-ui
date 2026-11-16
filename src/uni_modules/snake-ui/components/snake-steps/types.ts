import type { ComponentPublicInstance, InjectionKey, Ref } from 'vue';
import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 步骤条排列方向。 */
export type StepsDirection = 'horizontal' | 'vertical';

/** snake-steps 运行时属性。 */
export const stepsProps = {
    /** 当前进行到的步骤索引，从 0 开始。 */ current: { type: Number, default: 0 },
    /** 排列方向。 */ direction: { type: String as PropType<StepsDirection>, default: 'horizontal' },
    /** 已完成与进行中的颜色。 */ activeColor: {
        type: String,
        default: 'var(--snake-color-primary, #06D290)'
    },
    /** 未开始的颜色。 */ inactiveColor: {
        type: String,
        default: 'var(--snake-color-text-muted, #909399)'
    },
    /** 异常状态的颜色。 */ errorColor: { type: String, default: 'var(--snake-color-error, #FA3534)' },
    /** 横向排列时圆点与文字是否居中，关闭后圆点靠左、文字左对齐。 */
    alignCenter: { type: Boolean, default: true },
    /** 用点状指示器替代序号圆点。 */ dot: { type: Boolean, default: false },
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' }
} as const;

/** snake-steps 解析后的属性。 */
export type StepsResolvedProps = ExtractPropTypes<typeof stepsProps>;

/** snake-steps 对外属性。 */
export interface StepsProps {
    /** 当前进行到的步骤索引，从 0 开始。 */ current?: number;
    /** 排列方向。 */ direction?: StepsDirection;
    /** 已完成与进行中的颜色。 */ activeColor?: string;
    /** 未开始的颜色。 */ inactiveColor?: string;
    /** 异常状态的颜色。 */ errorColor?: string;
    /** 横向排列时圆点与文字是否居中。 */ alignCenter?: boolean;
    /** 用点状指示器替代序号圆点。 */ dot?: boolean;
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
}

/** 步骤条向下提供的上下文。 */
export interface StepsContext {
    /** 当前进行到的步骤索引。 */ current: Ref<number>;
    /** 排列方向。 */ direction: Ref<StepsDirection>;
    /** 已完成与进行中的颜色。 */ activeColor: Ref<string>;
    /** 未开始的颜色。 */ inactiveColor: Ref<string>;
    /** 异常状态的颜色。 */ errorColor: Ref<string>;
    /** 横向排列时圆点与文字是否居中。 */ alignCenter: Ref<boolean>;
    /** 用点状指示器替代序号圆点。 */ dot: Ref<boolean>;
}

/** 步骤条上下文注入键。 */
export const stepsContextKey: InjectionKey<StepsContext> = Symbol('snakeSteps');

/** 步骤条子项在父级上下文中的公开形态。 */
export type StepChild = ComponentPublicInstance;
