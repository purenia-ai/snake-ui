import type { SnakeStyleValue } from '../component-types';

export type SnakeButtonType = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'error' | (string & {});
export type SnakeButtonSize = 'large' | 'default' | 'medium' | 'small' | 'mini';
export type SnakeButtonShape = 'square' | 'circle';
export type SnakeButtonFormType = 'submit' | 'reset' | '';

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
