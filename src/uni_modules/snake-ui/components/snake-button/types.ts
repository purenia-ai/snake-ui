import type { ExtractPropTypes, PropType } from 'vue';

/** 按钮主题类型。 */
export type SnakeButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'error' | (string & {});
/** 按钮尺寸。 */
export type SnakeButtonSize = 'large' | 'default' | 'medium' | 'small' | 'mini';
/** 按钮形状。 */
export type SnakeButtonShape = 'square' | 'circle';
/** 原生表单行为。 */
export type SnakeButtonFormType = 'submit' | 'reset' | '';
/** 支付宝授权范围。 */
export type SnakeButtonScope = '' | 'phoneNumber' | 'userInfo';

/** snake-button 运行时属性。 */
export const snakeButtonProps = {
    /** 根节点自定义样式。 */ customStyle: { type: [String, Object] as PropType<string | Record<string, unknown>>, default: () => ({}) },
    /** 根节点自定义类名。 */ customClass: { type: String, default: '' },
    /** 按钮文本。 */ text: { type: String, default: '' },
    /** 是否使用半像素细边框。 */ hairLine: { type: Boolean, default: true },
    /** 按钮主题。 */ type: { type: String as PropType<SnakeButtonType>, default: 'default' },
    /** 按钮尺寸。 */ size: { type: String as PropType<SnakeButtonSize>, default: 'default' },
    /** 按钮形状。 */ shape: { type: String as PropType<SnakeButtonShape>, default: 'square' },
    /** 是否为镂空按钮。 */ plain: { type: Boolean, default: false },
    /** 是否禁用。 */ disabled: { type: Boolean, default: false },
    /** 是否显示原生加载状态。 */ loading: { type: Boolean, default: false },
    /** 支付宝小程序授权范围。 */ scope: { type: String as PropType<SnakeButtonScope>, default: '' },
    /** uni-app 原生开放能力类型。 */ openType: { type: String, default: '' },
    /** 原生表单行为类型。 */ formType: { type: String as PropType<SnakeButtonFormType>, default: '' },
    /** 打开 App 时传递的参数。 */ appParameter: { type: String, default: '' },
    /** 是否阻止祖先节点出现点击态。 */ hoverStopPropagation: { type: Boolean, default: false },
    /** 用户信息语言。 */ lang: { type: String, default: 'en' },
    /** 客服会话来源。 */ sessionFrom: { type: String, default: '' },
    /** 客服消息卡片标题。 */ sendMessageTitle: { type: String, default: '' },
    /** 客服消息卡片路径。 */ sendMessagePath: { type: String, default: '' },
    /** 客服消息卡片图片。 */ sendMessageImg: { type: String, default: '' },
    /** 是否显示客服消息卡片。 */ showMessageCard: { type: Boolean, default: false },
    /** 按下时的背景色。 */ hoverBgColor: { type: String, default: '' },
    /** 水波纹背景色。 */ rippleBgColor: { type: String, default: '' },
    /** 是否开启水波纹。 */ ripple: { type: Boolean, default: false },
    /** 自定义按下类名。 */ hoverClass: { type: String, default: '' },
    /** 透传到 dataset 的 name。 */ dataName: { type: String, default: '' },
    /** 点击节流间隔，单位毫秒。 */ throttleTime: { type: [String, Number] as PropType<string | number>, default: 0 },
    /** 按住后出现点击态的时间，单位毫秒。 */ hoverStartTime: { type: [String, Number] as PropType<string | number>, default: 20 },
    /** 松开后点击态保留时间，单位毫秒。 */ hoverStayTime: { type: [String, Number] as PropType<string | number>, default: 150 }
} as const;

/** snake-button 解析后的属性。 */
export type SnakeButtonResolvedProps = ExtractPropTypes<typeof snakeButtonProps>;

/** snake-button 对外属性。 */
export interface SnakeButtonProps {
    /** 根节点自定义样式。 */ customStyle?: string | Record<string, unknown>;
    /** 根节点自定义类名。 */ customClass?: string;
    /** 按钮文本。 */ text?: string;
    /** 是否使用半像素细边框。 */ hairLine?: boolean;
    /** 按钮主题。 */ type?: SnakeButtonType;
    /** 按钮尺寸。 */ size?: SnakeButtonSize;
    /** 按钮形状。 */ shape?: SnakeButtonShape;
    /** 是否为镂空按钮。 */ plain?: boolean;
    /** 是否禁用。 */ disabled?: boolean;
    /** 是否显示原生加载状态。 */ loading?: boolean;
    /** 支付宝小程序授权范围。 */ scope?: SnakeButtonScope;
    /** uni-app 原生开放能力类型。 */ openType?: string;
    /** 原生表单行为类型。 */ formType?: SnakeButtonFormType;
    /** 打开 App 时传递的参数。 */ appParameter?: string;
    /** 是否阻止祖先节点出现点击态。 */ hoverStopPropagation?: boolean;
    /** 用户信息语言。 */ lang?: string;
    /** 客服会话来源。 */ sessionFrom?: string;
    /** 客服消息卡片标题。 */ sendMessageTitle?: string;
    /** 客服消息卡片路径。 */ sendMessagePath?: string;
    /** 客服消息卡片图片。 */ sendMessageImg?: string;
    /** 是否显示客服消息卡片。 */ showMessageCard?: boolean;
    /** 按下时的背景色。 */ hoverBgColor?: string;
    /** 水波纹背景色。 */ rippleBgColor?: string;
    /** 是否开启水波纹。 */ ripple?: boolean;
    /** 自定义按下类名。 */ hoverClass?: string;
    /** 透传到 dataset 的 name。 */ dataName?: string;
    /** 点击节流间隔，单位毫秒。 */ throttleTime?: string | number;
    /** 按住后出现点击态的时间，单位毫秒。 */ hoverStartTime?: string | number;
    /** 松开后点击态保留时间，单位毫秒。 */ hoverStayTime?: string | number;
}

/** snake-button 事件。 */
export interface SnakeButtonEmits {
    /** 点击事件。 */ click: [event: unknown];
    /** 用户信息回调。 */ getuserinfo: [event: unknown];
    /** 客服消息回调。 */ contact: [event: unknown];
    /** 手机号回调。 */ getphonenumber: [event: unknown];
    /** 开放能力错误回调。 */ error: [event: unknown];
    /** 打开 App 回调。 */ launchapp: [event: unknown];
    /** 打开设置回调。 */ opensetting: [event: unknown];
    /** 头像选择回调。 */ chooseavatar: [event: unknown];
    /** 隐私授权回调。 */ agreeprivacyauthorization: [event: unknown];
}
