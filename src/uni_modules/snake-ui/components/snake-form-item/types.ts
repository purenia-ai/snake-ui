import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
import type { SnakeFormLabelAlign, SnakeFormLabelPosition, SnakeFormSize } from '../../libs/internal/form';
/** SnakeFormItem 组件的公开属性。 */
export interface SnakeFormItemProps {
    /** 展示标签文本。 */
    label?: string;
    /** prop 配置。 */
    prop?: string;
    /** 是否展示必填状态。 */
    required?: boolean;
    /** left icon 配置。 */
    leftIcon?: string;
    /** right icon 配置。 */
    rightIcon?: string;
    /** 标签所在位置。 */
    labelPosition?: SnakeFormLabelPosition;
    /** 标签区域宽度。 */
    labelWidth?: UnitValue;
    /** 标签文字对齐方式。 */
    labelAlign?: SnakeFormLabelAlign;
    /** 标签自定义样式。 */
    labelStyle?: SnakeStyleValue;
    /** 是否显示底部边框。 */
    borderBottom?: boolean;
    /** 组件尺寸。 */
    size?: SnakeFormSize;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeFormItem 组件实例公开的方法和状态。 */
export interface SnakeFormItemExpose {
    /** validate 方法。 */
    validate(trigger?: 'change' | 'blur'): Promise<unknown[]>;
    /** resetField 方法。 */
    resetField(): void;
    /** clearValidate 方法。 */
    clearValidate(): void;
}
