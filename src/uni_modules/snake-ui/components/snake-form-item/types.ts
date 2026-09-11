import type { InjectionKey, Ref } from 'vue';
import type { UnitValue } from '../../libs/function/unit';
import type { StyleValue } from '../../types/global';
import type { FormTrigger } from '../../libs/form';
import type { FormLabelAlign, FormLabelPosition, FormSize } from '../snake-form/types';

/** FormItem 组件的公开属性，与 uView Pro FormItem 保持一致。 */
export interface FormItemProps {
    /** 标签文本。 */
    label?: string;
    /** 表单模型中的字段路径。 */
    prop?: string;
    /** 是否显示底边，空字符串表示继承 Form。 */
    borderBottom?: string | boolean;
    /** 标签位置。 */
    labelPosition?: FormLabelPosition | '';
    /** 标签宽度。 */
    labelWidth?: UnitValue | '';
    /** 标签自定义样式。 */
    labelStyle?: Record<string, any>;
    /** 标签对齐方式。 */
    labelAlign?: FormLabelAlign | '';
    /** 右侧图标。 */
    rightIcon?: string;
    /** 左侧图标。 */
    leftIcon?: string;
    /** 左侧图标字体前缀。 */
    leftIconPrefix?: string;
    /** 右侧图标字体前缀。 */
    rightIconPrefix?: string;
    /** 左侧图标样式。 */
    leftIconStyle?: StyleValue;
    /** 右侧图标样式。 */
    rightIconStyle?: StyleValue;
    /** 是否展示必填星号。 */
    required?: boolean;
    /** 预设尺寸或自定义字号。 */
    size?: FormSize | string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: StyleValue;
}

/** FormItem 通过模板 ref 暴露的接口。 */
export interface FormItemExpose {
    /** 校验当前字段。 */
    validation(trigger?: string, callback?: (message: string) => void): void;
    /** 将字段恢复为初始值。 */
    resetField(): void;
    /** 触发 blur 规则校验。 */
    onFormBlur(): void;
    /** 触发 change 规则校验。 */
    onFormChange(): void;
}

/** FormItem 向叶子控件（input / textarea / switch / slider / radio-group / checkbox-group）注入的配对上下文。 */
export interface FormItemContext {
    /** 当前校验错误文案。 */
    error: Ref<string>;
    /** 是否展示错误。 */
    errorVisible: Ref<boolean>;
    /** 控件尺寸。 */
    size: Ref<FormSize>;
    /** 触发指定方式的校验。 */
    notify(trigger: FormTrigger): Promise<void>;
}

/** FormItem ↔ 叶子控件配对注入键。 */
export const formItemKey: InjectionKey<FormItemContext> = Symbol('snake-form-item');
