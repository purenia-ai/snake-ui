import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 单个步骤的状态。 */
export type StepStatus = 'wait' | 'process' | 'finish' | 'error';

/** snake-step 运行时属性。 */
export const stepProps = {
    /** 步骤标题。 */ title: { type: String, default: '' },
    /** 步骤描述。 */ description: { type: String, default: '' },
    /** 自定义图标名，设置后替代序号。 */ icon: { type: String, default: '' },
    /** 显式指定状态，缺省由父级 current 推导。 */ status: { type: String as PropType<StepStatus>, default: '' },
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' }
} as const;

/** snake-step 解析后的属性。 */
export type StepResolvedProps = ExtractPropTypes<typeof stepProps>;

/** snake-step 对外属性。 */
export interface StepProps {
    /** 步骤标题。 */ title?: string;
    /** 步骤描述。 */ description?: string;
    /** 自定义图标名。 */ icon?: string;
    /** 显式指定状态。 */ status?: StepStatus;
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
}
