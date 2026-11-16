import type { ExtractPropTypes, PropType } from 'vue';
import type { StyleValue } from '../../types/global';

/** 滑动按钮的语义类型，决定缺省背景色。 */
export type SwipeActionType = 'primary' | 'success' | 'warning' | 'error' | 'info';

/** 操作按钮所在的侧边。 */
export type SwipeActionSide = 'left' | 'right';

/** 停留状态：收起、左侧展开、右侧展开。 */
export type SwipeActionStatus = 'close' | SwipeActionSide;

/** 触发关闭的原因：手势回弹、点击、外部程序控制。 */
export type SwipeActionReason = 'swipe' | 'click' | 'value';

/**
 * 关闭前拦截器：同步返回 `true`、异步 resolve `true` 才会继续关闭；
 * 返回 `false`、resolve `false`、不返回值或抛错都会保持展开。
 */
export type SwipeActionBeforeClose = (
    reason: SwipeActionReason,
    position: SwipeActionSide
) => boolean | Promise<boolean>;

/** 滑动按钮配置。 */
export interface SwipeActionItem {
    /** 按钮文字，必填。 */ text: string;
    /** 按钮背景色，缺省按 type 取语义色。 */ color?: string;
    /** 文字与图标颜色，缺省白色。 */ textColor?: string;
    /** 语义类型，决定缺省背景色。 */ type?: SwipeActionType;
    /** 图标名，透传 snake-icon。 */ icon?: string;
    /** 是否禁用。 */ disabled?: boolean;
    /** 点击后是否自动收起，缺省收起。 */ autoClose?: boolean;
}

/** snake-swipe-action 运行时属性。 */
export const swipeActionProps = {
    /** 右侧按钮配置。 */ actions: {
        type: Array as PropType<SwipeActionItem[]>,
        default: () => []
    },
    /** 左侧按钮配置。 */ leftActions: {
        type: Array as PropType<SwipeActionItem[]>,
        default: () => []
    },
    /** 当前停留状态，支持 v-model。 */ modelValue: {
        type: String as PropType<SwipeActionStatus>,
        default: 'close'
    },
    /** 是否禁用滑动。 */ disabled: { type: Boolean, default: false },
    /** 打开时是否关闭同组其他已打开项。 */ autoClose: { type: Boolean, default: true },
    /** 判定停留所需的最小位移，0 表示按按钮区一半判定。 */ threshold: { type: Number, default: 0 },
    /** 回弹动画时长，单位毫秒。 */ duration: { type: Number, default: 300 },
    /** 单个按钮宽度，单位 px（375 稿）。 */ buttonWidth: { type: Number, default: 80 },
    /** 关闭前拦截器。 */ beforeClose: {
        type: Function as PropType<SwipeActionBeforeClose>,
        default: undefined
    },
    /** 根节点自定义样式。 */ customStyle: {
        type: [String, Object, Array] as PropType<StyleValue>,
        default: () => ({})
    },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' }
} as const;

/** snake-swipe-action 解析后的属性。 */
export type SwipeActionResolvedProps = ExtractPropTypes<typeof swipeActionProps>;

/** snake-swipe-action 对外属性。 */
export interface SwipeActionProps {
    /** 右侧按钮配置。 */ actions?: SwipeActionItem[];
    /** 左侧按钮配置。 */ leftActions?: SwipeActionItem[];
    /** 当前停留状态。 */ modelValue?: SwipeActionStatus;
    /** 是否禁用滑动。 */ disabled?: boolean;
    /** 打开时是否关闭同组其他已打开项。 */ autoClose?: boolean;
    /** 判定停留所需的最小位移。 */ threshold?: number;
    /** 回弹动画时长，单位毫秒。 */ duration?: number;
    /** 单个按钮宽度，单位 px（375 稿）。 */ buttonWidth?: number;
    /** 关闭前拦截器。 */ beforeClose?: SwipeActionBeforeClose;
    /** 根节点自定义样式。 */ customStyle?: StyleValue;
    /** 根节点自定义类名。 */ customClass?: string;
}

/** snake-swipe-action 事件。 */
export type SwipeActionEmits = {
    /** 点击某个操作按钮。 */ click: [action: SwipeActionItem, side: SwipeActionSide, index: number];
    /** 展开后派发，参数为展开的侧边。 */ open: [side: SwipeActionSide];
    /** 收起后派发，参数为收起前展开的侧边。 */ close: [side: SwipeActionSide];
    /** 收起态点击内容区派发；展开态点击只收起，不派发。 */ contentClick: [];
    /** 停留状态变化。 */ 'update:modelValue': [value: SwipeActionStatus];
};

/** snake-swipe-action 对外实例方法。 */
export interface SwipeActionExpose {
    /** 展开指定侧边；不传时优先展开右侧。 */ open(side?: SwipeActionSide): void;
    /** 收起按钮区。 */ close(): void;
    /** 重新测量左右按钮区宽度。 */ refresh(): Promise<void>;
}
