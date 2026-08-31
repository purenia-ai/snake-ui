import type { UnitValue } from '../../libs/function/unit';
import type { SnakeStyleValue } from '../../types/global';
/** SnakeNoticeBarMode 类型定义。 */
export type SnakeNoticeBarMode = 'horizontal' | 'vertical';
/** SnakeNoticeBarDirection 类型定义。 */
export type SnakeNoticeBarDirection = 'row' | 'column';
/** SnakeNoticeBar 组件的公开属性。 */
export interface SnakeNoticeBarProps {
    /** 用于渲染的数据列表。 */
    list?: string[];
    /** 展示文本。 */
    text?: string | string[];
    /** 组件类型或展示模式。 */
    type?: 'primary' | 'success' | 'warning' | 'error' | 'info';
    /** 组件展示模式。 */
    mode?: SnakeNoticeBarMode;
    /** 内容排列或滚动方向。 */
    direction?: SnakeNoticeBarDirection;
    /** 是否显示组件。 */
    show?: boolean;
    /** 是否自动播放。 */
    autoplay?: boolean;
    /** volume icon 配置。 */
    volumeIcon?: boolean;
    /** volume size 配置。 */
    volumeSize?: UnitValue;
    /** more icon 配置。 */
    moreIcon?: boolean;
    /** 关闭按钮图标名称。 */
    closeIcon?: boolean;
    /** 背景颜色。 */
    bgColor?: string;
    /** 内容颜色。 */
    color?: string;
    /** 文字尺寸，数值按 rpx 处理。 */
    fontSize?: UnitValue;
    /** 动画持续时间。 */
    duration?: number;
    /** speed 配置。 */
    speed?: number;
    /** is circular 配置。 */
    isCircular?: boolean;
    /** play state 配置。 */
    playState?: 'play' | 'paused';
    /** disable touch 配置。 */
    disableTouch?: boolean;
    /** 圆角尺寸。 */
    borderRadius?: UnitValue;
    /** padding 配置。 */
    padding?: string;
    /** no list hidden 配置。 */
    noListHidden?: boolean;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义样式。 */
    customStyle?: SnakeStyleValue;
}
/** SnakeNoticeBar 组件的事件契约。 */
export interface SnakeNoticeBarEmits {
    /** click 事件携带的参数。 */
    click: [index: number];
    /** change 事件携带的参数。 */
    change: [index: number];
    /** close 事件携带的参数。 */
    close: [];
    /** getMore 事件携带的参数。 */
    getMore: [];
}
