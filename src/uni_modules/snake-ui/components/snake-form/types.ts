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
/** 字段校验触发时机。 */
export type FormValidateTrigger = FormTrigger;
/** 默认在输入与失焦时校验，保持既有行为；设为 ['blur'] 可只做失焦校验。 */
export const DEFAULT_VALIDATE_TRIGGERS: FormValidateTrigger[] = ['change', 'blur'];

/** 归一化 validateTrigger：字符串与数组都接受，非法值丢弃。 */
export function normalizeValidateTriggers(value?: FormValidateTrigger | FormValidateTrigger[]): FormValidateTrigger[] {
    const list = Array.isArray(value) ? value : value ? [value] : DEFAULT_VALIDATE_TRIGGERS;
    const valid = list.filter(item => item === 'change' || item === 'blur');
    return valid.length ? valid : [];
}

/** Form 组件的公开属性。 */
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
    /** 必填星号位置，start 在标签前，end 在标签后，表单项可覆盖。 */
    asteriskPosition?: 'start' | 'end';
    /** 是否隐藏必填星号，仅影响展示不参与校验。 */
    hideAsterisk?: boolean;
    /** 标签自定义样式。 */
    labelStyle?: Record<string, any>;
    /** 表单控件尺寸。 */
    size?: FormSize;
    /** 是否禁用整张表单内的控件，表单项可用自身 disabled 覆盖。 */
    disabled?: boolean;
    /** 字段校验触发时机，默认 ['change', 'blur']；只传 'blur' 时输入过程不校验。 */
    validateTrigger?: FormValidateTrigger | FormValidateTrigger[];
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

/**
 * Form 注册的单个字段协议。
 * 由 FormItem 在挂载后注册，Form 只通过这两个方法驱动字段，不直接操作控件。
 */
export interface FormField {
    /** 字段在表单模型中的路径。 */
    prop: string;
    /** 按触发方式校验字段，回调返回错误文案（空字符串表示通过）。 */
    validation(trigger?: string, callback?: (message: string) => void): void;
    /** 将字段恢复为初始值并清空校验状态。 */
    resetField(): void;
}

/** Form 向 form-item 注入的配对上下文（formKey 通道）。 */
export interface FormContext {
    /** 表单数据对象。 */
    model: Ref<Record<string, unknown>>;
    /** 校验规则。 */
    rules: Ref<FormRules>;
    /** 控件尺寸。 */
    size: Ref<FormSize>;
    /** 是否禁用整张表单。 */
    disabled: Ref<boolean>;
    /** 字段校验触发时机。 */
    validateTrigger: Ref<FormValidateTrigger[]>;
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
    /** 必填星号位置。 */
    asteriskPosition: Ref<'start' | 'end'>;
    /** 是否隐藏必填星号。 */
    hideAsterisk: Ref<boolean>;
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
