import type { ExtractPropTypes, PropType } from 'vue';
import type { SnakeStyleValue } from '../../types/global';

export type SnakeButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'error' | (string & {});
export type SnakeButtonSize = 'large' | 'default' | 'medium' | 'small' | 'mini';
export type SnakeButtonShape = 'square' | 'circle';
export type SnakeButtonFormType = 'submit' | 'reset' | '';

export const snakeButtonProps = {
    text: { type: String, default: '' },
    type: { type: String as PropType<SnakeButtonType>, default: 'default' },
    size: { type: String as PropType<SnakeButtonSize>, default: 'default' },
    shape: { type: String as PropType<SnakeButtonShape>, default: 'square' },
    plain: { type: Boolean, default: false },
    hairLine: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: '' },
    loadingMode: { type: String as PropType<'circle' | 'spinner'>, default: 'circle' },
    loadingSize: { type: [Number, String] as PropType<number | string>, default: 18 },
    icon: { type: String, default: '' },
    iconColor: { type: String, default: '' },
    color: { type: String, default: '' },
    customClass: { type: String, default: '' },
    customStyle: { type: [String, Object, Array] as PropType<SnakeStyleValue>, default: '' },
    ripple: { type: Boolean, default: false },
    rippleBgColor: { type: String, default: 'rgba(255, 255, 255, .28)' },
    hoverClass: { type: String, default: '' },
    hoverStartTime: { type: [Number, String] as PropType<number | string>, default: 20 },
    hoverStayTime: { type: [Number, String] as PropType<number | string>, default: 150 },
    throttleTime: { type: [Number, String] as PropType<number | string>, default: 0 },
    formType: { type: String as PropType<SnakeButtonFormType>, default: '' },
    openType: { type: String, default: '' },
    scope: { type: String as PropType<'' | 'phoneNumber' | 'userInfo'>, default: '' },
    appParameter: { type: String, default: '' },
    hoverStopPropagation: { type: Boolean, default: false },
    lang: { type: String as PropType<'en' | 'zh_CN' | 'zh_TW'>, default: 'en' },
    sessionFrom: { type: String, default: '' },
    sendMessageTitle: { type: String, default: '' },
    sendMessagePath: { type: String, default: '' },
    sendMessageImg: { type: String, default: '' },
    showMessageCard: { type: Boolean, default: false },
    dataName: { type: String, default: '' }
} as const;

export type SnakeButtonResolvedProps = ExtractPropTypes<typeof snakeButtonProps>;

export interface SnakeButtonProps {
    text?: string;
    type?: SnakeButtonType;
    size?: SnakeButtonSize;
    shape?: SnakeButtonShape;
    plain?: boolean;
    hairLine?: boolean;
    disabled?: boolean;
    loading?: boolean;
    loadingText?: string;
    loadingMode?: 'circle' | 'spinner';
    loadingSize?: number | string;
    icon?: string;
    iconColor?: string;
    color?: string;
    customClass?: string;
    customStyle?: SnakeStyleValue;
    ripple?: boolean;
    rippleBgColor?: string;
    hoverClass?: string;
    hoverStartTime?: number | string;
    hoverStayTime?: number | string;
    throttleTime?: number | string;
    formType?: SnakeButtonFormType;
    openType?: string;
    scope?: '' | 'phoneNumber' | 'userInfo';
    appParameter?: string;
    hoverStopPropagation?: boolean;
    lang?: 'en' | 'zh_CN' | 'zh_TW';
    sessionFrom?: string;
    sendMessageTitle?: string;
    sendMessagePath?: string;
    sendMessageImg?: string;
    showMessageCard?: boolean;
    dataName?: string;
}

export interface SnakeButtonEmits {
    click: [event: unknown];
    getuserinfo: [event: unknown];
    contact: [event: unknown];
    getphonenumber: [event: unknown];
    error: [event: unknown];
    launchapp: [event: unknown];
    opensetting: [event: unknown];
    chooseavatar: [event: unknown];
    agreeprivacyauthorization: [event: unknown];
}
