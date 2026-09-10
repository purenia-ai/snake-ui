import type { StyleValue } from '../../types/global';
import type { FormError, FormRules } from '../../libs/form';
import type {
    FormErrorType,
    FormLabelAlign,
    FormLabelPosition,
    FormSize
} from '../../libs/internal/form';

/** Form 组件的公开属性，与 uView Pro Form 保持一致。 */
export interface FormProps {
    /** 表单数据对象。 */
    model?: Record<string, any>;
    /** 表单校验规则。 */
    rules?: FormRules;
    /** 错误提示方式。 */
    errorType?: FormErrorType[];
    /** 是否显示表单项底边。 */
    borderBottom?: boolean;
    /** 标签位置。 */
    labelPosition?: FormLabelPosition;
    /** 标签宽度。 */
    labelWidth?: string | number;
    /** 标签对齐方式。 */
    labelAlign?: FormLabelAlign;
    /** 标签自定义样式。 */
    labelStyle?: Record<string, any>;
    /** 表单控件尺寸。 */
    size?: FormSize;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** 表单校验回调。 */
export type FormCallback = (valid: boolean, errors: FormError[]) => void;

/** Form 通过模板 ref 暴露的接口。 */
export interface FormExpose {
    /** 动态设置校验规则。 */
    setRules(rules: FormRules): void;
    /** 重置所有已注册字段。 */
    resetFields(): void;
    /** 校验全部字段。 */
    validate(callback?: FormCallback): Promise<boolean>;
    /** 校验一个或多个指定字段。 */
    validateField(props: string | string[], callback?: FormCallback): Promise<boolean>;
}

export type { FormError, FormRule, FormRules, FormTrigger } from '../../libs/form';
