import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormError, SnakeFormRules } from '../../libs/form';
import type {
    SnakeFormErrorType,
    SnakeFormLabelAlign,
    SnakeFormLabelPosition,
    SnakeFormSize
} from '../../libs/internal/form';

/** SnakeForm 组件的公开属性，与 uView Pro Form 保持一致。 */
export interface SnakeFormProps {
    /** 表单数据对象。 */
    model?: Record<string, any>;
    /** 表单校验规则。 */
    rules?: SnakeFormRules;
    /** 错误提示方式。 */
    errorType?: SnakeFormErrorType[];
    /** 是否显示表单项底边。 */
    borderBottom?: boolean;
    /** 标签位置。 */
    labelPosition?: SnakeFormLabelPosition;
    /** 标签宽度。 */
    labelWidth?: string | number;
    /** 标签对齐方式。 */
    labelAlign?: SnakeFormLabelAlign;
    /** 标签自定义样式。 */
    labelStyle?: Record<string, any>;
    /** 表单控件尺寸。 */
    size?: SnakeFormSize;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** 表单校验回调。 */
export type SnakeFormCallback = (valid: boolean, errors: SnakeFormError[]) => void;

/** SnakeForm 通过模板 ref 暴露的接口。 */
export interface SnakeFormExpose {
    /** 动态设置校验规则。 */
    setRules(rules: SnakeFormRules): void;
    /** 重置所有已注册字段。 */
    resetFields(): void;
    /** 校验全部字段。 */
    validate(callback?: SnakeFormCallback): Promise<boolean>;
    /** 校验一个或多个指定字段。 */
    validateField(props: string | string[], callback?: SnakeFormCallback): Promise<boolean>;
}

export type { SnakeFormError, SnakeFormRule, SnakeFormRules, SnakeFormTrigger } from '../../libs/form';
