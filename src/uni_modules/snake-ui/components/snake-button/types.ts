import type { ExtractPropTypes, PropType } from 'vue';
import type { SnakeStyleValue } from '../../types/global';

/** SnakeButtonType 类型定义。 */
export type SnakeButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'error' | (string & {});
/** SnakeButtonSize 类型定义。 */
export type SnakeButtonSize = 'large' | 'default' | 'medium' | 'small' | 'mini';
/** SnakeButtonShape 类型定义。 */
export type SnakeButtonShape = 'square' | 'circle';
/** SnakeButtonFormType 类型定义。 */
export type SnakeButtonFormType = 'submit' | 'reset' | '';

/** snakeButtonProps 运行时属性及默认值。 */
export const snakeButtonProps = {
    /** 展示文本。 */
    text: { type: String, default: '' },
    /** 组件类型或展示模式。 */
    type: { type: String as PropType<SnakeButtonType>, default: 'default' },
    /** 组件尺寸。 */
    size: { type: String as PropType<SnakeButtonSize>, default: 'default' },
    /** 组件形状。 */
    shape: { type: String as PropType<SnakeButtonShape>, default: 'square' },
    /** 是否使用朴素按钮样式。 */
    plain: { type: Boolean, default: false },
    /** 是否使用半像素细边框。 */
    hairLine: { type: Boolean, default: true },
    /** 是否禁用交互。 */
    disabled: { type: Boolean, default: false },
    /** 是否显示加载状态。 */
    loading: { type: Boolean, default: false },
    /** 加载状态下显示的文本。 */
    loadingText: { type: String, default: '' },
    /** 加载图标的动画模式。 */
    loadingMode: { type: String as PropType<'circle' | 'spinner'>, default: 'circle' },
    /** 加载图标尺寸，数值按 rpx 处理。 */
    loadingSize: { type: [Number, String] as PropType<number | string>, default: 18 },
    /** 图标名称。 */
    icon: { type: String, default: '' },
    /** 图标颜色。 */
    iconColor: { type: String, default: '' },
    /** 内容颜色。 */
    color: { type: String, default: '' },
    /** 根节点自定义类名。 */
    customClass: { type: String, default: '' },
    /** 根节点自定义样式。 */
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: '' },
    /** 是否启用点击水波纹效果；波纹从用户按下位置向外扩散。 */
    ripple: { type: Boolean, default: false },
    /** 水波纹背景颜色，建议使用带透明度的颜色。 */
    rippleBgColor: { type: String, default: 'rgba(255, 255, 255, .28)' },
    /** 按下组件时应用的类名。 */
    hoverClass: { type: String, default: '' },
    /** 按住多久出现点击态，单位毫秒。 */
    hoverStartTime: { type: [Number, String] as PropType<number | string>, default: 20 },
    /** 松开后点击态保留时间，单位毫秒。 */
    hoverStayTime: { type: [Number, String] as PropType<number | string>, default: 150 },
    /** 连续点击的节流间隔，单位毫秒。 */
    throttleTime: { type: [Number, String] as PropType<number | string>, default: 0 },
    /** 原生表单行为类型。 */
    formType: { type: String as PropType<SnakeButtonFormType>, default: '' },
    /** uni-app 原生开放能力类型。 */
    openType: { type: String, default: '' },
    /** 支付宝小程序授权范围。 */
    scope: { type: String as PropType<'' | 'phoneNumber' | 'userInfo'>, default: '' },
    /** 打开 App 时传递的参数。 */
    appParameter: { type: String, default: '' },
    /** 是否阻止祖先节点出现点击态。 */
    hoverStopPropagation: { type: Boolean, default: false },
    /** 返回用户信息使用的语言。 */
    lang: { type: String as PropType<'en' | 'zh_CN' | 'zh_TW'>, default: 'en' },
    /** 客服会话来源。 */
    sessionFrom: { type: String, default: '' },
    /** 会话消息卡片标题。 */
    sendMessageTitle: { type: String, default: '' },
    /** 会话消息卡片跳转路径。 */
    sendMessagePath: { type: String, default: '' },
    /** 会话消息卡片图片地址。 */
    sendMessageImg: { type: String, default: '' },
    /** 是否显示会话消息卡片。 */
    showMessageCard: { type: Boolean, default: false },
    /** 透传到原生节点 dataset 的数据名称。 */
    dataName: { type: String, default: '' }
} as const;

/** SnakeButtonResolved 组件的公开属性。 */
export type SnakeButtonResolvedProps = ExtractPropTypes<typeof snakeButtonProps>;

/** SnakeButton 组件的公开属性。 */
export interface SnakeButtonProps {
    /** 展示文本。 */
    text?: string;
    /** 组件类型或展示模式。 */
    type?: SnakeButtonType;
    /** 组件尺寸。 */
    size?: SnakeButtonSize;
    /** 组件形状。 */
    shape?: SnakeButtonShape;
    /** 是否使用朴素按钮样式。 */
    plain?: boolean;
    /** 是否使用半像素细边框。 */
    hairLine?: boolean;
    /** 是否禁用交互。 */
    disabled?: boolean;
    /** 是否显示加载状态。 */
    loading?: boolean;
    /** 加载状态下显示的文本。 */
    loadingText?: string;
    /** 加载图标的动画模式。 */
    loadingMode?: 'circle' | 'spinner';
    /** 加载图标尺寸，数值按 rpx 处理。 */
    loadingSize?: number | string;
    /** 图标名称。 */
    icon?: string;
    /** 图标颜色。 */
    iconColor?: string;
    /** 内容颜色。 */
    color?: string;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
    /** 是否启用点击水波纹效果；波纹从用户按下位置向外扩散。 */
    ripple?: boolean;
    /** 水波纹背景颜色，建议使用带透明度的颜色。 */
    rippleBgColor?: string;
    /** 按下组件时应用的类名。 */
    hoverClass?: string;
    /** 按住多久出现点击态，单位毫秒。 */
    hoverStartTime?: number | string;
    /** 松开后点击态保留时间，单位毫秒。 */
    hoverStayTime?: number | string;
    /** 连续点击的节流间隔，单位毫秒。 */
    throttleTime?: number | string;
    /** 原生表单行为类型。 */
    formType?: SnakeButtonFormType;
    /** uni-app 原生开放能力类型。 */
    openType?: string;
    /** 支付宝小程序授权范围。 */
    scope?: '' | 'phoneNumber' | 'userInfo';
    /** 打开 App 时传递的参数。 */
    appParameter?: string;
    /** 是否阻止祖先节点出现点击态。 */
    hoverStopPropagation?: boolean;
    /** 返回用户信息使用的语言。 */
    lang?: 'en' | 'zh_CN' | 'zh_TW';
    /** 客服会话来源。 */
    sessionFrom?: string;
    /** 会话消息卡片标题。 */
    sendMessageTitle?: string;
    /** 会话消息卡片跳转路径。 */
    sendMessagePath?: string;
    /** 会话消息卡片图片地址。 */
    sendMessageImg?: string;
    /** 是否显示会话消息卡片。 */
    showMessageCard?: boolean;
    /** 透传到原生节点 dataset 的数据名称。 */
    dataName?: string;
}

/** SnakeButton 组件的事件契约。 */
export interface SnakeButtonEmits {
    /** click 事件携带的参数。 */
    click: [event: unknown];
    /** getuserinfo 事件携带的参数。 */
    getuserinfo: [event: unknown];
    /** contact 事件携带的参数。 */
    contact: [event: unknown];
    /** getphonenumber 事件携带的参数。 */
    getphonenumber: [event: unknown];
    /** error 事件携带的参数。 */
    error: [event: unknown];
    /** launchapp 事件携带的参数。 */
    launchapp: [event: unknown];
    /** opensetting 事件携带的参数。 */
    opensetting: [event: unknown];
    /** chooseavatar 事件携带的参数。 */
    chooseavatar: [event: unknown];
    /** agreeprivacyauthorization 事件携带的参数。 */
    agreeprivacyauthorization: [event: unknown];
}
