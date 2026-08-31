import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormError, SnakeFormRules } from '../../libs/form';
import type {
    SnakeFormErrorType,
    SnakeFormLabelAlign,
    SnakeFormLabelPosition,
    SnakeFormSize
} from '../../libs/internal/form';

/** SnakeForm 组件的公开属性。 */
export interface SnakeFormProps {
    /** 表单数据模型。 */
    model?: Record<string, unknown>;
    /** 表单校验规则。 */
    rules?: SnakeFormRules;
    /** error type 配置。 */
    errorType?: SnakeFormErrorType | SnakeFormErrorType[];
    /** 是否显示底部边框。 */
    borderBottom?: boolean;
    /** 标签所在位置。 */
    labelPosition?: SnakeFormLabelPosition;
    /** 标签区域宽度。 */
    labelWidth?: string | number;
    /** 标签文字对齐方式。 */
    labelAlign?: SnakeFormLabelAlign;
    /** 标签自定义样式。 */
    labelStyle?: SnakeStyleValue;
    /** 组件尺寸。 */
    size?: SnakeFormSize;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeFormCallback 类型定义。 */
export type SnakeFormCallback = (valid: boolean, errors: SnakeFormError[]) => void;
/** SnakeForm 组件实例公开的方法和状态。 */
export interface SnakeFormExpose {
    /** validate 方法。 */
    validate(callback?: SnakeFormCallback): Promise<Record<string, unknown>>;
    /** validateField 方法。 */
    validateField(props: string | string[], callback?: SnakeFormCallback): Promise<void>;
    /** resetFields 方法。 */
    resetFields(props?: string | string[]): void;
    /** clearValidate 方法。 */
    clearValidate(props?: string | string[]): void;
    /** setRules 方法。 */
    setRules(rules: SnakeFormRules): void;
}
/** SnakeForm 组件的事件契约。 */
export interface SnakeFormEmits {
    /** validate 事件携带的参数。 */
    validate: [valid: boolean, errors: SnakeFormError[]];
}
export type { SnakeFormError, SnakeFormRule, SnakeFormRules, SnakeFormTrigger } from '../../libs/form';
