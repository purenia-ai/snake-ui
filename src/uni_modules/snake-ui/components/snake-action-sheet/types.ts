import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 动作面板单项配置。 */
export interface ActionSheetAction {
    /** 动作名称，必填。 */ name: string;
    /** 名称下方的次要说明。 */ subname?: string;
    /** 文字与图标颜色，缺省跟随主题。 */ color?: string;
    /** 左侧图标名，透传 snake-icon。 */ icon?: string;
    /** 是否禁用该动作。 */ disabled?: boolean;
    /** 是否处于加载中，加载中不派发 select。 */ loading?: boolean;
}

/** snake-action-sheet 运行时属性。 */
export const actionSheetProps = {
    /** 是否显示面板。 */ modelValue: { type: Boolean, default: false },
    /** 面板标题。 */ title: { type: String, default: '' },
    /** 标题下方的说明文字。 */ description: { type: String, default: '' },
    /** 动作列表。 */ actions: {
        type: Array as PropType<ActionSheetAction[]>,
        default: () => []
    },
    /** 是否显示取消按钮。 */ showCancel: { type: Boolean, default: true },
    /** 取消按钮文案，缺省读取语言包 common.cancel。 */ cancelText: { type: String, default: '' },
    /** 点击动作后是否自动关闭。 */ closeOnClickAction: { type: Boolean, default: true },
    /** 点击遮罩层是否关闭。 */ closeOnClickOverlay: { type: Boolean, default: true },
    /** 是否显示为圆角。 */ round: {
        type: [Boolean, Number, String] as PropType<boolean | number | string>,
        default: true
    },
    /** 是否适配底部安全区域。 */ safeAreaInsetBottom: { type: Boolean, default: true },
    /** 面板层级。 */ zIndex: { type: Number, default: 0 },
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' }
} as const;

/** snake-action-sheet 解析后的属性。 */
export type ActionSheetResolvedProps = ExtractPropTypes<typeof actionSheetProps>;

/** snake-action-sheet 对外属性。 */
export interface ActionSheetProps {
    /** 是否显示面板。 */ modelValue?: boolean;
    /** 面板标题。 */ title?: string;
    /** 标题下方的说明文字。 */ description?: string;
    /** 动作列表。 */ actions?: ActionSheetAction[];
    /** 是否显示取消按钮。 */ showCancel?: boolean;
    /** 取消按钮文案。 */ cancelText?: string;
    /** 点击动作后是否自动关闭。 */ closeOnClickAction?: boolean;
    /** 点击遮罩层是否关闭。 */ closeOnClickOverlay?: boolean;
    /** 是否显示为圆角。 */ round?: boolean | number | string;
    /** 是否适配底部安全区域。 */ safeAreaInsetBottom?: boolean;
    /** 面板层级。 */ zIndex?: number;
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
}

/** snake-action-sheet 事件。 */
export type ActionSheetEmits = {
    /** 面板显隐变化。 */ 'update:modelValue': [value: boolean];
    /** 选中某个动作。 */ select: [action: ActionSheetAction, index: number];
    /** 点击取消按钮。 */ cancel: [];
    /** 面板开始关闭。 */ close: [];
    /** 面板打开动画结束。 */ opened: [];
};

/** snake-action-sheet 对外实例方法。 */
export interface ActionSheetExpose {
    /** 打开面板，需父组件绑定 v-model 才会生效。 */ open(): void;
    /** 关闭面板，需父组件绑定 v-model 才会生效。 */ close(): void;
}
