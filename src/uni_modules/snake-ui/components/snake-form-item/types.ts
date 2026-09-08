import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormLabelAlign, SnakeFormLabelPosition, SnakeFormSize } from '../../libs/internal/form';

/** SnakeFormItem 组件的公开属性，与 uView Pro FormItem 保持一致。 */
export interface SnakeFormItemProps {
    /** 标签文本。 */
    label?: string;
    /** 表单模型中的字段路径。 */
    prop?: string;
    /** 是否显示底边，空字符串表示继承 Form。 */
    borderBottom?: string | boolean;
    /** 标签位置。 */
    labelPosition?: SnakeFormLabelPosition | '';
    /** 标签宽度。 */
    labelWidth?: UnitValue | '';
    /** 标签自定义样式。 */
    labelStyle?: Record<string, any>;
    /** 标签对齐方式。 */
    labelAlign?: SnakeFormLabelAlign | '';
    /** 右侧图标。 */
    rightIcon?: string;
    /** 左侧图标。 */
    leftIcon?: string;
    /** 左侧图标字体前缀。 */
    leftIconPrefix?: string;
    /** 右侧图标字体前缀。 */
    rightIconPrefix?: string;
    /** 左侧图标样式。 */
    leftIconStyle?: SnakeStyleValue;
    /** 右侧图标样式。 */
    rightIconStyle?: SnakeStyleValue;
    /** 是否展示必填星号。 */
    required?: boolean;
    /** 预设尺寸或自定义字号。 */
    size?: SnakeFormSize | string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}

/** SnakeFormItem 通过模板 ref 暴露的接口。 */
export interface SnakeFormItemExpose {
    /** 校验当前字段。 */
    validation(trigger?: string, callback?: (message: string) => void): void;
    /** 将字段恢复为初始值。 */
    resetField(): void;
    /** 触发 blur 规则校验。 */
    onFormBlur(): void;
    /** 触发 change 规则校验。 */
    onFormChange(): void;
}
