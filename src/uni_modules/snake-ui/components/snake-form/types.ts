import type { InjectionKey, Ref } from 'vue';
import type { StyleValue } from '../../types/global';
import type { FormError, FormRules, FormTrigger } from '../../libs/form';

/** 表单控件尺寸。 */
export type FormSize = 'small' | 'default' | 'large';
/** 标签位置。 */
export type FormLabelPosition = 'left' | 'top';
/** 标签对齐方式。 */
export type FormLabelAlign = 'left' | 'center' | 'right';
/** 错误提示方式。 */
export type FormErrorType = 'message' | 'border' | 'border-bottom' | 'none' | 'toast';

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

/** Form 注册的单个字段协议。 */
export interface FormField {
    /** 字段在表单模型中的路径。 */
    prop: string;
    /** 按触发方式校验字段，返回错误列表。 */
    validate(trigger?: FormTrigger): Promise<FormError[]>;
    /** 将字段恢复为初始值。 */
    reset(): void;
    /** 清空字段的校验状态。 */
    clear(): void;
}

/** Form 向 form-item 注入的配对上下文（formKey 通道）。 */
export interface FormContext {
    /** 表单数据对象。 */
    model: Ref<Record<string, unknown>>;
    /** 校验规则。 */
    rules: Ref<FormRules>;
    /** 控件尺寸。 */
    size: Ref<FormSize>;
    /** 错误提示方式。 */
    errorType: Ref<FormErrorType[]>;
    /** 是否显示表单项底边。 */
    borderBottom: Ref<boolean>;
    /** 标签位置。 */
    labelPosition: Ref<FormLabelPosition>;
    /** 标签宽度。 */
    labelWidth: Ref<string | number>;
    /** 标签对齐方式。 */
    labelAlign: Ref<FormLabelAlign>;
    /** 标签自定义样式。 */
    labelStyle: Ref<StyleValue>;
    /** 注册一个字段。 */
    register(field: FormField): void;
    /** 注销一个字段。 */
    unregister(field: FormField): void;
}

/** Form ↔ FormItem 配对注入键。 */
export const formKey: InjectionKey<FormContext> = Symbol('snake-form');

export type { FormError, FormRule, FormRules, FormTrigger } from '../../libs/form';
